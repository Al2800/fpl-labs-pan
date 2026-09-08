#!/usr/bin/env python3
"""Build compact 2025/26 presentation JSON from Al2800/FPL replay artifacts."""

from __future__ import annotations

import csv
import json
from collections import defaultdict
from pathlib import Path

ROOT = Path("/tmp/fpl-lab/reports/benchmarks/2025-26")
VAASTAV = Path("/tmp/vaastav-2025-26")
OUT = Path("/workspace/data/seasons/2025-26")

ARM_MAP = {
    "naive_baseline": "baseline",
    "forecast_optimizer": "optimiser",
    "evidence_agent": "agent",
}

ARM_META = {
    "baseline": {
        "name": "Template (roll transfers)",
        "shortLabel": "Template",
        "category": "Heuristic",
    },
    "optimiser": {
        "name": "Optimiser (forecast)",
        "shortLabel": "Optimiser",
        "category": "Mixed-Integer Linear (ILP)",
    },
    "agent": {
        "name": "Evidence-informed",
        "shortLabel": "Evidence",
        "category": "Multi-Objective Agent",
    },
}

LESSON_COPY = {
    "cold_start_no_prior_gameweek": "GW1 has no prior gameweek of locked form.",
    "controlled_gw1_seed_no_historical_forecast": "GW1 used the official Scout seed; there was no historical forecast lock.",
    "final_export_fixture_revision_not_archived": "Fixtures come from the final season export, so mid-season revisions are not in this snapshot.",
    "fixture_deadline_derived_as_first_kickoff_minus_90_minutes": "The cutoff is reconstructed as first kickoff minus 90 minutes, not the live FPL deadline clock.",
    "historical_manager_state_unavailable": "No private manager state (exact bank, selling prices, chip timing) was archived at the time.",
    "historical_news_unavailable": "Press and injury notes were not locked before the deadline.",
    "historical_prices_not_deadline_snapshots": "Prices are not exact pre-deadline quotes.",
    "unshifted_vaastav_xP_excluded": "Raw community xP tables were not used as the pre-deadline forecast.",
    "untimestamped_market_odds_excluded": "Closing odds were excluded because they are not timestamped to the cutoff.",
    "historical_unstructured_evidence_and_recorded_human_choice_unavailable": "No admissible historical press, injury notes, or recorded human proposal was available.",
}

POSITION_FROM_TYPE = {1: "GKP", 2: "DEF", 3: "MID", 4: "FWD"}


def gw_dir(gw: int) -> Path:
    padded = ROOT / f"gw-{gw:02d}"
    if padded.exists():
        return padded
    return ROOT / f"gw-{gw}"


def pid_num(player_id: str) -> int:
    return int(str(player_id).rsplit(":", 1)[-1])


def team_num(club_id: str) -> int:
    return int(str(club_id).rsplit(":", 1)[-1])


def load_csv(path: Path) -> list[dict[str, str]]:
    with path.open(newline="", encoding="utf-8") as handle:
        return list(csv.DictReader(handle))


def formation_string(formation: dict) -> str:
    return f"{formation.get('DEF', 0)}-{formation.get('MID', 0)}-{formation.get('FWD', 0)}"


def chip_type(raw) -> str:
    if not raw:
        return "none"
    value = str(raw).lower()
    if value in {"tc", "triple_captain", "triple-captain"}:
        return "tc"
    if value in {"bb", "bench_boost", "bench-boost"}:
        return "bb"
    if value in {"fh", "free_hit", "free-hit"}:
        return "fh"
    if value in {"wc", "wildcard"}:
        return "wc"
    return "none"


def humanize_lessons(lessons: list[str]) -> list[str]:
    seen: list[str] = []
    for lesson in lessons:
        text = LESSON_COPY.get(lesson, lesson.replace("_", " "))
        if text not in seen:
            seen.append(text)
    return seen[:6]


