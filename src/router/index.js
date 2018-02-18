import Vue from 'vue';
import Router from 'vue-router';
import Default from '@/layouts/default';
import Index from '@/pages/index';
import Eugene from '@/pages/eugene';
import Admin from '@/pages/admin';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      component: Default,
      children: [
        {
          path: '',
          component: Index,
        },
        {
          path: 'eugene',
          component: Eugene,
        },
        {
          path: 'admin',
          component: Admin,
        },
      ],
    },
  ],
});
