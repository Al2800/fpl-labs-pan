#!/usr/bin/env node
/**
 * Submit URLs to IndexNow (Bing, Yandex, Naver, Seznam).
 *
 * Usage:
 *   node scripts/submit_indexnow.mjs [url1 url2 ...]
 *   npm run indexnow
 *
 * If no URLs are provided, submits the core priority pages (chip hubs & guides).
 */

const INDEXNOW_KEY = '4de897cbe51c0a37829aee6ad40e199b';
const HOST = 'www.fplreplay.com';
const KEY_LOCATION = `https://${HOST}/${INDEXNOW_KEY}.txt`;

const DEFAULT_URLS = [
  `https://${HOST}/chips/wildcard`,
  `https://${HOST}/chips/bench-boost`,
  `https://${HOST}/chips/free-hit`,
  `https://${HOST}/chips/triple-captain`,
  `https://${HOST}/chips`,
  `https://${HOST}/guides/when-to-play-fpl-chips`,
  `https://${HOST}/guides`,
  `https://${HOST}/seasons/2025-26`,
  `https://${HOST}/seasons/2025-26/gw/34`,
  `https://${HOST}/`,
];

async function submitIndexNow(urls = DEFAULT_URLS) {
  const payload = {
    host: HOST,
    key: INDEXNOW_KEY,
    keyLocation: KEY_LOCATION,
    urlList: urls,
  };

  console.log(`Submitting ${urls.length} URLs to IndexNow with key ${INDEXNOW_KEY}...`);
  console.log(`Key location: ${KEY_LOCATION}`);

  try {
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    console.log(`IndexNow response status: ${res.status} ${res.statusText}`);
    if (res.status === 200 || res.status === 202) {
      console.log('Successfully submitted URLs to IndexNow.');
    } else {
      const text = await res.text();
      console.warn(`IndexNow response body:`, text);
    }
  } catch (err) {
    console.error('Error submitting to IndexNow:', err);
    process.exit(1);
  }
}

const args = process.argv.slice(2);
const urlsToSubmit = args.length > 0 ? args : DEFAULT_URLS;
submitIndexNow(urlsToSubmit);
