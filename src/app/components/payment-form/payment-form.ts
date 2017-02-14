import * as Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { State } from 'vuex-class';
import * as View from '!view!./payment-form.html?style=./payment-form.styl';

import { PaymentData } from '../../store/index';
import { Sellable } from '../../../lib/gj-lib-client/components/sellable/sellable.model';
import { SellablePricing } from '../../../lib/gj-lib-client/components/sellable/pricing/pricing.model';
import { User } from '../../../lib/gj-lib-client/components/user/user.model';
import { AppJolticon } from '../../../lib/gj-lib-client/vue/components/jolticon/jolticon';

@View
@Component({
	name: 'payment-form',
	components: {
		AppJolticon,
	}
})
export class AppPaymentForm extends Vue
{
	@Prop( Object ) sellable: Sellable;
	@Prop( Object ) pricing: SellablePricing;
	@Prop( Number ) minOrderAmount: number;
	@Prop( String ) price: string;

	@State user?: User;

	payment = {
		email: '',
		amount: this.price,
	};

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

		this.$emit( 'submit', paymentData );
	}
}
