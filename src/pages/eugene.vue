<template>
<section class="container">
  <gmap-map
   class="google-map"
   :center="center"
   :zoom="12"
 >
   <gmap-marker
     :key="index"
     v-for="(m, index) in markers"
     :position="m.position"
     :clickable="true"
     :draggable="true"
     @click="center=m.position"
   ></gmap-marker>
 </gmap-map>
</section>
</template>

<script>
import Vue from 'vue';
import * as VueGoogleMaps from 'vue2-google-maps';

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyDzmx25d5VnxRXhRlMsl7bJVoZNMwSGfHw',
    libraries: 'places', // This is required if you use the Autocomplete plugin
    // OR: libraries: 'places,drawing'
    // OR: libraries: 'places,drawing,visualization'
    // (as you require)
  },
});
export default {
  data() {
    return {
      center: { lat: 44.067, lng: -123.0925903 },
      markers: [
        { lat: 44.067, lng: -123.0925903 },
      ]
    };
  },
};
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
}
.google-map {
  width: 100%;
  height: 400px;
}
</style>
