import * as Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import * as View from '!view!./toast.html?style=./toast.styl';
import { AppJolticon } from '../../../lib/gj-lib-client/vue/components/jolticon/jolticon';

@View
@Component({
	name: 'toast',
	components: {
		AppJolticon,
	}
})
export class AppToast extends Vue
{
	@Prop( String ) type: string;

	timeout?: number;

	mounted()
	{
		if ( !this.type ) {
			this.type = 'info';
		}
		this.setTimer();
	}

	focus()
	{
		this.clear();
	}

	blur()
	{
		this.setTimer();
	}

	dismiss()
	{
		this.$emit( 'dismiss' );
		this.clear();
	}

	private setTimer()
	{
		this.timeout = window.setTimeout( () => this.dismiss(), 3000 );
	}

	private clear()
	{
		if ( this.timeout ) {
			clearTimeout( this.timeout );
			this.timeout = undefined;
		}
	}
}
