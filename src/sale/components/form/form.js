(function(){

	var emailRegex = /^[a-z0-9!#$%&'*+/=?^_`{|}~.-]+@[a-z0-9-]+(\.[a-z0-9-]+)*$/i;

	var $form = document.getElementById( 'widget-form' );
	var $errors = document.getElementById( 'form-errors' );
	var $email = document.getElementById( 'email-address' );

	var prevEmailVal = '';

	$form.addEventListener( 'submit', function( e )
	{
		// Never submit it.
		e.preventDefault();

		var submitBtn = document.getElementById( 'payment-methods').querySelector( '[gj-type=submit]' );
		var paymentMethod = submitBtn.getAttribute( 'gj-payment-method' );

		var emailVal = $email.value.trim();
		if ( !emailVal ) {
			return addEmailError( 'no-email' );
		}
		else if ( emailVal.match( emailRegex ) === null ) {
			return addEmailError( 'invalid-email' );
		}

		// $paymentMethod.value = paymentMethod;
		$form.classList.remove( 'showing-error' );
		$form.classList.add( 'redirecting' );

		// Don't allow changes.
		$email.setAttribute( 'disabled', 'disabled' );

		var data = {
			pricing_id: window.Pricing.id,
			bucket_id: window.Bucket.id,
			payment_method: paymentMethod,
			email_address: emailVal,
		};

		var options = {
			withCredentials: true,
			cache: ' ',  // This forces qwest to not send cache control stuff.
			responseType: 'json',
		};

		window.qwest.post( 'http://development.gamejolt.com/site-api/web/checkout/setup-order', data, options )
			.then( function( xhr, response )
			{
				if ( typeof response.payload.success != 'undefined' && !response.payload.success ) {
					console.log( 'form errors', response.payload.errors );
					return;
				}

				console.log( response.payload );
				window.parent.location.href = response.payload.redirectUrl;
			} )
			.catch( function( response )
			{
				console.log( 'caught', response );
			} );
	} );

	$email.addEventListener( 'keypress', revalidateEmail );
	$email.addEventListener( 'paste', revalidateEmail );
	$email.addEventListener( 'input', revalidateEmail );

	function addEmailError( type )
	{
		prevEmailVal = $email.value.trim();
		$form.classList.add( 'showing-error' );
		$errors.classList.add( 'showing-' + type );
		$email.classList.add( 'has-error' );
		$email.focus();
	}

	function revalidateEmail()
	{
		var emailVal = $email.value.trim();
		if ( emailVal != prevEmailVal ) {
			resetEmailError();
		}
	}

	function resetEmailError()
	{
		prevEmailVal = '';
		$form.classList.remove( 'showing-error' );
		$errors.classList.add( 'not-showing' );
		$email.classList.remove( 'has-error' );
	}

})();
