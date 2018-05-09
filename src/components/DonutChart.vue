<template lang="html">
  <div id="donut-chart"></div>
</template>

<script>
import * as d3 from 'd3';

export default {
  props: ['donutData'],
  data() {
    return {
      vis: {},
      variable: 'offense',
      activeOffense: null,
    }
  },
  methods: {
    initVis() {
      var vis = this.vis;

      vis.margin = { left:0, right:0, top:0, bottom:0 };
      vis.width = 250 - vis.margin.left - vis.margin.right;
      vis.height = 250 - vis.margin.top - vis.margin.bottom;
      vis.radius = Math.min(vis.width, vis.height) / 2;

      vis.pie = d3.pie()
        .padAngle(0.03)
        .value(function(d) { return d.data; })
        .sort(null);

      vis.arc = d3.arc()
        .innerRadius(vis.radius - 60)
        .outerRadius(vis.radius - 30);

      vis.svg = d3.select('#donut-chart')
          .append("svg")
          .attr("width", vis.width + vis.margin.left + vis.margin.right)
          .attr("height", vis.height + vis.margin.top + vis.margin.bottom);
      vis.g = vis.svg.append("g")
          .attr("transform", "translate(" + (vis.margin.left + (vis.width / 2)) +
              ", " + (vis.margin.top + (vis.height / 2)) + ")");

      vis.g.append("text")
          .attr("y", -vis.height/2)
          .attr("x", -vis.width/2)
          .attr("font-size", "15px")
          .attr("text-anchor", "start");

      this.wrangleData();
    },
    wrangleData() {
      const vis = this.vis;
      // vis.activeCoin = $("#coin-select").val();
      this.updateVis();
    },
    updateVis() {
      const vis = this.vis;
      const uniqueOffenses = this.donutData.map(x => x.offense);
      const color = d3.scaleOrdinal()
        .domain(uniqueOffenses)
        .range(d3.quantize(t => d3.interpolateRainbow(t), uniqueOffenses.length));

      const totalCrimes = d3.sum(this.donutData.map(x => x.data));
      const formatter = d3.format(".2%")
      const activeOffense = this.activeOffense;
      const div = d3.select("body").append("div").attr("class", "toolTip");

      vis.path = vis.g.selectAll("path");

      vis.data0 = vis.path.data();
      vis.data1 = vis.pie(this.donutData);

      // JOIN elements with new data.
      vis.path = vis.path.data(vis.data1, key);

      // EXIT old elements from the screen.
      vis.path.exit()
        .datum(function(d, i) {
          return findNeighborArc(i, vis.data1, vis.data0, key) || d;
        })
        .transition()
        .duration(750)
        .attrTween("d", arcTween)
        .remove();

      // UPDATE elements still on the screen.
      vis.path.transition()
        .duration(750)
        .attrTween("d", arcTween)
        .attr("fill-opacity", (d) => {
          return (d.data.offense === activeOffense) ? 1 : 0.3;
        })

      // ENTER new elements in the array.
      vis.path.enter()
        .append("path")
        .each(function(d, i) {
          this._current = findNeighborArc(i, vis.data0, vis.data1, key) || d;
        })
        .attr("fill", function(d) {
          return color(d.data.offense)
        })
        .attr("fill-opacity", function(d) {
          return (d.data.offense === activeOffense) ? 1 : 0.3;
        })
        .on("mousemove", (d) => {
            div.style("left", d3.event.pageX+10+"px");
            div.style("top", d3.event.pageY-25+"px");
            div.style("display", "inline-block");
            div.html(`${d.data.offense}<br>${formatter((d.data.data / totalCrimes))}`);
          })
        .on("mouseout", (d) => {
            div.style("display", "none");
          })
        .on("click", this.arcClicked)
        .transition()
        .duration(750)
        .attrTween("d", arcTween);

      function key(d) {
        return d.data.offense;
      }

      function findNeighborArc(i, data0, data1, key) {
        var d;
        return (d = findPreceding(i, vis.data0, vis.data1, key)) ? {
            startAngle: d.endAngle,
            endAngle: d.endAngle
          } :
          (d = findFollowing(i, vis.data0, vis.data1, key)) ? {
            startAngle: d.startAngle,
            endAngle: d.startAngle
          } :
          null;
      }

      // Find the element in data0 that joins the highest preceding element in data1.
      function findPreceding(i, data0, data1, key) {
        var m = vis.data0.length;
        while (--i >= 0) {
          var k = key(vis.data1[i]);
          for (var j = 0; j < m; ++j) {
            if (key(vis.data0[j]) === k) return vis.data0[j];
          }
        }
      }

      // Find the element in data0 that joins the lowest following element in data1.
      function findFollowing(i, data0, data1, key) {
        var n = vis.data1.length,
          m = vis.data0.length;
        while (++i < n) {
          var k = key(vis.data1[i]);
          for (var j = 0; j < m; ++j) {
            if (key(vis.data0[j]) === k) return vis.data0[j];
          }
        }
      }

      function arcTween(d) {
        var i = d3.interpolate(this._current, d);
        this._current = i(1)
        return function(t) {
          return vis.arc(i(t));
        };
      }

    },
    arcClicked(arc){
      this.activeOffense = arc.data.offense;
      console.log("SELECT", arc.data.offense);
      this.wrangleData();
    },
  },
  mounted() {
    //do something after mounting vue instance
    this.initVis()
  }
}
</script>

<style>
path {
  cursor: pointer;
}

.toolTip {
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    position: absolute;
    display: none;
    width: auto;
    height: auto;
    background: none repeat scroll 0 0 white;
    border: 0 none;
    border-radius: 8px 8px 8px 8px;
    box-shadow: -3px 3px 15px #888888;
    color: black;
    font: 12px sans-serif;
    padding: 5px;
    text-align: center;
}
</style>
