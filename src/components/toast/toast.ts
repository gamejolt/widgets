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
	timeout: NodeJS.Timer;

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
		clearTimeout( this.timeout );
		this.timeout = null;
	}

	private _setTimer()
	{
		this.timeout = setTimeout( () =>
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
