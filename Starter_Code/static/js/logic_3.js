// Create our initial map object, set latitude and longitude as well as zoom level
var myMap = L.map("map", {
  center: [37.09, -115.71],
  zoom: 5,
});

// Adding the tile layer/background image
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// A function to determine the marker size based on the population
function markerSize(magnitude) {
  return (magnitude) * 5000;
}

// Define the queryurl to be scraped for data
var queryurl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Pull the JSON data and define functions (=>) within to search for desired info to filter
d3.json(queryurl).then((response) => {
  // Review the retrieved data via console.log
  console.log(response);  

  // Define arrays to hold the markers
  // var markers = [];

  // Initiate variable earthquakeData to loop through ".features"/isolated JSON data
  // var earthquakeData = response.features
  // console.log(earthquakeData)
  // Loop through earthquakeData variable
  // for (var i = 0; i < earthquakeData.length; i++) {
  //   // initiate location variable to determine marker placement
  //   var location = earthquakeData[i].geometry;
  //   var coordinates = [(location.coordinates[1]), (location.coordinates[0])]
  //   var depth = (location.coordinates[2])
  //   // console.log(depth)
  //   // initiate metadata variable to isolate ".properties" object
  //   var metadata = earthquakeData[i].properties;
  //   console.log(metadata.mag * 1000)
    // Setting the marker radius for the state by passing population into the markerSize function
    // markers.push(
      // L.circle([location.coordinates[1], location.coordinates[0]], {
      // L.circle(coordinates, {
      //   stroke: false,
      //   fillOpacity: 0.5,
      //   color: "gray",
      //   fillColor: "green",
      //   radius: (metadata.mag * 5000),
      //   popup: `<h3>${metadata.place}</h3><hr>
      //   <strong>Magnitude:</strong> ${metadata.mag}<br>
      //   <strong>Date: </strong>${new Date(metadata.time)}<br>    
      //   <a href="${metadata.url}">Further Info</a>`
      //   // popup: popupText        
      // }).bindPopup(popupText).addTo(myMap)
    // );

  function depthColor(depth) {
    if (depth < 10) return "#00ff00";
    else if (depth < 20) return "#ccff00";
    else if (depth < 50) return "#ffff00";
    else if (depth < 70) return "#ffdd00";
    else if (depth < 90) return "#ffaa00";
    else return "#ff0000";      
  }

  // Initiate variable earthquakeData to loop through ".features"/isolated JSON data
  var earthquakeData = response.features
  // console.log(earthquakeData)
  // Loop through earthquakeData variable
  for (var i = 0; i < earthquakeData.length; i++) {
    // initiate location variable to determine marker placement
    var location = earthquakeData[i].geometry;
    var depth = (location.coordinates[2])
    // initiate metadata variable to isolate ".properties" object
    var metadata = earthquakeData[i].properties;
    // Initiate popupText variable to provide additional information
    var popupText = `<h3>${metadata.place}</h3><hr>
    <strong>Magnitude:</strong> ${metadata.mag}<br>
    <strong>Date: </strong>${new Date(metadata.time)}<br>    
    <a href="${metadata.url}">Further Info</a>`;

    // Check for the location property
    if (location) {
      // Add marker to map and bind the popup
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

  // // Set up the legend.
  var legend = L.control({
    position: "bottomright" 
  });

  // Provide legend details
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var depths = [-10, 10, 20, 50, 70, 90];
    var colors = ["#00ff00", "#ccff00", "#ffff00", "#ffdd00", "#ffaa00", "#ff0000"];
    var labels = [];

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
});
