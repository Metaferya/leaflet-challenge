// Create the 'basemap' tile layer that will be the background of our map.
let basemap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  });
  
  // OPTIONAL: Step 2
  // Create the 'street' tile layer as a second background of the map
  let street = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenTopoMap contributors'
  });
  
  // Create the map object with center and zoom options.
  let map = L.map('map', {
    center: [37.09, -95.71],
    zoom: 5,
    layers: [basemap]
  });
  
  // Then add the 'basemap' tile layer to the map.
  basemap.addTo(map);
  
  // OPTIONAL: Step 2
  // Create the layer groups, base maps, and overlays for our two sets of data, earthquakes and tectonic_plates.
  let earthquakes = new L.LayerGroup();
  let tectonic_plates = new L.LayerGroup();
  
  let baseMaps = {
    "Basemap": basemap,
    "Street Map": street
  };
  
  let overlays = {
    "Earthquakes": earthquakes,
    "Tectonic Plates": tectonic_plates
  };
  
  // Add a control to the map that will allow the user to change which layers are visible.
  L.control.layers(baseMaps, overlays).addTo(map);
  
  // Make a request that retrieves the earthquake geoJSON data.
  d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function (data) {
  
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
  
    function getColor(depth) {
      return depth > 90 ? "#ff5f65" :
             depth > 70 ? "#fca35d" :
             depth > 50 ? "#fdb72a" :
             depth > 30 ? "#f7db11" :
             depth > 10 ? "#dcf400" : "#a3f600";
    }
  
    function getRadius(magnitude) {
      return magnitude === 0 ? 1 : magnitude * 4;
    }
  
    L.geoJson(data, {
      pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng);
      },
      style: styleInfo,
      onEachFeature: function (feature, layer) {
        layer.bindPopup(`Magnitude: ${feature.properties.mag}<br>Location: ${feature.properties.place}`);
      }
    }).addTo(earthquakes);
  
    earthquakes.addTo(map);
  
    let legend = L.control({
      position: "bottomright"
    });
  
    legend.onAdd = function () {
      let div = L.DomUtil.create("div", "info legend");
      let depths = [-10, 10, 30, 50, 70, 90];
      let colors = ["#a3f600", "#dcf400", "#f7db11", "#fdb72a", "#fca35d", "#ff5f65"];
  
      for (let i = 0; i < depths.length; i++) {
        div.innerHTML +=
          '<i style="background:' + colors[i] + '"></i> ' +
          depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
      }
      return div;
    };
  
    legend.addTo(map);
  
    // OPTIONAL: Step 2
    // Make a request to get our Tectonic Plate geoJSON data.
    d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json").then(function (plate_data) {
      L.geoJson(plate_data, {
        color: "orange",
        weight: 2
      }).addTo(tectonic_plates);
  
      tectonic_plates.addTo(map);
    });
  });
  