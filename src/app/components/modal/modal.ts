import * as Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import * as View from '!view!./modal.html?style=./modal.styl';
import { AppJolticon } from '../../../lib/gj-lib-client/vue/components/jolticon/jolticon';

@View
@Component({
	name: 'modal',
	components: {
		AppJolticon,
	}
})
export class AppModal extends Vue
{
	@Prop( Boolean ) hideClose: boolean;

	close()
	{
		this.$emit( 'close' );
	}
}
