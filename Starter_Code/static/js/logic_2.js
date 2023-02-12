// Create our map
var myMap = L.map("map", {
  center: [37.09, -95.71],
  zoom: 4,
});

// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Define the queryurl to be scraped for data
var queryurl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Pull the JSON data and define functions (=>) within to search for desired info to filter
d3.json(queryurl).then((response) => {
  // Review the retrieved data via console.log
  console.log(response);  
  // Initiate variable earthquakeData to loop through ".features"/isolated JSON data
  var earthquakeData = response.features
  console.log(earthquakeData)
  // Loop through earthquakeData variable
  for (var i = 0; i < earthquakeData.length; i++) {
    // initiate location variable to determine marker placement
    var location = earthquakeData[i].geometry;
    // initiate metadata variable to isolate ".properties" object
    var metadata = earthquakeData[i].properties;
    // Initiate popupText variable to provide additional information
    var popupText = `<h3>${metadata.place}</h3><hr>
    <strong>Magnitude:</strong> ${metadata.mag}<br>
    <strong>Date: </strong>${new Date(metadata.time)}<br>    
    <a href="${metadata.url}">Further Info</a>`;
    // var popupText = `<h3>${metadata.place}</h3><hr>
    // <p>Magnitude: ${metadata.mag}</p>
    // <p>Date: ${new Date(metadata.time)}</p>    
    // <p><a href="${metadata.url}">Further Info</a></p>`;

    // Check for the location property
    if (location) {
      // Add marker to map and bind the popup
      L.marker([location.coordinates[1], location.coordinates[0]]).addTo(myMap)
      .bindPopup(popupText);
    }
  }

  // Set up the legend.
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var limits = location.coordinates[3];
    // var colors = geojson.options.colors;
    var labels = [];

    // Add the minimum and maximum.
    var legendInfo = "<h1>Depth</h1>" +
      "<div class=\"labels\">" +
        "<div class=\"min\">" + limits[0] + "</div>" +
        "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
      "</div>";
 
    div.innerHTML = legendInfo;
 
    limits.forEach(function(limit, index) {
     labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
    });
    
    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
  };
  
  // Adding the legend to the map
  legend.addTo(myMap);

});
