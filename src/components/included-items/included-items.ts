import Component from 'vue-class-component';
import { VueComponent } from './../../util/vue';

import { ucwords } from './../../util/string';
import { filesize } from './../../filters/filesize';

@Component( {
	props: [
		'isShowing',
		'sellable',
		'builds',
	],
	filters: {
		filesize,
	},
} )
export default class IncludedItems extends VueComponent
{
	data()
	{
		return {
			ucwords,
		};
	}
}

