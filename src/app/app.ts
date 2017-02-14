import * as Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { AppShell } from './components/shell/shell';
import * as View from '!view!./app.html';

@View
@Component({
	name: 'app',
	components: {
		AppShell,
	},
})
export class App extends Vue
{
}
