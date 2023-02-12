// Define the url to be scraped for data as a "const"
const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


// Fetch the JSON data and define functions (=>) within to search for desired info to filter
d3.json(url).then((data) => {
    // Define local variable to hold "samples" information
    let allearthquakeslastsevendays = data;
    console.log(allearthquakeslastsevendays);
});