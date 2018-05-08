import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import View from '!view!./modal.html?style=./modal.styl';

@View
@Component({})
export class AppModal extends Vue {
	@Prop(Boolean) hideClose: boolean;

	close() {
		this.$emit('close');
	}
}
