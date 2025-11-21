const https = require('https');
const fs = require('fs');
const path = require('path');

const CLIENT_ID = process.env.STRAVA_CLIENT_ID;
const CLIENT_SECRET = process.env.STRAVA_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.STRAVA_REFRESH_TOKEN;

if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
  console.error('Missing Strava credentials');
  process.exit(1);
}

async function refreshAccessToken() {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      refresh_token: REFRESH_TOKEN,
      grant_type: 'refresh_token'
    });

    const options = {
      hostname: 'www.strava.com',
      path: '/oauth/token',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          const tokenData = JSON.parse(body);
          resolve(tokenData.access_token);
        } else {
          reject(new Error(`Token refresh failed: ${res.statusCode} - ${body}`));
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function fetchActivities(accessToken, page = 1, allActivities = []) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'www.strava.com',
      path: `/api/v3/athlete/activities?page=${page}&per_page=200`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          const activities = JSON.parse(body);
          if (activities.length === 0) {
            resolve(allActivities);
          } else {
            allActivities.push(...activities);
            fetchActivities(accessToken, page + 1, allActivities)
              .then(resolve)
              .catch(reject);
          }
        } else {
          reject(new Error(`Failed to fetch activities: ${res.statusCode} - ${body}`));
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

function filterRuns(activities) {
  return activities.filter(activity => 
    activity.type === 'Run' && 
    activity.distance > 0
  );
}

function aggregateRuns(runs) {
  const now = new Date();
  const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
  const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const total = {
    count: runs.length,
    distance: 0,
    time: 0,
    elevation: 0
  };

  const thisYear = { count: 0, distance: 0, time: 0, elevation: 0 };
  const thisMonth = { count: 0, distance: 0, time: 0, elevation: 0 };
  const thisWeek = { count: 0, distance: 0, time: 0, elevation: 0 };

  runs.forEach(run => {
    const runDate = new Date(run.start_date);
    const distance = run.distance / 1000;
    const time = run.moving_time;
    const elevation = run.total_elevation_gain || 0;

    total.distance += distance;
    total.time += time;
    total.elevation += elevation;

    if (runDate >= oneYearAgo) {
      thisYear.count++;
      thisYear.distance += distance;
      thisYear.time += time;
      thisYear.elevation += elevation;
    }

    if (runDate >= oneMonthAgo) {
      thisMonth.count++;
      thisMonth.distance += distance;
      thisMonth.time += time;
      thisMonth.elevation += elevation;
    }

    if (runDate >= oneWeekAgo) {
      thisWeek.count++;
      thisWeek.distance += distance;
      thisWeek.time += time;
      thisWeek.elevation += elevation;
    }
  });

  const recentRuns = runs
    .slice(0, 20)
    .map(run => {
      const distanceKm = run.distance / 1000;
      const movingTime = run.moving_time;
      const elapsedTime = run.elapsed_time || movingTime;
      const elevationGain = Math.round(run.total_elevation_gain || 0);
      
      const runData = {
        id: run.id,
        name: run.name,
        date: run.start_date,
        distance: Math.round(distanceKm * 100) / 100,
        time: movingTime,
        pace: movingTime / distanceKm,
        elevation: elevationGain,
        averageHeartRate: run.average_heartrate || null,
        maxHeartRate: run.max_heartrate || null,
        calories: run.calories || null,
        kudos: run.kudos_count || 0,
        map: {
          id: run.map?.id,
          summary_polyline: run.map?.summary_polyline
        }
      };

      if (run.start_date_local) runData.dateLocal = run.start_date_local;
      if (run.timezone) runData.timezone = run.timezone;
      if (elapsedTime !== movingTime) runData.elapsedTime = elapsedTime;
      
      if (run.average_speed) {
        runData.averageSpeed = Math.round((run.average_speed * 3.6) * 100) / 100;
      }
      if (run.max_speed) {
        runData.maxSpeed = Math.round((run.max_speed * 3.6) * 100) / 100;
      }

      if (run.total_elevation_loss || run.elev_high || run.elev_low) {
        runData.elevationDetail = {
          gain: elevationGain,
          loss: Math.round(run.total_elevation_loss || 0),
          high: run.elev_high ? Math.round(run.elev_high) : null,
          low: run.elev_low ? Math.round(run.elev_low) : null
        };
      }

      if (run.average_cadence || run.suffer_score) {
        runData.performance = {};
        if (run.average_cadence) runData.performance.averageCadence = run.average_cadence;
        if (run.suffer_score) runData.performance.sufferScore = run.suffer_score;
      }

      if (run.start_latitude && run.start_longitude) {
        runData.location = {
          start: {
            lat: run.start_latitude,
            lng: run.start_longitude
          }
        };
        if (run.end_latitude && run.end_longitude) {
          runData.location.end = {
            lat: run.end_latitude,
            lng: run.end_longitude
          };
        }
        const city = run.location_city || run.city;
        const state = run.location_state || run.state;
        const country = run.location_country || run.country;
        if (city || state || country) {
          runData.location.city = city;
          runData.location.state = state;
          runData.location.country = country;
        }
      }

      if (run.workout_type !== null || run.description || run.commute || run.trainer) {
        runData.workout = {
          workoutType: run.workout_type,
          description: run.description || null,
          commute: run.commute || false,
          trainer: run.trainer || false
        };
      }

      if (run.comment_count || run.achievement_count || run.pr_count) {
        runData.social = {
          comments: run.comment_count || 0,
          achievements: run.achievement_count || 0,
          prCount: run.pr_count || 0
        };
      }

      if (run.gear_id) {
        runData.gear = {
          id: run.gear_id
        };
        if (run.gear?.name) {
          runData.gear.name = run.gear.name;
        }
      }

      return runData;
    });

  return {
    lastUpdated: new Date().toISOString(),
    totals: {
      allTime: total,
      thisYear,
      thisMonth,
      thisWeek
    },
    recentRuns
  };
}

async function main() {
  try {
    console.log('Refreshing access token...');
    const accessToken = await refreshAccessToken();
    
    console.log('Fetching activities...');
    const activities = await fetchActivities(accessToken);
    console.log(`Fetched ${activities.length} total activities`);
    
    const runs = filterRuns(activities);
    console.log(`Found ${runs.length} runs`);
    
    const aggregated = aggregateRuns(runs);
    
    const outputDir = path.join(__dirname, '..', 'data');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const outputPath = path.join(outputDir, 'strava-runs.json');
    fs.writeFileSync(outputPath, JSON.stringify(aggregated, null, 2));
    
    console.log(`Data saved to ${outputPath}`);
    console.log(`Total runs: ${aggregated.totals.allTime.count}`);
    console.log(`Total distance: ${aggregated.totals.allTime.distance.toFixed(2)} km`);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();

