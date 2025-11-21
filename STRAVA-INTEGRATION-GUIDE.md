# Strava Integration Guide

This guide explains how to integrate Strava API to automatically fetch and display your running data on your website.

## Overview

The integration uses:
1. **GitHub Actions** - Automatically fetches data from Strava every 6 hours
2. **JSON Data File** - Stores aggregated run data in `data/strava-runs.json`
3. **JavaScript Display** - Reads and displays the data on your website

## Step 1: Create Strava API Application

1. Go to https://www.strava.com/settings/api
2. Click **"Create App"**
3. Fill in:
   - **Application Name**: Your website name
   - **Category**: Website
   - **Website**: `https://yourusername.github.io`
   - **Authorization Callback Domain**: `localhost` (for testing)
4. Click **"Create"**
5. Note your **Client ID** and **Client Secret**

## Step 2: Get Refresh Token

### Option A: Using Postman/curl (Recommended)

1. Visit this URL in your browser (replace `YOUR_CLIENT_ID`):
```
https://www.strava.com/oauth/authorize?client_id=YOUR_CLIENT_ID&response_type=code&redirect_uri=http://localhost&scope=activity:read_all
```

2. Authorize the application
3. You'll be redirected to `http://localhost/?code=CODE_HERE`
4. Copy the `code` from the URL

5. Exchange the code for tokens using curl:
```bash
curl -X POST https://www.strava.com/oauth/token \
  -d client_id=YOUR_CLIENT_ID \
  -d client_secret=YOUR_CLIENT_SECRET \
  -d code=CODE_FROM_STEP_3 \
  -d grant_type=authorization_code
```

6. Save the `refresh_token` from the response

### Option B: Using Python Script

Create `get-token.py`:
```python
import requests

CLIENT_ID = 'YOUR_CLIENT_ID'
CLIENT_SECRET = 'YOUR_CLIENT_SECRET'
CODE = 'CODE_FROM_AUTHORIZATION_URL'

response = requests.post(
    'https://www.strava.com/oauth/token',
    data={
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
        'code': CODE,
        'grant_type': 'authorization_code'
    }
)

print(response.json())
```

Run: `python get-token.py`

## Step 3: Add GitHub Secrets

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **"New repository secret"**
4. Add these three secrets:
   - `STRAVA_CLIENT_ID` - Your Client ID
   - `STRAVA_CLIENT_SECRET` - Your Client Secret
   - `STRAVA_REFRESH_TOKEN` - Your Refresh Token

## Step 4: Create Data Directory

Create the `data` directory in your repository root:
```bash
mkdir data
```

Add a `.gitkeep` file to ensure the directory is tracked:
```bash
touch data/.gitkeep
```

## Step 5: Test the Script Locally

1. Install Node.js (if not already installed)
2. Set environment variables:
```bash
export STRAVA_CLIENT_ID="your_client_id"
export STRAVA_CLIENT_SECRET="your_client_secret"
export STRAVA_REFRESH_TOKEN="your_refresh_token"
```

3. Run the script:
```bash
node scripts/fetch-strava.js
```

4. Check that `data/strava-runs.json` was created

## Step 6: Add Strava Display to Your Website

### On Homepage (index.html)

Add this section before the closing `</main>` tag:

```html
<section class="strava-stats-section">
    <div class="container">
        <h2 class="section-title" data-en="My Running Stats" data-zh="我的跑步统计">My Running Stats</h2>
        
        <div class="stats-period-tabs">
            <button class="period-tab active" data-period="allTime" data-en="All Time" data-zh="全部">All Time</button>
            <button class="period-tab" data-period="thisYear" data-en="This Year" data-zh="今年">This Year</button>
            <button class="period-tab" data-period="thisMonth" data-en="This Month" data-zh="本月">This Month</button>
            <button class="period-tab" data-period="thisWeek" data-en="This Week" data-zh="本周">This Week</button>
        </div>
        
        <div id="strava-stats-alltime" class="stats-grid"></div>
        <div id="strava-stats-year" class="stats-grid" style="display:none;"></div>
        <div id="strava-stats-month" class="stats-grid" style="display:none;"></div>
        <div id="strava-stats-week" class="stats-grid" style="display:none;"></div>
        
        <h3 class="section-subtitle" data-en="Recent Runs" data-zh="最近跑步">Recent Runs</h3>
        <div id="strava-recent-runs" class="recent-runs-list"></div>
    </div>
</section>
```

