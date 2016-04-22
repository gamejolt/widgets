let Vue = require( 'vue' );
let VueValidator = require( 'vue-validator' );

// We need to register the validator before we import app components.
Vue.use( VueValidator );

let App = require( './components/app/app.vue' );

require( './main.styl' );
require( 'hint.css/hint.base.css' );

let vue = new Vue( {
	el: 'body',
	components: {
		App,
	},
} );
