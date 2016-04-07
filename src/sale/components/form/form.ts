import { emailRegex } from './../../../helpers/string';

export class SaleForm
{
	$form = document.getElementById( 'widget-form' );
	$errors = document.getElementById( 'form-errors' );
	$email = <HTMLInputElement>document.getElementById( 'email-address' );

	prevEmailVal = '';

	constructor( private game: any, private sellable: any, private pricing: any )
	{
		this.$form.addEventListener( 'submit', this.onSubmit.bind( this ) );

		this.$email.addEventListener( 'keypress', this.revalidateEmail.bind( this ) );
		this.$email.addEventListener( 'paste', this.revalidateEmail.bind( this ) );
		this.$email.addEventListener( 'input', this.revalidateEmail.bind( this ) );
	}

	private onSubmit( e )
	{
		// Never submit it.
		e.preventDefault();

		let $submitBtn = document.getElementById( 'payment-methods').querySelector( '[gj-type=submit]' );
		let paymentMethod = $submitBtn.getAttribute( 'gj-payment-method' );

		let emailVal = this.$email.value.trim();
		if ( !emailVal ) {
			return this.addEmailError( 'no-email' );
		}
		else if ( emailVal.match( emailRegex ) === null ) {
			return this.addEmailError( 'invalid-email' );
		}

		// $paymentMethod.value = paymentMethod;
		this.$form.classList.remove( 'showing-error' );
		this.$form.classList.add( 'redirecting' );

		// Don't allow changes.
		this.$email.setAttribute( 'disabled', 'disabled' );

		let data = {
			pricing_id: this.pricing.id,
			sellable_id: this.sellable.id,
			payment_method: paymentMethod,
			email_address: this.emailVal,
		};

		let options = {
			withCredentials: true,
			cache: ' ',  // This forces qwest to not send cache control stuff.
			responseType: 'json',
		};

		window.qwest.post( 'http://development.gamejolt.com/site-api/web/checkout/setup-order', data, options )
			.then( ( xhr, response ) =>
			{
				if ( typeof response.payload.success != 'undefined' && !response.payload.success ) {
					console.log( 'form errors', response.payload.errors );
					return;
				}

				console.log( response.payload );
				window.parent.location.href = response.payload.redirectUrl;
			} )
			.catch( ( response ) =>
			{
				console.log( 'caught', response );
			} );
	}

	private addEmailError( type )
	{
		this.prevEmailVal = this.$email.value.trim();
		this.$form.classList.add( 'showing-error' );
		this.$errors.classList.add( 'showing-' + type );
		this.$email.classList.add( 'has-error' );
		this.$email.focus();
	}

	private revalidateEmail()
	{
		let emailVal = this.$email.value.trim();
		if ( emailVal != this.prevEmailVal ) {
			this.resetEmailError();
		}
	}

	private resetEmailError()
	{
		this.prevEmailVal = '';
		this.$form.classList.remove( 'showing-error' );
		this.$errors.classList.add( 'not-showing' );
		this.$email.classList.remove( 'has-error' );
	}
}
