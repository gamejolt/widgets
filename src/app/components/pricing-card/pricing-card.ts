import * as Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { State } from 'vuex-class';
import * as View from '!view!./pricing-card.html?style=./pricing-card.styl';

import { Sellable } from '../../../lib/gj-lib-client/components/sellable/sellable.model';

@View
@Component({
	name: 'pricing-card',
})
export class AppPricingCard extends Vue
{
	@State sellable: Sellable;

	get discount()
	{
		const price = parseInt( this.$store.getters.price, 10 );
		const originalPrice = parseInt( this.$store.getters.originalPrice, 10 );

		return ((originalPrice - price) / originalPrice * 100).toFixed( 0 );
	}
}
