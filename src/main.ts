import * as Vue from 'vue';
let vueValidator = require( 'vue-validator' );

// We need to register the validator before we import app components.
Vue.use( vueValidator );

let app = require( './components/app/app.vue' );

import './main.styl';
import 'hint.css/hint.base.css';

new Vue( {
	el: 'body',
	components: {
		App: app,
	},
} );