def load_identities():
    players = {}
    for row in load_csv(VAASTAV / "players_raw.csv"):
        players[int(row["id"])] = {
            "webName": row["web_name"],
            "fullName": f"{row['first_name']} {row['second_name']}".strip(),
            "teamId": int(row["team"]),
            "position": POSITION_FROM_TYPE.get(int(row["element_type"]), "MID"),
            "cost": int(row["now_cost"]) / 10.0,
            "selectedByPercent": float(row.get("selected_by_percent") or 0),
        }
    teams = {}
    for row in load_csv(VAASTAV / "teams.csv"):
        teams[int(row["id"])] = {
            "name": row["name"],
            "short": row["short_name"],
            "strength": int(row.get("strength") or 3),
        }
    fixtures: dict[tuple[int, int], dict] = {}
    for row in load_csv(VAASTAV / "fixtures.csv"):
        event = row.get("event") or row.get("Gameweek")
        if not event:
            continue
        gw = int(float(event))
        home = int(row["team_h"])
        away = int(row["team_a"])
        fixtures[(gw, home)] = {
            "opponentId": away,
            "isHome": True,
            "fdr": int(row.get("team_h_difficulty") or 3),
        }
        fixtures[(gw, away)] = {
            "opponentId": home,
            "isHome": False,
            "fdr": int(row.get("team_a_difficulty") or 3),
        }
    return players, teams, fixtures


def load_forecast(gw: int) -> dict[int, dict]:
    path = gw_dir(gw) / "setup" / "shared-locked-forecast.json"
    if not path.exists():
        return {}
    data = json.loads(path.read_text())
    by_id = {}
    for player in data.get("players", []):
        by_id[pid_num(player["player_id"])] = player
    return by_id


def opponent_label(teams: dict, fixture: dict | None) -> tuple[str, bool, int]:
    if not fixture:
        return "—", False, 3
    opp = teams.get(fixture["opponentId"], {})
    short = opp.get("short", "?")
    home = fixture["isHome"]
    return f"{short} ({'H' if home else 'A'})", home, fixture["fdr"]


def player_card(
    player_id: str,
    club_id: str,
    position: str,
    gw: int,
    players: dict,
    teams: dict,
    fixtures: dict,
    forecast: dict,
    points_by_id: dict[int, int],
    *,
    is_captain=False,
    is_vice=False,
    bench_order: int | None = None,
    multiplier: int = 1,
) -> dict:
    num = pid_num(player_id)
    ident = players.get(num, {})
    team_id = team_num(club_id) if club_id else ident.get("teamId", 0)
    team = teams.get(team_id, {})
    fx = fixtures.get((gw, team_id))
    opp, is_home, fdr = opponent_label(teams, fx)
    fc = forecast.get(num, {})
    expected = fc.get("expected_points")
    minutes = fc.get("expected_minutes")
    card = {
        "id": player_id,
        "webName": ident.get("webName") or fc.get("name") or f"Player {num}",
        "fullName": ident.get("fullName") or fc.get("name") or f"Player {num}",
        "team": team.get("short") or str(team_id),
        "position": position or ident.get("position") or "MID",
        "cost": ident.get("cost") or 0,
        "projectedMinutes": round(float(minutes), 1) if minutes is not None else 0,
        "expectedPoints": round(float(expected), 2) if expected is not None else 0,
        "realisedPoints": points_by_id.get(num),
        "opponent": opp,
        "isHome": is_home,
        "fixtureDifficulty": fdr,
        "selectedByPercent": ident.get("selectedByPercent"),
    }
    if is_captain:
        card["isCaptain"] = True
        card["multiplier"] = multiplier
    if is_vice:
        card["isViceCaptain"] = True
    if bench_order is not None:
        card["benchOrder"] = bench_order
    return card


