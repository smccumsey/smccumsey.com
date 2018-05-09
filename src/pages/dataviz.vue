<template>
  <div id='dataviz' v-if="visData">
    <div class="left">
      <div class="wrapper">
        <div class="pie-chart">
          <donut-chart :donutData="donutData"/>
        </div>
        <data-filter class="slider"/>
        <div class="line-chart"></div>
      </div>
    </div>
    <data-map :dataFeatures="visData" class="right"/>
  </div>
</template>

<script>
import * as d3 from 'd3';

import DataFilter from '../components/DataFilter';
import DataMap from '../components/DataMap';
import DonutChart from '../components/DonutChart';

export default {
  name: 'Dataviz',
  components: {
    DataMap,
    DataFilter,
    DonutChart
  },
  data() {
    return {
      visData: null,
      donutData: null
    }
  },
  methods: {
    sortByDate(dataset, dateKey) {
      const dataClone = JSON.parse(JSON.stringify(dataset))
      return dataClone.sort(function(a, b){
        var keyA = new Date(a.properties[dateKey]),
            keyB = new Date(b.properties[dateKey]);
        // Compare the 2 dates
        if(keyA < keyB) return -1;
        if(keyA > keyB) return 1;
        return 0;
      });
    },
    parseGeoJson(dataFeatures) {
      const parseTime = d3.timeParse("%Y/%m/%d");
      const groupedData = {};

      dataFeatures.forEach((d) => {
        d.properties.REPORTDATE = parseTime(d.properties.REPORTDATE);
      });
      const sortedData = this.sortByDate(dataFeatures, 'REPORTDATE');

      sortedData.forEach((d) => {
        groupedData[d.properties.OFFENSE] = groupedData[d.properties.OFFENSE] || [];
        groupedData[d.properties.OFFENSE].push(d);
      });

      return groupedData;
    },
    loadData() {
      return new Promise((resolve, reject) => {
        d3.json("./static/data/CrimeLocations.GeoJSON")
          .then((data) => {
            const parsedData = this.parseGeoJson(data.features);
            return resolve(parsedData);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
  },
  mounted() {
    this.loadData()
    .then((data) => {
      this.visData = data;
      this.donutData = Object.keys(data).map(key => {
        return { offense: key, data: data[key].length };
      })
      console.log('success')
    })
    .catch((e) => console.log(e));
  }
}
</script>

<style>
  #dataviz {
    height: 100%;
    display: flex;
  }

  .left,
  .right {
    flex: 0 0 50%;
  }

  .wrapper {
    margin: 40px;
    display: flex;
    flex-flow: row wrap;
  }

  #map {
    /* float: right; */
    height: 100vh;
  }
  .marker {
    background: black;
    background-size: cover;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    cursor: pointer;
  }

  .pie-chart {
    flex: 0 0 50%;
    height: 250px;
  }
  .line-chart {
    flex: 0 0 100%;
    height: 50vh;
    background-color: red;
  }
  .slider {
    flex: 0 0 50%;
  }
</style>
