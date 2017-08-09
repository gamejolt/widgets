import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import * as View from '!view!./processing-overlay.html';

import { AppLoading } from '../../../lib/gj-lib-client/vue/components/loading/loading';
import { AppModal } from '../modal/modal';

@View
@Component({
	components: {
		AppModal,
		AppLoading,
	},
})
export class AppProcessingOverlay extends Vue {}
