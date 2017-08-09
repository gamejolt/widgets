import '../lib/gj-lib-client/utils/polyfills';
import './main.styl';

import Vue from 'vue';
import * as VeeValidate from 'vee-validate';

import { store } from './store/index';
import { Payload } from '../lib/gj-lib-client/components/payload/payload-service';
import { App } from './app';

const VueGettext = require('vue-gettext');

Vue.use(VeeValidate);
Vue.use(VueGettext, {
	silent: true,
	translations: {},
});

Payload.init(store);

new Vue({
	el: '#app',
	store,
	render: h => h(App),
});
