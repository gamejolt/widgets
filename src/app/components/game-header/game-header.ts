import * as Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { State } from 'vuex-class';
import * as View from '!view!./game-header.html?style=./game-header.styl';

import { AppPricingCard } from '../pricing-card/pricing-card';
import { AppJolticon } from '../../../lib/gj-lib-client/vue/components/jolticon/jolticon';
import { Game } from '../../../lib/gj-lib-client/components/game/game.model';
import { User } from '../../../lib/gj-lib-client/components/user/user.model';
import { Sellable } from '../../../lib/gj-lib-client/components/sellable/sellable.model';
import { GamePackagePayloadModel } from '../../../lib/gj-lib-client/components/game/package/package-payload.model';
import { GamePackageCardModel } from '../../../lib/gj-lib-client/components/game/package/card/card.model';
import { Environment } from '../../../lib/gj-lib-client/components/environment/environment.service';
import { AppModal } from '../modal/modal';
import { AppIncludedItems } from '../included-items/included-items';

@View
@Component({
	name: 'game-header',
	components: {
		AppJolticon,
		AppPricingCard,
		AppModal,
		AppIncludedItems,
	}
})
export class AppGameHeader extends Vue
{
	@State game: Game;
	@State developer: User;
	@State sellable: Sellable;
	@State packagePayload: GamePackagePayloadModel;
	@State packageCard: GamePackageCardModel;

	isShowingIncluded = false;

	created()
	{

	}

	get gameUrl()
	{
		// `http://gamejolt.com/games/${game.slug}/${game.id}`
		return Environment.baseUrl + this.game.getUrl();
	}

	get developerUrl()
	{
		return this.developer.web_site || Environment.baseUrl + this.developer.url;
	}

	get shouldShowIncluded()
	{
		return this.sellable.type !== Sellable.TYPE_FREE;
	}
}
