import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { State } from 'vuex-class';
import View from '!view!./download.html?style=./download.styl';

import { filesize } from '../../../lib/gj-lib-client/vue/filters/filesize';
import { Store } from '../../store/index';
import { GameBuild } from '../../../lib/gj-lib-client/components/game/build/build.model';
import { Analytics } from '../../../lib/gj-lib-client/components/analytics/analytics.service';
import { HistoryTick } from '../../../lib/gj-lib-client/components/history-tick/history-tick-service';
import { Environment } from '../../../lib/gj-lib-client/components/environment/environment.service';
import { AppModal } from '../../components/modal/modal';
import { Sellable } from '../../../lib/gj-lib-client/components/sellable/sellable.model';
import { AppFadeCollapse } from '../../components/fade-collapse/fade-collapse';
import { AppPayment } from '../payment/payment';
import { currency } from '../../../lib/gj-lib-client/vue/filters/currency';
import { AppTooltip } from '../../../lib/gj-lib-client/components/tooltip/tooltip';

@View
@Component({
	components: {
		AppModal,
		AppFadeCollapse,
		AppPayment,
	},
	filters: {
		filesize,
		currency,
	},
	directives: {
		AppTooltip,
	},
})
export class AppDownload extends Vue {
	@State app: Store['app'];
	@State packageCard: Store['packageCard'];
	@State game: Store['game'];
	@State developer: Store['developer'];
	@State package: Store['package'];
	@State sellable: Store['sellable'];
	@State pricing: Store['pricing'];
	@State price: Store['price'];

	isShowingMoreOptions = false;
	isDescriptionCollapsed = false;
	isShowingDescription = false;
	isShowingPayment = false;
	clickedBuild?: GameBuild;

	GameBuild = GameBuild;

	// "Convenience" I guess
	get browserBuild() {
		return this.packageCard.browserBuild;
	}
	get showcasedBrowserIcon() {
		return this.packageCard.showcasedBrowserIcon;
	}
	get downloadableBuild() {
		return this.packageCard.downloadableBuild;
	}
	get platformSupportInfo() {
		return this.packageCard.platformSupportInfo;
	}
	get showcasedOs() {
		return this.packageCard.showcasedOs;
	}
	get showcasedOsIcon() {
		return this.packageCard.showcasedOsIcon;
	}
	get extraBuilds() {
		return this.packageCard.extraBuilds;
	}
	get otherOnly() {
		return this.packageCard.otherOnly;
	}

	get shouldShowDevDescription() {
		return (
			this.app.user &&
			this.game.developer.id === this.app.user.id &&
			!this.package.description
		);
	}

	async buildClick(build: GameBuild) {
		if (this.sellable.type === Sellable.TYPE_PWYW && !this.isShowingPayment) {
			this.clickedBuild = build;
			this.isShowingPayment = true;
			return;
		}

		this.isShowingPayment = false;

		Analytics.trackEvent('game-play', 'play');

		HistoryTick.sendBeacon('game-build', build.id, {
			sourceResource: 'Game',
			sourceResourceId: this.game.id,
		});

		if (build.isBrowserBased || build.type === GameBuild.TYPE_ROM) {
			// We have to open the window first before getting the URL. The browser
			// will block the popup unless it's done directly in the onclick
			// handler. Once we have the download URL we can direct the window that
			// we now have the reference to.
			const win = window.open('');
			if (win) {
				// For some reason "win" in null in dev.
				const payload = await build.getDownloadUrl();
				win.location.href = payload.url;
			}
		} else {
			window.open(Environment.baseUrl + build.getUrl(this.game, 'download'));
		}
	}
}
