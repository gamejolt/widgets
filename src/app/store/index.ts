import * as Vue from 'vue';
import * as Vuex from 'vuex';
import { parse } from 'qs';

import { appStore } from '../../lib/gj-lib-client/vue/services/app/app-store';
import { Api } from '../../lib/gj-lib-client/components/api/api.service';
import { Game } from '../../lib/gj-lib-client/components/game/game.model';
import { User } from '../../lib/gj-lib-client/components/user/user.model';
import { Sellable } from '../../lib/gj-lib-client/components/sellable/sellable.model';
import { SellablePricing } from '../../lib/gj-lib-client/components/sellable/pricing/pricing.model';
import { GamePackagePayloadModel } from '../../lib/gj-lib-client/components/game/package/package-payload.model';
import { GamePackageCardModel } from '../../lib/gj-lib-client/components/game/package/card/card.model';
import { GamePackage } from '../../lib/gj-lib-client/components/game/package/package.model';

Vue.use( Vuex );

export const Mutations = {
	invalidKey: 'invalidKey',
	setProcessing: 'setProcessing',
	setNotProcessing: 'setNotProcessing',
	setFailure: 'setFailure',
	clearFailure: 'clearFailure',
	bootstrap: 'bootstrap',
	setPayment: 'setPayment',
	setAddress: 'setAddress',
};

export const Actions = {
	bootstrap: 'bootstrap',
	checkout: 'checkout',
};

export class PaymentData {
	method: 'cc-stripe' | 'paypal' = 'cc-stripe';
	email = '';
	amount = 0;
}

export class AddressData {
	country = '';
	region = '';
	street1 = '';
	postcode = '';
}

export class StoreState
{
	sellableKey: string = parse( window.location.search.substring( 1 ) ).key;
	isLightTheme: boolean = parse( window.location.search.substring( 1 ) ).theme === 'light';
	isLoaded = false;
	isProcessing = false;
	view: 'AppDownload' | 'AppPayment' = 'AppDownload';

	hasInvalidKey = false;
	hasFailure?: string = undefined;

	game?: Game = undefined;
	developer?: User = undefined;
	sellable?: Sellable = undefined;
	package?: GamePackage = undefined;
	packagePayload?: GamePackagePayloadModel = undefined;
	packageCard?: GamePackageCardModel = undefined;
	addresses: any[] = [];
	minOrderAmount = 50;
	pricing?: SellablePricing = undefined;
	originalPricing?: SellablePricing = undefined;

	payment = new PaymentData();
	address = new AddressData();
}

export type Store = Vuex.Store<StoreState>;

export const store = new Vuex.Store<StoreState>( {
	modules: {
		app: appStore,
	},
	state: new StoreState(),
	getters: {
		price: ( state ) =>
		{
			return state.pricing && (state.pricing.amount / 100).toFixed( 2 );
		},
		originalPrice( state )
		{
			if ( !state.originalPricing ) {
				return undefined;
			}

			return (state.originalPricing.amount / 100).toFixed( 2 );
		}
	},
	mutations: {
		[Mutations.invalidKey]: state => state.hasInvalidKey = true,

		[Mutations.setFailure]: ( state, failure ) => state.hasFailure = failure,
		[Mutations.clearFailure]: state => state.hasFailure = undefined,

		[Mutations.setProcessing]: state => state.isProcessing = true,
		[Mutations.setNotProcessing]: state => state.isProcessing = false,

		[Mutations.bootstrap]( state, response: any )
		{
			state.game = new Game( response.game );
			state.developer = new User( state.game.developer );
			state.sellable = new Sellable( response.sellable );
			state.packagePayload = new GamePackagePayloadModel( response );
			state.packageCard = new GamePackageCardModel(
				state.packagePayload.releases,
				state.packagePayload.builds,
			);
			state.package = state.packagePayload.packages[0];

			state.addresses = response.billingAddresses || [];
			state.minOrderAmount = response.minOrderAmount || 50;

			if ( state.sellable.pricings.length ) {
				state.pricing = state.sellable.pricings[0];
				if ( state.pricing.promotional ) {
					state.originalPricing = state.sellable.pricings[1];
				}
			}

			if ( state.sellable!.type === Sellable.TYPE_PAID ) {
				state.view = 'AppPayment';
			}

			state.isLoaded = true;
		},

		[Mutations.setPayment]: ( state, payment: any ) => state.payment = payment,
		[Mutations.setAddress]: ( state, address: any ) => state.address = address,
	},
	actions: {
		async [Actions.bootstrap]( { commit, state } )
		{
			try {
				const response = await Api.sendRequest( `/widgets/package/${state.sellableKey}` );
				commit( Mutations.bootstrap, response );
			}
			catch ( _e ) {
				console.error( _e );
				commit( Mutations.invalidKey );
			}
		},
		async [Actions.checkout]( { commit, state } )
		{
			if ( state.isProcessing ) {
				return;
			}

			commit( Mutations.setProcessing );

			let data: any = {
				payment_method: state.payment.method,
				pricing_id: state.pricing!.id,
				sellable_id: state.sellable!.id,
				email_address: state.payment.email,
				amount: (state.payment.amount * 100),
				source: document.referrer,
			};

			if ( state.addresses.length ) {
				data.address_id = state.addresses[0].id;
			}

			try {
				const response = await Api.sendRequest( `/web/checkout/setup-order`, data );

				if ( typeof response.success !== 'undefined' && !response.success ) {
					throw new Error( 'Response returned errors.' );
				}

				window.parent.location.href = response.redirectUrl;
			}
			catch ( _e ) {
				commit( Mutations.setFailure, 'setup-order' );
				commit( Mutations.setNotProcessing );
			}
		},
	}
} );
