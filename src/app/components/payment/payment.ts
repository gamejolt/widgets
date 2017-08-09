import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { State, Mutation, Action } from 'vuex-class';
import * as View from '!view!./payment.html?style=./payment.styl';

import { PaymentData, Store } from '../../store/index';
import { ucwords } from '../../../lib/gj-lib-client/vue/filters/ucwords';

import { AppJolticon } from '../../../lib/gj-lib-client/vue/components/jolticon/jolticon';
import { AppAddress } from '../address/address';
import { AppModal } from '../modal/modal';
import { currency } from '../../../lib/gj-lib-client/vue/filters/currency';
import { AppUserAvatar } from '../../../lib/gj-lib-client/components/user/user-avatar/user-avatar';

@View
@Component({
	components: {
		AppJolticon,
		AppAddress,
		AppUserAvatar,
		AppModal,
	},
	filters: {
		currency,
	},
})
export class AppPayment extends Vue {
	ucwords = ucwords;
	currency = currency;

	@State app: Store['app'];
	@State game: Store['game'];
	@State developer: Store['developer'];
	@State sellable: Store['sellable'];
	@State pricing: Store['pricing'];
	@State minOrderAmount: number;
	@State isShowingIncluded: boolean;
	@State price: Store['price'];

	@Mutation setPayment: Store['setPayment'];
	@Action checkout: Store['checkout'];

	isShowingAddress = false;

	payment = {
		email: '',
		amount: '',
	};

	mounted() {
		this.payment.amount = (this.price! / 100).toFixed(2);
	}

	get user() {
		return this.app.user;
	}

	get minAmount() {
		return this.sellable.type === 'paid' ? this.pricing!.amount / 100 : this.minOrderAmount / 100;
	}

	submit(method: any) {
		const paymentData = new PaymentData();
		paymentData.method = method;
		paymentData.amount = parseFloat(this.payment.amount);
		paymentData.email = this.payment.email;

		this.setPayment(paymentData);

		if (paymentData.method === 'cc-stripe') {
			this.checkout();
		} else if (paymentData.method === 'paypal') {
			this.isShowingAddress = true;
		}
	}
}
