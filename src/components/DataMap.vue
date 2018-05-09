<template>
  <div>
    <div id="progress"><div id="progress-bar"></div></div>
    <div id='map'></div>
  </div>

</template>

<script>
import * as d3 from 'd3';
import 'leaflet';
import 'leaflet.markercluster';
import 'leaflet.markercluster.layersupport';
// import '../../static/js/jquery-1.9.1.min.js'
// import '../../static/js/jquery-ui.js'
// import '../../static/js/leaflet.SliderControl.min.js'

export default {
  props: ['dataFeatures'],
  data() {
    return {
      map: null,
      crimeData: null,
      layers: {},
      dateRange: [],
    }
  },
  methods: {
    updateProgressBar(processed, total, elapsed, layersArray) {
      const progress = document.getElementById('progress');
      const progressBar = document.getElementById('progress-bar');
      if (elapsed > 1000) {
        // if it takes more than a second to load, display the progress bar:
        progress.style.display = 'block';
        progressBar.style.width = Math.round(processed/total*100) + '%';
      }
      if (processed === total) {
        // all markers processed - hide the progress bar:
        progress.style.display = 'none';
      }
    },
    addData(dataFeatures) {
      return new Promise((resolve, reject) => {
        const map = this.map;
        // const pointList = [];
        const mcgLayerSupportGroup = L.markerClusterGroup.layerSupport({
          chunkedLoading: true,
          chunkInterval: 100,
          chunkProgress: this.updateProgressBar,
          showCoverageOnHover: false,
        });
        const control = L.control.layers(null, null, {
          collapsed: false,
          sortLayers: true,
          hideSingleBase: true,
          sortFunction: (layerA, layerB, nameA, nameB)  => {
            return dataFeatures[nameB].length - dataFeatures[nameA].length;
          },
        });

        const uniqueOffenses = Object.keys(dataFeatures);
        const timeFormat = d3.timeFormat("%a %b %e, %Y");
        const colorPicker = d3.scaleOrdinal()
          .domain(uniqueOffenses)
          .range(d3.quantize(t => d3.interpolateRainbow(t), uniqueOffenses.length));

        const myLayerGroups = uniqueOffenses.map((x) => {
          return L.geoJSON(dataFeatures[x], {
            pointToLayer: function (feature, latlng) {
              return L.circleMarker(latlng, {
                  radius: 4,
                  color: colorPicker(feature.properties.OFFENSE),
                  weight: 4,
                  opacity: 1,
                  fillOpacity: 0.8
              });
            },
            onEachFeature: function (feature, layer) {
              let popupText = 'OFFENSE: ' + feature.properties.OFFENSE;
              popupText += '<br/>REPORTDATE: ' + timeFormat(new Date(feature.properties.REPORTDATE));
              popupText += '<br/>BLOCKADD: ' + feature.properties.BLOCKADD;
              layer.bindTooltip(popupText);
            }
          });
        });


        mcgLayerSupportGroup.addTo(map);
        mcgLayerSupportGroup.checkIn(myLayerGroups);
        myLayerGroups.forEach((group, index) => {
          control.addOverlay(group, uniqueOffenses[index]);
        })
        control.addTo(map);
        myLayerGroups.forEach((group) => {
          group.addTo(map);
        })
        map.addLayer(mcgLayerSupportGroup);

        // const sliderControl = L.control.sliderControl({
        //   position: "topleft",
        //   layer: myLayerGroups[0],
        //   range: true,
        //   timeAttribute:"REPORTDATE"
        // });
        //
        // //Make sure to add the slider to the map ;-)
        // map.addControl(sliderControl);
        // //And initialize the slider
        // sliderControl.startSlider();
        return resolve()
      })

    },
    initMap() {
      return new Promise((resolve, reject) => {
        this.map = L.map('map').setView([40.025647, -105.257869], 12.14);
        //add choice base tiles - background map of Lyon
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
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
                }
            }).bindTooltip(function (layer) {
                return layer.feature.properties.SUBCOM;
            }).addTo(this.map);
          })
          .catch(reject)
          return resolve();
      })
    },
  },
  mounted() {
    this.initMap()
    .then(this.addData(this.dataFeatures))
    .then(() => console.log('success'))
    .catch((e) => console.log(e));
  }
}
</script>

<style lang="scss">
  @import '../assets/css/MarkerCluster.Default.css';
  @import '../assets/css/MarkerCluster.css';
  /* @import '../assets/css/jquery-ui.css'; */
</style>
