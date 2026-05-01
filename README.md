# NBA Shot Chart

An interactive basketball shot visualization tool built with React, D3.js, and Flask. Explore and compare shot data for five NBA stars from the 2024-25 season across multiple chart types with real-time filtering.

## Features

- **Three chart modes** — Dots (individual shots), Hex (FG% by zone), and Heat Map (shot frequency)
- **Interactive filters** — Filter by shot type and quarter
- **Zone breakdown** — Attempts, makes, and FG% by court zone
- **Player stats** — Toggle between 2024-25 season and career averages
- **Five players** — Stephen Curry, LeBron James, Kevin Durant, Luka Doncic, Giannis Antetokounmpo

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, D3.js |
| Backend | Flask, SQLite |
| Data | nba_api, pandas |

## Prerequisites

- Python 3.9+
- Node.js 18+
- npm

## Local Setup

### 1. Clone the repository

```bash
git clone <repo-url>
cd nba-shotchart
```

### 2. Set up the backend

```bash
cd backend

# Create and activate a virtual environment
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Fetch data and initialize the database

Run these scripts in order. The fetch scripts pull data from the NBA Stats API (may take a few minutes due to rate limiting).

```bash
python fetch_shots.py
python fetch_bio.py
python fetch_stats.py
python setup_db.py
```

### 4. Start the Flask server

```bash
python app.py
```

The API will be available at `http://127.0.0.1:5001`.

### 5. Set up and start the frontend

Open a new terminal tab:

```bash
cd nba-shotchart/frontend

npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

## API Endpoints

| Endpoint | Description |
|---|---|
| `GET /api/shots?player_id=<id>` | All shot data for a player |
| `GET /api/shots/summary?player_id=<id>` | Zone-by-zone shot breakdown |
| `GET /api/player/stats?player_id=<id>` | Season and career stats |
| `GET /api/player/bio?player_id=<id>` | Player bio information |

## Player IDs

| Player | ID |
|---|---|
| Stephen Curry | 201939 |
| LeBron James | 2544 |
| Kevin Durant | 201142 |
| Luka Doncic | 1629029 |
| Giannis Antetokounmpo | 203507 |
