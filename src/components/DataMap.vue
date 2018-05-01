<template>
  <div id='map'></div>
</template>

<script>
import * as d3 from 'd3';
import L from 'leaflet';

export default {
  data() {
    return {
      crimeData: null,
      map: null,
      uniqueOffenses: null,
    }
  },
  methods: {
    getLocation(input) {
      // search
      const results = provider.search({ query: input.value });
    },
    getUnique(dataset, prop) {
      // get offense categories
      const uniqueArr = dataset.reduce((acc, elem) => {
        const value = elem[prop];
          if (acc.indexOf(value) === -1){
           acc.push(value);
          }
        return acc;
      }, []);
      return uniqueArr;
    },
    loadData() {
      return new Promise((resolve, reject) => {
        const parseTime = d3.timeParse("%Y-%m-%d");
        d3.json("./static/data/geocodedData.json").then(function(data) {
          data.forEach(d => {
            d.REPORTDATE = parseTime(d.REPORTDATE.split(' ')[0]);
          })
          const isObject = (t) => { return Object.prototype.toString.call(t); };
          // remove data that doesn't have location coordinates
          return resolve(data.filter(x => isObject(x.location)));
        }).catch((err) => {
          reject(err);
        });
      });
    },
    setup() {
      var map = L.map('map').setView([40.025647, -105.257869], 12.14);
      //add choice base tiles - background map of Lyon
      L.tileLayer('http://{s}.tile.stamen.com/toner-lite/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      d3.json('static/data/BoulderCityLimits.geojson')
        .then((cityData) => {
          L.geoJSON(cityData, {
              style: function (feature) {
                return { weight: 1, color: '#808080' };
                  // return {color: feature.properties.color};
              }
          }).addTo(map);
        });

      // L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      //     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      // }).addTo(map);
//       var mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');
//
//       mapboxgl.accessToken = `
// pk.eyJ1Ijoic21jY3Vtc2V5IiwiYSI6ImNqZ2lyem1ucDBxYnQycXBxOTV2eWRlYmoifQ.rPD4wTlJ2zWXBMyu1VEUkA`;
//       var map = new mapboxgl.Map({
//         container: 'map',
//         style: 'mapbox://styles/mapbox/streets-v10',
//         center: [-105.257869, 40.025647],
//         zoom: 12.14,
//       });

      // map.on('load', function () {
      //     map.addLayer({
      //         'id': 'population',
      //         'type': 'circle',
      //         'source': {
      //             type: 'vector',
      //             url: 'mapbox://examples.8fgz4egr'
      //         },
      //         'source-layer': 'sf2010',
      //         'paint': {
      //             // make circles larger as the user zooms from z12 to z22
      //             'circle-radius': {
      //                 'base': 1.75,
      //                 'stops': [[12, 2], [22, 180]]
      //             },
      //             // color circles by ethnicity, using a match expression
      //             // https://www.mapbox.com/mapbox-gl-js/style-spec/#expressions-match
      //             'circle-color': [
      //                 'match',
      //                 ['get', 'ethnicity'],
      //                 'White', '#fbb03b',
      //                 'Black', '#223b53',
      //                 'Hispanic', '#e55e5e',
      //                 'Asian', '#3bb2d0',
      //                 /* other */ '#ccc'
      //             ]
      //         }
      //     });
      // });
      this.loadData().then((res) => {
        // map.on('load', function () {
          const organizedCrime = {};
          const crimeData = res;
          const uniqueOffenses = this.getUnique(crimeData, 'OFFENSE');
          // const colors = d3.scaleOrdinal.range(["#A07A19", "#AC30C0", "#EB9A72", "#BA86F5", "#EA22A8"]);
          const color = d3.scaleOrdinal()
            .domain(uniqueOffenses)
            .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), uniqueOffenses.length).reverse())
          // const spectrum = d3.scaleOrdinal(d3.schemeRdYlGn[uniqueOffenses.length]);
          crimeData.forEach((x) => {
            // create a HTML element for each feature
            var el = document.createElement('div');
            el.className = 'marker';
            const {lng, lat} = x.location;
            if (lng && lat) {
              let circle = L.circleMarker([lat, lng], {
                radius: 1,
                fillOpacity: 1,
                fillColor: color(x.OFFENSE),
                color: color(x.OFFENSE),
              });
              organizedCrime[x.OFFENSE] = organizedCrime[x.OFFENSE] || [];
              organizedCrime[x.OFFENSE].push(circle);
              // circle.addTo(map);
            }
          })
          console.log(organizedCrime);
          Object.keys(organizedCrime).forEach((key) => {
            L.layerGroup(organizedCrime[key])
              .on('click', function() { L.Layer.remove() })
              .addTo(map);
          })
        // })
      });
    }
  },
  mounted() {
    this.loadData();
    this.setup();
  }
}
</script>
