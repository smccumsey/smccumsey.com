<template>
  <div>
    <my-header/>
    <router-view></router-view>
    <my-footer/>
  </div>
</template>

<script>
import MyFooter from '@/components/Footer';
import MyHeader from '@/components/Header';

export default {
  components: {
    MyFooter,
    MyHeader,
  },
};
</script>

<style>
.container
{
  margin: 0 40px;
  padding: 100px 0;
  text-align: center;
}

.button, .button:visited
{
  display: inline-block;
  color: black;
  letter-spacing: 1px;
  background-color: #fff;
  border: 2px solid #000;
  text-decoration: none;
  text-transform: uppercase;
  padding: 15px 45px;
}

.button:hover, .button:focus
{
  color: #fff;
  background-color: #000;
}

.title
{
  font-weight: 300;
  font-size: 2.5em;
  margin: 0;
}
</style>
