import Component from 'vue-class-component';
import { VueComponent } from './../../util/vue';

@Component( {
	props: [
		'price',
		'sellable',
	]
} )
export default class PricingCard extends VueComponent
{
}
