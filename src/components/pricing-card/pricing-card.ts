import Component from 'vue-class-component';
import { VueComponent } from './../../util/vue';

@Component( {
	props: [
		'price',
		'originalPrice',
		'sellable',
	]
} )
export default class PricingCard extends VueComponent
{
	price: string;
	originalPrice: string;

	get discount()
	{
		const price = parseInt( this.price );
		const originalPrice = parseInt( this.originalPrice );

		return ((originalPrice - price) / originalPrice * 100).toFixed( 0 );
	}
}
