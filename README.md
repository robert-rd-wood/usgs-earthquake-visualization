# USGS Earthquake Visualization
USGS Earthquake Visualization - Leaflet.js and GeoJSON

**Description**  
HTML page containing a map and layers generated using Leaflet.js and GeoJSON. Several base map layer options were added, and overlays were added for fault lines and earthquakes.  Earthquake markers are sized and colored according to magnitude, and a legend was added for reference.  Fault line data was sourced from <https://github.com/fraxen/tectonicplates>. Earthquake data was pulled from the USGS API <https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php>, and is updated via an API call on page load to display all earthquakes from the past 7 days. Popups are also incorporated to display magnitude, location, and time of each earthquake.  

---

![alt text](screenshots/map.gif "Map Controls")