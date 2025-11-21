function decodePolyline(encoded) {
    const poly = [];
    let index = 0;
    const len = encoded.length;
    let lat = 0;
    let lng = 0;

    while (index < len) {
        let b;
        let shift = 0;
        let result = 0;
        do {
            b = encoded.charCodeAt(index++) - 63;
            result |= (b & 0x1f) << shift;
            shift += 5;
        } while (b >= 0x20);
        const dlat = ((result & 1) !== 0 ? ~(result >> 1) : (result >> 1));
        lat += dlat;

        shift = 0;
        result = 0;
        do {
            b = encoded.charCodeAt(index++) - 63;
            result |= (b & 0x1f) << shift;
            shift += 5;
        } while (b >= 0x20);
        const dlng = ((result & 1) !== 0 ? ~(result >> 1) : (result >> 1));
        lng += dlng;

        poly.push({ lat: lat * 1e-5, lng: lng * 1e-5 });
    }
    return poly;
}

function createRunMap(mapId, polyline, runData) {
    if (!polyline || !polyline.summary_polyline) {
        return;
    }

    const mapElement = document.getElementById(mapId);
    if (!mapElement) {
        return;
    }

    if (typeof window.initGoogleMap === 'function' && typeof window.queueMapInit === 'function') {
        const path = decodePolyline(polyline.summary_polyline);
        if (path.length > 0) {
            window.queueMapInit(mapId, {
                center: path[0],
                polyline: polyline.summary_polyline,
                startMarker: true,
                endMarker: true
            });
        }
    } else {
        mapElement.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; height: 100%; background: #f0f0f0; color: #666; text-align: center; padding: 20px;">
                <div>Map loading...</div>
            </div>
        `;
        
        const checkInterval = setInterval(() => {
            if (typeof window.initGoogleMap === 'function' && typeof window.queueMapInit === 'function') {
                clearInterval(checkInterval);
                const path = decodePolyline(polyline.summary_polyline);
                if (path.length > 0) {
                    window.queueMapInit(mapId, {
                        center: path[0],
                        polyline: polyline.summary_polyline,
                        startMarker: true,
                        endMarker: true
                    });
                }
            }
        }, 100);
        
        setTimeout(() => clearInterval(checkInterval), 10000);
    }
}

function renderRunCard(run, index) {
    const runDate = new Date(run.date);
    const formattedDate = runDate.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    const hours = Math.floor(run.time / 3600);
    const minutes = Math.floor((run.time % 3600) / 60);
    const secs = run.time % 60;
    const timeStr = hours > 0 
        ? `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
        : `${minutes}:${secs.toString().padStart(2, '0')}`;

    const paceMinutes = Math.floor(run.pace / 60);
    const paceSeconds = Math.round(run.pace % 60);
    const paceStr = `${paceMinutes}:${paceSeconds.toString().padStart(2, '0')}/km`;

    const elevation = run.elevationDetail || { gain: run.elevation || 0 };
    const heartRate = run.heartRate || { average: run.averageHeartRate, max: run.maxHeartRate };

    return `
        <div class="run-card" data-run-id="${run.id}">
            <div class="run-card-header">
                <div>
                    <h3 class="run-card-title">${run.name || 'Run'}</h3>
                    <div class="run-card-meta">
                        <p class="run-card-date">${formattedDate}</p>
                        ${run.location && (run.location.city || run.location.country) ? `
                        <p class="run-card-location">📍 ${[run.location.city, run.location.state, run.location.country].filter(Boolean).join(', ')}</p>
                        ` : ''}
                        ${run.workout && run.workout.description ? `
                        <p class="run-card-description">${run.workout.description}</p>
                        ` : ''}
                    </div>
                </div>
            </div>
            
            <div class="run-card-stats">
                <div class="run-stat-item">
                    <span class="run-stat-value">${run.distance.toFixed(2)} km</span>
                    <span class="run-stat-label" data-en="Distance" data-zh="距离">Distance</span>
                </div>
                <div class="run-stat-item">
                    <span class="run-stat-value">${timeStr}</span>
                    <span class="run-stat-label" data-en="Time" data-zh="时间">Time</span>
                    ${run.elapsedTime && run.elapsedTime !== run.time ? `
                    <span class="run-stat-note" data-en="(${formatTime(run.elapsedTime)} elapsed)" data-zh="(总时间 ${formatTime(run.elapsedTime)})">(${formatTime(run.elapsedTime)} elapsed)</span>
                    ` : ''}
                </div>
                <div class="run-stat-item">
                    <span class="run-stat-value">${paceStr}</span>
                    <span class="run-stat-label" data-en="Pace" data-zh="配速">Pace</span>
                </div>
                ${run.averageSpeed ? `
                <div class="run-stat-item">
                    <span class="run-stat-value">${run.averageSpeed} km/h</span>
                    <span class="run-stat-label" data-en="Avg Speed" data-zh="平均速度">Avg Speed</span>
                </div>
                ` : ''}
                ${elevation.gain > 0 ? `
                <div class="run-stat-item">
                    <span class="run-stat-value">${Math.round(elevation.gain)} m</span>
                    <span class="run-stat-label" data-en="Elevation" data-zh="爬升">Elevation</span>
                    ${elevation.high && elevation.low ? `
                    <span class="run-stat-note" data-en="(${elevation.low}-${elevation.high}m)" data-zh="(${elevation.low}-${elevation.high}米)">(${elevation.low}-${elevation.high}m)</span>
                    ` : ''}
                </div>
                ` : ''}
                ${heartRate.average ? `
                <div class="run-stat-item">
                    <span class="run-stat-value">${Math.round(heartRate.average)} bpm</span>
                    <span class="run-stat-label" data-en="Avg HR" data-zh="平均心率">Avg HR</span>
                    ${heartRate.max ? `
                    <span class="run-stat-note" data-en="(max ${Math.round(heartRate.max)})" data-zh="(最大 ${Math.round(heartRate.max)})">(max ${Math.round(heartRate.max)})</span>
                    ` : ''}
                </div>
                ` : ''}
                ${run.performance && run.performance.averageCadence ? `
                <div class="run-stat-item">
                    <span class="run-stat-value">${Math.round(run.performance.averageCadence)} spm</span>
                    <span class="run-stat-label" data-en="Cadence" data-zh="步频">Cadence</span>
                </div>
                ` : ''}
            </div>

            ${(run.performance && run.performance.sufferScore) || (run.social && (run.social.achievements > 0 || run.social.prCount > 0)) || run.gear ? `
            <div class="run-card-details">
                ${run.performance && run.performance.sufferScore ? `
                <div class="run-detail-item">
                    <span class="run-detail-label" data-en="Suffer Score:" data-zh="痛苦指数:">Suffer Score:</span>
                    <span class="run-detail-value">${run.performance.sufferScore}</span>
                </div>
                ` : ''}
                ${run.social && run.social.achievements > 0 ? `
                <div class="run-detail-item">
                    <span class="run-detail-label" data-en="Achievements:" data-zh="成就:">Achievements:</span>
                    <span class="run-detail-value">🏆 ${run.social.achievements}</span>
                </div>
                ` : ''}
                ${run.social && run.social.prCount > 0 ? `
                <div class="run-detail-item">
                    <span class="run-detail-label" data-en="PRs:" data-zh="个人最佳:">PRs:</span>
                    <span class="run-detail-value">⭐ ${run.social.prCount}</span>
                </div>
                ` : ''}
                ${run.gear && run.gear.name ? `
                <div class="run-detail-item">
                    <span class="run-detail-label" data-en="Gear:" data-zh="装备:">Gear:</span>
                    <span class="run-detail-value">👟 ${run.gear.name}</span>
                </div>
                ` : ''}
            </div>
            ` : ''}

            ${run.map && run.map.summary_polyline ? `
            <div class="run-card-map-container">
                <div id="map-${run.id}" class="run-card-map"></div>
            </div>
            ` : ''}
        </div>
    `;
}

async function renderStravaRuns() {
    const data = await loadStravaData();
    if (!data || !data.recentRuns) {
        const container = document.getElementById('strava-runs-container');
        if (container) {
            container.innerHTML = '<p style="text-align: center; color: var(--text-medium);">No runs data available.</p>';
        }
        return;
    }

    const container = document.getElementById('strava-runs-container');
    if (!container) return;

    container.innerHTML = data.recentRuns.map((run, index) => renderRunCard(run, index)).join('');

    data.recentRuns.forEach((run, index) => {
        if (run.map && run.map.summary_polyline) {
            setTimeout(() => {
                createRunMap(`map-${run.id}`, run.map, run);
            }, index * 100);
        }
    });

    if (typeof updateLanguage === 'function') {
        updateLanguage();
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initStravaDisplay();
        renderStravaRuns();
    });
} else {
    initStravaDisplay();
    renderStravaRuns();
}

