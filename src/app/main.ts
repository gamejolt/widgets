import '../lib/gj-lib-client/utils/polyfills';
import * as Vue from 'vue';
const VeeValidate = require( 'vee-validate' );

import { store } from './store/index';
import { Payload } from '../lib/gj-lib-client/components/payload/payload-service';
import { App } from './app';
import { Referrer } from '../lib/gj-lib-client/components/referrer/referrer.service';

Vue.use( VeeValidate );

Payload.initVue( store );
Referrer.init();

new Vue( {
	el: '#app',
	store,
	render: ( h ) => h( App ),
} );
