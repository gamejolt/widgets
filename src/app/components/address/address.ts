import * as Vue from 'vue';
import { Component } from 'vue-property-decorator';
import * as View from '!view!./address.html?style=./address.styl';

import { Mutations, Actions, AddressData } from '../../store/index';
import { AppJolticon } from '../../../lib/gj-lib-client/vue/components/jolticon/jolticon';
import { Geo } from '../../../lib/gj-lib-client/components/geo/geo.service';

@View
@Component({
	name: 'address',
	components: {
		AppJolticon,
	}
})
export class AppAddress extends Vue
{
	address = {
		country: 'us',
		region: '',
		street1: '',
		postcode: '',
	};

	countries = Geo.getCountries();
	regions = Geo.getRegions( this.address.country );

	countryChanged()
	{
		this.regions = Geo.getRegions( this.address.country );

		if ( this.regions ) {
			this.address.region = this.regions[0].code;
		}
		else {
			this.address.region = '';
		}
	}

	submit()
	{
		const addressData = Object.assign( new AddressData(), this.address );
		this.$store.commit( Mutations.setAddress, addressData );
		this.$store.dispatch( Actions.checkout );
	}
}
