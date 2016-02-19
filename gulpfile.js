var config = {
	// staticCdn: '//help.gamejolt.com',
	widgets: [
		'sale',
	],
};

var argv = require( 'minimist' )( process.argv );
var gulp = require( 'gulp' );
var gutil = require( 'gulp-util' );
var plugins = require( 'gulp-load-plugins' )();
var sequence = require( 'run-sequence' );

config.watching = false;
config.production = argv.production || false;
config.buildDir = 'build';

gulp.task( 'clean', function()
{
	return gulp.src( config.buildDir, { read: false } )
		.pipe( plugins.clean( { force: true } ) )
} );

require( './tasks/styles.js' )( config );
require( './tasks/js.js' )( config );
require( './tasks/html.js' )( config );
// require( './fonts.js' )( config );
require( './tasks/images.js' )( config );
// require( './inject.js' )( config );
require( './tasks/watch.js' )( config );

gulp.task( 'default', function( callback )
{
	return sequence( 'clean', [ 'styles', 'js', 'images', 'html' ], /*'inject',*/ callback );
} );
