import * as Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { State, Getter } from 'vuex-class';
import * as View from '!view!./payment.html?style=./payment.styl';

import { PaymentData, Mutations, Actions } from '../../store/index';
import { ucwords } from '../../../lib/gj-lib-client/vue/filters/ucwords';

import { Game } from '../../../lib/gj-lib-client/components/game/game.model';
import { User } from '../../../lib/gj-lib-client/components/user/user.model';
import { Sellable } from '../../../lib/gj-lib-client/components/sellable/sellable.model';
import { SellablePricing } from '../../../lib/gj-lib-client/components/sellable/pricing/pricing.model';
import { AppJolticon } from '../../../lib/gj-lib-client/vue/components/jolticon/jolticon';
import { AppAddress } from '../address/address';
import { AppModal } from '../modal/modal';

@View
@Component( {
	name: 'payment',
	components: {
		AppJolticon,
		AppAddress,
		AppModal,
	},
})
export class AppPayment extends Vue
{
	ucwords = ucwords;

	@State game: Game;
	@State developer: User;
	@State sellable: Sellable;
	@State pricing: SellablePricing;
	@State minOrderAmount: number;
	@State isShowingIncluded: boolean;
	@State user?: User;

	@Getter price: string;

	isShowingAddress = false;

	payment = {
		email: '',
		amount: '',
	};

	mounted()
	{
		this.payment.amount = this.price;
	}

	get minAmount()
	{
		return this.sellable.type === 'paid'
			? this.pricing.amount / 100
			: this.minOrderAmount / 100;
	}

	submit( method: any )
	{
		const paymentData = new PaymentData();
		paymentData.method = method;
		paymentData.amount = parseFloat( this.payment.amount );
		paymentData.email = this.payment.email;

		this.$store.commit( Mutations.setPayment, paymentData );

		if ( paymentData.method === 'cc-stripe' ) {
			this.$store.dispatch( Actions.checkout );
		}
		else if ( paymentData.method === 'paypal' ) {
			this.isShowingAddress = true;
		}
	}
}
