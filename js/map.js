function initMaps() {
    const mapElements = document.querySelectorAll('.route-map');
    
    mapElements.forEach(mapElement => {
        const mapId = mapElement.id;
        const gpxPath = mapElement.dataset.gpx;
        const polyline = mapElement.dataset.polyline;
        
        if (mapId) {
            if (typeof window.initGoogleMap === 'function') {
                if (polyline) {
                    window.queueMapInit(mapId, {
                        polyline: polyline,
                        startMarker: true,
                        endMarker: true
                    });
                } else {
                    initMap(mapId, gpxPath);
                }
            } else {
                displayMapPlaceholder(mapElement);
            }
        }
    });
}

function initMap(mapId, gpxPath) {
    if (typeof window.initGoogleMap === 'function') {
        window.queueMapInit(mapId, {
            center: { lat: -33.8688, lng: 151.2093 },
            zoom: 13
        });
        if (gpxPath) {
            displaySampleRoute(mapId, gpxPath);
        }
    } else {
        console.warn('Google Maps not initialized');
        displayMapPlaceholder(document.getElementById(mapId));
    }
}

function displaySampleRoute(mapId, gpxPath) {
    let routePath = [];
    
    if (mapId === 'map-bondi') {
        routePath = [
            { lat: -33.8906, lng: 151.2745 },
            { lat: -33.8925, lng: 151.2765 },
            { lat: -33.8955, lng: 151.2785 },
            { lat: -33.8985, lng: 151.2795 },
            { lat: -33.9015, lng: 151.2785 },
            { lat: -33.9045, lng: 151.2765 },
            { lat: -33.9065, lng: 151.2745 }
        ];
    } else if (mapId === 'map-centennial') {
        routePath = [
            { lat: -33.8974, lng: 151.2311 },
            { lat: -33.8984, lng: 151.2351 },
            { lat: -33.9004, lng: 151.2381 },
            { lat: -33.9024, lng: 151.2361 },
            { lat: -33.9014, lng: 151.2321 },
            { lat: -33.8994, lng: 151.2291 },
            { lat: -33.8974, lng: 151.2311 }
        ];
    } else if (mapId === 'map-harbour') {
        routePath = [
            { lat: -33.8523, lng: 151.2108 },
            { lat: -33.8563, lng: 151.2098 },
            { lat: -33.8603, lng: 151.2118 },
            { lat: -33.8633, lng: 151.2148 },
            { lat: -33.8603, lng: 151.2178 },
            { lat: -33.8563, lng: 151.2158 },
            { lat: -33.8523, lng: 151.2138 }
        ];
    }

    if (routePath.length > 0 && typeof window.initGoogleMap === 'function') {
        const encoded = encodePolyline(routePath);
        window.queueMapInit(mapId, {
            center: routePath[0],
            polyline: encoded,
            startMarker: true,
            endMarker: true
        });
    }
}

function encodePolyline(path) {
    let encoded = '';
    let prevLat = 0;
    let prevLng = 0;
    
    path.forEach(point => {
        const lat = Math.round(point.lat * 1e5);
        const lng = Math.round(point.lng * 1e5);
        const dLat = lat - prevLat;
        const dLng = lng - prevLng;
        
        encoded += encodeValue(dLat);
        encoded += encodeValue(dLng);
        
        prevLat = lat;
        prevLng = lng;
    });
    
    return encoded;
}

function encodeValue(value) {
    value = value < 0 ? ~(value << 1) : value << 1;
    let encoded = '';
    while (value >= 0x20) {
        encoded += String.fromCharCode((0x20 | (value & 0x1f)) + 63);
        value >>= 5;
    }
    encoded += String.fromCharCode(value + 63);
    return encoded;
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

