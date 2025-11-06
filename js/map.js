function initMaps() {
    const mapElements = document.querySelectorAll('.route-map');
    
    mapElements.forEach(mapElement => {
        const mapId = mapElement.id;
        const gpxPath = mapElement.dataset.gpx;
        
        if (mapId && typeof L !== 'undefined') {
            initMap(mapId, gpxPath);
        } else if (mapId) {
            displayMapPlaceholder(mapElement);
        }
    });
}

function initMap(mapId, gpxPath) {
    try {
        const defaultCoords = [-33.8688, 151.2093];
        const map = L.map(mapId).setView(defaultCoords, 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 18
        }).addTo(map);

        if (gpxPath) {
            displaySampleRoute(map, mapId);
        } else {
            L.marker(defaultCoords).addTo(map)
                .bindPopup('Sydney Running Route')
                .openPopup();
        }

    } catch (error) {
        console.error('Error initializing map:', error);
        displayMapPlaceholder(document.getElementById(mapId));
    }
}

function displaySampleRoute(map, mapId) {
    let routeCoords = [];
    
    if (mapId === 'map-bondi') {
        routeCoords = [
            [-33.8906, 151.2745],
            [-33.8925, 151.2765],
            [-33.8955, 151.2785],
            [-33.8985, 151.2795],
            [-33.9015, 151.2785],
            [-33.9045, 151.2765],
            [-33.9065, 151.2745]
        ];
    } else if (mapId === 'map-centennial') {
        routeCoords = [
            [-33.8974, 151.2311],
            [-33.8984, 151.2351],
            [-33.9004, 151.2381],
            [-33.9024, 151.2361],
            [-33.9014, 151.2321],
            [-33.8994, 151.2291],
            [-33.8974, 151.2311]
        ];
    } else if (mapId === 'map-harbour') {
        routeCoords = [
            [-33.8523, 151.2108],
            [-33.8563, 151.2098],
            [-33.8603, 151.2118],
            [-33.8633, 151.2148],
            [-33.8603, 151.2178],
            [-33.8563, 151.2158],
            [-33.8523, 151.2138]
        ];
    }

    if (routeCoords.length > 0) {
        const polyline = L.polyline(routeCoords, {
            color: '#5a7a8c',
            weight: 4,
            opacity: 0.8
        }).addTo(map);

        map.fitBounds(polyline.getBounds(), { padding: [50, 50] });

        L.marker(routeCoords[0], {
            icon: L.icon({
                iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSI4IiBmaWxsPSIjNGFhZjRhIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMiIvPjwvc3ZnPg==',
                iconSize: [24, 24],
                iconAnchor: [12, 12]
            })
        }).addTo(map).bindPopup('Start');

        L.marker(routeCoords[routeCoords.length - 1], {
            icon: L.icon({
                iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSI4IiBmaWxsPSIjZjQ0MzM2IiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMiIvPjwvc3ZnPg==',
                iconSize: [24, 24],
                iconAnchor: [12, 12]
            })
        }).addTo(map).bindPopup('Finish');
    }
}

function displayMapPlaceholder(mapElement) {
    mapElement.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; height: 100%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-align: center; padding: 20px;">
            <div>
                <div style="font-size: 48px; margin-bottom: 16px;">🗺️</div>
                <div style="font-size: 18px; font-weight: 600; margin-bottom: 8px;">Interactive Route Map</div>
                <div style="font-size: 14px; opacity: 0.9;">GPX route visualization will appear here</div>
            </div>
        </div>
    `;
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMaps);
} else {
    initMaps();
}

