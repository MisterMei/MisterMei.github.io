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

        poly.push([lat * 1e-5, lng * 1e-5]);
    }
    return poly;
}

function createRunMap(mapId, polyline, runData) {
    if (!polyline || !polyline.summary_polyline) {
        return;
    }

    try {
        const coordinates = decodePolyline(polyline.summary_polyline);
        
        if (coordinates.length === 0) {
            return;
        }

        const map = L.map(mapId).setView(coordinates[0], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 18
        }).addTo(map);

        const polylineLayer = L.polyline(coordinates, {
            color: '#5a7a8c',
            weight: 4,
            opacity: 0.8
        }).addTo(map);

        map.fitBounds(polylineLayer.getBounds(), { padding: [20, 20] });

        const startIcon = L.divIcon({
            className: 'map-marker-start',
            html: '<div style="background: #4aaf4a; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
            iconSize: [16, 16],
            iconAnchor: [8, 8]
        });

        const endIcon = L.divIcon({
            className: 'map-marker-end',
            html: '<div style="background: #f44336; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
            iconSize: [16, 16],
            iconAnchor: [8, 8]
        });

        L.marker(coordinates[0], { icon: startIcon }).addTo(map)
            .bindPopup('Start');

        L.marker(coordinates[coordinates.length - 1], { icon: endIcon }).addTo(map)
            .bindPopup('Finish');

    } catch (error) {
        console.error('Error creating map:', error);
        const mapElement = document.getElementById(mapId);
        if (mapElement) {
            mapElement.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: center; height: 100%; background: #f0f0f0; color: #666; text-align: center; padding: 20px;">
                    <div>Map unavailable</div>
                </div>
            `;
        }
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

    return `
        <div class="run-card" data-run-id="${run.id}">
            <div class="run-card-header">
                <div>
                    <h3 class="run-card-title">${run.name || 'Run'}</h3>
                    <p class="run-card-date">${formattedDate}</p>
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
                </div>
                <div class="run-stat-item">
                    <span class="run-stat-value">${paceStr}</span>
                    <span class="run-stat-label" data-en="Pace" data-zh="配速">Pace</span>
                </div>
                ${run.elevation > 0 ? `
                <div class="run-stat-item">
                    <span class="run-stat-value">${Math.round(run.elevation)} m</span>
                    <span class="run-stat-label" data-en="Elevation" data-zh="爬升">Elevation</span>
                </div>
                ` : ''}
                ${run.averageHeartRate ? `
                <div class="run-stat-item">
                    <span class="run-stat-value">${Math.round(run.averageHeartRate)} bpm</span>
                    <span class="run-stat-label" data-en="Avg HR" data-zh="平均心率">Avg HR</span>
                </div>
                ` : ''}
            </div>

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

