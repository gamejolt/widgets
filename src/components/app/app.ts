import 'micro-query/micro-query.js';
declare var uQuery: any;

let qwest: Qwest.Static = require( 'qwest/qwest.min.js' );

import Component from 'vue-class-component';
import { VueComponent } from './../../util/vue';

import { ucwords } from './../../util/string';

import * as AppFooter from './../footer/footer';
import * as ProcessingOverlay from './../processing-overlay/processing-overlay';
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
	isProcessing = false;
	step: Step = 'main';
	ucwords = ucwords;

	hasInvalidKey = false;
	hasFailure?: string;

	user: any = {};
	game: any = {};
	developer: any = {};
	sellable: any = {};
	pricing: any = {};
	originalPricing?: any;
	priceFormatted = '';
	operatingSystems: string[] = [];
	builds: any[] = [];
	addresses: any[] = [];
	minOrderAmount = 50;

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
		ProcessingOverlay,
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

		qwest.get( 'https://gamejolt.com/site-api/widgets/sale/' + this.sellableKey, null, options )
			.then( ( _xhr: any, response: any ) => this.processResponse( response ) )
			.catch( () => this.hasInvalidKey = true );
	}

	get price()
	{
		return (this.pricing.amount / 100).toFixed( 2 );
	}

	get originalPrice()
	{
		if ( !this.originalPricing ) {
			return undefined;
		}

		return (this.originalPricing.amount / 100).toFixed( 2 );
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
		this.operatingSystems = payload.operatingSystems;
		this.builds = payload.builds;
		this.addresses = payload.billingAddresses || [];
		this.minOrderAmount = payload.minOrderAmount || 50;

		this.pricing = this.sellable.pricings[0];
		if ( this.pricing.promotional ) {
			this.originalPricing = this.sellable.pricings[1];
		}

		this.isLoaded = true;
	}

	submit( paymentMethod: PaymentMethod )
	{
		if ( this.isProcessing ) {
			return;
		}

		this.isProcessing = true;

		let data: any = {
			payment_method: paymentMethod,
			pricing_id: this.pricing.id,
			sellable_id: this.sellable.id,
			email_address: this.payment.email,
			amount: this.payment.amount,

			source: document.referrer,
		};

		if ( this.addresses.length ) {
			data.address_id = this.addresses[0].id;
		}

		let options = {
			withCredentials: true,
			cache: ' ',  // This forces qwest to not send cache control stuff.
			responseType: 'json',
		};

		qwest.post( 'https://gamejolt.com/site-api/web/checkout/setup-order', data, options )
			.then( ( _xhr: any, response: any ) =>
			{
				if ( typeof response.payload.success != 'undefined' && !response.payload.success ) {
					this.hasFailure = 'setup-order';
					return;
				}

				window.parent.location.href = response.payload.redirectUrl;
			} )
			.catch( () =>
			{
				this.hasFailure = 'setup-order';
				this.isProcessing = false;
			} );
	}
}
