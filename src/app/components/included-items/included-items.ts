import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { State } from 'vuex-class';
import * as View from '!view!./included-items.html?style=./included-items.styl';

import { filesize } from '../../../lib/gj-lib-client/vue/filters/filesize';
import { ucwords } from '../../../lib/gj-lib-client/vue/filters/ucwords';
import { AppJolticon } from '../../../lib/gj-lib-client/vue/components/jolticon/jolticon';
import { Store } from '../../store/index';

@View
@Component({
	components: {
		AppJolticon,
	},
	filters: {
		filesize,
	},
})
export class AppIncludedItems extends Vue {
	ucwords = ucwords;

	@State package: Store['package'];
	@State packagePayload: Store['packagePayload'];
	@State packageCard: Store['packageCard'];
}
