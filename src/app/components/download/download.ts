import * as Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { State, Getter } from 'vuex-class';
import * as View from '!view!./download.html?style=./download.styl';

import { AppJolticon } from '../../../lib/gj-lib-client/vue/components/jolticon/jolticon';
import { filesize } from '../../../lib/gj-lib-client/vue/filters/filesize';
import { Store } from '../../store/index';
import { GameBuild } from '../../../lib/gj-lib-client/components/game/build/build.model';
import { Analytics } from '../../../lib/gj-lib-client/components/analytics/analytics.service';
import { HistoryTick } from '../../../lib/gj-lib-client/components/history-tick/history-tick-service';
import { Game } from '../../../lib/gj-lib-client/components/game/game.model';
import { Environment } from '../../../lib/gj-lib-client/components/environment/environment.service';
import { GamePackage } from '../../../lib/gj-lib-client/components/game/package/package.model';
import { AppModal } from '../../components/modal/modal';
import { User } from '../../../lib/gj-lib-client/components/user/user.model';
import { Sellable } from '../../../lib/gj-lib-client/components/sellable/sellable.model';
import { AppFadeCollapse } from '../../components/fade-collapse/fade-collapse';
import { SellablePricing } from '../../../lib/gj-lib-client/components/sellable/pricing/pricing.model';
import { AppPayment } from '../payment/payment';

@View
@Component({
	name: 'download',
	components: {
		AppJolticon,
		AppModal,
		AppFadeCollapse,
		AppPayment,
	},
	filters: {
		filesize,
	},
})
export class AppDownload extends Vue
{
	$store: Store;
	packageCard = this.$store.state.packageCard!;
	GameBuild = GameBuild;
	@State game: Game;
	@State developer: User;
	@State package: GamePackage;
	@State sellable: Sellable;
	@State pricing: SellablePricing;

	@Getter price: string;

	browserBuild = this.packageCard.browserBuild;
	showcasedBrowserIcon = this.packageCard.showcasedBrowserIcon;

	downloadableBuild = this.packageCard.downloadableBuild;
	platformSupportInfo = this.packageCard.platformSupportInfo;
	showcasedOs = this.packageCard.showcasedOs;
	showcasedOsIcon = this.packageCard.showcasedOsIcon;

	extraBuilds = this.packageCard.extraBuilds;
	otherOnly = this.packageCard.otherOnly;

	isShowingMoreOptions = false;
	isDescriptionCollapsed = false;
	isShowingDescription = false;
	isShowingPayment = false;
	clickedBuild?: GameBuild;

	async buildClick( build: GameBuild )
	{
		if ( this.sellable.type === Sellable.TYPE_PWYW && !this.isShowingPayment ) {
			this.clickedBuild = build;
			this.isShowingPayment = true;
			return;
		}

		this.isShowingPayment = false;

		Analytics.trackEvent( 'game-play', 'play' );

		HistoryTick.sendBeacon( 'game-build', build.id, {
			sourceResource: 'Game',
			sourceResourceId: this.game.id,
		} );

		if ( build.isBrowserBased() || build.type === GameBuild.TYPE_ROM ) {

			// We have to open the window first before getting the URL. The browser
			// will block the popup unless it's done directly in the onclick
			// handler. Once we have the download URL we can direct the window that
			// we now have the reference to.
			const win = window.open( '' );
			const payload = await build.getDownloadUrl();
			win.location.href = payload.url;
		}
		else {
			window.open( Environment.baseUrl + build.getUrl( this.game, 'download' ) );
		}
	}
}
