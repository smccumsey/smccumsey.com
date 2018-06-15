<template>
  <div>
    <div id="dataviz" v-if="geoData">
      <div class="left">
        <div class="wrapper">

          <div class="info">
            <a target="_blank" href="https://bouldercolorado.gov/open-data/crime-locations/">
              <h4>Crime location data for the City of Boulder</h4>
            </a>
            <p>Date Range: {{ dateRange[0] | formatDate }} - {{ dateRange[1] | formatDate }}</p>
          </div>

          <div id="crime-table">
            <v-client-table
              :data="tableData"
              :columns="columns"
              :options="options"
              @row-click="updateActiveOffense">
                <div
                slot="color"
                slot-scope="props"
                class="swatch"
                :style="{background: props.row.color}"></div>
              <!-- <a slot="color" slot-scope="props" :href="edit(props.row.id)"></a> -->
            </v-client-table>
          </div>
          <!-- <donut-chart
            class="pie-chart"
            :donutData="donutData"
            :colorPicker="colorPicker"
            @selectOffense="updateActiveOffense"/>

          <line-chart
            class="line-chart"
            :lineData="lineData"
            :colorPicker="colorPicker"
            :activeOffense="activeOffense"/> -->

        </div>
      </div>
      <geo-chart
        class="right"
        :geoData="geoData"
        :colorPicker="colorPicker"
        :activeOffense="activeOffense"/>
    </div>
    <div id="loader" v-else>
      <div class="box"></div>
      <div class="box"></div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import * as d3 from 'd3';

import GeoChart from '../components/GeoChart';
import DonutChart from '../components/DonutChart';
import LineChart from '../components/LineChart';
import { ClientTable } from 'vue-tables-2';

import 'bulma';

Vue.use(ClientTable, {}, false, 'bulma', 'default');


Array.prototype.simpleSMA=function(N) {
return this.map(
  (el, index, _arr) => {
      return _arr.filter(
      (x2, i2) => {
        return i2 <= index && i2 > index - N;
        })
      .reduce(
      (current, last, index, arr) => {
        return (current + last);
        })/index || 1;
      });
};

export default {
  name: 'Dataviz',
  components: {
    GeoChart,
    DonutChart,
    LineChart
  },
  data() {
    return {
      geoData: null,
      donutData: null,
      lineData: null,
      uniqueOffenses: [],
      dateRange: [],
      activeOffense: 'Vandalism',
      columns: ['color', 'name', 'percent'],
      tableData: [],
      uniqueKey: 'id',
      options: {
        perPage: 35,
        perPageValues: [],
        filterable: false,
        skin: 'table is-hoverable',
        orderBy: {
          column: 'percent',
        },
        pagination: {
          dropdown: false,
          edge: false,
        },
      },
    };
  },
  computed: {
    sortedOffenses() {
      return this.uniqueOffenses.concat().sort();
    },
  },
  methods: {
    updateActiveOffense(rowClick) {
      const newOffense = rowClick.row.name;
      const rows = document.querySelectorAll('#crime-table tr');
      const clickedRow = rowClick.event.target.closest('tr');
      // remove 'is-selected' class from all rows
      rows.forEach(r => r.classList.remove('is-selected'))
      // add the 'is-selected' class to the clicked row
      clickedRow.classList.add('is-selected');

      // debugger;
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
    parseGeoJson(features) {
      const groupedData = {};
      const parseTime = d3.timeParse("%Y/%m/%d");
      // dataFeatures.forEach((d) => {
      //   d.properties.REPORTDATE = parseTime(d.properties.REPORTDATE);
      // });
      features.forEach((d) => {
        d.properties.REPORTDATE = parseTime(d.properties.REPORTDATE);
        groupedData[d.properties.OFFENSE] = groupedData[d.properties.OFFENSE] || [];
        groupedData[d.properties.OFFENSE].push(d);
      });

      this.dateRange = d3.extent(features, (d) => d.properties.REPORTDATE.getTime())
                         .map(d => new Date(d));

      this.uniqueOffenses = Object.keys(groupedData);

      this.colorPicker = d3.scaleOrdinal()
        .domain(this.uniqueOffenses)
        .range(d3.quantize(t => d3.interpolateRainbow(t), this.uniqueOffenses.length));

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
        const count = this.countOffenses(dataGroup); // { date: count }
        const output = days.map((d) => {
          return {
            date: d,
            offenseCount: count.hasOwnProperty(d) ? count[d] :0,
          }
        });
        // compute a moving average of the output
        const simple = output.map(x => x.offenseCount);
        const simpleSMA = simple.simpleSMA(2);
        newData[offense] = output.map((x, i) => {
          return {
            date: x.date,
            offenseCount: simpleSMA[i] !== Infinity ? simpleSMA[i] : 0,
          }
        });
      });
      return newData;
    },
  },
  created() {
    this.loadData()
    .then((groupedData) => {
      // set data for charts
      this.geoData = groupedData;
      // this.donutData = Object.keys(groupedData).map(key => {
      //   return { offense: key, data: groupedData[key].length };
      // })

      const totalCrimes = Object.values(groupedData).reduce((acc, elem) => {
        acc += elem.length;
        return acc;
      }, 0)
      // const offensePercents = Object.keys(groupedData).map(key => {
      //   return { offense: key, data: (groupedData[key].length / totalCrimes) };
      // })
      this.tableData = this.uniqueOffenses.map((offense, i) => {
        return {
          id: i,
          color: this.colorPicker(offense),
          name: offense,
          percent: +((groupedData[offense].length / totalCrimes) * 100).toFixed(2),
        }
      })
      // this.lineData = this.genLineData(groupedData);

      console.log('success')
    })
    .catch((e) => console.log(e));
  },
  filters: {
    formatDate: function (value) {
      if (!value) return '';
      return d3.timeFormat("%m/%d/%y")(new Date(value));
    },
    formatPercent: function (value) {
      if (!value) return '';
      const formatter = d3.format(".2%");
      return formatter(value);
    }
  }
}
</script>

