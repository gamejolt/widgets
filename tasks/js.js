'use strict';

let _ = require( 'lodash' );
let gulp = require( 'gulp' );
let gutil = require( 'gulp-util' );
let plugins = require( 'gulp-load-plugins' )();
let streamqueue = require( 'streamqueue' );
let fs = require( 'fs' );

module.exports = function( config )
{
	// Pull their bower file.
	let bower = require( '../bower.json' );

	let typescript = plugins.typescript.createProject( './src/tsconfig.json', {
		typescript: require( 'typescript' )
	} );

	function getBowerComponentFiles( component )
	{
		let files = [];
		let mainFile = null;

		// Try to get the bower config for this component.
		let componentBower = require( '../src/bower-lib/' + component + '/.bower.json' );
		if ( componentBower.main ) {
			if ( _.isString( componentBower.main ) && componentBower.main.match( /\.js$/ ) ) {
				mainFile = componentBower.main;
			}
			else if ( _.isArray( componentBower.main ) ) {
				_.forEach( componentBower.main, function( file )
				{
					if ( file.match( /\.js$/ ) ) {
						mainFile = file;
						return false;  // Found the file, stop looping.
					}
				} );
			}
		}

		if ( component == 'qwest' ) {
			// The normal main file is made for module.exports.
			mainFile = 'qwest.min.js';
		}
		else if ( component == 'accounting' ) {
			mainFile = 'accounting.js';
		}

		if ( !mainFile ) {
			gutil.log( gutil.colors.red( 'Component not found: ' + component ) );
		}
		else {
			mainFile = mainFile.replace( './', '' );
			files.push( 'src/bower-lib/' + component + '/' + mainFile );
		}

		return files;
	}

	gulp.task( 'js:vendor', function()
	{
		let files = [
			'node_modules/systemjs/dist/system-register-only.src.js',
		];

		if ( bower.dependencies ) {

			_.forEach( bower.dependencies, function( version, component )
			{
				files = _.union( files, getBowerComponentFiles( component ) );
			} );
		}

		gutil.log( 'Adding files to vendor: ' + gutil.colors.gray( JSON.stringify( files ) ) );

		if ( files.length ) {
			return gulp.src( files )
				.pipe( plugins.newer( config.buildDir + '/app/vendor.js' ) )
				.pipe( plugins.sourcemaps.init() )
				.pipe( plugins.concat( 'vendor.js' ) )
				.pipe( config.production ? plugins.uglify() : gutil.noop() )
				.pipe( plugins.sourcemaps.write( '.', {
					sourceRoot: '/../../src/',
				} ) )
				.pipe( plugins.size( { gzip: true, title: 'js:vendor' } ) )
				.pipe( gulp.dest( config.buildDir ) )
				;
		}
	} );

	/**
	 * Build out the widget components.
	 */
	let widgetTasks = [];
	config.widgets.forEach( function( widget )
	{
		widgetTasks.push( 'js:' + widget );

		gulp.task( 'js:' + widget, function()
		{
			return gulp.src( [ 'src/' + widget + '/**/*.{js,ts}' ], { base: 'src' } )
				.pipe( plugins.sourcemaps.init() )
				.pipe( plugins.typescript( typescript ) )
				.pipe( config.production ? plugins.uglify() : gutil.noop() )
				.pipe( plugins.sourcemaps.write( '.', {
					sourceRoot: '/../../src/' + widget + '/',
				} ) )
				.pipe( plugins.size( { gzip: true, title: 'js:' + widget } ) )
				.pipe( gulp.dest( config.buildDir + '/' + widget ) )
				.pipe( plugins.connect.reload() )
		} );
	} );

	gulp.task( 'js:widgets', widgetTasks );
	gulp.task( 'js', [ 'js:vendor', 'js:widgets' ] );
};