Add the script before closing `</body>`:
```html
<script src="js/strava.js"></script>
```

### Add CSS Styles

Add to `css/main.css`:

```css
.strava-stats-section {
    padding: 80px 0;
    background: var(--bg-light);
}

.stats-period-tabs {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-bottom: 40px;
    flex-wrap: wrap;
}

.period-tab {
    padding: 10px 20px;
    border: 2px solid var(--primary-color);
    background: transparent;
    color: var(--primary-color);
    border-radius: 25px;
    cursor: pointer;
    transition: all 0.3s;
    font-family: inherit;
    font-size: 14px;
}

.period-tab:hover {
    background: var(--primary-color);
    color: white;
}

.period-tab.active {
    background: var(--primary-color);
    color: white;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    margin-bottom: 40px;
}

.stat-card {
    background: white;
    padding: 30px;
    border-radius: 10px;
    text-align: center;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.stat-value {
    font-size: 2.5em;
    font-weight: 700;
    color: var(--primary-color);
    margin-bottom: 10px;
}

.stat-label {
    font-size: 0.9em;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 1px;
}

.recent-runs-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.run-item {
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}

.run-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
}

.run-header h4 {
    margin: 0;
    color: var(--primary-color);
}

.run-date {
    color: var(--text-secondary);
    font-size: 0.9em;
}

.run-stats {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
}

.run-stat {
    display: flex;
    flex-direction: column;
}

.run-stat strong {
    font-size: 1.2em;
    color: var(--primary-dark);
}

.run-stat small {
    font-size: 0.8em;
    color: var(--text-secondary);
    text-transform: uppercase;
}
```

## Step 7: Manual Workflow Trigger

You can manually trigger the GitHub Action:
1. Go to **Actions** tab in your repository
2. Select **"Fetch Strava Data"** workflow
3. Click **"Run workflow"**

## Data Structure

The `strava-runs.json` file contains:

```json
{
  "lastUpdated": "2024-01-15T10:30:00.000Z",
  "totals": {
    "allTime": { "count": 500, "distance": 5000, "time": 1800000, "elevation": 50000 },
    "thisYear": { "count": 100, "distance": 1000, "time": 360000, "elevation": 10000 },
    "thisMonth": { "count": 20, "distance": 200, "time": 72000, "elevation": 2000 },
    "thisWeek": { "count": 5, "distance": 50, "time": 18000, "elevation": 500 }
  },
  "recentRuns": [
    {
      "id": 123456789,
      "name": "Morning Run",
      "date": "2024-01-15T06:00:00Z",
      "distance": 10.5,
      "time": 3600,
      "pace": 343,
      "elevation": 120,
      "averageHeartRate": 150,
      "maxHeartRate": 170,
      "calories": 600,
      "kudos": 5
    }
  ]
}
```

## Troubleshooting

### GitHub Action Fails

1. Check that all secrets are set correctly
2. Verify the refresh token is still valid (tokens don't expire, but can be revoked)
3. Check the Actions logs for specific error messages

### Data Not Updating

1. The workflow runs every 6 hours automatically
2. You can manually trigger it from the Actions tab
3. Check that `data/strava-runs.json` exists and is committed

### Display Not Showing

1. Check browser console for errors
2. Verify `data/strava-runs.json` is accessible (visit `https://yourusername.github.io/data/strava-runs.json`)
3. Ensure `js/strava.js` is loaded after the DOM is ready

## Rate Limits

Strava API has rate limits:
- **600 requests per 15 minutes**
- **30,000 requests per day**

The script fetches all activities in batches, so it should stay well within limits.

## Security Notes

- Never commit your Client ID, Client Secret, or Refresh Token to the repository
- Always use GitHub Secrets for sensitive data
- The refresh token provides access to your Strava account - keep it secure

## Next Steps

- Customize the display styling to match your site
- Add charts/graphs using a library like Chart.js
- Filter runs by date range or distance
- Add route maps using the polyline data