<style lang="scss">
  #dataviz {
    height: 100%;
    display: flex;
    color: #383838;
    fill: #383838;
  }

  .left {
    flex: 0 0 30%;
  }
  .right {
    flex: 0 0 70%;
  }

  .wrapper {
    margin: 20px;
    display: flex;
    flex-flow: row wrap;
    justify-content: space-evenly;
  }

  #map {
    /* float: right; */
    height: 100%;
  }
  .marker {
    background: black;
    background-size: cover;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    cursor: pointer;
  }

  .info {
    padding: 10px;
    text-align: center;
    /* box-shadow: inset 0 0 10px #000000; */
    font-size: 12px;
  }

  .info a {
    text-decoration: underline;
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
    /* display: inline-block; */
    width: 100%;
    height: 100%;
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

  /* table */
  #crime-table {
    font-size: .8rem;
  }

  #crime-table tr {
    cursor: pointer;
  }

  #crime-table td {
      height: 12pt;
    }
//   td {
//     height: 12pt;
//   }
//   table {
//     border-collapse: collapse;
//   }
//   tr {
//     border: 1px solid grey;
//   }
//   th {
//     text-align: left;
//   }
//
//   th, td {
//     border-right: 1px solid grey;
//   }
//
// .VuePagination {
//   text-align: center;
// }
//
// .vue-title {
//   text-align: center;
//   margin-bottom: 10px;
// }
//
// .vue-pagination-ad {
//   text-align: center;
// }
//
// .glyphicon.glyphicon-eye-open {
//   width: 16px;
//   display: block;
//   margin: 0 auto;
// }
//
// th:nth-child(3) {
//   text-align: center;
// }
//
// .VueTables__child-row-toggler {
//   width: 16px;
//   height: 16px;
//   line-height: 16px;
//   display: block;
//   margin: auto;
//   text-align: center;
// }
//
// .VueTables__child-row-toggler--closed::before {
//   content: "+";
// }
//
// .VueTables__child-row-toggler--open::before {
//   content: "-";
// }

$duration: 4s;

.box {
  background:
  radial-gradient(circle farthest-side at 0% 50%,#fb1 23.5%,rgba(240,166,17,0) 0)21px 30px,
  radial-gradient(circle farthest-side at 0% 50%,#B71 24%,rgba(240,166,17,0) 0)19px 30px,
  linear-gradient(#fb1 14%,rgba(240,166,17,0) 0, rgba(240,166,17,0) 85%,#fb1 0)0 0,
  linear-gradient(150deg,#fb1 24%,#B71 0,#B71 26%,rgba(240,166,17,0) 0,rgba(240,166,17,0) 74%,#B71 0,#B71 76%,#fb1 0)0 0,
  linear-gradient(30deg,#fb1 24%,#B71 0,#B71 26%,rgba(240,166,17,0) 0,rgba(240,166,17,0) 74%,#B71 0,#B71 76%,#fb1 0)0 0,
  linear-gradient(90deg,#B71 2%,#fb1 0,#fb1 98%,#B71 0%)0 0 #fb1;
  background-size:40px 60px;
  height: 1em;
  width: 1em;
  font-size: 10vmin;
  position: absolute;
  top: 50%;
  left: 50%;
  margin: -.5em;
  margin-left: -1em;
  transform-origin: top right;

  animation: box-flip $duration ease-in-out infinite;

  &:nth-child(2) {
    animation-delay: #{$duration / -2};
  }
}

@keyframes box-flip {
  #{percentage(1/6)} {
    transform: rotate(0);
  }
  #{percentage(2/6)} {
    transform: rotate(.5turn);
  }
  #{percentage(3/6)} {
    transform: rotate(.5turn);
  }
  #{percentage(4/6)} {
    transform: rotate(.75turn);
  }
  #{percentage(5/6)} {
    transform: rotate(.75turn);
  }
  #{percentage(6/6)} {
    transform: rotate(1turn);
  }
}
</style>
