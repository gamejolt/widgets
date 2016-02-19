var gulp = require( 'gulp' );
var gutil = require( 'gulp-util' );
var plugins = require( 'gulp-load-plugins' )();
var sequence = require( 'run-sequence' );

module.exports = function( config )
{
	gulp.task( 'html', function()
	{
		return gulp.src( [ 'src/*/*.html' ], { base: 'src' } )
			.pipe( gulp.dest( config.buildDir ) )
			.pipe( plugins.connect.reload() )
	} );
};
