# Strava API Data Fields Available

This document lists all the data fields available from the Strava API that can be added to `strava-runs.json`.

## Currently Used Fields

The current `fetch-strava.js` script extracts:
- `id` - Activity ID
- `name` - Activity name
- `date` (from `start_date`) - Start date/time
- `distance` - Distance in meters (converted to km)
- `time` (from `moving_time`) - Moving time in seconds
- `pace` - Calculated pace (seconds per km)
- `elevation` (from `total_elevation_gain`) - Elevation gain in meters
- `averageHeartRate` (from `average_heartrate`)
- `maxHeartRate` (from `max_heartrate`)
- `calories`
- `kudos` (from `kudos_count`)
- `map.id` - Map ID
- `map.summary_polyline` - Encoded polyline

## Additional Available Fields

### Time & Duration
- `elapsed_time` - Total elapsed time (includes stops)
- `moving_time` - Time spent moving (currently used)
- `start_date_local` - Start time in local timezone
- `timezone` - Timezone of the activity

### Distance & Speed
- `distance` - Total distance (currently used)
- `average_speed` - Average speed in m/s
- `max_speed` - Maximum speed in m/s
- `split_standard` - Standard splits (e.g., per km)
- `splits_metric` - Metric splits
- `splits_imperial` - Imperial splits

### Elevation
- `total_elevation_gain` - Elevation gain (currently used)
- `elev_high` - Maximum elevation
- `elev_low` - Minimum elevation
- `total_elevation_loss` - Elevation loss (if available)

### Heart Rate
- `average_heartrate` - Average HR (currently used)
- `max_heartrate` - Maximum HR (currently used)
- `heartrate_opt_out` - Whether HR data is hidden
- `has_heartrate` - Whether HR data exists

### Power & Cadence
- `average_watts` - Average power (cycling)
- `weighted_average_watts` - Weighted average power
- `kilojoules` - Energy output
- `device_watts` - Whether power from device
- `average_cadence` - Average cadence (steps per minute)
- `average_temp` - Average temperature

### Location & Geography
- `start_latitude` - Start latitude
- `start_longitude` - Start longitude
- `end_latitude` - End latitude
- `end_longitude` - End longitude
- `city` - City name
- `state` - State/Province
- `country` - Country name
- `location_city` - Location city
- `location_state` - Location state
- `location_country` - Location country

### Map Data
- `map.id` - Map ID (currently used)
- `map.summary_polyline` - Summary polyline (currently used)
- `map.polyline` - Full detailed polyline (requires additional API call)
- `map.resource_state` - Map resource state

### Activity Details
- `type` - Activity type (Run, Ride, etc.)
- `workout_type` - Workout type (1=Race, 2=Long Run, etc.)
- `description` - Activity description
- `private` - Whether activity is private
- `visibility` - Visibility setting
- `trainer` - Whether done on trainer
- `commute` - Whether marked as commute
- `manual` - Whether manually entered
- `flagged` - Whether flagged

### Social & Engagement
- `kudos_count` - Kudos count (currently used)
- `comment_count` - Number of comments
- `athlete_count` - Number of athletes
- `photo_count` - Number of photos
- `has_kudoed` - Whether you've given kudos

### Performance Metrics
- `achievement_count` - Number of achievements
- `pr_count` - Number of PRs
- `suffer_score` - Suffer score (if available)
- `perceived_exertion` - Perceived exertion (if available)

### Gear & Equipment
- `gear_id` - Gear ID
- `gear.name` - Gear name (shoes, bike, etc.)
- `gear.distance` - Distance on this gear

### Weather (if available)
- `weather` - Weather conditions object
- `temperature` - Temperature
- `wind_speed` - Wind speed
- `wind_direction` - Wind direction

### Segments
- `segment_efforts` - Array of segment efforts (requires detailed activity fetch)
- `best_efforts` - Best efforts on segments

### Detailed Data (requires additional API call)
To get more detailed data, you need to call `/api/v3/activities/{id}`:
- `laps` - Detailed lap data
- `splits_metric` - Metric splits with detailed data
- `splits_standard` - Standard splits
- `segment_efforts` - Segment efforts with full details
- `best_efforts` - Best efforts with details
- `photos` - Activity photos
- `calories` - More accurate calories (if available)

## Recommended Additional Fields to Add

### High Priority (Easy to add, high value)
1. **`elapsed_time`** - Total time including stops
2. **`average_speed`** - Average speed in m/s or km/h
3. **`max_speed`** - Maximum speed
4. **`start_latitude` / `start_longitude`** - Start location
5. **`city` / `state` / `country`** - Location information
6. **`description`** - Activity description/notes
7. **`workout_type`** - Type of workout (race, long run, etc.)
8. **`average_cadence`** - Running cadence (steps per minute)
9. **`comment_count`** - Social engagement
10. **`achievement_count`** - Achievements earned

### Medium Priority (Requires additional processing)
1. **`splits_metric`** - Per-kilometer splits
2. **`best_efforts`** - Best efforts on segments
3. **`gear.name`** - Shoes/equipment used
4. **`elev_high` / `elev_low`** - Elevation range

### Low Priority (Requires additional API calls)
1. **`laps`** - Detailed lap data
2. **`segment_efforts`** - Segment performance
3. **`photos`** - Activity photos
4. **Full polyline** - More detailed route data

## Example Enhanced JSON Structure

```json
{
  "id": 16508434234,
  "name": "Morning Run",
  "date": "2025-11-19T18:47:19Z",
  "dateLocal": "2025-11-20T04:47:19+10:00",
  "timezone": "(GMT+10:00) Australia/Sydney",
  
  "distance": 14.3,
  "time": 4974,
  "elapsedTime": 5200,
  "pace": 347.82,
  "averageSpeed": 2.87,
  "maxSpeed": 4.2,
  
  "elevation": {
    "gain": 198,
    "loss": 195,
    "high": 45,
    "low": 12
  },
  
  "heartRate": {
    "average": 169.1,
    "max": 181,
    "hasData": true
  },
  
  "performance": {
    "averageCadence": 168,
    "calories": 850,
    "sufferScore": 45
  },
  
  "location": {
    "start": {
      "lat": -33.8688,
      "lng": 151.2093
    },
    "end": {
      "lat": -33.8700,
      "lng": 151.2100
    },
    "city": "Sydney",
    "state": "NSW",
    "country": "Australia"
  },
  
  "workout": {
    "type": "Run",
    "workoutType": 0,
    "description": "Easy morning run along the coast",
    "commute": false,
    "trainer": false
  },
  
  "social": {
    "kudos": 0,
    "comments": 2,
    "achievements": 1
  },
  
  "gear": {
    "id": "g12345",
    "name": "Nike Air Zoom Pegasus 39"
  },
  
  "splits": [
    {
      "distance": 1000,
      "elapsedTime": 348,
      "elevationDifference": 5,
      "paceZone": 3,
      "averageSpeed": 2.87
    }
  ],
  
  "map": {
    "id": "a16508434234",
    "summaryPolyline": "...",
    "polyline": "..." // Full detailed polyline
  }
}
```

## Implementation Notes

1. **Basic fields** can be added directly from the activities list endpoint
2. **Detailed fields** require calling `/api/v3/activities/{id}` for each activity
3. **Splits and segments** are only available in detailed activity data
4. **Photos** require additional API calls or webhook setup
5. **Weather data** may not be available for all activities

## API Rate Limits

- **Default**: 600 requests per 15 minutes
- **Detailed activity calls**: Use sparingly to avoid rate limits
- Consider caching detailed data and updating incrementally

