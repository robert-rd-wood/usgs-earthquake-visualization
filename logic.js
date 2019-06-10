// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function getColor(magnitude) {
  if (magnitude >= 5) {
    return "#f06b6b";
  }
  else if (magnitude >= 4) {
    return "#f0a76b";
  }
  else if (magnitude >= 3) {
    return "#f3ba4d";
  }
  else if (magnitude >= 2) {
    return "#f3db4d";
  }
  else if (magnitude >= 1) {
    return "#e1f34d";
  }
  else {
    return "#b7f34d";
  }
}

function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h5>Magnitude " + feature.properties.mag + "<br>" + feature.properties.place +
      "</h5><hr><small>" + new Date(feature.properties.time) + "</small>");
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
      onEachFeature: onEachFeature,
      pointToLayer: function (feature, latlng) {
          return L.circleMarker(latlng, {
            radius: feature.properties.mag * 2,
            fillColor: getColor(feature.properties.mag),
            color: "#000",
            weight: .3,
            opacity: 1,
            fillOpacity: 0.8
          });
      }
  });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Define darkmap layer
  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      39.95, -95.31
    ], 
    zoom: 4,
    layers: [darkmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
    }).addTo(myMap);

  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function(map) {
    var div = L.DomUtil.create('div','info legend');
    var labels = ["0-1","1-2","2-3","3-4","4-5","5+"];
    var grades = [0, 1, 2, 3, 4, 5];
    div.innerHTML='<div><b>Legend</b></div>';
    for (var i=0; i<grades.length; i++) {
      div.innerHTML += '<i style="background:'
      + getColor(grades[i])
      + '">&nbsp;&nbsp;</i>&nbsp;&nbsp;'
      + labels[i]
      + '<br />';
    }
    return div;
  }
  legend.addTo(myMap);
}
