<template>
  <div id='dataviz'>
    <div class="left">
      <div class="wrapper">
        <data-filter/>
      </div>
    </div>
    <data-map class="right"/>
  </div>
</template>

<script>
import DataFilter from '../components/DataFilter';
import DataMap from '../components/DataMap';

export default {
  name: 'Dataviz',
  components: {
    DataMap,
    DataFilter,
  },
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
</style>
