<template>
  <div>
    <h2>DataViz</h2>
    <div id="plot"></div>
  </div>
</template>

<script>
import * as d3 from 'd3'
export default {
  data() {
    return {
      margin: {
        top: 50,
        bottom: 50,
        right: 50,
        left: 50,
      },
      width: 500 - 100,
      height: 400 - 100,
    }
  },
  methods: {
    loadData() {
      d3.csv('./static/data/CrimeLocations.csv', (data) => {
        console.log(data);
      });
    },
    setup() {
      // Setup root SVG
      const g = d3.select('#plot')
        .append('svg')
        .attr('width', this.width + this.margin.right + this.margin.left)
        .attr('height', this.height + this.margin.top + this.margin.bottom)
        .append('g')
          .attr('transform', `translate(${this.margin.left},${this.margin.top})`);
      // Title label
      const title = g.append("text")
        .attr("x", (this.width / 2))
        .attr("y", 0 - (this.margin.top / 4))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("text-decoration", "underline")
        .text("(year)");
    },
  },
  mounted() {
    this.loadData();
    this.setup();
  }
}
</script>

<style lang="css">
</style>
