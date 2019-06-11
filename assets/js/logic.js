// Function to create circle markers and bind popups
function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the magnitude, place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h4>Magnitude " + feature.properties.mag + "<br>" + feature.properties.place +
      "</h4><hr><small>" + new Date(feature.properties.time) + "</small>");
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
      onEachFeature: onEachFeature,
      pointToLayer: function (feature, latlng) {
          return L.circleMarker(latlng, {
            radius: feature.properties.mag * 3,
            fillColor: getColor(feature.properties.mag),
            color: "#000",
            weight: .3,
            opacity: 1,
            fillOpacity: 0.9
          });
      }
  });

  // Empty array to hold plate boundary objects
  var plateBoundaryArray = [];

  // Loop through plate boundary data, add objects to array
  for (var i=0; i< plates.features.length; i++) {
    plateBoundaryArray.push(plates.features[i].geometry)
  }

  // Define style for plate boundary lines
  var myStyle = {
      "color": "#c64040",
      "weight": 2,
      "opacity": .5
  };

  // Create a GeoJSON layer containing plate boundaries
  var plateBoundaries = L.geoJSON(plateBoundaryArray, {
      style: myStyle
  });

  // Send our earthquakes and plate boundaries layers to the createMap function
  createMap(earthquakes,plateBoundaries);
}

// Function to define map layers and create map
function createMap(earthquakes,plateBoundaries) {

  // Define darkmap layer
  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  // Define satellite layer
  var satellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
  });

  // Define grayscale layer
  var grayscale = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Dark Map": darkmap,
    "Satellite": satellite,
    "Grayscale": grayscale
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    "Fault Lines": plateBoundaries,
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      39.95, -95.31
    ], 
    zoom: 4,
    layers: [darkmap, plateBoundaries, earthquakes]
  });

  // Create variable to hold legend
  var legend = L.control({position: 'bottomright'});

  // Populate data for legend
  legend.onAdd = function(map) {
    var div = L.DomUtil.create('div','info legend');
    var labels = ["0-1","1-2","2-3","3-4","4-5","5+"];
    var grades = [0, 1, 2, 3, 4, 5];
    div.innerHTML='<div><b>Legend</b><hr></div>';
    for (var i=0; i<grades.length; i++) {
      div.innerHTML += '<i style="background:'
      + getColor(grades[i])
      + '">&nbsp;&nbsp;</i>&nbsp;&nbsp;'
      + labels[i]
      + '<br />';
    }
    return div;
  }

  // Add legend to map
  legend.addTo(myMap);

  
  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
    }).addTo(myMap);
}

// Function to determine circle marker fill color based on earthquake magnitude
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

// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL, send the response to the createFeatures function
d3.json(queryUrl, createFeatures);