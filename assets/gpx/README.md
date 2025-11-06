# GPX Route Files

Store your running route GPX files here for display on the routes page.

## Expected Files

- `bondi-bronte.gpx` - Bondi to Bronte coastal walk route
- `centennial-loop.gpx` - Centennial Park 5km loop
- `harbour-circuit.gpx` - Sydney Harbour Bridge circuit

## How to Get GPX Files

1. **From Strava**: Export any activity as GPX file
2. **From Garmin Connect**: Export activity in GPX format
3. **From Apple Watch**: Use third-party apps like HealthFit to export
4. **Create manually**: Use tools like:
   - https://www.plotaroute.com/
   - https://onthegomap.com/
   - https://www.gpsvisualizer.com/

## Sample GPX File Format

```xml
<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Running Journal">
  <metadata>
    <name>Bondi to Bronte Coastal Run</name>
    <desc>10km coastal running route</desc>
  </metadata>
  <trk>
    <name>Bondi to Bronte</name>
    <trkseg>
      <trkpt lat="-33.8906" lon="151.2745">
        <ele>12.0</ele>
      </trkpt>
      <trkpt lat="-33.8925" lon="151.2765">
        <ele>15.0</ele>
      </trkpt>
      <!-- More track points -->
    </trkseg>
  </trk>
</gpx>
```

## Notes

- GPX files will be automatically rendered on the routes page using Leaflet.js
- Maps will show start/finish markers and the complete route path
- If no GPX file is present, a sample route will be displayed

