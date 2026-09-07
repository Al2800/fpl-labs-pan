export function snapshotResponse(data: unknown, hash?: string): Response {
  const body = JSON.stringify(data, null, 2);
  const headers = new Headers({
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'public, max-age=0, s-maxage=3600',
  });
  if (hash) {
    headers.set('ETag', `"${hash}"`);
    headers.set('X-Snapshot-Hash', hash);
  }
  return new Response(body, { status: 200, headers });
}

export function snapshotNotFound(): Response {
  return new Response(JSON.stringify({ error: 'Snapshot not found' }), {
    status: 404,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
