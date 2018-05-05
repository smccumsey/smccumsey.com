<template lang="html">
  <vue-slider
  @callback="onSlide"
  v-model="value">
    <div class="diy-tooltip" slot="tooltip" slot-scope="{ value }">
      {{ getFormatedDate(value) }}
    </div>
  </vue-slider>
</template>

<script>
import vueSlider from 'vue-slider-component';
import * as d3 from 'd3';

export default {
  name: 'DataFilter',
  components: {
    vueSlider,
  },
  data() {
    return {
      min: 0,
      max: 100,
      myDateRange: [new Date(2008,0,1), new Date(2018,0,11)], // TODO: update to actual date range
      mySlideRange: [0, 100],
      value: [0, 100],
    }
  },
  computed: {
    timeScale() {
      return d3.scaleTime()
        .domain(this.myDateRange)
        .range(this.mySlideRange);
    },
    invertedScale() {
      return this.value.map(x => this.timeScale.invert(x))
    }
  },
  methods: {
    getFormatedDate(x) {
      const formatter = d3.timeFormat("%m/%d/%Y");
      return formatter(this.timeScale.invert(x));
    },
    getDaysBetween() {
      const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
      const firstDate = this.myDateRange[0];
      const secondDate = this.myDateRange[1];

      const diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));
    },
    onSlide() {
      console.log('sliiiiidee', this.value.map(x => this.timeScale.invert(x)))
    },
  },
}
</script>

<style lang="css">
</style>
