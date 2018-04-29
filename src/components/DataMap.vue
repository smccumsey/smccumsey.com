<template>
  <div id='map'></div>
</template>

<script>
import * as d3 from 'd3'
// import
import { OpenStreetMapProvider } from 'leaflet-geosearch';

/* eslint-disable max-len */
const mb = `pk.eyJ1Ijoic21jY3Vtc2V5IiwiYSI6ImNqZ2lyem1ucDBxYnQycXBxOTV2eWRlYmoifQ.rPD4wTlJ2zWXBMyu1VEUkA`
/* eslint-enable max-len */

var MapboxClient = require('mapbox');
var client = new MapboxClient(mb);

// setup
const provider = new OpenStreetMapProvider();

export default {
  data() {
    return {
      crimeData: null,
    }
  },
  methods: {
    getLocation(input) {
      // search
      const results = provider.search({ query: input.value });
    },
    loadData() {
      return new Promise((resolve, reject) => {
        const parseTime = d3.timeParse("%Y-%m-%d");
        d3.json("./static/data/geocodedData.json", function(d) {
          return {
            date: parseTime(d.REPORTDATE.split(' ')[0]), // convert "Year" column to Date
            id: d.FID,
            address: d.BLOCKADD,
            offense: d.OFFENSE // convert "Length" column to number
          };
        }).then(function(data) {
          const isObject = (t) => { return Object.prototype.toString.call(t); };
          return resolve(data.filter(x => isObject(x.location)));
        }).catch((err) => {
          reject(err);
        });
      });
    },
    setup() {
      var mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');

      mapboxgl.accessToken = `
pk.eyJ1Ijoic21jY3Vtc2V5IiwiYSI6ImNqZ2lyem1ucDBxYnQycXBxOTV2eWRlYmoifQ.rPD4wTlJ2zWXBMyu1VEUkA`;
      var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v10',
        center: [-105.257869, 40.025647],
        zoom: 12.14,
      });
      debugger;

      map.on('load', function () {
          map.addLayer({
              'id': 'population',
              'type': 'circle',
              'source': {
                  type: 'vector',
                  url: 'mapbox://examples.8fgz4egr'
              },
              'source-layer': 'sf2010',
              'paint': {
                  // make circles larger as the user zooms from z12 to z22
                  'circle-radius': {
                      'base': 1.75,
                      'stops': [[12, 2], [22, 180]]
                  },
                  // color circles by ethnicity, using a match expression
                  // https://www.mapbox.com/mapbox-gl-js/style-spec/#expressions-match
                  'circle-color': [
                      'match',
                      ['get', 'ethnicity'],
                      'White', '#fbb03b',
                      'Black', '#223b53',
                      'Hispanic', '#e55e5e',
                      'Asian', '#3bb2d0',
                      /* other */ '#ccc'
                  ]
              }
          });
      });

      this.loadData().then((res) => {
        const crimeData = res;
        res.forEach((x) => {
          // create a HTML element for each feature
          var el = document.createElement('div');
          el.className = 'marker';
          const {lng, lat} = x.location;
          if (lng && lat) {
            const latlng = new mapboxgl.LngLat(lng, lat);
            // make a marker for each feature and add to the map
            new mapboxgl.Marker(el)
            .setLngLat(latlng)
            .addTo(map);
          }
        })
      });
    }
  },
  mounted() {
    this.loadData();
    this.setup();
  }
}
</script>

<style lang="css">
#map {
  position: absolute;
  height: 100%;
  width: 100%;
}
.marker {
  background: black;
  background-size: cover;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  cursor: pointer;
}
</style>
