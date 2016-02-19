(function(){

	window.User = null;
	window.Bucket = null;
	window.Pricing = null;

	var bucketKey = window.uQuery( 'key' );

	handleTheme( window.uQuery( 'theme' ) );

	var options = {
		withCredentials: true,
		cache: ' ',  // This forces qwest to not send cache control stuff.
		responseType: 'json',
	};

	window.qwest.get( 'http://development.gamejolt.com/site-api/widgets/sale/' + bucketKey, null, options )
		.then( function( xhr, response )
		{
			processResponse( response );
		} )
		.catch( function( response )
		{
			console.log( 'caught', response );
		} );

	function processResponse( response )
	{
		if ( response.user ) {
			window.User = response.user;
		}

		var payload = response.payload;

		window.Bucket = payload.bucket;
		window.Pricing = payload.pricing;

		compileWidget( payload );
	}

	function compileWidget( payload )
	{
		document.getElementById( 'thumbnail-img' ).src = window.Bucket.game.img_thumbnail;

		document.getElementById( 'package-title' ).title = window.Bucket.title;
		document.getElementById( 'package-title' ).textContent = window.Bucket.title;

		var a = document.getElementById( 'package-dev' ).querySelector( 'a' );
		a.href = window.Bucket.game.developer.web_site || window.Bucket.game.developer.url;
		a.textContent = window.Bucket.game.developer.display_name;

		document.getElementById( 'package-price' ).textContent = window.accounting.formatMoney( window.Pricing.amount / 100 );

		document.getElementById( 'package-description' ).textContent = window.Bucket.description;

		if ( payload.operatingSystems && payload.operatingSystems.length ) {
			document.getElementById( 'os-icons' ).innerHTML = payload.operatingSystems.map( function( os )
			{
				return '<span class="jolticon jolticon-' + (os == 'other' ? 'other-os' : os) + '" title="' + (os != 'other' ? ucwords( os ) : 'some other OS or device') + '"></span>';
			} ).join( ' ' );
		}
	}

	function handleTheme( theme )
	{
		if ( !theme ) {
			return;
		}

		if ( theme == 'light' ) {
			document.body.classList.add( 'light' );
		}
	}

	function ucwords( str )
	{
		return ( str + '' )
			.replace( /^([a-z\u00E0-\u00FC])|\s+([a-z\u00E0-\u00FC])/g, function( $1 )
			{
				return $1.toUpperCase();
			} );
	}
})();
