import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { State } from 'vuex-class';
import * as View from '!view!./pricing-card.html?style=./pricing-card.styl';

import { Store } from '../../store/index';
import { currency } from '../../../lib/gj-lib-client/vue/filters/currency';

@View
@Component({
	filters: {
		currency,
	},
})
export class AppPricingCard extends Vue {
	@State sellable: Store['sellable'];
	@State price: Store['price'];
	@State originalPrice: Store['originalPrice'];

	get discount() {
		const price = this.price!;
		const originalPrice = this.originalPrice!;

		return ((originalPrice - price) / originalPrice).toFixed(0);
	}
}
