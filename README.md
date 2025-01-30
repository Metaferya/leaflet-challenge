# leaflet-challenge
# Earthquake Map Visualization

## Overview
This project visualizes earthquake data on an interactive map using Leaflet.js and D3.js. The map retrieves real-time earthquake data from the USGS (United States Geological Survey) and displays it with markers sized by magnitude and colored by depth.

## Features
- **Interactive Map**: Displays earthquake locations with relevant data.
- **Real-Time Data**: Fetches weekly earthquake data from the USGS API.
- **Color-Coded Depths**: Earthquake markers are colored based on depth.
- **Magnitude-Based Sizing**: The radius of the marker corresponds to earthquake magnitude.
- **Popups**: Displays magnitude and location on marker click.
- **Legend**: Explains color coding of earthquake depth.

## Technologies Used
- [Leaflet.js](https://leafletjs.com/) for interactive mapping
- [D3.js](https://d3js.org/) for fetching and handling GeoJSON data
- [OpenStreetMap](https://www.openstreetmap.org/) for the basemap
- [USGS Earthquake API](https://earthquake.usgs.gov/) for real-time data

## Installation & Usage
1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo-name.git
   ```
2. Navigate to the project directory:
   ```sh
   cd earthquake-map
   ```
3. Open the `index.html` file in a web browser.

## Code Explanation
### 1. **Setting Up the Map**
```javascript
let basemap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
});

let map = L.map('map', {
  center: [37.00, -97.0],
  zoom: 5,
  layers: [basemap]
});
```
- Initializes the Leaflet map centered at latitude `37.00`, longitude `-97.0` with zoom level `5`.
- Uses OpenStreetMap as the tile layer.

### 2. **Fetching Earthquake Data**
```javascript
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function (data) {
  L.geoJson(data, {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng);
    },
    style: styleInfo,
    onEachFeature: function (feature, layer) {
      layer.bindPopup(`Magnitude: ${feature.properties.mag}<br>Location: ${feature.properties.place}`);
    }
  }).addTo(map);
});
```
- Retrieves GeoJSON earthquake data from USGS.
- Uses `circleMarker` to represent earthquake locations.
- Binds popups to show magnitude and location.

### 3. **Styling Earthquake Markers**
```javascript
function styleInfo(feature) {
  return {
    opacity: 1,
    fillOpacity: 1,
    fillColor: getColor(feature.geometry.coordinates[2]),
    color: "#000000",
    radius: getRadius(feature.properties.mag),
    stroke: true,
    weight: 0.5
  };
}
```
- Determines marker size based on magnitude and color based on depth.

### 4. **Adding a Legend**
```javascript
let legend = L.control({ position: "bottomright" });
legend.onAdd = function () {
  let div = L.DomUtil.create("div", "info legend");
  let depths = [-10, 10, 30, 50, 70, 90];
  let colors = ["#a3f600", "#dcf400", "#f7db11", "#fdb72a", "#fca35d", "#ff5f65"];
  for (let i = 0; i < depths.length; i++) {
    div.innerHTML += '<i style="background:' + colors[i] + '"></i> ' +
      depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
  }
  return div;
};
legend.addTo(map);
```
- Adds a legend explaining depth color coding.

## Credit
[To my Instuctor and Xpert]

