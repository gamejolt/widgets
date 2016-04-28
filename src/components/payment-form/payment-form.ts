import Component from 'vue-class-component';
import { VueComponent } from './../../util/vue';

import { email } from './../../validators/email';
import { price } from './../../filters/price';
import { hasFormError, formErrorMessage } from './../../util/form';

let FORM_FIELDS = [
	'amount',
];

class PaymentFormData extends VueComponent
{
	minAmount = 1;
}

@Component( {
	props: [
		'user',
		'game',
		'sellable',
		'pricing',
		'price',
		'payment',
		'minOrderAmount',
	],
	validators: {
		email,
	},
	filters: {
		price,
	},
} )
export default class PaymentForm extends PaymentFormData
{
	payment: any;
	user: any;
	game: any;
	sellable: any;
	pricing: any;
	price: string;
	minOrderAmount: number;

	data()
	{
		return new PaymentFormData();
	}

	ready()
	{
		this.payment.amount = this.pricing.amount;
		this.payment.email = '';

		// The rule is checked against the "form" value which is divided by 100.
		this.minAmount = this.sellable.type == 'paid' ? this.pricing.amount / 100 : this.minOrderAmount / 100;

		// We have an email field if the user isn't logged in.
		if ( !this.user ) {
			FORM_FIELDS.unshift( 'email' );
		}
	}

	get hasFormError()
	{
		return hasFormError( FORM_FIELDS, this.$form );
	}

	get formError()
	{
		return formErrorMessage( FORM_FIELDS, this.$form );
	}

	card()
	{
		this.$dispatch( 'checkout', 'cc-stripe' );
	}

	paypal()
	{
		this.$dispatch( 'change-step', 'address' );
	}
}
