import * as Vue from 'vue';
import { Component } from 'vue-property-decorator';
import * as View from '!view!./footer.html?style=./footer.styl';
import { AppJolticon } from '../../../lib/gj-lib-client/vue/components/jolticon/jolticon';

@View
@Component({
	name: 'footer',
	components: {
		AppJolticon,
	},
})
export class AppFooter extends Vue
{
}
