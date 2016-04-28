require( 'micro-query/micro-query.js' );
declare var uQuery: any;

let qwest = require( 'qwest/qwest.min.js' );

import Component from 'vue-class-component';
import { VueComponent } from './../../util/vue';

import { ucwords } from './../../util/string';

import * as AppFooter from './../footer/footer';
import * as PricingCard from './../pricing-card/pricing-card';
import * as IncludedItems from './../included-items/included-items';
import * as PaymentForm from './../payment-form/payment-form';
import * as AddressForm from './../address-form/address-form';
import * as Toast from './../toast/toast';

type Step = 'main' | 'address';
type PaymentMethod = 'cc-stripe' | 'paypal';

class AppData extends VueComponent
{
	sellableKey: string = uQuery( 'key' );
	isLightTheme = uQuery( 'theme' ) == 'light' ? true : false;
	isShowingIncluded = false;
	isLoaded = false;
	step: Step = 'main';
	ucwords = ucwords;

	hasInvalidKey = false;
	hasFailure: string = null;

	user: any = {};
	game: any = {};
	developer: any = {};
	sellable: any = {};
	pricing: any = {};
	priceFormatted = '';
	operatingSystems: string[] = [];
	builds: any[] = [];
	addresses: any[] = [];

	payment = {
		email: '',
		amount: 0,
	};

	address = {
		country: '',
		region: '',
		street1: '',
		postcode: '',
	};
}

@Component( {
	components: {
		AppFooter,
		PricingCard,
		PaymentForm,
		AddressForm,
		IncludedItems,
		Toast,
	},
} )
export default class App extends AppData
{
	data()
	{
		return new AppData();
	}

	ready()
	{
		if ( !this.sellableKey ) {
			this.hasInvalidKey = true;
			return;
		}

		let options = {
			withCredentials: true,
			cache: ' ',  // This forces qwest to not send cache control stuff.
			responseType: 'json',
		};

		qwest.get( 'http://development.gamejolt.com/site-api/widgets/sale/' + this.sellableKey, null, options )
			.then( ( xhr, response ) => this.processResponse( response ) )
			.catch( ( response ) => this.hasInvalidKey = true );
	}

	get price()
	{
		return (this.pricing.amount / 100).toFixed( 2 );
	}

	changeStep( step: Step )
	{
		// If we are trying to go to address section but we already have an address, skip it!
		if ( step == 'address' && this.addresses.length ) {
			this.checkout( 'paypal' );
			return;
		}

		this.step = step;
	}

	addressCancel()
	{
		this.changeStep( 'main' );
	}

	checkout( paymentMethod: PaymentMethod )
	{
		this.submit( paymentMethod );
	}

	private processResponse( response: any )
	{
		if ( response.user ) {
			this.user = response.user;
		}

		let payload = response.payload;

		this.game = payload.game;
		this.developer = this.game.developer;
		this.sellable = payload.sellable;
		this.pricing = payload.sellable.pricings[0];
		this.operatingSystems = payload.operatingSystems;
		this.builds = payload.builds;
		this.addresses = payload.billingAddresses || [];

		this.sellable.is_owned = false;

		this.isLoaded = true;
	}

	submit( paymentMethod: PaymentMethod )
	{
		let data: any = {
			payment_method: paymentMethod,
			pricing_id: this.pricing.id,
			sellable_id: this.sellable.id,
			email_address: this.payment.email,
			amount: this.payment.amount,
		};

		if ( this.addresses.length ) {
			data.address_id = this.addresses[0].id;
		}

		let options = {
			withCredentials: true,
			cache: ' ',  // This forces qwest to not send cache control stuff.
			responseType: 'json',
		};

		qwest.post( 'http://development.gamejolt.com/site-api/web/checkout/setup-order', data, options )
			.then( ( xhr, response ) =>
			{
				if ( typeof response.payload.success != 'undefined' && !response.payload.success ) {
					this.hasFailure = 'setup-order';
					return;
				}

				window.parent.location.href = response.payload.redirectUrl;
			} )
			.catch( ( response ) =>
			{
				this.hasFailure = 'setup-order';
			} );
	}
}
