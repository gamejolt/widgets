import '../lib/gj-lib-client/utils/polyfills';
import './main.styl';

import Vue from 'vue';
import * as VeeValidate from 'vee-validate';

import { store } from './store/index';
import { Payload } from '../lib/gj-lib-client/components/payload/payload-service';
import { App } from './app';
import { AppButton } from '../lib/gj-lib-client/components/button/button';
import { AppJolticon } from '../lib/gj-lib-client/vue/components/jolticon/jolticon';

// Common components.
Vue.component('AppButton', AppButton);
Vue.component('AppJolticon', AppJolticon);

const VueGettext = require('vue-gettext');

Vue.use(VeeValidate);
Vue.use(VueGettext, {
	silent: true,
	translations: {},
});

// Force tooltips to show even on mobile sizes.
if (!GJ_IS_SSR) {
	const mod = require('v-tooltip');
	mod.default.enabled = true;
}

Payload.init(store);

new Vue({
	el: '#app',
	store,
	render: h => h(App),
});
