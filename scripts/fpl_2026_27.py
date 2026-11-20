#!/usr/bin/env python3
"""Build and update the 2026/27 FPL Replay season.

The picks come from the sibling lab optimiser in Al2800/FPL (WP-07 bounded
search, plus the 2026/27 initial-squad policy). Points come from the public
FPL API. Nothing in the published squad is typed in by hand.

Gameweeks 1 to 10 are reconstructive: the cutoff is first kickoff minus 90
minutes, and the file is built after the matches. Gameweek 11 onwards is a
live freeze. The hash covers the squad, captain, transfers, chip, bank, hit
and projection. Scoring fills official points afterwards and does not change
that hash.

Forecast, recorded so a later run can reproduce it:

- Player rates start from reports/forecasting/2026-27-shared-player-prior-2025-26.json
  (completed 2025/26, keyed by FPL code). Missing players use that file's
  position fallback.
- Before the cutoff, current-season minutes and points from element-summary
  history are blended in. The prior is worth 1,350 minutes. Start rate uses a
  two-match prior. Both numbers are the lab's published live-faithful settings.
- A fixture scales that rate by the official difficulty, mapped the same way
  as the lab: FDR 1 -> 1.3, FDR 3 -> 1.0, FDR 5 -> 0.7.
- Gameweeks 1 to 10 treat every listed player as available. The API does not
  keep a pre-deadline injury snapshot. The live freeze uses bootstrap status.
- Chips are not in the search. The weekly solver is single-gameweek and may
  take at most one paid transfer. The template may make at most one free
  transfer and never takes a hit. The initial 15 uses the lab's six-week search.

Commands:

  python scripts/fpl_2026_27.py rebuild --through 10 --built-at 2026-11-18T12:00:00Z
  python scripts/fpl_2026_27.py freeze --gw 11 --allow-early --built-at ...
  python scripts/fpl_2026_27.py score
  python scripts/fpl_2026_27.py tick

tick is the weekly job. It scores a finished, data-checked gameweek that
already has a pick, and it freezes the next gameweek when the deadline is
about 2 to 2.75 hours away (or sooner, if that window was missed and the
deadline has not passed). It will not invent a pick after the deadline.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import sys
import time
import types
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any


SEASON = "2026-27"
POSITION = {1: "GKP", 2: "DEF", 3: "MID", 4: "FWD"}
PRIOR_EQUIV_MINUTES = 1350.0
START_PRIOR_MATCHES = 2.0
HORIZON = 6
DISCOUNTS = [1.0, 0.9, 0.81, 0.729, 0.6561, 0.59049]
SOLVER_MAX_HIT_TRANSFERS = 1
API = "https://fantasy.premierleague.com/api"

REPO = Path(__file__).resolve().parents[1]
OUT_DIR = REPO / "data" / "seasons" / SEASON
CACHE = REPO / "data" / ".cache" / SEASON


def lab_root() -> Path:
    raw = os.environ.get("FPL_LAB_ROOT", "/tmp/FPL")
    root = Path(raw)
    if not (root / "src" / "optimisation" / "solver.py").exists():
        raise SystemExit(
            f"FPL lab not found at {root}. Clone https://github.com/Al2800/FPL "
            "and set FPL_LAB_ROOT."
        )
    return root


def install_import_shims() -> None:
    """The lab imports pandas at module level. This script never calls it."""
    try:
        import pandas  # noqa: F401
    except ImportError:
        sys.modules["pandas"] = types.ModuleType("pandas")


def load_lab():
    root = lab_root()
    sys.path.insert(0, str(root))
    install_import_shims()
    from src.optimisation.initial_squad import optimise_initial_squad
    from src.optimisation.solver import solve
    from src.optimisation.types import SolverInput
    from src.scoring.engine import apply_automatic_substitutions, captain_points
    from src.scoring.rules_loader import load_rules, ruleset_sha256
    from src.scoring.validator import selling_price

    rules_path = root / "control" / "rules" / "2026-27.yaml"
    policy_path = root / "control" / "policies" / "initial-squad-2026-27.json"
    prior_path = root / "reports" / "forecasting" / "2026-27-shared-player-prior-2025-26.json"
    return {
        "root": root,
        "optimise_initial_squad": optimise_initial_squad,
        "solve": solve,
        "SolverInput": SolverInput,
        "apply_automatic_substitutions": apply_automatic_substitutions,
        "captain_points": captain_points,
        "selling_price": selling_price,
        "rules": load_rules(rules_path),
        "rules_sha": ruleset_sha256(rules_path),
        "policy": json.loads(policy_path.read_text()),
        "prior": json.loads(prior_path.read_text()),
        "commit": _git_commit(root),
    }


def _git_commit(root: Path) -> str:
    head = root / ".git" / "HEAD"
    try:
        text = head.read_text().strip()
    except OSError:
        return "unknown"
    if text.startswith("ref:"):
        ref = root / ".git" / text.split(" ", 1)[1]
        try:
            return ref.read_text().strip()
        except OSError:
            return "unknown"
    return text


def utc_now() -> datetime:
    return datetime.now(timezone.utc).replace(microsecond=0)


def parse_time(value: str) -> datetime:
    parsed = datetime.fromisoformat(value.replace("Z", "+00:00"))
    if parsed.tzinfo is None:
        parsed = parsed.replace(tzinfo=timezone.utc)
    return parsed.astimezone(timezone.utc)


def iso(value: datetime) -> str:
    return value.astimezone(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")


def sha256(payload: Any) -> str:
    raw = json.dumps(payload, sort_keys=True, separators=(",", ":"), ensure_ascii=True)
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()


def fetch_json(url: str, dest: Path | None = None) -> Any:
    if dest is not None and dest.exists():
        return json.loads(dest.read_text())
    request = urllib.request.Request(url, headers={"User-Agent": "fplreplay.com/2026-27"})
    last_error: Exception | None = None
    for attempt in range(5):
        try:
            with urllib.request.urlopen(request, timeout=60) as response:
                body = response.read()
            break
        except (urllib.error.URLError, TimeoutError) as exc:
            last_error = exc
            time.sleep(1.5 * (attempt + 1))
    else:
        raise SystemExit(f"Failed to fetch {url}: {last_error}")
    if dest is not None:
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_bytes(body)
    return json.loads(body)


def load_api() -> dict[str, Any]:
    CACHE.mkdir(parents=True, exist_ok=True)
    bootstrap = fetch_json(f"{API}/bootstrap-static/", CACHE / "bootstrap-static.json")
    fixtures = fetch_json(f"{API}/fixtures/", CACHE / "fixtures.json")
    elements = {int(row["id"]): row for row in bootstrap["elements"]}
    missing = [pid for pid in elements if not (CACHE / "elements" / f"{pid}.json").exists()]
    print(f"element-summary to fetch: {len(missing)} of {len(elements)}", flush=True)

    def one(pid: int) -> tuple[int, Any]:
        path = CACHE / "elements" / f"{pid}.json"
        return pid, fetch_json(f"{API}/element-summary/{pid}/", path)

    summaries: dict[int, Any] = {}
    if missing:
        with ThreadPoolExecutor(max_workers=12) as pool:
            futures = [pool.submit(one, pid) for pid in missing]
            done = 0
            for future in as_completed(futures):
                pid, payload = future.result()
                summaries[pid] = payload
                done += 1
                if done % 100 == 0:
                    print(f"  fetched {done}/{len(missing)}", flush=True)
    for pid in elements:
        path = CACHE / "elements" / f"{pid}.json"
        if pid not in summaries:
            summaries[pid] = json.loads(path.read_text())
    live: dict[int, Any] = {}
    for event in bootstrap["events"]:
        if event.get("finished") and event.get("data_checked"):
            live[int(event["id"])] = fetch_json(
                f"{API}/event/{event['id']}/live/",
                CACHE / "live" / f"{event['id']}.json",
            )
    return {
        "bootstrap": bootstrap,
        "fixtures": fixtures,
        "elements": elements,
        "summaries": summaries,
        "live": live,
        "teams": {int(team["id"]): team for team in bootstrap["teams"]},
        "fixtures_by_id": {int(row["id"]): row for row in fixtures},
    }


def prior_index(prior: dict[str, Any]) -> tuple[dict[int, dict[str, Any]], dict[str, dict[str, Any]]]:
    by_code = {int(row["fpl_code"]): row for row in prior["players"]}
    fallbacks = prior["fallbacks"]
    return by_code, fallbacks


def fdr_multiplier(difficulty: int) -> float:
    ratio = (int(difficulty) - 1) / 4
    return round(1.3 - ratio * (1.3 - 0.7), 6)


def history_rows(summary: dict[str, Any], before_round: int | None = None, exact_round: int | None = None) -> list[dict[str, Any]]:
    rows = summary.get("history") or []
    if exact_round is not None:
        return [row for row in rows if int(row["round"]) == exact_round]
    if before_round is not None:
        return [row for row in rows if int(row["round"]) < before_round]
    return list(rows)


def club_from_history(row: dict[str, Any], fixtures_by_id: dict[int, dict[str, Any]]) -> int:
    fixture = fixtures_by_id[int(row["fixture"])]
    return int(fixture["team_h"] if row["was_home"] else fixture["team_a"])


def price_and_club(summary: dict[str, Any], gw: int, fixtures_by_id: dict[int, dict[str, Any]], live_mode: bool, element: dict[str, Any]) -> tuple[float, int] | None:
    exact = history_rows(summary, exact_round=gw)
    if exact:
        row = exact[-1]
        return round(int(row["value"]) / 10, 1), club_from_history(row, fixtures_by_id)
    earlier = history_rows(summary, before_round=gw)
    if earlier:
        earlier.sort(key=lambda item: int(item["round"]))
        row = earlier[-1]
        return round(int(row["value"]) / 10, 1), club_from_history(row, fixtures_by_id)
    if live_mode:
        return round(int(element["now_cost"]) / 10, 1), int(element["team"])
    return None


def blended_rates(summary: dict[str, Any], gw: int, prior_row: dict[str, Any] | None, fallback: dict[str, Any]) -> dict[str, float]:
    base = prior_row or fallback
    prior_p90 = float(base["points_per_90"])
    prior_start = float(base.get("start_probability", fallback.get("start_probability", 0.0)))
    prior_minutes = float(base.get("minutes_per_start", fallback["minutes_per_start"]))
    sample_minutes = float(base.get("sample_minutes", 0.0))
    past = history_rows(summary, before_round=gw)
    current_minutes = sum(int(row["minutes"]) for row in past)
    current_points = sum(int(row["total_points"]) for row in past)
    current_starts = sum(int(row["starts"]) for row in past)
    appearances = len(past)
    if current_minutes <= 0:
        points_per_90 = prior_p90
    else:
        current_p90 = current_points / (current_minutes / 90.0)
        weight = current_minutes / (current_minutes + PRIOR_EQUIV_MINUTES)
        points_per_90 = weight * current_p90 + (1.0 - weight) * prior_p90
    if appearances <= 0:
        start_probability = prior_start
    else:
        observed = current_starts / appearances
        weight = appearances / (appearances + START_PRIOR_MATCHES)
        start_probability = weight * observed + (1.0 - weight) * prior_start
    if current_starts >= 3 and current_minutes > 0:
        observed_minutes = min(90.0, current_minutes / current_starts)
        weight = current_minutes / (current_minutes + PRIOR_EQUIV_MINUTES)
        minutes_per_start = weight * observed_minutes + (1.0 - weight) * prior_minutes
    else:
        minutes_per_start = prior_minutes
    sample = sample_minutes + current_minutes
    uncertainty = round(1.5 * 900.0 / (900.0 + sample), 4)
    return {
        "points_per_90": points_per_90,
        "start_probability": max(0.0, min(1.0, start_probability)),
        "minutes_per_start": max(0.0, min(90.0, minutes_per_start)),
        "uncertainty": uncertainty,
    }


def fixtures_for(club_id: int, gw: int, fixtures: list[dict[str, Any]]) -> list[dict[str, Any]]:
    rows = []
    for fixture in fixtures:
        if fixture.get("event") != gw or not fixture.get("kickoff_time"):
            continue
        if int(fixture["team_h"]) == club_id or int(fixture["team_a"]) == club_id:
            rows.append(fixture)
    rows.sort(key=lambda item: item["kickoff_time"])
    return rows


def expected_points_for_fixtures(rates: dict[str, float], club_id: int, week_fixtures: list[dict[str, Any]]) -> float:
    if not week_fixtures:
        return 0.0
    minutes = rates["start_probability"] * rates["minutes_per_start"]
    per_fixture = (minutes / 90.0) * rates["points_per_90"]
    total = 0.0
    for fixture in week_fixtures:
        home = int(fixture["team_h"]) == club_id
        difficulty = int(fixture["team_h_difficulty"] if home else fixture["team_a_difficulty"])
        total += per_fixture * fdr_multiplier(difficulty)
    return round(max(0.0, total), 4)


def opponent_label(club_id: int, week_fixtures: list[dict[str, Any]], teams: dict[int, dict[str, Any]]) -> tuple[str, bool, int]:
    if not week_fixtures:
        return "n/a", False, 3
    parts = []
    first_home = False
    first_fdr = 3
    for index, fixture in enumerate(week_fixtures):
        home = int(fixture["team_h"]) == club_id
        other = int(fixture["team_a"] if home else fixture["team_h"])
        short = teams[other]["short_name"]
        parts.append(f"{short} ({'H' if home else 'A'})")
        if index == 0:
            first_home = home
            first_fdr = int(fixture["team_h_difficulty"] if home else fixture["team_a_difficulty"])
    return ", ".join(parts), first_home, first_fdr


def first_kickoff(gw: int, fixtures: list[dict[str, Any]]) -> datetime:
    times = [
        parse_time(row["kickoff_time"])
        for row in fixtures
        if row.get("event") == gw and row.get("kickoff_time")
    ]
    if not times:
        raise SystemExit(f"No kickoff found for gameweek {gw}")
    return min(times)


def event_by_id(bootstrap: dict[str, Any]) -> dict[int, dict[str, Any]]:
    return {int(row["id"]): row for row in bootstrap["events"]}


def live_points(live: dict[str, Any] | None) -> dict[int, dict[str, int]]:
    if not live:
        return {}
    points: dict[int, dict[str, int]] = {}
    for row in live["elements"]:
        stats = row["stats"]
        points[int(row["id"])] = {
            "minutes": int(stats.get("minutes") or 0),
            "points": int(stats.get("total_points") or 0),
        }
    return points


def availability(element: dict[str, Any], live_mode: bool) -> tuple[str, float]:
    if not live_mode:
        return "a", 1.0
    if element.get("removed") or not element.get("can_select", True):
        return "u", 0.0
    status = str(element.get("status") or "a")
    chance = element.get("chance_of_playing_next_round")
    if status == "a" and chance is None:
        return "a", 1.0
    if chance is None:
        return status, 0.0
    scale = max(0.0, min(1.0, float(chance) / 100.0))
    if status != "a":
        return status, scale
    return "a", scale


class SquadState:
    def __init__(self, ids: list[str], purchase: dict[str, float], bank: float, free_transfers: int):
        self.ids = [str(item) for item in ids]
        self.purchase = {str(key): round(float(value), 1) for key, value in purchase.items()}
        self.bank = round(float(bank), 1)
        self.free_transfers = int(free_transfers)

    def to_json(self) -> dict[str, Any]:
        return {
            "playerIds": self.ids,
            "purchasePrices": self.purchase,
            "bank": self.bank,
            "freeTransfers": self.free_transfers,
        }

    @classmethod
    def from_json(cls, payload: dict[str, Any]) -> "SquadState":
        return cls(
            payload["playerIds"],
            payload["purchasePrices"],
            payload["bank"],
            payload["freeTransfers"],
        )


def market_for_gw(api: dict[str, Any], lab: dict[str, Any], gw: int, live_mode: bool, purchase: dict[str, float] | None = None) -> dict[str, dict[str, Any]]:
    by_code, fallbacks = prior_index(lab["prior"])
    rows: dict[str, dict[str, Any]] = {}
    for pid, element in api["elements"].items():
        position = POSITION.get(int(element["element_type"]))
        if position is None:
            continue
        summary = api["summaries"][pid]
        placed = price_and_club(summary, gw, api["fixtures_by_id"], live_mode, element)
        if placed is None:
            continue
        cost, club_id = placed
        prior_row = by_code.get(int(element["code"]))
        fallback = fallbacks[position]
        rates = blended_rates(summary, gw, prior_row, fallback)
        week_fixtures = fixtures_for(club_id, gw, api["fixtures"])
        ep = expected_points_for_fixtures(rates, club_id, week_fixtures)
        status, scale = availability(element, live_mode)
        ep = round(ep * scale, 4)
        player_id = str(pid)
        rows[player_id] = {
            "player_id": player_id,
            "web_name": element["web_name"],
            "position": position,
            "club_id": str(club_id),
            "now_cost": cost,
            "purchase_price": round(float(purchase[player_id]), 1) if purchase and player_id in purchase else cost,
            "expected_points": ep,
            "status": status,
            "start_probability": rates["start_probability"],
            "expected_minutes": round(rates["start_probability"] * rates["minutes_per_start"], 2),
            "element": element,
            "rates": rates,
            "new_signing": prior_row is None,
        }
    return rows


def initial_packet(api: dict[str, Any], lab: dict[str, Any], cutoff: datetime) -> dict[str, Any]:
    by_code, fallbacks = prior_index(lab["prior"])
    players = []
    for pid, element in api["elements"].items():
        position = POSITION.get(int(element["element_type"]))
        if position is None:
            continue
        summary = api["summaries"][pid]
        placed = price_and_club(summary, 1, api["fixtures_by_id"], False, element)
        if placed is None:
            continue
        cost, club_id = placed
        prior_row = by_code.get(int(element["code"]))
        fallback = fallbacks[position]
        rates = blended_rates(summary, 1, prior_row, fallback)
        expected = []
        starts = []
        uncertainty = []
        for week in range(1, HORIZON + 1):
            week_fixtures = fixtures_for(club_id, week, api["fixtures"])
            expected.append(expected_points_for_fixtures(rates, club_id, week_fixtures))
            starts.append(round(rates["start_probability"] if week_fixtures else 0.0, 6))
            uncertainty.append(rates["uncertainty"])
        players.append(
            {
                "player_id": str(pid),
                "web_name": element["web_name"],
                "position": position,
                "club_id": str(club_id),
                "now_cost": cost,
                "available_at": "2026-07-01T00:00:00Z",
                "expected_points": expected,
                "start_probability": starts,
                "uncertainty": uncertainty,
                "status": "a",
                "promoted_team": False,
                "new_signing": prior_row is None,
                "world_cup_fatigue": 0.0,
                "transfer_optionality": 0.0,
                "early_wildcard_risk": 0.0,
            }
        )
    feature_hash = sha256(
        [
            {
                "id": row["player_id"],
                "cost": row["now_cost"],
                "club": row["club_id"],
                "ep": row["expected_points"],
            }
            for row in sorted(players, key=lambda item: item["player_id"])
        ]
    )
    return {
        "schema_version": "1.0",
        "decision_id": "2026-27-gw1-initial",
        "season": SEASON,
        "decision_cutoff": iso(cutoff),
        "captured_at": iso(cutoff),
        "ruleset_id": lab["rules"]["meta"]["ruleset_id"],
        "ruleset_sha256": lab["rules_sha"],
        "feature_state_sha256": feature_hash,
        "forecast_model_version": "fplreplay-prior-blend-v1",
        "horizon_gameweeks": list(range(1, HORIZON + 1)),
        "discount_factors": DISCOUNTS,
        "players": players,
    }


def formation_string(formation: dict[str, Any]) -> str:
    return f"{int(formation['DEF'])}-{int(formation['MID'])}-{int(formation['FWD'])}"


def solve_week(lab: dict[str, Any], gw: int, state: SquadState, market: dict[str, dict[str, Any]], *, template: bool) -> dict[str, Any]:
    max_transfers = 1 if template else min(3, state.free_transfers + SOLVER_MAX_HIT_TRANSFERS)
    players = []
    for row in market.values():
        players.append(
            {
                "player_id": row["player_id"],
                "web_name": row["web_name"],
                "position": row["position"],
                "club_id": row["club_id"],
                "now_cost": row["now_cost"],
                "purchase_price": row["purchase_price"] if row["player_id"] in state.purchase else row["now_cost"],
                "expected_points": row["expected_points"],
                "status": row["status"],
            }
        )
    for pid in state.ids:
        if pid not in market:
            raise SystemExit(f"Owned player {pid} has no price in gameweek {gw}")
    solver_input = lab["SolverInput"](
        season=SEASON,
        gameweek=gw,
        ruleset_id=lab["rules"]["meta"]["ruleset_id"],
        bank=state.bank,
        free_transfers=state.free_transfers,
        squad_player_ids=list(state.ids),
        players=players,
        active_chip=None,
        chips_available=[],
        horizon_gameweeks=1,
        discount_factors=[1.0],
        max_transfers=max_transfers,
        sell_pool_per_pos=5,
        buy_pool_per_pos=8,
        allow_hits=not template,
        ruleset_mismatch_policy="fail_closed",
        availability_policy="available_only",
    )
    for row in solver_input.players:
        if row["player_id"] in state.purchase:
            row["purchase_price"] = state.purchase[row["player_id"]]
    output = lab["solve"](solver_input, rules=lab["rules"], ruleset_sha256=lab["rules_sha"])
    selected = output.get("selected")
    if not selected:
        raise SystemExit(f"Solver returned no plan for gameweek {gw}")
    return selected


def apply_selected(state: SquadState, selected: dict[str, Any], market: dict[str, dict[str, Any]]) -> SquadState:
    purchase = dict(state.purchase)
    ids = set(state.ids)
    for move in selected.get("transfers") or []:
        out_id = str(move["player_out_id"])
        in_id = str(move["player_in_id"])
        ids.discard(out_id)
        ids.add(in_id)
        purchase.pop(out_id, None)
        purchase[in_id] = round(float(market[in_id]["now_cost"]), 1)
    lineup = selected["lineup"]
    ordered = [str(pid) for pid in lineup["starting_xi_ids"] + lineup["bench_ids"]]
    if set(ordered) != ids:
        raise SystemExit("Solver lineup does not match the transferred squad")
    used = len(selected.get("transfers") or [])
    free_next = min(5, max(0, state.free_transfers - used) + 1)
    return SquadState(ordered, purchase, float(selected["bank_after"]), free_next)


def score_lineup(lab: dict[str, Any], lineup: dict[str, Any], points: dict[int, dict[str, int]], hit: int) -> tuple[int | None, list[str]]:
    if not points:
        return None, []
    starters = [{"player_id": str(pid), "position": None} for pid in lineup["starting_xi_ids"]]
    bench = [{"player_id": str(pid), "position": None} for pid in lineup["bench_ids"]]
    # Positions are filled by the caller. This helper expects them present.
    return None, []


def score_plan(lab: dict[str, Any], starting: list[dict[str, Any]], bench: list[dict[str, Any]], captain_id: str, vice_id: str, hit: int, points: dict[int, dict[str, int]]) -> tuple[int | None, bool]:
    if not points:
        return None, False
    minutes = {row["player_id"]: points.get(int(row["player_id"]), {}).get("minutes", 0) for row in starting + bench}
    raw = {row["player_id"]: points.get(int(row["player_id"]), {}).get("points", 0) for row in starting + bench}
    xi_rows = [{"player_id": row["player_id"], "position": row["position"]} for row in starting]
    bench_rows = [{"player_id": row["player_id"], "position": row["position"]} for row in bench]
    replaced = lab["apply_automatic_substitutions"](
        xi_rows,
        bench_rows,
        played_minutes=minutes,
        rules=lab["rules"],
    )
    base = sum(raw[row["player_id"]] for row in replaced)
    captain_minutes = minutes.get(captain_id, 0)
    if captain_minutes > 0:
        total = base + raw[captain_id]
    else:
        _multiplied, who = lab["captain_points"](raw[captain_id], 0, raw[vice_id], rules=lab["rules"])
        total = base + (raw[vice_id] if who == "vice_captain" else 0)
    planned_ids = [row["player_id"] for row in starting]
    subbed = [row["player_id"] for row in replaced] != planned_ids
    return int(total) - int(hit), subbed


def player_card(row: dict[str, Any], api: dict[str, Any], gw: int, points: dict[int, dict[str, int]], *, captain: bool = False, vice: bool = False, bench_order: int | None = None) -> dict[str, Any]:
    element = row["element"]
    week_fixtures = fixtures_for(int(row["club_id"]), gw, api["fixtures"])
    opponent, home, fdr = opponent_label(int(row["club_id"]), week_fixtures, api["teams"])
    realised = None
    if points:
        realised = points.get(int(row["player_id"]), {}).get("points", 0)
    card: dict[str, Any] = {
        "id": f"player:{SEASON}:{row['player_id']}",
        "webName": element["web_name"],
        "fullName": f"{element['first_name']} {element['second_name']}".strip(),
        "team": api["teams"][int(row["club_id"])]["short_name"],
        "position": row["position"],
        "cost": row["now_cost"],
        "projectedMinutes": round(float(row["expected_minutes"]), 1),
        "expectedPoints": round(float(row["expected_points"]), 2),
        "realisedPoints": realised,
        "opponent": opponent,
        "isHome": home,
        "fixtureDifficulty": fdr,
    }
    if gw >= 11 and element.get("selected_by_percent") not in (None, ""):
        card["selectedByPercent"] = float(element["selected_by_percent"])
    if captain:
        card["isCaptain"] = True
        card["multiplier"] = 2
    if vice:
        card["isViceCaptain"] = True
    if bench_order is not None:
        card["benchOrder"] = bench_order
    return card


def transfer_actions(selected: dict[str, Any], market: dict[str, dict[str, Any]], api: dict[str, Any]) -> list[dict[str, Any]]:
    actions = []
    for move in selected.get("transfers") or []:
        incoming = market[str(move["player_in_id"])]
        outgoing = market[str(move["player_out_id"])]
        in_team = api["teams"][int(incoming["club_id"])]["short_name"]
        out_team = api["teams"][int(outgoing["club_id"])]["short_name"]
        actions.append(
            {
                "playerIn": {
                    "id": f"player:{SEASON}:{incoming['player_id']}",
                    "webName": incoming["web_name"],
                    "team": in_team,
                    "position": incoming["position"],
                    "cost": incoming["now_cost"],
                    "expectedPoints": round(float(incoming["expected_points"]), 2),
                },
                "playerOut": {
                    "id": f"player:{SEASON}:{outgoing['player_id']}",
                    "webName": outgoing["web_name"],
                    "team": out_team,
                    "position": outgoing["position"],
                    "sellPrice": round(float(outgoing["purchase_price"]), 1),
                    "expectedPoints": round(float(outgoing["expected_points"]), 2),
                },
                "netCostDelta": round(float(incoming["now_cost"]) - float(outgoing["purchase_price"]), 1),
                "netXPDelta3GW": round(float(incoming["expected_points"]) - float(outgoing["expected_points"]), 2),
                "rationale": "Selected by this approach at the cutoff.",
            }
        )
    return actions


def plan_phrase(actions: list[dict[str, Any]], hit: int) -> str:
    if not actions:
        return "no transfers"
    pairs = "; ".join(
        f"{action['playerOut']['webName']} out, {action['playerIn']['webName']} in" for action in actions
    )
    count = "one transfer" if len(actions) == 1 else f"{len(actions)} transfers"
    hit_bit = f" taking a {hit}-point hit" if hit else ""
    return f"{count}{hit_bit} ({pairs})"


def limitations_for(kind: str, official: str, cutoff: str, built_at: str, freeze_mode: str = "") -> list[str]:
    shared = [
        "The forecast blends the lab's published 2025/26 points-per-90 prior with official minutes from earlier gameweeks only, then scales it by official fixture difficulty. Odds, ratings and the evidence ledger are not in this input.",
        "Chips are not in the search. A single-gameweek solver would spend Triple Captain on the first strong captain.",
        "The weekly solver looks at this gameweek only and may take at most one paid transfer. It is not a five-week mixed-integer programme. The initial squad uses the lab's six-week search.",
        "Same-state evidence copies the optimiser. No pre-deadline evidence ledger was available to move a rate.",
        "Promoted-club shrinkage and World Cup fatigue were not applied. The prior file has no club labels, and this run does not guess either flag.",
        "Selling prices follow the official half-profit rule from the purchase price stored on this squad.",
    ]
    if kind == "historical-replay":
        shared.insert(
            0,
            "This is a reconstructive replay. The cutoff is first kickoff minus 90 minutes. The file was built on 18 November 2026, after these matches, and was not frozen before the deadline.",
        )
        shared.insert(
            1,
            "Injury and team news were not available as a pre-deadline snapshot, so every listed player was treated as available.",
        )
        if official != cutoff:
            shared.append(
                f"The official FPL deadline was {official}. The cutoff on this page is first kickoff minus 90 minutes ({cutoff})."
            )
    else:
        shared.insert(
            0,
            f"This plan was frozen at {built_at}, before the official deadline ({official}). It is not a reconstructive replay.",
        )
        shared.insert(
            1,
            "Availability is the official FPL status at the freeze. Team news published after that time is not in the plan.",
        )
        if freeze_mode == "early-publish":
            shared.insert(
                2,
                "This lock was published before the two-hour window. The weekly job may replace it once, inside that window, and then the hash stays put.",
            )
    return shared


def arm_summary(arm_id: str, plan: dict[str, Any], actions: list[dict[str, Any]], hit: int, captain: str, vice: str, realised: int | None, baseline_points: int | None) -> dict[str, Any]:
    names = {
        "baseline": ("Template (roll transfers)", "Template", "Heuristic"),
        "optimiser": ("Optimiser (forecast)", "Optimiser", "Mixed-Integer Linear (ILP)"),
        "agent": ("Evidence-informed", "Evidence", "Multi-Objective Agent"),
    }
    name, short, category = names[arm_id]
    if arm_id == "agent":
        description = "Same squad as the optimiser. No pre-deadline evidence ledger was available."
    elif actions:
        description = ", ".join(
            f"{action['playerOut']['webName']} to {action['playerIn']['webName']}" for action in actions
        )
        if hit:
            description += f" (-{hit} hit)"
    else:
        description = "No transfers"
    delta = 0 if baseline_points is None or realised is None else realised - baseline_points
    return {
        "id": arm_id,
        "name": name,
        "shortLabel": short,
        "category": category,
        "description": description,
        "objectiveEP": plan["projected"],
        "realisedPoints": realised,
        "varianceScore": 0,
        "transfersCount": len(actions),
        "hits": hit // 4 if hit else 0,
        "captain": captain,
        "viceCaptain": vice,
        "chip": "none",
        "formation": plan["formation"],
        "decisionDeltaVsBaseline": delta,
        "realisedRankEffect": f"{realised} pts net" if realised is not None else None,
        "solverRuntimeMs": 0,
    }


def build_validated(api: dict[str, Any], market: dict[str, dict[str, Any]], selected: dict[str, Any], gw: int, points: dict[int, dict[str, int]], state_before: SquadState, *, arm_name: str, projected: float) -> tuple[dict[str, Any], int | None, bool]:
    lineup = selected["lineup"]
    hit = int(selected.get("hit_cost") or 0)
    actions = transfer_actions(selected, market, api)
    # Selling price on the way out is the purchase price only as a label fallback.
    # Replace it with the rules selling price already applied by using purchase vs now.
    rules = build_validated.lab["rules"]  # type: ignore[attr-defined]
    price_of = build_validated.lab["selling_price"]  # type: ignore[attr-defined]
    for action, move in zip(actions, selected.get("transfers") or []):
        out_id = str(move["player_out_id"])
        bought = float(state_before.purchase.get(out_id, market[out_id]["now_cost"]))
        sell = price_of(bought, float(market[out_id]["now_cost"]), rules)
        action["playerOut"]["sellPrice"] = round(float(sell), 1)
        action["netCostDelta"] = round(action["playerIn"]["cost"] - action["playerOut"]["sellPrice"], 1)
    starting_ids = [str(pid) for pid in lineup["starting_xi_ids"]]
    bench_ids = [str(pid) for pid in lineup["bench_ids"]]
    captain_id = str(lineup["captain_id"])
    vice_id = str(lineup["vice_captain_id"])
    starting = [
        player_card(
            market[pid],
            api,
            gw,
            points,
            captain=pid == captain_id,
            vice=pid == vice_id,
        )
        for pid in starting_ids
    ]
    bench = [
        player_card(market[pid], api, gw, points, bench_order=index + 1)
        for index, pid in enumerate(bench_ids)
    ]
    captain = next(card for card in starting if card.get("isCaptain"))
    vice = next(card for card in starting if card.get("isViceCaptain"))
    realised, subbed = score_plan(
        # score_plan needs the lab. Filled by the caller via a closure attribute.
        build_validated.lab,  # type: ignore[attr-defined]
        [{"player_id": pid, "position": market[pid]["position"]} for pid in starting_ids],
        [{"player_id": pid, "position": market[pid]["position"]} for pid in bench_ids],
        captain_id,
        vice_id,
        hit,
        points,
    )
    validated = {
        "armId": "optimiser" if arm_name == "optimiser" else "baseline",
        "armName": "Optimiser (forecast)" if arm_name == "optimiser" else "Template (roll transfers)",
        "formation": formation_string(lineup["formation"]),
        "bank": round(float(selected["bank_after"]), 1),
        "hitCost": hit,
        "freeTransfersAvailable": state_before.free_transfers,
        "chipUsed": "none",
        "captain": captain,
        "viceCaptain": vice,
        "startingXI": starting,
        "bench": bench,
        "transfersIn": [],
        "transfersOut": [],
        "transferActions": actions,
        "projectedSquadTotalXP": projected,
        "realisedSquadTotalPoints": realised,
    }
    validated["transfersIn"] = [
        player_card(market[str(move["player_in_id"])], api, gw, points)
        for move in selected.get("transfers") or []
    ]
    validated["transfersOut"] = [
        player_card(market[str(move["player_out_id"])], api, gw, points)
        for move in selected.get("transfers") or []
    ]
    return validated, realised, subbed


def projected_from_selected(selected: dict[str, Any]) -> float:
    return round(float(selected["objective"]), 1)


def decision_document(
    *,
    gw: int,
    kind: str,
    freeze_mode: str,
    deadline: datetime,
    frozen_at: datetime,
    built_at: datetime,
    official_deadline: datetime,
    optimiser: dict[str, Any],
    template: dict[str, Any],
    optimiser_points: int | None,
    template_points: int | None,
    optimiser_sub: bool,
    template_sub: bool,
    opt_state: SquadState,
    tpl_state: SquadState,
    lab: dict[str, Any],
    model_note: str,
) -> dict[str, Any]:
    plan = optimiser
    actions = plan["transferActions"]
    hit = int(plan["hitCost"])
    cap = plan["captain"]["webName"]
    vice = plan["viceCaptain"]["webName"]
    transfers = plan_phrase(actions, hit)
    bits = [
        f"{'Reconstructive replay' if kind == 'historical-replay' else 'Live freeze'} for {SEASON.replace('-', '/')} Gameweek {gw}.",
        f"The optimiser captained {cap} (vice {vice}), formation {plan['formation']}, and made {transfers}.",
    ]
    if optimiser_points is not None:
        bits.append(f"It scored {optimiser_points} net points after hits.")
    else:
        bits.append("Results are pending.")
    bits.append(f"The projected squad total, with the captain doubled and any hit removed, was {plan['projectedSquadTotalXP']:.1f}.")
    if optimiser_sub:
        bits.append("Automatic substitutions changed the scoring eleven. The points use the official rules.")
    tradeoffs = []
    if actions:
        tradeoffs.append(
            "Transfers: "
            + "; ".join(f"{action['playerOut']['webName']} to {action['playerIn']['webName']}" for action in actions)
            + "."
        )
    else:
        tradeoffs.append("The optimiser held the squad this week.")
    if template["captain"]["webName"] != cap:
        tradeoffs.append(f"The template captained {template['captain']['webName']} instead of {cap}.")
    if optimiser_points is not None and template_points is not None:
        delta = template_points - optimiser_points
        tradeoffs.append(f"The template finished {delta:+d} points versus the optimiser this week.")
    tradeoffs.append("No chip was played. Chips were left out of the search.")
    hash_payload = {
        "bank": plan["bank"],
        "bench": [player["id"] for player in plan["bench"]],
        "captain": plan["captain"]["id"],
        "chip": "none",
        "formation": plan["formation"],
        "freeTransfers": plan["freeTransfersAvailable"],
        "gw": gw,
        "hit": hit,
        "projected": plan["projectedSquadTotalXP"],
        "season": SEASON,
        "starting": [player["id"] for player in plan["startingXI"]],
        "transfers": [
            {"in": action["playerIn"]["id"], "out": action["playerOut"]["id"]} for action in actions
        ],
        "vice": plan["viceCaptain"]["id"],
    }
    digest = sha256(hash_payload)
    opt_summary = arm_summary(
        "optimiser",
        {"formation": plan["formation"], "projected": plan["projectedSquadTotalXP"]},
        actions,
        hit,
        cap,
        vice,
        optimiser_points,
        template_points,
    )
    tpl_actions = template["transferActions"]
    tpl_summary = arm_summary(
        "baseline",
        {"formation": template["formation"], "projected": template["projectedSquadTotalXP"]},
        tpl_actions,
        int(template["hitCost"]),
        template["captain"]["webName"],
        template["viceCaptain"]["webName"],
        template_points,
        template_points,
    )
    evidence = dict(opt_summary)
    evidence.update(
        {
            "id": "agent",
            "name": "Evidence-informed",
            "shortLabel": "Evidence",
            "category": "Multi-Objective Agent",
            "description": "Same squad as the optimiser. No pre-deadline evidence ledger was available.",
            "decisionDeltaVsBaseline": opt_summary["decisionDeltaVsBaseline"],
        }
    )
    title = (
        f"Gameweek {gw} reconstructive replay"
        if kind == "historical-replay"
        else f"Gameweek {gw} live freeze"
    )
    status = "completed" if optimiser_points is not None else "upcoming"
    return {
        "season": SEASON,
        "gw": gw,
        "title": title,
        "deadline": iso(deadline),
        "status": status,
        "datasetKind": kind,
        "provenance": {
            "modelVersion": model_note,
            "frozenAt": iso(frozen_at),
            "snapshotHash": f"sha256:{digest}",
            "datasetId": f"fpl-replay-{SEASON}-gw{gw}",
            "solverEngine": "Al2800/FPL WP-07 bounded search",
            "executionTimestamp": iso(built_at if kind == "live-freeze" else frozen_at),
            "solverParameters": {
                "horizonWeeks": 6 if gw == 1 else 1,
                "decayRate": 0.9,
                "hitPenalty": 4.0,
                "riskAversion": 0.0,
                "freeTransferConservationWeight": 0.0,
                "maxPlayersPerClub": 3,
                "teamBudgetCap": 100.0,
            },
            "isDemoSample": False,
            "datasetKind": kind,
            "freezeMode": freeze_mode,
            "labCommit": lab["commit"],
            "officialDeadline": iso(official_deadline),
            "limitations": limitations_for(
                kind, iso(official_deadline), iso(deadline), iso(built_at), freeze_mode
            ),
        },
        "validatedPlan": plan,
        "arms": [tpl_summary, opt_summary, evidence],
        "summaryAnalysis": {
            "executiveSummary": " ".join(bits),
            "keyTradeoffs": tradeoffs,
            "shadowPrices": {
                "budgetPerMillionXP": 0,
                "transferMarginalValueXP": 0,
                "benchPointsExpectancy": 0,
            },
            "divergenceNotes": (
                "This is a reconstructive historical replay, not a live two-hour freeze. "
                "Inputs were rebuilt after the matches. See Methods and the limitations on this page."
                if kind == "historical-replay"
                else "This plan is a live freeze. The squad, captain, transfers and chip were locked before the deadline and are not edited when the points arrive."
            ),
        },
        "managerState": {
            "optimiser": opt_state.to_json(),
            "template": tpl_state.to_json(),
        },
        "templatePlan": template,
    }


def write_json(path: Path, payload: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, indent=2, ensure_ascii=True) + "\n")


def load_decision(gw: int) -> dict[str, Any] | None:
    path = OUT_DIR / f"gw-{gw:02d}.json"
    if not path.exists():
        return None
    return json.loads(path.read_text())


def write_index() -> None:
    rows = []
    files = sorted(OUT_DIR.glob("gw-*.json"))
    optimiser_points = 0
    template_points = 0
    evidence_points = 0
    scored = 0
    for path in files:
        decision = json.loads(path.read_text())
        plan = decision["validatedPlan"]
        template = next(arm["realisedPoints"] for arm in decision["arms"] if arm["id"] == "baseline")
        evidence = next(arm["realisedPoints"] for arm in decision["arms"] if arm["id"] == "agent")
        points = plan["realisedSquadTotalPoints"]
        if points is not None:
            optimiser_points += int(points)
            template_points += int(template or 0)
            evidence_points += int(evidence or 0)
            scored += 1
        rows.append(
            {
                "gw": decision["gw"],
                "captain": plan["captain"]["webName"],
                "formation": plan["formation"],
                "projected": plan["projectedSquadTotalXP"],
                "points": points,
                "templatePoints": template,
                "evidencePoints": evidence,
                "transfers": len(plan["transferActions"]),
                "hits": plan["hitCost"],
                "chip": plan["chipUsed"],
                "hash": decision["provenance"]["snapshotHash"].replace("sha256:", ""),
            }
        )
    index = {
        "id": SEASON,
        "kind": "live-freeze",
        "title": "FPL 2026/27: Team, Captain and Transfers",
        "summary": (
            f"Gameweeks 1 to 10 are a reconstructive replay, scored on official points. "
            f"From Gameweek 11 the pick is frozen before the deadline. "
            f"The totals below add the {scored} scored weeks. No chip is in the search."
        ),
        "gameweeks": len(rows),
        "optimiserPoints": optimiser_points,
        "templatePoints": template_points,
        "evidencePoints": evidence_points,
        "chipsPlayed": [row for row in rows if row["chip"] != "none"],
        "rows": rows,
    }
    write_json(OUT_DIR / "index.json", index)
    print(
        f"index weeks={len(rows)} optimiser={optimiser_points} template={template_points}",
        flush=True,
    )


def previous_state(gw: int) -> tuple[SquadState, SquadState]:
    if gw == 1:
        raise SystemExit("Gameweek 1 has no previous squad")
    previous = load_decision(gw - 1)
    if previous is None or "managerState" not in previous:
        raise SystemExit(f"Gameweek {gw - 1} has no saved squad state. Rebuild from Gameweek 1.")
    state = previous["managerState"]
    return SquadState.from_json(state["optimiser"]), SquadState.from_json(state["template"])


def run_initial(api: dict[str, Any], lab: dict[str, Any], cutoff: datetime) -> tuple[dict[str, Any], SquadState]:
    print("optimising initial squad", flush=True)
    packet = initial_packet(api, lab, cutoff)
    result = lab["optimise_initial_squad"](
        packet,
        policy=lab["policy"],
        arm_mode="deterministic",
        rules=lab["rules"],
        ruleset_sha256=lab["rules_sha"],
    )
    selected = result["selected"]
    week = selected["weekly_plans"][0]
    lineup = week["lineup"]
    projected = round(week["value"]["starter_points"] + week["value"]["captain_bonus"], 1)
    ids = [str(row["player_id"]) for row in selected["squad"]]
    purchase = {str(row["player_id"]): round(float(row["now_cost"]), 1) for row in selected["squad"]}
    plan = {
        "transfers": [],
        "hit_cost": 0,
        "bank_after": selected["bank"],
        "objective": projected,
        "lineup": {
            "formation": lineup["formation"],
            "starting_xi_ids": lineup["starting_xi"],
            "bench_ids": lineup["bench"],
            "captain_id": lineup["captain_id"],
            "vice_captain_id": lineup["vice_captain_id"],
        },
    }
    print(
        "GW1",
        formation_string(lineup["formation"]),
        "bank",
        selected["bank"],
        "objective",
        projected,
        "captain",
        lineup["captain_id"],
        flush=True,
    )
    state = SquadState(ids, purchase, float(selected["bank"]), 1)
    # The stored state is the squad after the gameweek, so free transfers are for GW2.
    # The lineup order is the published order. Purchase prices cover the 15.
    ordered = [str(pid) for pid in lineup["starting_xi"] + lineup["bench"]]
    state = SquadState(ordered, purchase, float(selected["bank"]), 1)
    return plan, state


def build_gameweek(api: dict[str, Any], lab: dict[str, Any], gw: int, built_at: datetime, *, allow_early: bool) -> None:
    events = event_by_id(api["bootstrap"])
    event = events[gw]
    official = parse_time(event["deadline_time"])
    kickoff = first_kickoff(gw, api["fixtures"])
    cutoff = kickoff - timedelta(minutes=90)
    finished = bool(event.get("finished") and event.get("data_checked"))
    existing = load_decision(gw)
    if finished and gw >= 11 and existing is None:
        raise SystemExit(f"Gameweek {gw} is already finished and was not frozen. Refusing to backfill a live pick.")
    if not finished and existing and existing["provenance"].get("freezeMode") == "deadline-window" and not allow_early:
        print(f"GW{gw} already frozen in the deadline window", flush=True)
        return
    live_mode = not finished
    kind = "historical-replay" if finished and gw <= 10 else "live-freeze"
    if finished and gw <= 10:
        freeze_mode = "reconstructive"
        frozen_at = cutoff
        deadline = cutoff
    else:
        kind = "live-freeze"
        remaining = official - built_at
        if remaining.total_seconds() <= 0:
            raise SystemExit(f"Gameweek {gw} deadline has passed ({iso(official)}). Not freezing a pick.")
        in_window = timedelta(hours=2) <= remaining <= timedelta(hours=2, minutes=45)
        if in_window or (existing and existing["provenance"].get("freezeMode") == "early-publish" and remaining <= timedelta(hours=2, minutes=45)):
            freeze_mode = "deadline-window"
        elif allow_early or (existing is None and remaining < timedelta(hours=2)):
            freeze_mode = "early-publish" if not in_window else "deadline-window"
            if remaining < timedelta(hours=2):
                freeze_mode = "deadline-window"
        else:
            print(f"GW{gw} not in the freeze window ({remaining} until deadline)", flush=True)
            return
        frozen_at = built_at
        deadline = official
    points = live_points(api["live"].get(gw)) if finished else {}
    if gw == 1:
        if kind != "historical-replay":
            raise SystemExit("Gameweek 1 initial squad is only built as a reconstructive replay")
        selected, after = run_initial(api, lab, cutoff)
        market = market_for_gw(api, lab, gw, False)
        before = SquadState(after.ids, after.purchase, 0.0, 0)
        # run_initial already consumed the squad. before is only for transfer labels.
        projected = projected_from_selected(selected)
        build_validated.lab = lab  # type: ignore[attr-defined]
        validated, realised, subbed = build_validated(
            api, market, selected, gw, points, before, arm_name="optimiser", projected=projected
        )
        template_validated = json.loads(json.dumps(validated))
        template_validated["armId"] = "baseline"
        template_validated["armName"] = "Template (roll transfers)"
        opt_after = after
        tpl_after = SquadState(after.ids, after.purchase, after.bank, after.free_transfers)
        template_points = realised
        template_sub = subbed
    else:
        opt_before, tpl_before = previous_state(gw)
        market = market_for_gw(api, lab, gw, live_mode, {**opt_before.purchase, **tpl_before.purchase})
        for pid, price in {**opt_before.purchase, **tpl_before.purchase}.items():
            if pid in market:
                market[pid]["purchase_price"] = price
        print(f"solving GW{gw} optimiser", flush=True)
        opt_selected = solve_week(lab, gw, opt_before, market, template=False)
        print(f"solving GW{gw} template", flush=True)
        tpl_selected = solve_week(lab, gw, tpl_before, market, template=True)
        build_validated.lab = lab  # type: ignore[attr-defined]
        validated, realised, subbed = build_validated(
            api,
            market,
            opt_selected,
            gw,
            points,
            opt_before,
            arm_name="optimiser",
            projected=projected_from_selected(opt_selected),
        )
        template_validated, template_points, template_sub = build_validated(
            api,
            market,
            tpl_selected,
            gw,
            points,
            tpl_before,
            arm_name="baseline",
            projected=projected_from_selected(tpl_selected),
        )
        opt_after = apply_selected(opt_before, opt_selected, market)
        tpl_after = apply_selected(tpl_before, tpl_selected, market)
    model_note = f"wp07-wc-fh-rebuild-v0.3 prior-blend-v1 {lab['commit'][:12]}"
    document = decision_document(
        gw=gw,
        kind=kind,
        freeze_mode=freeze_mode,
        deadline=deadline,
        frozen_at=frozen_at,
        built_at=built_at,
        official_deadline=official,
        optimiser=validated,
        template=template_validated,
        optimiser_points=realised,
        template_points=template_points,
        optimiser_sub=subbed,
        template_sub=template_sub,
        opt_state=opt_after,
        tpl_state=tpl_after,
        lab=lab,
        model_note=model_note,
    )
    write_json(OUT_DIR / f"gw-{gw:02d}.json", document)
    print(
        f"wrote GW{gw} {document['validatedPlan']['captain']['webName']} "
        f"pts={document['validatedPlan']['realisedSquadTotalPoints']} "
        f"mode={freeze_mode}",
        flush=True,
    )


def rescore(api: dict[str, Any], lab: dict[str, Any]) -> int:
    """Fill official points on frozen picks. Does not change the plan hash."""
    changed = 0
    events = event_by_id(api["bootstrap"])
    for path in sorted(OUT_DIR.glob("gw-*.json")):
        decision = json.loads(path.read_text())
        gw = int(decision["gw"])
        event = events.get(gw)
        if not event or not (event.get("finished") and event.get("data_checked")):
            continue
        if decision["validatedPlan"]["realisedSquadTotalPoints"] is not None and decision["status"] == "completed":
            continue
        points = live_points(api["live"].get(gw))
        if not points:
            continue
        before_hash = decision["provenance"]["snapshotHash"]

        def fill(plan: dict[str, Any]) -> tuple[int, bool]:
            for group in (plan["startingXI"], plan["bench"], plan["transfersIn"], plan["transfersOut"]):
                for card in group:
                    pid = int(card["id"].rsplit(":", 1)[-1])
                    card["realisedPoints"] = points.get(pid, {}).get("points", 0)
            starting = [
                {"player_id": card["id"].rsplit(":", 1)[-1], "position": card["position"]}
                for card in plan["startingXI"]
            ]
            bench = [
                {"player_id": card["id"].rsplit(":", 1)[-1], "position": card["position"]}
                for card in plan["bench"]
            ]
            return score_plan(
                lab,
                starting,
                bench,
                plan["captain"]["id"].rsplit(":", 1)[-1],
                plan["viceCaptain"]["id"].rsplit(":", 1)[-1],
                int(plan["hitCost"]),
                points,
            )

        opt_points, opt_sub = fill(decision["validatedPlan"])
        decision["validatedPlan"]["realisedSquadTotalPoints"] = opt_points
        template_plan = decision.get("templatePlan") or decision["validatedPlan"]
        template_points, _template_sub = fill(template_plan)
        if "templatePlan" in decision:
            decision["templatePlan"]["realisedSquadTotalPoints"] = template_points
        template_arm = next(arm for arm in decision["arms"] if arm["id"] == "baseline")
        evidence_arm = next(arm for arm in decision["arms"] if arm["id"] == "agent")
        template_arm["realisedPoints"] = template_points
        template_arm["realisedRankEffect"] = f"{template_points} pts net"
        evidence_arm["realisedPoints"] = opt_points
        evidence_arm["realisedRankEffect"] = f"{opt_points} pts net"
        opt_arm = next(arm for arm in decision["arms"] if arm["id"] == "optimiser")
        opt_arm["realisedPoints"] = opt_points
        opt_arm["realisedRankEffect"] = f"{opt_points} pts net"
        baseline_points = template_points
        if baseline_points is not None:
            opt_arm["decisionDeltaVsBaseline"] = int(opt_points) - int(baseline_points)
            evidence_arm["decisionDeltaVsBaseline"] = opt_arm["decisionDeltaVsBaseline"]
        decision["status"] = "completed"
        cap = decision["validatedPlan"]["captain"]["webName"]
        vice = decision["validatedPlan"]["viceCaptain"]["webName"]
        transfers = plan_phrase(decision["validatedPlan"]["transferActions"], int(decision["validatedPlan"]["hitCost"]))
        kind = decision["datasetKind"]
        bits = [
            f"{'Reconstructive replay' if kind == 'historical-replay' else 'Live freeze'} for 2026/27 Gameweek {gw}.",
            f"The optimiser captained {cap} (vice {vice}), formation {decision['validatedPlan']['formation']}, and made {transfers}.",
            f"It scored {opt_points} net points after hits.",
            f"The projected squad total, with the captain doubled and any hit removed, was {decision['validatedPlan']['projectedSquadTotalXP']:.1f}.",
        ]
        if opt_sub:
            bits.append("Automatic substitutions changed the scoring eleven. The points use the official rules.")
        decision["summaryAnalysis"]["executiveSummary"] = " ".join(bits)
        after_hash = decision["provenance"]["snapshotHash"]
        if after_hash != before_hash:
            raise SystemExit(f"Scoring changed the GW{gw} hash. Aborting.")
        write_json(path, decision)
        changed += 1
        print(f"scored GW{gw}: {opt_points}", flush=True)
    if changed:
        write_index()
    else:
        print("no gameweeks to score", flush=True)
    return changed


def next_unfrozen(api: dict[str, Any], built_at: datetime) -> int | None:
    for event in api["bootstrap"]["events"]:
        if event.get("finished"):
            continue
        deadline = parse_time(event["deadline_time"])
        if deadline <= built_at:
            continue
        return int(event["id"])
    return None


def tick(api: dict[str, Any], lab: dict[str, Any], built_at: datetime) -> None:
    rescore(api, lab)
    gw = next_unfrozen(api, built_at)
    if gw is None:
        print("no future gameweek to freeze", flush=True)
        return
    existing = load_decision(gw)
    event = event_by_id(api["bootstrap"])[gw]
    remaining = parse_time(event["deadline_time"]) - built_at
    in_window = timedelta(hours=2) <= remaining <= timedelta(hours=2, minutes=45)
    catch_up = remaining < timedelta(hours=2)
    replace_early = (
        existing is not None
        and existing["provenance"].get("freezeMode") == "early-publish"
        and remaining <= timedelta(hours=2, minutes=45)
    )
    if existing and existing["provenance"].get("freezeMode") == "deadline-window":
        print(f"GW{gw} deadline freeze already stored", flush=True)
        return
    if not existing and not in_window and not catch_up:
        print(f"GW{gw} deadline in {remaining}. Waiting for the 2 hour window.", flush=True)
        return
    if existing and not replace_early:
        print(f"GW{gw} early freeze stands until the deadline window", flush=True)
        return
    # A catch-up or window freeze must chain from the previous saved squad.
    build_gameweek(api, lab, gw, built_at, allow_early=False)
    write_index()


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("command", choices=["rebuild", "freeze", "score", "tick"])
    parser.add_argument("--through", type=int, default=10)
    parser.add_argument("--gw", type=int, default=None)
    parser.add_argument("--built-at", default=None)
    parser.add_argument("--allow-early", action="store_true")
    parser.add_argument("--refresh-cache", action="store_true")
    args = parser.parse_args()
    if args.refresh_cache and CACHE.exists():
        import shutil

        shutil.rmtree(CACHE)
    built_at = parse_time(args.built_at) if args.built_at else utc_now()
    print(f"loading lab and FPL API, built_at={iso(built_at)}", flush=True)
    lab = load_lab()
    api = load_api()
    if args.command == "rebuild":
        for gw in range(1, args.through + 1):
            build_gameweek(api, lab, gw, built_at, allow_early=False)
        write_index()
    elif args.command == "freeze":
        gw = args.gw or next_unfrozen(api, built_at)
        if gw is None:
            raise SystemExit("No gameweek to freeze")
        build_gameweek(api, lab, gw, built_at, allow_early=args.allow_early)
        write_index()
    elif args.command == "score":
        rescore(api, lab)
    elif args.command == "tick":
        tick(api, lab, built_at)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
