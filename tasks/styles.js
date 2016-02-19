var gulp = require( 'gulp' );
var gutil = require( 'gulp-util' );
var plugins = require( 'gulp-load-plugins' )();

module.exports = function( config )
{
	var onError = function( err )
	{
		console.log( err );
		this.emit( 'end' );
	};

	gulp.task( 'styles', function()
	{
		return gulp.src( [ 'src/*/*.styl' ] )
			.pipe( !config.watching ? gutil.noop() : plugins.plumber( {
				errorHandler: onError
			} ) )
			.pipe( plugins.stylus( {
				errors: true,
				'include css': true
			} ) )
			.pipe( plugins.autoprefixer( 'last 2 version', 'safari 5', 'ie 9', 'opera 12.1', 'ios 6', 'android 4' ) )
			.pipe( config.production ? plugins.minifyCss() : gutil.noop() )
			.pipe( plugins.size( { gzip: true, title: 'styles', showFiles: true } ) )
			.pipe( gulp.dest( config.buildDir ) )
			.pipe( plugins.connect.reload() )
	} );
};
