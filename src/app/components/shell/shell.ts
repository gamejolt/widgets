import * as Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { State } from 'vuex-class';
import * as View from '!view!./shell.html?style=./shell.styl';

import { Mutations, Actions } from '../../store/index';
import { AppFooter } from '../footer/footer';
import { AppProcessingOverlay } from '../processing-overlay/processing-overlay';
import { AppJolticon } from '../../../lib/gj-lib-client/vue/components/jolticon/jolticon';
import { AppGameHeader } from '../game-header/game-header';
import { AppPayment } from '../payment/payment';
import { AppDownload } from '../download/download';

@View
@Component({
	name: 'shell',
	components: {
		AppJolticon,
		AppFooter,
		AppProcessingOverlay,
		AppGameHeader,
		AppPayment,
		AppDownload,
	},
})
export class AppShell extends Vue
{
	@State isLightTheme: boolean;
	@State isLoaded: boolean;
	@State isProcessing: boolean;
	@State hasInvalidKey: boolean;
	@State hasFailure: boolean;
	@State view: string;
	@State sellableKey: string;

	async mounted()
	{
		if ( !this.sellableKey ) {
			this.$store.commit( Mutations.invalidKey );
			return;
		}

		this.$store.dispatch( Actions.bootstrap );
	}
}
