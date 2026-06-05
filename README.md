# 🚛 Fleet Tracker Dashboard

## 🌐 Live Demo
[https://fleet-management-gold-rho.vercel.app/](https://fleet-management-gold-rho.vercel.app/)

A vehicle fleet tracking dashboard built with Next.js, Leaflet, Zustand, and React Query.
Built as part of a Junior React / Next.js Developer Technical Assessment.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/ahmadamobeidat/fleet-management.git
cd fleet-dashboard
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> ⚠️ Make sure to use `localhost:3000` and not your network IP to avoid API fetch issues.

Build for production:

```bash
npm run build
npm start
```

---

## 🐳 Docker

### Run with Docker Compose (recommended)

```bash
docker-compose up --build
```

### Or run with Docker directly

```bash
docker build -t fleet-dashboard .
docker run -p 3000:3000 fleet-dashboard
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🧪 Running Tests

```bash
npm test
```

18 unit tests covering the Zustand store and Playback Controls.

---

## 🏗️ Architecture Overview
src/
├── app/
│   ├── api/vehicles/route.ts      # GET /api/vehicles - returns vehicle data from JSON
│   ├── globals.css                # Global styles + Tailwind + Leaflet fixes
│   ├── layout.tsx                 # Root layout
│   └── page.tsx                   # Main dashboard page - wires everything together
│
├── components/
│   ├── controls/
│   │   └── PlaybackControls.tsx   # Play / Pause / Reset buttons + progress bar
│   ├── dashboard/
│   │   ├── VehicleList.tsx        # Sidebar vehicle cards with stats and filters
│   │   └── StatsPanel.tsx         # Live statistics panel
│   ├── map/
│   │   └── FleetMap.tsx           # Leaflet map + playback engine + route polylines
│   └── vehicle/
│       └── VehicleMarker.tsx      # Custom marker with popup (ID, speed, status, time)
│
├── data/
│   └── vehicles.json              # Mock GPS data for 6 vehicles around Amman, Jordan
│
├── hooks/
│   └── useVehicles.ts             # React Query hook - fetches from /api/vehicles
│
├── store/
│   └── fleetStore.ts              # Zustand store - manages all app state
│
├── types/
│   └── vehicle.ts                 # TypeScript interfaces for Vehicle, GpsCoordinate, etc.
│
└── tests/
├── fleetStore.test.ts          # Unit tests for Zustand store
└── PlaybackControls.test.tsx   # Unit tests for playback controls

### How it works

- **Data flow**: `useVehicles` (React Query) fetches from `/api/vehicles` → data is stored in Zustand via `setVehicles` → components read from the store
- **Playback engine**: Lives inside `FleetMap.tsx` — uses `setInterval` (1 second) when `playbackState === "playing"` to call `tickPosition` for each vehicle, advancing it one GPS point forward
- **Map**: Loaded with `dynamic(() => import(...), { ssr: false })` because Leaflet requires the browser `window` object and does not support SSR

---

## ✅ Features Implemented

### Core Requirements
- Leaflet map centered on Amman, Jordan
- 6 vehicles displayed with custom animated markers
- Vehicle data served from local JSON via Next.js API route
- Click any marker → popup shows Vehicle ID, Name, Speed, Status, Last Update
- Play / Pause / Reset playback controls
- Vehicles move along GPS route, one point per second

### Additional Features (4 out of 8)
- **Vehicle search by name** — real-time search input in the sidebar
- **Vehicle status filter** — All / Moving / Stopped quick filter buttons
- **Route polyline visualization** — traveled route shown as solid line, remaining as dashed
- **Dark mode support** — toggles between OpenStreetMap (light) and CartoDB Dark Matter tiles
- **Live statistics panel** — shows total, moving, stopped, avg speed, fastest vehicle
- **Responsive mobile layout** — hamburger menu with slide-in drawer on mobile

### Bonus
- **Zustand** for client-side state management
- **React Query** for data fetching with caching and auto-refresh every 30 seconds
- **Auto-fit map** to selected vehicle route bounds
- **Unit tests** — 18 tests passing with Jest and React Testing Library
- **Dockerized** — runs with a single `docker-compose up --build` command
- **Deployed on Vercel** — live demo available above

---

## 💡 Assumptions Made

1. GPS coordinates are pre-recorded — routes are static mock data simulating historical tracks, not live GPS feeds
2. All vehicles play simultaneously when clicking Play, not just the selected one
3. Map is centered on Amman, Jordan (`31.9454, 35.9284`) as the default location
4. Each interval tick (1 second) advances every vehicle by exactly one GPS coordinate
5. Leaflet is loaded client-side only using Next.js `dynamic` import with `ssr: false` to avoid window reference errors during SSR

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Next.js (App Router) | Framework + API routes |
| TypeScript | Type safety |
| Leaflet + React-Leaflet | Interactive map |
| Zustand | Client state management |
| React Query (@tanstack) | Server state + data fetching |
| Tailwind CSS | Styling |
| Jest + Testing Library | Unit testing |
| Docker | Containerization |

---

## 📦 Deployment

This app is deployed on Vercel:

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Vercel will detect Next.js automatically and deploy it

---

*Built by Ahmad Obeidat*