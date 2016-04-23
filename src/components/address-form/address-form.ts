import Component from 'vue-class-component';
import { VueComponent } from './../../util/vue';

import { COUNTRIES, REGIONS } from './../../util/geo';
import { hasFormError, formErrorMessage } from './../../util/form';

const FORM_FIELDS = [
	'country',
	'street',
	'region',
	'postcode',
];

class AddressFormData extends VueComponent
{
	countries = COUNTRIES;
	regions = REGIONS;
}

@Component( {
	props: [
		'address',
	],
	validators: {},
} )
export default class AddressForm extends AddressFormData
{
	address: any;

	data()
	{
		return new AddressFormData();
	}

	ready()
	{
		if ( !this.address.country ) {
			this.address.country = 'us';
			this.address.region = REGIONS[ this.address.country ] ? REGIONS[ this.address.country ][0].code : '';
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

	countryChanged()
	{
		if ( REGIONS[ this.address.country ] ) {
			this.address.region = REGIONS[ this.address.country ][0].code;
		}
		else {
			this.address.region = '';
		}
	}

	cancel()
	{
		this.$dispatch( 'cancel' );
	}

	submit()
	{
		this.$dispatch( 'checkout', 'paypal' );
	}
}