def build_plan(arm_dir: Path, gw: int, players, teams, fixtures, forecast) -> tuple[dict, dict, dict]:
    plan = json.loads((arm_dir / "validated-plan.json").read_text())
    outcome = json.loads((arm_dir / "realised-outcome.json").read_text())
    record = json.loads((arm_dir / "decision-record.json").read_text())

    points_by_id = {
        pid_num(row["player_id"]): int(row["total_points"])
        for row in outcome.get("aggregated_players", [])
    }
    lineup = plan["lineup"]
    squad_pos = {p["player_id"]: p for p in plan["squad_after"]}
    cap_id = lineup["captain_id"]
    vc_id = lineup["vice_captain_id"]
    multiplier = 3 if chip_type(plan.get("active_chip")) == "tc" else 2

    def card_for(pid: str, **kwargs):
        meta = squad_pos.get(pid, {})
        return player_card(
            pid,
            meta.get("club_id", ""),
            meta.get("position", ""),
            gw,
            players,
            teams,
            fixtures,
            forecast,
            points_by_id,
            **kwargs,
        )

    starting = [
        card_for(pid, is_captain=pid == cap_id, is_vice=pid == vc_id, multiplier=multiplier)
        for pid in lineup["starting_xi_ids"]
    ]
    bench = [
        card_for(pid, bench_order=idx + 1)
        for idx, pid in enumerate(lineup.get("bench_ids", []))
    ]
    captain = next((p for p in starting if p.get("isCaptain")), starting[0])
    vice = next((p for p in starting if p.get("isViceCaptain")), starting[min(1, len(starting) - 1)])

    transfers = []
    for action in plan.get("transfers", []):
        in_id = action["player_in_id"]
        out_id = action["player_out_id"]
        in_ident = players.get(pid_num(in_id), {})
        out_ident = players.get(pid_num(out_id), {})
        in_team = teams.get(in_ident.get("teamId", 0), {})
        out_team = teams.get(out_ident.get("teamId", 0), {})
        in_xp = forecast.get(pid_num(in_id), {}).get("expected_points") or 0
        out_xp = forecast.get(pid_num(out_id), {}).get("expected_points") or 0
        transfers.append(
            {
                "playerIn": {
                    "id": in_id,
                    "webName": in_ident.get("webName", in_id),
                    "team": in_team.get("short", ""),
                    "position": action.get("position") or in_ident.get("position", "MID"),
                    "cost": action.get("purchase_price") or in_ident.get("cost", 0),
                    "expectedPoints": round(float(in_xp), 2),
                },
                "playerOut": {
                    "id": out_id,
                    "webName": out_ident.get("webName", out_id),
                    "team": out_team.get("short", ""),
                    "position": action.get("position") or out_ident.get("position", "MID"),
                    "sellPrice": action.get("selling_price") or out_ident.get("cost", 0),
                    "expectedPoints": round(float(out_xp), 2),
                },
                "netCostDelta": round(
                    (action.get("purchase_price") or 0) - (action.get("selling_price") or 0), 1
                ),
                "netXPDelta3GW": round(float(in_xp) - float(out_xp), 2),
                "rationale": "Selected by this approach at the reconstructed cutoff.",
            }
        )

    finance = plan.get("finance", {})
    objective = record.get("recommendation", {}).get("objective")
    projected = None if objective in (None, 0, 0.0) else round(float(objective), 1)
    hit = int(finance.get("hit_cost") or 0)
    realised = outcome.get("gross_points")
    if realised is not None:
        realised = int(realised) - hit

    transfers_in = [card_for(t["playerIn"]["id"]) for t in transfers]
    transfers_out = []
    for action in plan.get("transfers", []):
        meta = {
            "player_id": action["player_out_id"],
            "club_id": "",
            "position": action.get("position", "MID"),
        }
        transfers_out.append(
            player_card(
                action["player_out_id"],
                "",
                action.get("position", "MID"),
                gw,
                players,
                teams,
                fixtures,
                forecast,
                points_by_id,
            )
        )

    validated = {
        "armId": ARM_MAP[arm_dir.name],
        "armName": ARM_META[ARM_MAP[arm_dir.name]]["name"],
        "formation": formation_string(lineup["formation"]),
        "bank": float(finance.get("bank_after") or 0),
        "hitCost": hit,
        "freeTransfersAvailable": int(finance.get("free_transfers_before") or 0),
        "chipUsed": chip_type(plan.get("active_chip")),
        "captain": captain,
        "viceCaptain": vice,
        "startingXI": starting,
        "bench": bench,
        "transfersIn": transfers_in,
        "transfersOut": transfers_out,
        "transferActions": transfers,
        "projectedSquadTotalXP": projected if projected is not None else 0,
        "realisedSquadTotalPoints": realised,
    }

    transfer_note = (
        ", ".join(f"{t['playerOut']['webName']} → {t['playerIn']['webName']}" for t in transfers)
        if transfers
        else "No transfers"
    )
    if hit:
        transfer_note += f" (−{hit} hit)"

    arm_summary = {
        "id": ARM_MAP[arm_dir.name],
        **ARM_META[ARM_MAP[arm_dir.name]],
        "description": transfer_note,
        "objectiveEP": projected if projected is not None else 0,
        "realisedPoints": realised,
        "varianceScore": 0,
        "transfersCount": len(transfers),
        "hits": hit // 4 if hit else 0,
        "captain": captain["webName"],
        "viceCaptain": vice["webName"],
        "chip": chip_type(plan.get("active_chip")),
        "formation": validated["formation"],
        "decisionDeltaVsBaseline": 0,
        "realisedRankEffect": f"{realised} pts net" if realised is not None else None,
        "solverRuntimeMs": 0,
    }

    extra = {
        "record": record,
        "plan_hash": plan.get("content_sha256"),
        "frozen_at": plan.get("frozen_at") or record.get("deadline"),
        "deadline": record.get("deadline") or plan.get("frozen_at"),
        "lessons": record.get("retrospective", {}).get("lessons") or [],
        "strategy": record.get("recommendation", {}).get("strategy"),
        "limitations": json.loads((gw_dir(gw) / "shared-context.json").read_text()).get("limitations", [])
        if (gw_dir(gw) / "shared-context.json").exists()
        else [],
    }
    return validated, arm_summary, extra


