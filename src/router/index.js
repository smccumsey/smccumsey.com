import Vue from 'vue';
import Router from 'vue-router';
import Default from '@/layouts/default';
import Index from '@/pages/index';
// import Eugene from '@/pages/eugene';
import DataViz from '@/pages/dataviz';
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
        // {
        //   path: 'eugene',
        //   component: Eugene,
        // },
        {
          path: 'dataviz',
          component: DataViz,
        },
        {
          path: 'admin',
          component: Admin,
        },
      ],
    },
  ],
});
