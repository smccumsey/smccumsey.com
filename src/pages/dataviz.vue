<template>
  <div class='grid fill-light'>
  <div class='col12 pad4 center fill-denim dark'>
    Mars Travel
  </div>
  <div class='col12 clearfix'>
    <nav class='col3 pad2'>
      <a class='block' href='#'>Welcome</a>
      <a class='block' href='#'>Where to go</a>
      <a class='block' href='#'>Places to stay</a>
      <a class='block' href='#'>Mars only offers</a>
      <a class='block' href='#'>Book online today</a>
    </nav>
    <div class='col9 pad4 fill-white'>
      <data-map/>
    </div>
  </div>
</div>
  <!-- <div id='dataviz' class='col12 pad4 contain fill-navy dark'>
    <div class='center quiet'></div>

    <div class='col4 pad2 fill-darken1 pin-left'>
      <data-filter/>
    </div>
  </div> -->
</template>

<script>
import DataFilter from '../components/DataFilter';
import DataMap from '../components/DataMap';

export default {
  components: {
    DataMap,
    DataFilter
  }
}
</script>
