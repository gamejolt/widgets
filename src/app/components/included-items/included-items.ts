import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { State } from 'vuex-class';
import View from '!view!./included-items.html?style=./included-items.styl';

import { filesize } from '../../../lib/gj-lib-client/vue/filters/filesize';
import { ucwords } from '../../../lib/gj-lib-client/vue/filters/ucwords';
import { Store } from '../../store/index';
import { AppTooltip } from '../../../lib/gj-lib-client/components/tooltip/tooltip';

@View
@Component({
	filters: {
		filesize,
	},
	directives: {
		AppTooltip,
	},
})
export class AppIncludedItems extends Vue {
	ucwords = ucwords;

	@State package: Store['package'];
	@State packagePayload: Store['packagePayload'];
	@State packageCard: Store['packageCard'];
}
