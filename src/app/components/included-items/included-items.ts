import * as Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { State } from 'vuex-class';
import * as View from '!view!./included-items.html?style=./included-items.styl';

import { filesize } from '../../../lib/gj-lib-client/vue/filters/filesize';
import { ucwords } from '../../../lib/gj-lib-client/vue/filters/ucwords';
import { AppJolticon } from '../../../lib/gj-lib-client/vue/components/jolticon/jolticon';
import { GamePackagePayloadModel } from '../../../lib/gj-lib-client/components/game/package/package-payload.model';
import { GamePackageCardModel } from '../../../lib/gj-lib-client/components/game/package/card/card.model';
import { GamePackage } from '../../../lib/gj-lib-client/components/game/package/package.model';

@View
@Component({
	name: 'included-items',
	components: {
		AppJolticon,
	},
	filters: {
		filesize,
	},
})
export class AppIncludedItems extends Vue
{
	ucwords = ucwords;

	@State package: GamePackage;
	@State packagePayload: GamePackagePayloadModel;
	@State packageCard: GamePackageCardModel;
}
