import Vue from 'vue';

import '../imports/ui/plugins';
import VueRouter from 'vue-router';
import routes from '../imports/ui/routes.js';

import App from '../imports/ui/App.vue';
import VueMeteorTracker from 'vue-meteor-tracker';
import vmodal from 'vue-js-modal';
Vue.use(vmodal);
Vue.use(VueMeteorTracker);
Vue.use(VueRouter);
const router = new VueRouter({
  routes,
});
Meteor.startup(() => {
  new Vue({
    router,
    el: '#app',
    ...App,
  });
});
