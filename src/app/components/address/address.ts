import Vue from 'vue';
import { Mutation, Action } from 'vuex-class';
import { Component } from 'vue-property-decorator';
import * as View from '!view!./address.html?style=./address.styl';

import { AddressData, Store } from '../../store/index';
import { AppJolticon } from '../../../lib/gj-lib-client/vue/components/jolticon/jolticon';
import { Geo, Region, Country } from '../../../lib/gj-lib-client/components/geo/geo.service';

@View
@Component({
	components: {
		AppJolticon,
	},
})
export class AppAddress extends Vue {
	@Mutation setAddress: Store['setAddress'];
	@Action checkout: Store['checkout'];

	address = {
		country: 'us',
		region: '',
		street1: '',
		postcode: '',
	};

	countries: Country[] = [];
	regions: Region[] | null = [];

	created() {
		this.countries = Geo.getCountries();
		this.countryChanged();
	}

	countryChanged() {
		this.regions = Geo.getRegions(this.address.country) || null;

		if (this.regions) {
			this.address.region = this.regions[0].code;
		} else {
			this.address.region = '';
		}
	}

	submit() {
		const addressData = Object.assign(new AddressData(), this.address);
		this.setAddress(addressData);
		this.checkout();
	}
}
