<template>
  <div id='dataviz' v-if="visData">
    <div class="left">
      <div class="wrapper">

        <div class="info-box">
          <a target="_blank" href="https://bouldercolorado.gov/open-data/crime-locations/">
            <h4>Crime location data for the City of Boulder</h4>
          </a>
          <p>Date Range: {{ dateRange[0] | formatDate }} - {{ dateRange[1] | formatDate }}</p>
          <p>Offense types:</p>
          <ul class="legend">
            <li v-for="(offense, id) in sortedOffenses"
                :key="id">
              <div class="swatch" :style="{background: colorPicker(offense)}"></div>
              <span>{{offense}}</span>
            </li>
          </ul>
        </div>

        <div class="pie-chart">
          <donut-chart
            :donutData="donutData"
            :colorPicker="colorPicker"
            @selectOffense="updateActiveOffense"/>
        </div>

        <div class="line-chart">
          <line-chart
            :lineData="lineData"
            :colorPicker="colorPicker"
            :activeOffense="activeOffense"/>
        </div>

      </div>
    </div>
    <data-map
      class="right"
      :dataFeatures="visData"
      :colorPicker="colorPicker"
      :activeOffense="activeOffense"/>
  </div>
</template>

<script>
import * as d3 from 'd3';

import DataFilter from '../components/DataFilter';
import DataMap from '../components/DataMap';
import DonutChart from '../components/DonutChart';
import LineChart from '../components/LineChart';


export default {
  name: 'Dataviz',
  components: {
    DataMap,
    DataFilter,
    DonutChart,
    LineChart
  },
  data() {
    return {
      visData: null,
      donutData: null,
      lineData: null,
      uniqueOffenses: null,
      dateRange: null,
      activeOffense: 'Vandalism',
    }
  },
  computed: {
    colorPicker() {
      if (!this.uniqueOffenses) return [];
      return d3.scaleOrdinal()
        .domain(this.uniqueOffenses)
        .range(d3.quantize(t => d3.interpolateRainbow(t), this.uniqueOffenses.length));
    },
    sortedOffenses() {
      return this.uniqueOffenses.concat().sort();
    },
  },
  methods: {
    updateActiveOffense(newOffense) {
      this.activeOffense = newOffense;
      const idx = this.uniqueOffenses.indexOf(newOffense);
      const checkboxes = document.querySelectorAll('input[type=checkbox].leaflet-control-layers-selector');
      checkboxes.forEach((x) => {
        const text = x.nextSibling.innerText.trim()
        const selectBox = text === newOffense;
        if (x.checked && selectBox) {
          return
        } else if (x.checked && !selectBox) {
          x.click()
        } else if (!x.checked && selectBox) {
          x.click()
        } else if (!x.checked && !selectBox) {
          return
        } else {
          return;
        }
      });
    },
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

      return { groupedData, sortedData };
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
    countOffenses(arr) {
      // arr is array of offenses
      const res = arr.reduce((obj, v) => {
        // increment or set the property
        // `(obj[v.status] || 0)` returns the property value if defined
        // or 0 ( since `undefined` is a falsy value
        obj[v.properties.REPORTDATE] = (obj[v.properties.REPORTDATE] || 0) + 1;
        // return the updated object
        return obj;
        // set the initial value as an object
      }, {})
      return res;
    },
    genLineData(allData) {
      const [first, last] = this.dateRange;
      const days = d3.timeDay.range(new Date(first), new Date(last));

      const newData = {}

      this.uniqueOffenses.forEach((offense) => {
        const dataGroup = allData[offense];
        const count = this.countOffenses(dataGroup);
        const output = days.map((d) => {
          return {
            date: d,
            offenseCount: count.hasOwnProperty(d.toISOString()) ? count[d.toISOString()] :0,
          }
        });
        newData[offense] = output;
      });
      return newData;
    },
  },
  mounted() {
    this.loadData()
    .then((data) => {
      const { groupedData, sortedData } = data;
      this.uniqueOffenses = Object.keys(groupedData);
      this.dateRange = d3.extent(sortedData, (d) => d.properties.REPORTDATE);

      this.visData = groupedData;
      this.donutData = Object.keys(groupedData).map(key => {
        return { offense: key, data: groupedData[key].length };
      })
      this.lineData = this.genLineData(groupedData);

      console.log('success')
    })
    .catch((e) => console.log(e));
  },
  filters: {
    formatDate: function (value) {
      if (!value) return '';
      return d3.timeFormat("%m/%d/%y")(new Date(value));
    }
  }
}
</script>

<style>
  #dataviz {
    height: 100%;
    display: flex;
    color: #383838;
    fill: #383838;
  }

  .left {
    flex: 0 0 50%;
  }
  .right {
    flex: 0 0 50%;
  }

  .wrapper {
    margin: 20px;
    display: flex;
    flex-flow: row wrap;
    justify-content: space-evenly;
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

  .info-box {
    flex: 0 1 45%;
    border: 1px solid #d0d0d0;
    align-self: flex-start;
    padding: 10px;
    /* box-shadow: inset 0 0 10px #000000; */
    font-size: 12px;
    height: 300px;
  }

  .legend {
    height: 60%;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    list-style-type: none;
    padding: 0;
    margin: 0;
  }
  .swatch {
    display: inline-block;
    width: 5px;
    height: 10px;
  }
  .legend li {
    padding: 2px;
  }

  .pie-chart {
    text-align: center;
    flex: 0 1 50%;
    height: 300px;
  }
  .line-chart {
    text-align: center;
    flex: 0 0 100%;
    height: 350px;
  }

</style>
