var gulp = require( 'gulp' );
var gutil = require( 'gulp-util' );
var plugins = require( 'gulp-load-plugins' )();

module.exports = function( config )
{
	gulp.task( 'images:svg', function()
	{
		var src = config.widgets.map( function( widget )
		{
			return 'src/' + widget + '/**/*.svg';
		} );

		return gulp.src( src, { base: 'src' } )
			.pipe( plugins.newer( config.buildDir ) )
			.pipe( config.production ? plugins.svgmin() : gutil.noop() )
			.pipe( gulp.dest( config.buildDir ) )
			.pipe( plugins.connect.reload() )
	} );

	gulp.task( 'images:raster', function()
	{
		var src = config.widgets.map( function( widget )
		{
			return 'src/' + widget + '/**/*.{bmp,png,jpg,jpeg,gif,ico}';
		} );

		return gulp.src( src, { base: 'src' } )
			.pipe( plugins.newer( config.buildDir ) )
			.pipe( config.production ? plugins.imagemin( { progressive: true, interlaced: true, pngquant: true } ) : gutil.noop() )
			.pipe( gulp.dest( config.buildDir ) )
			.pipe( plugins.connect.reload() )
	} );

	gulp.task( 'images', [ 'images:svg', 'images:raster' ] );
};
