<template>
  <div id='dataviz'>
    <data-map/>
  </div>
</template>

<script>
import DataFilter from '../components/DataFilter';
import DataMap from '../components/DataMap';

export default {
  name: 'Dataviz',
  components: {
    DataMap,
    DataFilter
  }
}
</script>

<style>
  #dataviz {
    height: 100%;
  }
  #map {
    float: right;
    height: 100vh;
    width: 70%;
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
