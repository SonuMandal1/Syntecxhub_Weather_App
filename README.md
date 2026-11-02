# Hearth — premium weather app

Live conditions, hourly and 7-day forecasts, sunrise/sunset arc, air quality, severe-weather alerts and an interactive weather map, in a warm cream-and-emerald editorial design.

React 18 · TypeScript · Vite · Tailwind CSS 3 · TanStack Query · Framer Motion · Zustand · React-Leaflet

## Setup

```bash
npm install
cp .env.example .env      # then add your key
npm run dev               # http://localhost:5173
```

Other scripts: `npm run build`, `npm run preview`, `npm run typecheck`, `npm test`.

### API key

1. Create a free account at <https://home.openweathermap.org/api_keys> and copy your key into `.env` as `VITE_OWM_API_KEY`.
2. For the 48h hourly / 7-day forecast, UV and alerts, subscribe to **One Call API 3.0** ("One Call by Call", 1,000 calls/day free; it asks for a card but won't charge under the limit).
3. Without that subscription the app **falls back automatically** to the free 2.5 endpoints (3-hourly forecast, 5 days, no UV or alerts). The UI says so.
4. With **no key** the app shows a setup screen. There is no sample or demo data anywhere; every number comes from the live API.

The key is read from `.env` at build time and `.env` is git-ignored. Note that any key used by a browser-only app is visible in network requests. For a public deployment, proxy the API through a small server or restrict the key.

## Features

- Geolocation on load, plus a debounced, keyboard-navigable city search (ARIA combobox)
- Hero card with oversized temperature and a grid of metric sub-cards (feels like, humidity, wind, pressure, visibility, UV, AQI, cloud cover, rain chance)
- Hourly strip (horizontal scroll), 7-day card grid, sunrise/sunset arc
- Map tab: precipitation, clouds, temperature and wind layers over a warm-filtered base map, with opacity control
- °C/°F and km/h/mph pill switches (data is cached in metric and converted at render, so toggling is instant)
- Saved locations (persisted), swipeable on mobile and a grid from tablet up
- Auto-refresh every 10 minutes, refetch on focus, manual refresh button and touch pull-to-refresh
- Amber/orange alert banner (never red), light and dark themes

## Structure

```
src/
  components/  UI building blocks and views
  hooks/       useWeather, useCitySearch, useGeolocation, useDebounce, usePullToRefresh
  services/    api.ts (fetch + retry/backoff + typed errors), weatherService.ts, cities.ts (welcome-screen shortcuts, coordinates only)
  store/       Zustand store (units, theme, saved, active location), persisted
  types/       Normalised app types and raw OpenWeatherMap response types
  utils/       Units, time-zone-aware formatting, condition mapping
```

The service layer retries only network failures, 429 and 5xx with exponential backoff; 4xx errors surface immediately with a readable message.

## Design tokens

| Role | Value |
| --- | --- |
| Background / surface | `#FAF6EC` / `#FFFDF8` |
| Card border | `#D4AF6A` at 40% |
| Primary / secondary accent | `#10B981` / `#2DD4BF` |
| Temperature number | `#0E7C5A` |
| Alert accent | `#E8743B` |
| Heading / body text | `#1F2A24` / `#5C6B63` |
| Dark surface | `#16211C` |

Type: Fraunces (serif, titles and numbers) and Manrope (UI).

### Contrast notes

- `#10B981` on cream is only about 2.3:1, so it is used for fills and icons, never for small text. Text on emerald fills is `#04281D` (about 7:1).
- Emerald **text** uses `#0E7C5A` (about 5:1 on cream) or the darker `#0B6347` for small labels.
- Body `#5C6B63` on `#FAF6EC` is about 5:1. Badge colours pair pastel fills with dark tones of the same hue.
- Dark mode lifts the temperature and accent text to `#34D399` / `#5EEAB4` for the same reason.

## Screenshots

Add captures at 375, 768, 1024 and 1440 px here.

## Known limits

- UV and alerts need One Call 3.0; the free fallback shows 5 days.
- Base map tiles come from OpenStreetMap's public server, which is fine for light use. Use a tile provider for production traffic.
- Automated tests cover unit and time utilities only.
