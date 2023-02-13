// Define the urls to be queried and scraped for data
var plateUrl = "Leaflet-Part-2/static/js/plates.geojson";
// var plateUrl = "https://github.com/fraxen/tectonicplates/blob/master/GeoJSON/PB2002_plates.json";
var quakeUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform an API call on the plateUrl to scrape the GeoJSON data for the tectonic plate information
d3.json(plateUrl).then(function(data) {
  // Create a GeoJSON layer (L.geoJson) with the retrieved data
  plates = L.geoJson(data, {
    // Style each "feature" of the retrieved tectonic plates
    style: function(feature) {
      return {
        color: "red",
        fillOpacity: 0,
        weight: 3
      };
    },
    // bind Popup information with each plate's name
    onEachFeature: function(feature,layer){
      layer.bindPopup(`<strong>${feature.properties.PlateName} Plate</strong>`);
    }
  });
    
  // Perform a second API call call to the quakeUrl to retrieve earthquake results  
  d3.json(quakeUrl).then((results) => {
    // Initiate variable to hold earthquake markers
    var earthquakes = [];
    // Define function to colour code each marker based on depth of earthquake
    function depthColor(depth) {
      if (depth < 10) return "#00ff00";
      else if (depth < 20) return "#ccff00";
      else if (depth < 50) return "#ffff00";
      else if (depth < 70) return "#ffdd00";
      else if (depth < 90) return "#ffaa00";
      else return "#ff0000";      
    }
    
    // Initiate variable earthquakeData to loop through ".features"/isolated JSON data
    var earthquakeData = results.features

    // Create loop to run through earthquakeData variable
    for (var i = 0; i < earthquakeData.length; i++) {
      // initiate location variable to isolate ".geometry" object
      var location = earthquakeData[i].geometry;
      // isolate depth coordinates and assign to variable
      var depth = (location.coordinates[2])
      // initiate metadata variable to isolate ".properties" object
      var metadata = earthquakeData[i].properties;
      // Initiate popupText variable and provide additional information to be included
      var popupText = `<h3>${metadata.place}</h3><hr>
      <strong>Magnitude:</strong> ${metadata.mag}<br>
      <strong>Depth:</strong> ${depth} km<br>
      <strong>Date: </strong>${new Date(metadata.time)}<br>    
      <a href="${metadata.url}">Further Info</a>`; 

      // Add each earthquake marker as it is created to the earthquakes variable using .push
      earthquakes.push(
        // Define Marker type as "circle"; isolate lat, long coordinates
        L.circleMarker([location.coordinates[1], location.coordinates[0]], {
          // Define appearance of markers and use .bind to add Popup information
          stroke: true,        
          weight: 1,
          color: "#000000",
          opacity: .4,        
          fillColor: depthColor(depth),
          fillOpacity: 0.4,
          radius: (metadata.mag * 4),      
        }).bindPopup(popupText)
      );    
    }
    // Call on createMap function to create and populate map
    createMap(earthquakes);
  });
});

// Define createMap function to establish base layers, overlays and legend
function createMap(earthquakes) {
  // Create the base/tile layers that will be the background of our map.
  var streetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  var topoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    maxZoom: 17,
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  var esriMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: USGS, Esri, TANA, DeLorme, and NPS',
    maxZoom: 13
  });

  var googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
});

  // Create a layer group for the earthquakes
  var quakes = L.layerGroup(earthquakes);    

  // Create a baseMaps object to hold our base layers and later add to the layer control.
  var baseMaps = {
    "Street": streetMap,
    "Topographic": topoMap,
    "ESRI": esriMap
  };

  // Create an overlays object to hold our overlay layers and later add to the layer control.
  var overlayMaps = {
    "Tectconic Plates": plates,
    "Earthquakes": quakes
  };

  // Define a map object with our default layers.
  var myMap = L.map("map", {
    center: [40.0, -95.0],
    zoom: 3.25,
    layers: [streetMap, plates, quakes]
  });

  // Create a control for our layers, and add our baseMaps and overlayMaps to it.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  // Set up the legend.
  var legend = L.control({
    position: "bottomright" 
  });
    
  // Provide legend information and labels
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var depths = [-10, 10, 20, 50, 70, 90];
    var colors = ["#00ff00", "#ccff00", "#ffff00", "#ffdd00", "#ffaa00", "#ff0000"];
    var labels = [];
  
    // Reference css to format legend
    for (var i = 0; i < depths.length; i++) {
      labels.push(
        "<i style ='background: " + colors[i] + "'></i> " + 
        depths[i] + (depths[i + 1] ? "&ndash;" + depths[i + 1] + "<br>" : "+")
      )
    }        
    div.innerHTML = labels.join('');
    return div;
  }
  
  // Adding the legend to the map
  legend.addTo(myMap);  
};