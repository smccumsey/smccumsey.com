<template lang="html">
  <div id="line-chart"></div>
</template>

<script>
import * as d3 from 'd3';

export default {
  props: ['lineData', 'activeOffense', 'colorPicker'],
  data() {
    return {
      vis: {},
      variable: 'offense',
    }
  },
  methods: {
    initVis() {
      const vis = this.vis;

      vis.margin = { left:80, right:10, top:30, bottom:30 };
      vis.height = 300 - vis.margin.top - vis.margin.bottom;
      vis.width = 600 - vis.margin.left - vis.margin.right;

      vis.svg = d3.select('#line-chart')
          .append("svg")
          .attr("width", vis.width + vis.margin.left + vis.margin.right)
          .attr("height", vis.height + vis.margin.top + vis.margin.bottom);
      vis.g = vis.svg.append("g")
          .attr("transform", "translate(" + vis.margin.left +
              ", " + vis.margin.top + ")");

      vis.t = function() { return d3.transition().duration(1000); }

      vis.bisectDate = d3.bisector(function(d) { return d.date; }).left;

      vis.linePath = vis.g.append("path")
          .attr("class", "line")
          .attr("fill", "none")
          .attr("stroke-width", "3px");

      vis.yLabel = vis.g.append("text")
          .attr("class", "y axisLabel")
          .attr("transform", "rotate(-90)")
          .attr("y", -60)
          .attr("x", -(vis.height / 2))
          .attr("font-size", "20px")
          .attr("text-anchor", "middle")
          .text("Crime Count")

      vis.x = d3.scaleTime().range([0, vis.width]);
      vis.y = d3.scaleLinear().range([vis.height, 0]);

      vis.yAxisCall = d3.axisLeft()
      vis.xAxisCall = d3.axisBottom()
          .ticks(4);
      vis.xAxis = vis.g.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + vis.height +")");
      vis.yAxis = vis.g.append("g")
          .attr("class", "y axis");

      this.wrangleData();
    },
    wrangleData() {
      var vis = this.vis;

      vis.offense = this.activeOffense;
      vis.yVariable = 'offenseCount';

      // Filter data based on selections
      // vis.sliderValues = $("#date-slider").slider("values")
      // vis.dataFiltered = filteredData[vis.offense].filter(function(d) {
      //     return ((d.date >= vis.sliderValues[0]) && (d.date <= vis.sliderValues[1]))
      // })
      vis.dataFiltered = this.lineData[vis.offense];

      this.updateVis();
    },
    updateVis() {
      const vis = this.vis;
      const uniqueOffenses = Object.keys(this.lineData);
      const color = this.colorPicker;


      // Update scales
      vis.x.domain(d3.extent(vis.dataFiltered, function(d) { return d.date; }));
      vis.y.domain([d3.min(vis.dataFiltered, function(d) { return d[vis.yVariable]; }) / 1.005,
          d3.max(vis.dataFiltered, function(d) { return d[vis.yVariable]; }) * 1.005]);
      // vis.y.domain([0,30]);

      // Fix for y-axis format values
      var formatSi = d3.format("d");
      function formatAbbreviation(x) {
        var s = formatSi(x);
        return s;
      }

      // Update axes
      vis.xAxisCall.scale(vis.x);
      vis.xAxis.transition(vis.t()).call(vis.xAxisCall);
      vis.yAxisCall.scale(vis.y);
      vis.yAxis.transition(vis.t()).call(vis.yAxisCall.tickFormat(formatAbbreviation));

      // Discard old tooltip elements
      d3.select(".focus").remove();
      d3.select(".overlay").remove();

      var focus = vis.g.append("g")
          .attr("class", "focus")
          .style("display", "none");

      focus.append("line")
          .attr("class", "x-hover-line hover-line")
          .attr("y1", 0)
          .attr("y2", vis.height);

      focus.append("line")
          .attr("class", "y-hover-line hover-line")
          .attr("x1", 0)
          .attr("x2", vis.width);

      focus.append("circle")
          .attr("r", 5);

      focus.append("text")
          .attr("x", -85)
          .attr("font-size", 12)
          .attr("fill", '#000')
          .attr("dy", ".31em");

      vis.svg.append("rect")
          .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")")
          .attr("class", "overlay")
          .attr("width", vis.width)
          .attr("height", vis.height)
          .on("mouseover", function() { focus.style("display", null); })
          .on("mouseout", function() { focus.style("display", "none"); })
          .on("mousemove", mousemove);

      function mousemove() {
          var x0 = vis.x.invert(d3.mouse(this)[0]),
              i = vis.bisectDate(vis.dataFiltered, x0, 1),
              d0 = vis.dataFiltered[i - 1],
              d1 = vis.dataFiltered[i],
              d = (d1 && d0) ? (x0 - d0.date > d1.date - x0 ? d1 : d0) : 0;
          focus.attr("transform", "translate(" + vis.x(d.date) + "," + vis.y(d[vis.yVariable]) + ")");
          focus.select("text").text(function() {
            const count = d3.format(",")(d[vis.yVariable].toFixed(2));
            const date = d3.timeFormat("%m/%d/%y")(d.date);
            return `${date} (${count})`;
          });
          focus.select(".x-hover-line").attr("y2", vis.height - vis.y(d[vis.yVariable]));
          focus.select(".y-hover-line").attr("x2", -vis.x(d.date));
      }

      // Update y-axis label
      vis.yLabel.text(`${vis.offense} Count`)

      var line = d3.line()
          .curve(d3.curveBasis)
          .x(function(d) { return vis.x(d.date); })
          .y(function(d) { return vis.y(d[vis.yVariable]); });

      vis.g.select(".line")
          .attr("stroke", color(vis.offense))
          .transition(vis.t)
          .attr("d", line(vis.dataFiltered));
    },
  },
  mounted() {
    //do something after mounting vue instance
    this.initVis()
  },
  watch: {
    // whenever question changes, this function will run
    activeOffense: function () {
      this.wrangleData()
    }
  },
}
</script>

<style lang="css">
.axis {
  font: 10px sans-serif;
}

.axis path,
.axis line {
  fill: none;
  stroke: #D4D8DA;
  stroke-width: 2px;
  shape-rendering: crispEdges;
}

.line {
  fill: none;
  stroke-width: 1px;
}

.overlay {
  fill: none;
  pointer-events: all;
}

.focus circle {
  fill: #F1F3F3;
  stroke: #777;
  stroke-width: 3px;
}

.hover-line {
  stroke: #777;
  stroke-width: 2px;
  stroke-dasharray: 3,3;
}
</style>
