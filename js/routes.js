async function loadRoutesData() {
  try {
    if (typeof loadStravaData === 'function') {
      return await loadStravaData();
    }
    const response = await fetch('data/strava-runs.json');
    if (!response.ok) throw new Error('Failed to load Strava data');
    return await response.json();
  } catch (error) {
    console.error('Error loading Strava data:', error);
    return null;
  }
}

function groupRunsByRoute(runs) {
  const routeGroups = {};
  
  runs.forEach(run => {
    if (!run.map || !run.map.summary_polyline) return;
    
    const distance = run.distance;
    const elevation = run.elevationDetail ? run.elevationDetail.gain : run.elevation || 0;
    
    const distanceRounded = Math.round(distance);
    const elevationRounded = Math.round(elevation);
    
    const routeKey = `${distanceRounded}km-${elevationRounded}m`;
    
    if (!routeGroups[routeKey]) {
      routeGroups[routeKey] = {
        distance: distanceRounded,
        elevation: elevationRounded,
        runs: [],
        avgPace: 0,
        totalRuns: 0,
        name: run.name || 'Run',
        polyline: run.map.summary_polyline,
        mapId: run.map.id,
        avgDistance: 0
      };
    }
    
    routeGroups[routeKey].runs.push(run);
    routeGroups[routeKey].totalRuns++;
  });
  
  Object.keys(routeGroups).forEach(key => {
    const group = routeGroups[key];
    const totalPace = group.runs.reduce((sum, run) => sum + run.pace, 0);
    const totalDistance = group.runs.reduce((sum, run) => sum + run.distance, 0);
    group.avgPace = Math.round(totalPace / group.totalRuns);
    group.avgDistance = totalDistance / group.totalRuns;
    group.runs.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    const mostCommonName = getMostCommonName(group.runs);
    if (mostCommonName) {
      group.name = mostCommonName;
    }
  });
  
  const filteredRoutes = Object.values(routeGroups)
    .filter(route => route.totalRuns >= 2)
    .sort((a, b) => b.totalRuns - a.totalRuns)
    .slice(0, 6);
  
  console.log(`Found ${filteredRoutes.length} common routes from ${runs.length} runs`);
  return filteredRoutes;
}

function getMostCommonName(runs) {
  const nameCounts = {};
  runs.forEach(run => {
    const name = run.name || 'Run';
    nameCounts[name] = (nameCounts[name] || 0) + 1;
  });
  
  let maxCount = 0;
  let mostCommon = null;
  Object.keys(nameCounts).forEach(name => {
    if (nameCounts[name] > maxCount && name !== 'Run' && name !== 'Morning Run' && name !== 'Afternoon Run') {
      maxCount = nameCounts[name];
      mostCommon = name;
    }
  });
  
  return mostCommon || (runs[0]?.name || 'Run');
}

function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}`;
  }
  return `${minutes} min`;
}

function formatPace(secondsPerKm) {
  const minutes = Math.floor(secondsPerKm / 60);
  const seconds = Math.round(secondsPerKm % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}/km`;
}

function getDifficulty(elevation, distance) {
  const elevationPerKm = elevation / distance;
  if (elevationPerKm < 20) return { level: 'Easy', emoji: '⭐' };
  if (elevationPerKm < 50) return { level: 'Medium', emoji: '⭐⭐' };
  return { level: 'Hard', emoji: '⭐⭐⭐' };
}

function renderRouteFromData(route, index) {
  const difficulty = getDifficulty(route.elevation, route.avgDistance || route.distance);
  const avgTime = Math.round((route.avgPace * (route.avgDistance || route.distance)) / 60);
  
  return `
    <section class="route-detail" id="route-${index}">
      <div class="container">
        <div class="route-header">
          <div class="route-info">
            <h2>${route.name}</h2>
            <div class="route-specs">
              <span class="spec-item">📏 ~${route.avgDistance ? route.avgDistance.toFixed(1) : route.distance} km</span>
              <span class="spec-item">⛰️ ${route.elevation}m elevation</span>
              <span class="spec-item">${difficulty.emoji} ${difficulty.level} difficulty</span>
              <span class="spec-item">⏱️ ~${formatTime(avgTime * 60)}</span>
              <span class="spec-item">🏃 ${route.totalRuns} runs</span>
            </div>
            <p data-en="This route has been run ${route.totalRuns} times with an average pace of ${formatPace(route.avgPace)}. Based on your actual Strava running data." 
               data-zh="这条路线已跑 ${route.totalRuns} 次，平均配速 ${formatPace(route.avgPace)}。基于您的实际 Strava 跑步数据。">
              This route has been run ${route.totalRuns} times with an average pace of ${formatPace(route.avgPace)}. Based on your actual Strava running data.
            </p>
          </div>
        </div>

        <div class="route-map-container">
          <div id="map-route-${index}" class="route-map" data-polyline="${route.polyline}"></div>
        </div>

        <div class="route-highlights">
          <h3 data-en="Recent Runs on This Route" data-zh="此路线上的最近跑步">Recent Runs on This Route</h3>
          <ul class="highlights-list">
            ${route.runs.slice(0, 5).map(run => {
              const runDate = new Date(run.date);
              const dateStr = runDate.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
              });
              return `<li>${dateStr} - ${run.distance.toFixed(2)} km in ${formatTime(run.time)} (${formatPace(run.pace)})</li>`;
            }).join('')}
          </ul>
        </div>
      </div>
    </section>
  `;
}

function initRouteMap(mapId, polyline) {
  if (!polyline) return;
  
  if (typeof window.initGoogleMap === 'function') {
    const path = window.decodePolyline(polyline);
    if (path.length > 0) {
      window.queueMapInit(mapId, {
        center: path[0],
        polyline: polyline,
        startMarker: true,
        endMarker: true
      });
    }
  } else {
    console.warn('Google Maps not initialized');
  }
}

async function renderRoutesFromStrava() {
  const data = await loadRoutesData();
  if (!data || !data.recentRuns) {
    console.warn('No Strava data available');
    const routesContainer = document.getElementById('strava-routes-container');
    if (routesContainer) {
      routesContainer.innerHTML = '<p style="text-align: center; color: var(--text-medium); padding: 40px;" data-en="No route data available. Routes need to be run at least 2 times to appear here." data-zh="没有路线数据。路线需要至少跑2次才会显示在这里。">No route data available. Routes need to be run at least 2 times to appear here.</p>';
    }
    return;
  }

  const routes = groupRunsByRoute(data.recentRuns);
  
  const routesContainer = document.getElementById('strava-routes-container');
  if (!routesContainer) {
    console.error('Routes container not found');
    return;
  }

  if (routes.length === 0) {
    routesContainer.innerHTML = '<p style="text-align: center; color: var(--text-medium); padding: 40px;" data-en="No common routes found. Routes need to be run at least 2 times with similar distance and elevation to appear here." data-zh="未找到常见路线。路线需要至少跑2次且距离和海拔相似才会显示在这里。">No common routes found. Routes need to be run at least 2 times with similar distance and elevation to appear here.</p>';
    if (typeof updateLanguage === 'function') {
      updateLanguage();
    }
    return;
  }

  routesContainer.innerHTML = routes.map((route, index) => 
    renderRouteFromData(route, index)
  ).join('');

  routes.forEach((route, index) => {
    setTimeout(() => {
      initRouteMap(`map-route-${index}`, route.polyline);
    }, index * 200);
  });

  if (typeof updateLanguage === 'function') {
    updateLanguage();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderRoutesFromStrava);
} else {
  renderRoutesFromStrava();
}

