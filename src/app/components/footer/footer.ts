import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import View from '!view!./footer.html?style=./footer.styl';

@View
@Component({})
export class AppFooter extends Vue {}
