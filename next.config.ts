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
    ];
  },
};

export default nextConfig;
