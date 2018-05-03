<template>
  <div id='map'></div>
</template>

<script>
import * as d3 from 'd3';
import L from 'leaflet';

export default {
  data() {
    return {
      map: null,
      crimeData: null,
      layers: {},
      dateRange: [],
    }
  },
  methods: {
    sortByDate(dataset, dateKey) {
      return dataset.sort(function(a, b){
        var keyA = new Date(a[dateKey]),
            keyB = new Date(b[dateKey]);
        // Compare the 2 dates
        if(keyA < keyB) return -1;
        if(keyA > keyB) return 1;
        return 0;
      });
    },
    getUnique(dataset, key) {
      // get offense categories
      const uniqueArr = dataset.reduce((acc, elem) => {
        const value = elem[key];
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
          // filter out data that doesn't have location coordinates
          const filteredData = data.filter(x => x.location !== 'timeout');
          return resolve(filteredData);
        }).catch((err) => {
          reject(err);
        });
      });
    },
    initMap() {
      this.map = L.map('map').setView([40.025647, -105.257869], 12.14);
      //add choice base tiles - background map of Lyon
      L.tileLayer('http://{s}.tile.stamen.com/toner-lite/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.map);

      d3.json('static/data/Subcomm.GeoJSON')
        .then((cityData) => {
          const subcoms = cityData.features.map(x => x.properties.SUBCOM);
          const color = d3.scaleOrdinal()
            .domain(subcoms)
            .range(d3.quantize(t => d3.interpolateGreys(t * .7 + 0.5), subcoms.length).reverse())

          L.geoJSON(cityData, {
              style: function (feature) {
                return { weight: 2, fillColor: '#808080', color: '#0080ff' };
                  // return {color: feature.properties.color};
              }
          }).bindTooltip(function (layer) {
              return layer.feature.properties.SUBCOM;
          }).addTo(this.map);
        });
    },
    setup() {
      this.loadData().then((res) => {
        // map.on('load', function () {
          const organizedCrime = {};
          this.crimeData = this.sortByDate(res, 'REPORTDATE');
          this.dateRange = d3.extent(this.crimeData, d => d.REPORTDATE)

          const uniqueOffenses = this.getUnique(this.crimeData, 'OFFENSE');
          const color = d3.scaleOrdinal()
            .domain(uniqueOffenses)
            .range(d3.quantize(t => d3.interpolateWarm(t * 0.8 + 0.3), uniqueOffenses.length))
          // const spectrum = d3.scaleOrdinal(d3.schemeRdYlGn[uniqueOffenses.length]);
          this.crimeData.forEach((x) => {
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
            }
          })
          console.log(organizedCrime);
          Object.keys(organizedCrime).forEach((key) => {
            this.layers[key] = L.layerGroup(organizedCrime[key])
              .on('click', function() { L.Layer.remove() })
              .addTo(this.map);
          })
          L.control.layers(this.layers, null, {
            collapsed: false,
            sortLayers: true,
            sortFunction: (layerA, layerB, nameA, nameB)  => {
              return organizedCrime[nameB].length - organizedCrime[nameA].length;
            }
          }).addTo(this.map);
        // })
      });
    }
  },
  mounted() {
    this.initMap();
    this.setup();
  }
}
</script>
