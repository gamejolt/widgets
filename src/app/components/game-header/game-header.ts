import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { State } from 'vuex-class';
import View from '!view!./game-header.html?style=./game-header.styl';

import { AppPricingCard } from '../pricing-card/pricing-card';
import { Sellable } from '../../../lib/gj-lib-client/components/sellable/sellable.model';
import { Environment } from '../../../lib/gj-lib-client/components/environment/environment.service';
import { AppModal } from '../modal/modal';
import { AppIncludedItems } from '../included-items/included-items';
import { Store } from '../../store/index';
import { AppTooltip } from '../../../lib/gj-lib-client/components/tooltip/tooltip';

@View
@Component({
	components: {
		AppPricingCard,
		AppModal,
		AppIncludedItems,
	},
	directives: {
		AppTooltip,
	},
})
export class AppGameHeader extends Vue {
	@State game: Store['game'];
	@State developer: Store['developer'];
	@State sellable: Store['sellable'];
	@State packageCard: Store['packageCard'];

	isShowingIncluded = false;

	created() {}

	get gameUrl() {
		// `https://gamejolt.com/games/${game.slug}/${game.id}`
		return Environment.baseUrl + this.game.getUrl();
	}

	get developerUrl() {
		return this.developer.web_site || Environment.baseUrl + this.developer.url;
	}

	get shouldShowIncluded() {
		return this.sellable.type !== Sellable.TYPE_FREE;
	}
}
