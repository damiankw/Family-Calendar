// ─── worker.js — Background data fetcher ───
// Runs on a 5-minute loop. Each provider fetches from an external source
// and writes into SQLite. The web server reads from the same DB independently.

const db = require('./db');

const INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

// ═══════════════════════════════════════════════════════════════
//  PROVIDERS — each one fetches data and writes it to SQLite.
//  Replace the stub implementations with real API calls.
// ═══════════════════════════════════════════════════════════════

// ───────── Calendar provider ─────────
// TODO: Wire up to Google Calendar, Outlook, iCal URL, etc.
async function fetchCalendarEvents() {
  console.log('[worker] Fetching calendar events …');

  // ── STUB: hardcoded family events ──
  // When you wire this up, delete everything below and replace with
  // real API calls that return the same shape: { date, time, title, color, source, source_id }
  const stubEvents = [
    { date: '2026-02-02', time: '09:00', title: 'Swimming — kids',     color: '#8be9fd', source: 'stub', source_id: 'stub-1'  },
    { date: '2026-02-05', time: '15:30', title: 'Parent-teacher',      color: '#ff5555', source: 'stub', source_id: 'stub-2'  },
    { date: '2026-02-05', time: '16:30', title: 'Piano — Emma',        color: '#bd93f9', source: 'stub', source_id: 'stub-3'  },
    { date: '2026-02-10', time: '10:00', title: 'Dentist — Mum',       color: '#50fa7b', source: 'stub', source_id: 'stub-4'  },
    { date: '2026-02-14', time: '18:00', title: "Valentine's dinner",   color: '#ff79c6', source: 'stub', source_id: 'stub-5'  },
    { date: '2026-02-14', time: '17:00', title: 'School disco',        color: '#ffb86c', source: 'stub', source_id: 'stub-6'  },
    { date: '2026-02-17', time: '11:00', title: 'Vet — Biscuit',       color: '#f1fa8c', source: 'stub', source_id: 'stub-7'  },
    { date: '2026-02-20', time: '14:00', title: 'Soccer finals',       color: '#50fa7b', source: 'stub', source_id: 'stub-8'  },
    { date: '2026-02-20', time: '09:00', title: 'Haircuts',            color: '#8be9fd', source: 'stub', source_id: 'stub-9'  },
    { date: '2026-02-24', time: '10:00', title: 'Groceries',           color: '#ffb86c', source: 'stub', source_id: 'stub-10' },
    { date: '2026-02-26', time: '08:30', title: 'School drop-off',     color: '#ff5555', source: 'stub', source_id: 'stub-11' },
    { date: '2026-02-26', time: '10:00', title: 'Dentist — Mum',       color: '#50fa7b', source: 'stub', source_id: 'stub-12' },
    { date: '2026-02-26', time: '18:00', title: 'Soccer — Liam',       color: '#8be9fd', source: 'stub', source_id: 'stub-13' },
    { date: '2026-02-27', time: '09:00', title: 'Grocery shop',        color: '#ffb86c', source: 'stub', source_id: 'stub-14' },
    { date: '2026-02-27', time: '14:00', title: 'Play date — Emma',    color: '#bd93f9', source: 'stub', source_id: 'stub-15' },
    { date: '2026-02-28', time: '12:00', title: 'Family BBQ',          color: '#ff79c6', source: 'stub', source_id: 'stub-16' },
    { date: '2026-03-02', time: '09:00', title: 'Swimming — kids',     color: '#8be9fd', source: 'stub', source_id: 'stub-17' },
    { date: '2026-03-05', time: '19:30', title: 'Book club — Dad',     color: '#f1fa8c', source: 'stub', source_id: 'stub-18' },
    { date: '2026-03-07', time: '14:00', title: 'Birthday — Nana',     color: '#ff79c6', source: 'stub', source_id: 'stub-19' },
    { date: '2026-03-07', time: '10:00', title: 'Cake pickup',         color: '#ffb86c', source: 'stub', source_id: 'stub-20' },
    { date: '2026-03-12', time: '09:00', title: 'School photos',       color: '#bd93f9', source: 'stub', source_id: 'stub-21' },
    { date: '2026-03-14', time: '14:00', title: 'Soccer semis',        color: '#50fa7b', source: 'stub', source_id: 'stub-22' },
  ];

  for (const ev of stubEvents) {
    db.upsertEvent(ev);
  }

  console.log(`[worker]   → ${stubEvents.length} events written`);
}

// ───────── Weather provider ─────────
// TODO: Wire up to OpenWeatherMap, Bureau of Meteorology, etc.
async function fetchWeather() {
  console.log('[worker] Fetching weather …');

  // ── STUB: hardcoded current conditions ──
  db.upsertCurrentWeather({
    temp: 23,
    icon: '⛅',
    description: 'Partly cloudy',
    wind_speed: 3,
    wind_dir: 'SE',
    humidity: 62,
    sunrise: '6:12 AM',
    sunset: '7:48 PM',
  });

  // ── STUB: hardcoded multi-day forecast ──
  const forecasts = [
    { date: '2026-02-26', day_label: 'TODAY', icon: '⛅',  hi: 24, lo: 15 },
    { date: '2026-02-27', day_label: 'FRI',   icon: '🌧️', hi: 27, lo: 17 },
    { date: '2026-02-28', day_label: 'SAT',   icon: '⛈️', hi: 28, lo: 19 },
    { date: '2026-03-01', day_label: 'SUN',   icon: '🌥️', hi: 22, lo: 20 },
  ];

  for (const f of forecasts) {
    db.upsertForecastDay(f);
  }

  console.log('[worker]   → weather + forecast written');
}

// ───────── Add future providers here ─────────
// async function fetchBinNights()  { … }
// async function fetchSchoolAlerts() { … }
// async function fetchBirthdays()  { … }

// ═══════════════════════════════════════════════════════════════
//  RUNNER
// ═══════════════════════════════════════════════════════════════

async function runAll() {
  const start = Date.now();
  console.log(`\n[worker] ── Cycle starting at ${new Date().toLocaleTimeString()} ──`);

  try { await fetchCalendarEvents(); } catch (e) { console.error('[worker] Calendar error:', e.message); }
  try { await fetchWeather();         } catch (e) { console.error('[worker] Weather error:', e.message); }
  // try { await fetchBinNights();    } catch (e) { … }

  console.log(`[worker] ── Cycle complete in ${Date.now() - start}ms ──`);
}

// Run immediately on startup, then every 5 minutes
runAll();
const timer = setInterval(runAll, INTERVAL_MS);

// Graceful shutdown
function shutdown() {
  console.log('\n[worker] Shutting down …');
  clearInterval(timer);
  db.close();
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

console.log(`[worker] Started — polling every ${INTERVAL_MS / 1000}s`);
