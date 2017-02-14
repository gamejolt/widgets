import * as Vue from 'vue';
import { Component } from 'vue-property-decorator';
import * as View from '!view!./fade-collapse.html?style=./fade-collapse.styl';
import { Ruler } from '../../../lib/gj-lib-client/components/ruler/ruler-service';

@View
@Component({
	name: 'fade-collapse',
})
export class AppFadeCollapse extends Vue
{
	innerElem: HTMLElement;
	height = 0;
	innerHeight = 0;
	isCollapsed = false;

	async mounted()
	{
		await this.$nextTick();
		this.height = Ruler.height( this.$el );
		this.innerElem = this.$el.getElementsByClassName( 'fade-collapse-inner' )[0] as HTMLElement;
		this.innerHeight = Ruler.height( this.innerElem );

		if ( this.innerHeight > this.height ) {
			this.isCollapsed = true;
			this.$emit( 'required' );
		}
	}
}
