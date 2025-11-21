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
  
  container.innerHTML = runs.map(run => `
    <div class="run-item">
      <div class="run-header">
        <h4>${run.name || 'Run'}</h4>
        <span class="run-date">${formatDate(run.date)}</span>
      </div>
      <div class="run-stats">
        <span class="run-stat">
          <strong>${formatDistance(run.distance)}</strong>
          <small data-en="Distance" data-zh="距离">Distance</small>
        </span>
        <span class="run-stat">
          <strong>${formatTime(run.time)}</strong>
          <small data-en="Time" data-zh="时间">Time</small>
        </span>
        <span class="run-stat">
          <strong>${formatPace(run.pace)}</strong>
          <small data-en="Pace" data-zh="配速">Pace</small>
        </span>
        ${run.elevation > 0 ? `
        <span class="run-stat">
          <strong>${run.elevation}m</strong>
          <small data-en="Elevation" data-zh="爬升">Elevation</small>
        </span>
        ` : ''}
      </div>
    </div>
  `).join('');
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