def transfer_phrase(plan: dict) -> str:
    actions = plan["transferActions"]
    if not actions:
        return "no transfers"
    pairs = "; ".join(f"{t['playerOut']['webName']} out, {t['playerIn']['webName']} in" for t in actions)
    n = len(actions)
    hit = plan["hitCost"]
    count = "one transfer" if n == 1 else f"{n} transfers"
    hit_bit = f" taking a {hit}-point hit" if hit else ""
    return f"{count}{hit_bit} ({pairs})"


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    players, teams, fixtures = load_identities()
    season_rows = []

    for gw in range(1, 39):
        folder = gw_dir(gw)
        forecast = load_forecast(gw)
        built = {}
        extras = {}
        for src, dest in ARM_MAP.items():
            validated, summary, extra = build_plan(folder / src, gw, players, teams, fixtures, forecast)
            built[dest] = (validated, summary)
            extras[dest] = extra

        baseline_pts = built["baseline"][1]["realisedPoints"] or 0
        for dest, (validated, summary) in built.items():
            summary["decisionDeltaVsBaseline"] = round(
                (summary["realisedPoints"] or 0) - baseline_pts, 1
            )

        selected = built["optimiser"][0]
        extra = extras["optimiser"]
        lessons = humanize_lessons(extra["lessons"] or extra["limitations"])
        cap = selected["captain"]["webName"]
        vc = selected["viceCaptain"]["webName"]
        pts = selected["realisedSquadTotalPoints"]
        proj = selected["projectedSquadTotalXP"]
        transfers = transfer_phrase(selected)

        exec_bits = [
            f"Reconstructive replay for 2025/26 Gameweek {gw}.",
            f"The optimiser captained {cap} (vice {vc}), formation {selected['formation']}, and made {transfers}.",
        ]
        if pts is not None:
            exec_bits.append(f"It scored {pts} net points after hits.")
        if proj:
            exec_bits.append(f"Pre-cutoff objective was {proj:.1f} expected points.")
        else:
            exec_bits.append("No locked expected-points objective was available for this week.")

        key_tradeoffs = []
        if selected["transferActions"]:
            key_tradeoffs.append(
                "Transfers: "
                + "; ".join(
                    f"{t['playerOut']['webName']} to {t['playerIn']['webName']}"
                    for t in selected["transferActions"]
                )
                + "."
            )
        else:
            key_tradeoffs.append("The optimiser held the squad this week.")
        other = built["agent"][1]
        if other["captain"] != cap:
            key_tradeoffs.append(
                f"The evidence-informed approach captained {other['captain']} instead of {cap}."
            )
        if other["realisedPoints"] is not None and pts is not None:
            delta = other["realisedPoints"] - pts
            key_tradeoffs.append(
                f"Evidence-informed finished {delta:+d} points versus the optimiser this week."
            )
        key_tradeoffs.extend(lessons[:3])

        decision = {
            "season": "2025-26",
            "gw": gw,
            "title": f"Gameweek {gw} reconstructive replay",
            "deadline": extra["deadline"],
            "status": "completed",
            "datasetKind": "historical-replay",
            "provenance": {
                "modelVersion": extra["strategy"] or "fpl-lab-replay",
                "frozenAt": extra["frozen_at"],
                "snapshotHash": f"sha256:{extra['plan_hash']}",
                "datasetId": f"fpl-lab-2025-26-gw{gw}-replay",
                "solverEngine": "FPL lab reconstructive replay",
                "executionTimestamp": extra["frozen_at"],
                "solverParameters": {
                    "horizonWeeks": 5,
                    "decayRate": 0.85,
                    "hitPenalty": 4.0,
                    "riskAversion": 0.15,
                    "freeTransferConservationWeight": 0.8,
                    "maxPlayersPerClub": 3,
                    "teamBudgetCap": 100.0,
                },
                "isDemoSample": False,
                "datasetKind": "historical-replay",
                "limitations": lessons,
            },
            "validatedPlan": selected,
            "arms": [built["baseline"][1], built["optimiser"][1], built["agent"][1]],
            "summaryAnalysis": {
                "executiveSummary": " ".join(exec_bits),
                "keyTradeoffs": key_tradeoffs,
                "shadowPrices": {
                    "budgetPerMillionXP": 0,
                    "transferMarginalValueXP": 0,
                    "benchPointsExpectancy": 0,
                },
                "divergenceNotes": (
                    "This is a reconstructive historical replay, not a live two-hour freeze. "
                    "Inputs were rebuilt after the season; see Methods and the limitations on this page."
                ),
            },
        }

        out_path = OUT / f"gw-{gw:02d}.json"
        out_path.write_text(json.dumps(decision, indent=2) + "\n")
        season_rows.append(
            {
                "gw": gw,
                "captain": cap,
                "formation": selected["formation"],
                "projected": proj,
                "points": pts,
                "templatePoints": built["baseline"][1]["realisedPoints"],
                "evidencePoints": built["agent"][1]["realisedPoints"],
                "transfers": selected["transferActions"] and len(selected["transferActions"]) or 0,
                "hits": selected["hitCost"],
                "chip": selected["chipUsed"],
                "hash": extra["plan_hash"],
            }
        )
        print(f"wrote {out_path.name} cap={cap} pts={pts} proj={proj}")

    opt_pts = sum(r["points"] or 0 for r in season_rows)
    tpl_pts = sum(r["templatePoints"] or 0 for r in season_rows)
    ev_pts = sum(r["evidencePoints"] or 0 for r in season_rows)
    index = {
        "id": "2025-26",
        "kind": "historical-replay",
        "title": "FPL 2025/26 reconstructive replay",
        "summary": (
            "A full 38-gameweek reconstructive replay from the FPL lab. Three approaches "
            "run on rebuilt pre-deadline inputs, then scored on official points. This is not "
            "a live two-hour freeze."
        ),
        "gameweeks": 38,
        "optimiserPoints": opt_pts,
        "templatePoints": tpl_pts,
        "evidencePoints": ev_pts,
        "chipsPlayed": [r for r in season_rows if r["chip"] != "none"],
        "rows": season_rows,
    }
    (OUT / "index.json").write_text(json.dumps(index, indent=2) + "\n")
    print("season", opt_pts, "vs template", tpl_pts, "vs evidence", ev_pts)


if __name__ == "__main__":
    main()
