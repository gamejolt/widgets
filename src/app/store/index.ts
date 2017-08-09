import {
	VuexStore,
	VuexModule,
	VuexMutation,
	VuexAction,
} from '../../lib/gj-lib-client/utils/vuex';
import {
	AppStore,
	Mutations as AppMutations,
	Actions as AppActions,
	appStore,
} from '../../lib/gj-lib-client/vue/services/app/app-store';
import { parse } from 'qs';
import { Api } from '../../lib/gj-lib-client/components/api/api.service';
import { Game } from '../../lib/gj-lib-client/components/game/game.model';
import { User } from '../../lib/gj-lib-client/components/user/user.model';
import { Sellable } from '../../lib/gj-lib-client/components/sellable/sellable.model';
import { SellablePricing } from '../../lib/gj-lib-client/components/sellable/pricing/pricing.model';
import { GamePackagePayloadModel } from '../../lib/gj-lib-client/components/game/package/package-payload.model';
import { GamePackageCardModel } from '../../lib/gj-lib-client/components/game/package/card/card.model';
import { GamePackage } from '../../lib/gj-lib-client/components/game/package/package.model';

export type Actions = AppActions & {
	bootstrap: undefined;
	checkout: undefined;
};

export type Mutations = AppMutations & {
	setInvalidKey: undefined;
	setFailure: undefined;
	clearFailure: undefined;
	setProcessing: undefined;
	setNotProcessing: undefined;
	_bootstrap: any;
	setPayment: any;
	setAddress: any;
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

@VuexModule({
	store: true,
	modules: {
		app: appStore,
	},
})
export class Store extends VuexStore<Store, Actions, Mutations> {
	app: AppStore;

	sellableKey: string = parse(window.location.search.substring(1)).key;
	isLightTheme: boolean = parse(window.location.search.substring(1)).theme === 'light';
	isLoaded = false;
	isProcessing = false;
	view: 'AppDownload' | 'AppPayment' = 'AppDownload';

	hasInvalidKey = false;
	hasFailure?: string = undefined;

	game: Game = null as any;
	developer: User = null as any;
	sellable: Sellable = null as any;
	package: GamePackage = null as any;
	packagePayload?: GamePackagePayloadModel = undefined;
	packageCard: GamePackageCardModel = null as any;
	addresses: any[] = [];
	minOrderAmount = 50;
	pricing: SellablePricing | null = null;
	originalPricing: SellablePricing | null = null;

	payment = new PaymentData();
	address = new AddressData();

	get price() {
		return this.pricing && (this.pricing.amount || this.minOrderAmount);
	}

	get originalPrice() {
		return this.originalPricing && this.originalPricing.amount;
	}

	@VuexMutation
	setInvalidKey() {
		this.hasInvalidKey = true;
	}

	@VuexMutation
	setFailure(failure?: string) {
		this.hasFailure = failure;
	}

	@VuexMutation
	clearFailure() {
		this.hasFailure = undefined;
	}

	@VuexMutation
	setProcessing() {
		this.isProcessing = true;
	}

	@VuexMutation
	setNotProcessing() {
		this.isProcessing = false;
	}

	@VuexMutation
	_bootstrap(response: any) {
		this.game = new Game(response.game);
		this.developer = new User(this.game.developer);
		this.sellable = new Sellable(response.sellable);
		this.packagePayload = new GamePackagePayloadModel(response);
		this.packageCard = new GamePackageCardModel(
			this.packagePayload.releases,
			this.packagePayload.builds
		);
		this.package = this.packagePayload.packages[0];

		this.addresses = response.billingAddresses || [];
		this.minOrderAmount = response.minOrderAmount || 50;

		if (this.sellable.pricings.length) {
			this.pricing = this.sellable.pricings[0];
			if (this.pricing.promotional) {
				this.originalPricing = this.sellable.pricings[1];
			}
		}

		if (this.sellable.type === Sellable.TYPE_PAID && !this.sellable.is_owned) {
			this.view = 'AppPayment';
		}

		this.isLoaded = true;
	}

	@VuexMutation
	setPayment(payment: any) {
		this.payment = payment;
	}

	@VuexMutation
	setAddress(address: any) {
		this.address = address;
	}

	@VuexAction
	async bootstrap() {
		try {
			const response = await Api.sendRequest(`/widgets/package/${this.sellableKey}`);
			this._bootstrap(response);
		} catch (_e) {
			console.error(_e);
			this.setInvalidKey();
		}
	}

	@VuexAction
	async checkout() {
		if (this.isProcessing) {
			return;
		}

		this.setProcessing();

		let data: any = {
			payment_method: this.payment.method,
			pricing_id: this.pricing!.id,
			sellable_id: this.sellable.id,
			email_address: this.payment.email,
			amount: this.payment.amount * 100,
			source: document.referrer,
		};

		if (this.addresses.length) {
			data.address_id = this.addresses[0].id;
		}

		try {
			const response = await Api.sendRequest(`/web/checkout/setup-order`, data);

			if (typeof response.success !== 'undefined' && !response.success) {
				throw new Error('Response returned errors.');
			}

			window.parent.location.href = response.redirectUrl;
		} catch (_e) {
			this.setFailure('setup-order');
			this.setNotProcessing();
		}
	}
}

export const store = new Store();

// export class StoreState {
// 	sellableKey: string = parse(window.location.search.substring(1)).key;
// 	isLightTheme: boolean = parse(window.location.search.substring(1)).theme === 'light';
// 	isLoaded = false;
// 	isProcessing = false;
// 	view: 'AppDownload' | 'AppPayment' = 'AppDownload';

// 	hasInvalidKey = false;
// 	hasFailure?: string = undefined;

// 	game?: Game = undefined;
// 	developer?: User = undefined;
// 	sellable?: Sellable = undefined;
// 	package?: GamePackage = undefined;
// 	packagePayload?: GamePackagePayloadModel = undefined;
// 	packageCard?: GamePackageCardModel = undefined;
// 	addresses: any[] = [];
// 	minOrderAmount = 50;
// 	pricing?: SellablePricing = undefined;
// 	originalPricing?: SellablePricing = undefined;

// 	payment = new PaymentData();
// 	address = new AddressData();
// }

// export type Store = Vuex.Store<StoreState>;

// export const store = new Vuex.Store<StoreState>({
// 	modules: {
// 		app: appStore,
// 	},
// 	state: new StoreState(),
// 	getters: {
// 		price: state => {
// 			return state.pricing && ((state.pricing.amount || state.minOrderAmount) / 100).toFixed(2);
// 		},
// 		originalPrice(state) {
// 			if (!state.originalPricing) {
// 				return undefined;
// 			}

// 			return (state.originalPricing.amount / 100).toFixed(2);
// 		},
// 	},
// 	mutations: {
// 		[Mutations.invalidKey]: state => (state.hasInvalidKey = true),

// 		[Mutations.setFailure]: (state, failure) => (state.hasFailure = failure),
// 		[Mutations.clearFailure]: state => (state.hasFailure = undefined),

// 		[Mutations.setProcessing]: state => (state.isProcessing = true),
// 		[Mutations.setNotProcessing]: state => (state.isProcessing = false),

// 		[Mutations.bootstrap](state, response: any) {
// 			state.game = new Game(response.game);
// 			state.developer = new User(state.game.developer);
// 			state.sellable = new Sellable(response.sellable);
// 			state.packagePayload = new GamePackagePayloadModel(response);
// 			state.packageCard = new GamePackageCardModel(
// 				state.packagePayload.releases,
// 				state.packagePayload.builds
// 			);
// 			state.package = state.packagePayload.packages[0];

// 			state.addresses = response.billingAddresses || [];
// 			state.minOrderAmount = response.minOrderAmount || 50;

// 			if (state.sellable.pricings.length) {
// 				state.pricing = state.sellable.pricings[0];
// 				if (state.pricing.promotional) {
// 					state.originalPricing = state.sellable.pricings[1];
// 				}
// 			}

// 			if (state.sellable!.type === Sellable.TYPE_PAID && !state.sellable!.is_owned) {
// 				state.view = 'AppPayment';
// 			}

// 			state.isLoaded = true;
// 		},

// 		[Mutations.setPayment]: (state, payment: any) => (state.payment = payment),
// 		[Mutations.setAddress]: (state, address: any) => (state.address = address),
// 	},
// 	actions: {
// 		async [Actions.bootstrap]({ commit, state }) {
// 			try {
// 				const response = await Api.sendRequest(`/widgets/package/${state.sellableKey}`);
// 				commit(Mutations.bootstrap, response);
// 			} catch (_e) {
// 				console.error(_e);
// 				commit(Mutations.invalidKey);
// 			}
// 		},
// 		async [Actions.checkout]({ commit, state }) {
// 			if (state.isProcessing) {
// 				return;
// 			}

// 			commit(Mutations.setProcessing);

// 			let data: any = {
// 				payment_method: state.payment.method,
// 				pricing_id: state.pricing!.id,
// 				sellable_id: state.sellable!.id,
// 				email_address: state.payment.email,
// 				amount: state.payment.amount * 100,
// 				source: document.referrer,
// 			};

// 			if (state.addresses.length) {
// 				data.address_id = state.addresses[0].id;
// 			}

// 			try {
// 				const response = await Api.sendRequest(`/web/checkout/setup-order`, data);

// 				if (typeof response.success !== 'undefined' && !response.success) {
// 					throw new Error('Response returned errors.');
// 				}

// 				window.parent.location.href = response.redirectUrl;
// 			} catch (_e) {
// 				commit(Mutations.setFailure, 'setup-order');
// 				commit(Mutations.setNotProcessing);
// 			}
// 		},
// 	},
// });
