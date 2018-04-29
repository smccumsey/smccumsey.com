<template lang="html">
  <ul>
    <li v-for="type in offenses" key="type">
      <input type="checkbox" id="type" name="interest" value="type">
      <label for="type">{{type}}</label>
    </li>
  </ul>
</template>

<script>
export default {
  data() {
    return {
      offenses: ['a', 'b', 'c']
    }
  }
}
</script>

<style lang="css">
</style>
