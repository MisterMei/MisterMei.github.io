# Strava Integration - Quick Start

## What Was Created

1. **`.github/workflows/fetch-strava-data.yml`** - GitHub Actions workflow that fetches data every 6 hours
2. **`scripts/fetch-strava.js`** - Node.js script that fetches and aggregates Strava runs
3. **`js/strava.js`** - Frontend JavaScript to display the data
4. **`data/.gitkeep`** - Ensures data directory is tracked
5. **CSS styles** - Added to `css/main.css` for displaying stats

## Quick Setup (5 Steps)

### 1. Create Strava App
- Go to https://www.strava.com/settings/api
- Create app, note Client ID and Client Secret

### 2. Get Refresh Token
Visit in browser (replace YOUR_CLIENT_ID):
```
https://www.strava.com/oauth/authorize?client_id=YOUR_CLIENT_ID&response_type=code&redirect_uri=http://localhost&scope=activity:read_all
```

After authorization, copy the `code` from URL, then run:
```bash
curl -X POST https://www.strava.com/oauth/token \
  -d client_id=YOUR_CLIENT_ID \
  -d client_secret=YOUR_CLIENT_SECRET \
  -d code=CODE_FROM_URL \
  -d grant_type=authorization_code
```

Save the `refresh_token` from response.

### 3. Add GitHub Secrets
Repository → Settings → Secrets → Actions → New secret:
- `STRAVA_CLIENT_ID`
- `STRAVA_CLIENT_SECRET`  
- `STRAVA_REFRESH_TOKEN`

### 4. Test Locally (Optional)
```bash
export STRAVA_CLIENT_ID="your_id"
export STRAVA_CLIENT_SECRET="your_secret"
export STRAVA_REFRESH_TOKEN="your_token"
node scripts/fetch-strava.js
```

### 5. Add to Website
Add the HTML from `STRAVA-HTML-EXAMPLE.html` to your `index.html` before `</main>`, and add `<script src="js/strava.js"></script>` before `</body>`.

## How It Works

1. GitHub Actions runs every 6 hours
2. Fetches all your Strava activities
3. Filters only runs
4. Aggregates stats (all time, this year, this month, this week)
5. Saves to `data/strava-runs.json`
6. Your website reads and displays the JSON file

## Manual Trigger

Go to Actions tab → "Fetch Strava Data" → "Run workflow"

## Data File Location

`data/strava-runs.json` - Contains aggregated run statistics and recent runs

## Full Documentation

See `STRAVA-INTEGRATION-GUIDE.md` for detailed instructions.

