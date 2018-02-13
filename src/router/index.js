import Vue from 'vue';
import Router from 'vue-router';
import Default from '@/layouts/default';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Default',
      component: Default,
    },
  ],
});
