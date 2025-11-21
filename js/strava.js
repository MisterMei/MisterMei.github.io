let stravaData = null;

async function loadStravaData() {
  try {
    const response = await fetch('data/strava-runs.json');
    if (!response.ok) throw new Error('Failed to load Strava data');
    stravaData = await response.json();
    return stravaData;
  } catch (error) {
    console.error('Error loading Strava data:', error);
    return null;
  }
}

function formatDistance(km) {
  if (km < 1) return `${Math.round(km * 1000)}m`;
  return `${km.toFixed(2)}km`;
}

function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

function formatPace(secondsPerKm) {
  const minutes = Math.floor(secondsPerKm / 60);
  const seconds = Math.round(secondsPerKm % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}/km`;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
}

function renderStats(containerId, period, data) {
  const container = document.getElementById(containerId);
  if (!container || !data) return;

  const stats = data.totals[period];
  if (!stats) return;

  container.innerHTML = `
    <div class="stat-card">
      <div class="stat-value">${stats.count}</div>
      <div class="stat-label" data-en="Runs" data-zh="跑步次数">Runs</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">${formatDistance(stats.distance)}</div>
      <div class="stat-label" data-en="Distance" data-zh="距离">Distance</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">${formatTime(stats.time)}</div>
      <div class="stat-label" data-en="Time" data-zh="时间">Time</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">${Math.round(stats.elevation)}m</div>
      <div class="stat-label" data-en="Elevation" data-zh="爬升">Elevation</div>
    </div>
  `;
}

function renderRecentRuns(containerId, data) {
  const container = document.getElementById(containerId);
  if (!container || !data || !data.recentRuns) return;

  const runs = data.recentRuns.slice(0, 10);
  
  container.innerHTML = runs.map(run => {
    const elevation = run.elevationDetail || { gain: run.elevation || 0 };
    const heartRate = run.heartRate || { average: run.averageHeartRate };
    
    return `
    <div class="run-item">
      <div class="run-header">
        <h4>${run.name || 'Run'}</h4>
        <span class="run-date">${formatDate(run.date)}</span>
      </div>
      ${run.location && (run.location.city || run.location.country) ? `
      <div class="run-location">
        📍 ${[run.location.city, run.location.state, run.location.country].filter(Boolean).join(', ')}
      </div>
      ` : ''}
      <div class="run-stats">
        <span class="run-stat">
          <strong>${formatDistance(run.distance)}</strong>
          <small data-en="Distance" data-zh="距离">Distance</small>
        </span>
        <span class="run-stat">
          <strong>${formatTime(run.time)}</strong>
          <small data-en="Time" data-zh="时间">Time</small>
          ${run.elapsedTime && run.elapsedTime !== run.time ? `
          <small class="run-stat-note" data-en="(${formatTime(run.elapsedTime)} elapsed)" data-zh="(总时间 ${formatTime(run.elapsedTime)})">(${formatTime(run.elapsedTime)} elapsed)</small>
          ` : ''}
        </span>
        <span class="run-stat">
          <strong>${formatPace(run.pace)}</strong>
          <small data-en="Pace" data-zh="配速">Pace</small>
        </span>
        ${run.averageSpeed ? `
        <span class="run-stat">
          <strong>${run.averageSpeed} km/h</strong>
          <small data-en="Avg Speed" data-zh="平均速度">Avg Speed</small>
        </span>
        ` : ''}
        ${elevation.gain > 0 ? `
        <span class="run-stat">
          <strong>${elevation.gain}m</strong>
          <small data-en="Elevation" data-zh="爬升">Elevation</small>
        </span>
        ` : ''}
        ${heartRate.average ? `
        <span class="run-stat">
          <strong>${Math.round(heartRate.average)} bpm</strong>
          <small data-en="Avg HR" data-zh="平均心率">Avg HR</small>
        </span>
        ` : ''}
        ${run.performance && run.performance.averageCadence ? `
        <span class="run-stat">
          <strong>${Math.round(run.performance.averageCadence)} spm</strong>
          <small data-en="Cadence" data-zh="步频">Cadence</small>
        </span>
        ` : ''}
      </div>
      ${(run.social && (run.social.achievements > 0 || run.social.prCount > 0)) || run.gear ? `
      <div class="run-extras">
        ${run.social && run.social.achievements > 0 ? `
        <span class="run-extra" data-en="${run.social.achievements} achievements" data-zh="${run.social.achievements} 个成就">🏆 ${run.social.achievements} achievements</span>
        ` : ''}
        ${run.social && run.social.prCount > 0 ? `
        <span class="run-extra" data-en="${run.social.prCount} PRs" data-zh="${run.social.prCount} 个个人最佳">⭐ ${run.social.prCount} PRs</span>
        ` : ''}
        ${run.gear && run.gear.name ? `
        <span class="run-extra" data-en="Gear: ${run.gear.name}" data-zh="装备: ${run.gear.name}">👟 ${run.gear.name}</span>
        ` : ''}
      </div>
      ` : ''}
    </div>
  `;
  }).join('');
}

function initPeriodTabs() {
  const tabs = document.querySelectorAll('.period-tab');
  const statContainers = {
    allTime: document.getElementById('strava-stats-alltime'),
    thisYear: document.getElementById('strava-stats-year'),
    thisMonth: document.getElementById('strava-stats-month'),
    thisWeek: document.getElementById('strava-stats-week')
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const period = tab.dataset.period;
      
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      Object.keys(statContainers).forEach(key => {
        const container = statContainers[key];
        if (container) {
          container.style.display = key === period ? 'grid' : 'none';
        }
      });
    });
  });
}

async function initStravaDisplay() {
  const data = await loadStravaData();
  if (!data) {
    console.warn('Strava data not available');
    return;
  }

  renderStats('strava-stats-alltime', 'allTime', data);
  renderStats('strava-stats-year', 'thisYear', data);
  renderStats('strava-stats-month', 'thisMonth', data);
  renderStats('strava-stats-week', 'thisWeek', data);
  renderRecentRuns('strava-recent-runs', data);
  
  initPeriodTabs();

  if (typeof updateLanguage === 'function') {
    updateLanguage();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initStravaDisplay);
} else {
  initStravaDisplay();
}

