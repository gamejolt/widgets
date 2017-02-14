var gulp = require( 'gulp' );

var config = {
	staticCdn: 'https://s.gjcdn.net/widgets',
	port: 8086,
	framework: 'vue',
};

require( './src/lib/gj-lib-client/gulp/tasks/common.js' )( config, __dirname );
