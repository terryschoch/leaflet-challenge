// Create our initial map object, set latitude and longitude as well as zoom level
var myMap = L.map("map", {
  center: [43.6532, -79.3832],
  zoom: 5,
});

// Use L.tileLayer to add the tile layer/background image
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Define a markerSize function to determine the marker size based on the population
function markerSize(magnitude) {
  return (magnitude) * 5000;
}

// Declare the queryurl to be scraped for data
const queryurl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Pull the JSON data and define functions (=>) within to search for desired info to filter
d3.json(queryurl).then((response) => {
  // Review the retrieved data via console.log
  console.log(response);  
  // Define a depthColor function to assign each marker a color
  function depthColor(depth) {
    if (depth < 10) return "#00ff00";
    else if (depth < 20) return "#ccff00";
    else if (depth < 50) return "#ffff00";
    else if (depth < 70) return "#ffdd00";
    else if (depth < 90) return "#ffaa00";
    else return "#ff0000";      
  }
  // Declare variable earthquakeData to loop through ".features" key of JSON data
  var earthquakeData = response.features
  // console.log(earthquakeData)
  // Loop through earthquakeData
  for (var i = 0; i < earthquakeData.length; i++) {
    // Declare location variable to determine marker placement
    var location = earthquakeData[i].geometry;
    // Declare depth variable to capture depth (in km) of each earthquake
    var depth = (location.coordinates[2])
    // Declare metadata variable to hold ".properties" key
    var metadata = earthquakeData[i].properties;
    // Declare popupText variable to hold desired additional information to be added to popup
    var popupText = `<h3>${metadata.place}</h3><hr>
    <strong>Magnitude:</strong> ${metadata.mag}<br>
    <strong>Depth:</strong> ${depth} km<br>
    <strong>Date: </strong>${new Date(metadata.time)}<br>    
    <a href="${metadata.url}">Further Info</a>`;
    // Check for the location property
    if (location) {
      // Use .circleMarker to add marker to map layer and .bindPopup to included popup info for each marker
      L.circleMarker([location.coordinates[1], location.coordinates[0]], {
        stroke: true,        
        weight: 1,
        color: "#000000",
        opacity: .4,        
        fillColor: depthColor(depth),
        fillOpacity: 0.4,
        radius: (metadata.mag * 4),      
      }).addTo(myMap)
      .bindPopup(popupText);
    }
  }

  // // Set up the legend
  var legend = L.control({
    position: "bottomright" 
  });
  // Provide legend information and labels
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var depths = [-10, 10, 20, 50, 70, 90];
    var colors = ["#00ff00", "#ccff00", "#ffff00", "#ffdd00", "#ffaa00", "#ff0000"];
    var labels = [];
  // Use for loop and reference css to format legend
    for (var i = 0; i < depths.length; i++) {
      labels.push(
        "<i style ='background: " + colors[i] + "'></i> " + 
        depths[i] + (depths[i + 1] ? "&ndash;" + depths[i + 1] + "<br>" : "+")
      )
    }
    // Use .join to add pushed label information to legend and add to the created div for the legend
    div.innerHTML = labels.join('');    
    return div;
  }

  // Add the legend to the map
  legend.addTo(myMap);
});