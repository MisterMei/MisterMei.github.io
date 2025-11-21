let mapsInitialized = false;
let mapsToInitialize = [];

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

function initGoogleMap(mapId, options = {}) {
  if (!window.google || !window.google.maps) {
    console.warn('Google Maps API not loaded');
    return null;
  }

  const {
    center = { lat: -33.8688, lng: 151.2093 },
    zoom = 13,
    polyline = null,
    startMarker = true,
    endMarker = true
  } = options;

  const mapElement = document.getElementById(mapId);
  if (!mapElement) {
    console.error(`Map element ${mapId} not found`);
    return null;
  }

  try {
    const map = new google.maps.Map(mapElement, {
      center: center,
      zoom: zoom,
      mapTypeId: 'roadmap',
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ]
    });

    if (polyline) {
      const path = decodePolyline(polyline);
      
      if (path.length > 0) {
        const routePolyline = new google.maps.Polyline({
          path: path,
          geodesic: true,
          strokeColor: '#5a7a8c',
          strokeOpacity: 0.8,
          strokeWeight: 4
        });
        routePolyline.setMap(map);

        const bounds = new google.maps.LatLngBounds();
        path.forEach(point => bounds.extend(point));
        map.fitBounds(bounds);

        if (startMarker && path.length > 0) {
          new google.maps.Marker({
            position: path[0],
            map: map,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: '#4aaf4a',
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 3
            },
            title: 'Start'
          });
        }

        if (endMarker && path.length > 1) {
          new google.maps.Marker({
            position: path[path.length - 1],
            map: map,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: '#f44336',
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 3
            },
            title: 'Finish'
          });
        }
      }
    } else {
      new google.maps.Marker({
        position: center,
        map: map,
        title: 'Location'
      });
    }

    return map;
  } catch (error) {
    console.error('Error initializing Google Map:', error);
    mapElement.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center; height: 100%; background: #f0f0f0; color: #666; text-align: center; padding: 20px;">
        <div>Map unavailable</div>
      </div>
    `;
    return null;
  }
}

function initGoogleMaps() {
  if (typeof google !== 'undefined' && google.maps) {
    mapsInitialized = true;
    mapsToInitialize.forEach(({ mapId, options }) => {
      initGoogleMap(mapId, options);
    });
    mapsToInitialize = [];
  }
}

function queueMapInit(mapId, options) {
  if (mapsInitialized) {
    initGoogleMap(mapId, options);
  } else {
    mapsToInitialize.push({ mapId, options });
  }
}

if (typeof window !== 'undefined') {
  window.initGoogleMap = initGoogleMap;
  window.queueMapInit = queueMapInit;
  window.decodePolyline = decodePolyline;
  
  if (typeof google !== 'undefined' && google.maps) {
    initGoogleMaps();
  } else {
    window.initGoogleMaps = initGoogleMaps;
  }
}

