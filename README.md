# Family Calendar

Family Calendar is a family dashboard for wall-mounted displays. It combines a calendar wallboard, weather, birthdays, and reminders with a clean admin interface.

## ✨ Features

- Calendar wallboard with upcoming events
- Admin panel for calendar sources, birthdays, reminders, and settings
- Weather (current + forecast) via Open-Meteo (no API key required)
- Setup wizard for first-time installs
- Backup & restore
- Docker-ready with persistent SQLite storage

## 🚀 Quick Start (Local)

**Prerequisites:** Node.js 22+ (or current LTS)

1. Install dependencies:
   - `npm ci`
2. Start the app:
   - `npm start`
3. Open: `http://localhost:3000`

If no users exist, you’ll be redirected to the setup wizard at `/setup`.

## ✅ First-Time Setup

The setup wizard walks you through:

1. Creating the admin account
2. Setting the weather location (required for weather fetches)

After setup, you’ll land in `/admin` where you can add calendars and configure the dashboard.

> Weather is **not fetched** until you set a location. Melbourne appears only as a **placeholder** in the UI and is not used as a default.

## ⚙️ Configuration

Environment variables:

| Variable | Default | Description |
|---------|---------|-------------|
| `PORT` | `3000` | Server port |
| `DB_PATH` | `data/family-calendar.db` | SQLite database path |

Data is stored in a SQLite database in the `data/` directory by default.

## 🧩 Calendar Sources

Calendars are managed via the Admin UI:

- ICS URL sources are supported
- Additional providers can be added in the future

## ☁️ Weather

Weather uses Open-Meteo. Once you set your location in Admin, the background worker fetches weather periodically.

## 💾 Backup & Restore

The Admin UI supports exporting and importing data as JSON.

Backup file names use the `family-calendar-backup-*.json` format.

## 🐳 Docker

Build and run using Docker Compose:

- `docker compose up --build`

The container stores data in a mounted `./data` folder:

```yaml
volumes:
  - ./data:/data
```

The database location inside the container is:

```
DB_PATH=/data/family-calendar.db
```

## 🛠️ Development Notes

- `npm start` runs the server with the embedded worker
- `npm run worker` runs the worker standalone
- `npm run dev` runs worker + server (legacy)

## 📄 License

ISC
