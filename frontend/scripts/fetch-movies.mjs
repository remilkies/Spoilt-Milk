
//   node --env-file=.env scripts/fetch-movies.mjs

import { mkdir, readFile, writeFile } from 'node:fs/promises';

const TOKEN = process.env.TMDB_TOKEN; 
if (!TOKEN) {
  console.error('No TMDB_TOKEN found. Did you create .env and run with --env-file=.env?');
  process.exit(1);
}

const API = 'https://api.themoviedb.org/3';
const IMG = 'https://image.tmdb.org/t/p/w500';

// IMDb ids. Keep in sync with horrorWatchlist in main.js (i know this makes my life harder but you have no idea how much more i prefer it this way)
const IDS = ['tt28821371', 'tt34508974', 'tt2870612', 'tt0124102', 'tt1703199'];

async function tmdb(path) {
  const response = await fetch(`${API}${path}`, {
    headers: { accept: 'application/json', Authorization: `Bearer ${TOKEN}` }
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

// start from the existing file so one failed lookup doesn't wipe a good entry
let movies = {};
try {
  movies = JSON.parse(await readFile('data/movies.json', 'utf8'));
} catch { /* first run, nothing there yet */ }

for (const imdbId of IDS) {
  try {
    // 1) IMDb id -> TMDB id (cause imdb is not in TMDB's main movie endpoint and i'm too lazy to do a second lookup ;P)
    const found = await tmdb(`/find/${imdbId}?external_source=imdb_id`);
    const hit = found.movie_results?.[0];
    if (!hit) throw new Error('no movie found for that IMDb id');

    // 2) TMDB id -> full details (genre names live here, not in /find)
    const data = await tmdb(`/movie/${hit.id}`);

    movies[imdbId] = {
      title: data.title || 'Untitled Movie',
      genre: data.genres?.length ? data.genres.map(g => g.name).join(', ') : 'Horror',
      image: data.poster_path ? `${IMG}${data.poster_path}` : '/assets/posters/placeholder.jpg',
      desc: data.overview || 'No description provided yet by the yappers.'
    };
    console.log(`got ${movies[imdbId].title}`);
  } catch (err) {
    console.error(`${imdbId}: ${err.message}, skipping`);
  }
}

if (Object.keys(movies).length === 0) {
  console.error('Nothing fetched, leaving data/movies.json alone.');
  process.exit(1);
}

await mkdir('data', { recursive: true });
await writeFile('data/movies.json', JSON.stringify(movies, null, 2));
console.log('wrote data/movies.json');
