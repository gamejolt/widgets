import Component from 'vue-class-component';
import { VueComponent } from './../../util/vue';

@Component( {
	props: {
		type: {
			type: String,
		},
	},
} )
export default class Toast extends VueComponent
{
	timeout?: number;

	ready()
	{
		this._setTimer();
	}

	focus()
	{
		this._clear();
	}

	blur()
	{
		this._setTimer();
	}

	private _clear()
	{
		if ( this.timeout ) {
			clearTimeout( this.timeout );
			this.timeout = undefined;
		}
	}

	private _setTimer()
	{
		this.timeout = window.setTimeout( () =>
		{
			this.dismiss();
		}, 3000 );
	}

	dismiss()
	{
		this.$dispatch( 'dismiss' );
		this._clear();
	}
}
