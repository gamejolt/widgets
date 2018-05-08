import Vue from 'vue';
import { State, Mutation, Action } from 'vuex-class';
import { Component } from 'vue-property-decorator';
import View from '!view!./app.html?style=./app.styl';

import { AppFooter } from './components/footer/footer';
import { AppProcessingOverlay } from './components/processing-overlay/processing-overlay';
import { AppGameHeader } from './components/game-header/game-header';
import { AppPayment } from './components/payment/payment';
import { AppDownload } from './components/download/download';
import { Store } from './store/index';
import { AppToast } from './components/toast/toast';
import { AppTheme } from '../lib/gj-lib-client/components/theme/theme';
import { ThemeMutation, ThemeStore } from '../lib/gj-lib-client/components/theme/theme.store';

@View
@Component({
	components: {
		AppTheme,
		AppFooter,
		AppProcessingOverlay,
		AppGameHeader,
		AppPayment,
		AppDownload,
		AppToast,
	},
})
export class App extends Vue {
	@State isLightTheme: Store['isLightTheme'];
	@State isLoaded: Store['isLoaded'];
	@State isProcessing: Store['isProcessing'];
	@State hasInvalidKey: Store['hasInvalidKey'];
	@State hasFailure: Store['hasFailure'];
	@State view: Store['view'];
	@State sellableKey: Store['sellableKey'];
	@State game: Store['game'];

	@Mutation setInvalidKey: Store['setInvalidKey'];
	@Mutation clearFailure: Store['clearFailure'];
	@ThemeMutation setPageTheme: ThemeStore['setPageTheme'];
	@Action bootstrap: Store['bootstrap'];

	async mounted() {
		if (!this.sellableKey) {
			this.setInvalidKey();
			return;
		}

		await this.bootstrap();
		if (this.game) {
			this.setPageTheme(this.game.theme || null);
		}
	}
}
