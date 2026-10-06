import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/chips/tc',
        destination: '/chips/triple-captain',
        permanent: true,
      },
      {
        source: '/chips/bb',
        destination: '/chips/bench-boost',
        permanent: true,
      },
      {
        source: '/chips/fh',
        destination: '/chips/free-hit',
        permanent: true,
      },
      {
        source: '/chips/wc',
        destination: '/chips/wildcard',
        permanent: true,
      },
      {
        source: '/replays/2025-26/gw/:n/:arm',
        destination: '/seasons/2025-26/gw/:n',
        permanent: false,
      },
      {
        source: '/replays/2025-26/gw/:n/:arm/snapshot.json',
        destination: '/seasons/2025-26/gw/:n/snapshot.json',
        permanent: false,
      },
      {
        source: '/decisions/gw/:n',
        destination: '/seasons/2025-26/gw/:n',
        permanent: true,
      },
      {
        source: '/decisions/gw/:n/snapshot.json',
        destination: '/seasons/2025-26/gw/:n/snapshot.json',
        permanent: true,
      },
      {
        source: '/replays/2026-27/gw/:n/:arm',
        destination: '/seasons/2025-26/gw/:n',
        permanent: true,
      },
      {
        source: '/replays/2026-27/gw/:n/:arm/snapshot.json',
        destination: '/seasons/2025-26/gw/:n/snapshot.json',
        permanent: true,
      },
      {
        source: '/chips/tc/gw/:n',
        destination: '/chips/triple-captain',
        permanent: true,
      },
      {
        source: '/chips/bb/gw/:n',
        destination: '/chips/bench-boost',
        permanent: true,
      },
      {
        source: '/chips/fh/gw/:n',
        destination: '/chips/free-hit',
        permanent: true,
      },
      {
        source: '/chips/wc/gw/:n',
        destination: '/chips/wildcard',
        permanent: true,
      },
      {
        source: '/chips/tc/gw/:n/snapshot.json',
        destination: '/chips/triple-captain',
        permanent: true,
      },
      {
        source: '/chips/bb/gw/:n/snapshot.json',
        destination: '/chips/bench-boost',
        permanent: true,
      },
      {
        source: '/chips/fh/gw/:n/snapshot.json',
        destination: '/chips/free-hit',
        permanent: true,
      },
      {
        source: '/chips/wc/gw/:n/snapshot.json',
        destination: '/chips/wildcard',
        permanent: true,
      },
      {
        source: '/sims/2026-27/gw/:n/:scenario',
        destination: '/sims',
        permanent: true,
      },
      {
        source: '/sims/2026-27/gw/:n/:scenario/snapshot.json',
        destination: '/sims',
        permanent: true,
      },
      {
        source: '/seasons/2026-27',
        destination: '/seasons/2025-26',
        permanent: true,
      },
      {
        source: '/seasons/2026-27/snapshot.json',
        destination: '/seasons/2025-26/snapshot.json',
        permanent: true,
      },
      {
        source: '/seasons/2026-27/gw/:n',
        destination: '/seasons/2025-26/gw/:n',
        permanent: true,
      },
      {
        source: '/seasons/2026-27/gw/:n/snapshot.json',
        destination: '/seasons/2025-26/gw/:n/snapshot.json',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
