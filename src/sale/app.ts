import { SaleForm } from './components/form/form';
import { ucwords } from '../helpers/string';

export class App
{
	sellableKey: string = window.uQuery( 'key' );
	user: any;
	game: any;
	sellable: any;
	pricing: any;
	form: SaleForm;

	constructor()
	{
		if ( !this.sellableKey ) {
			this.invalidKey();
		}

		this.handleTheme( window.uQuery( 'theme' ) );

		let options = {
			withCredentials: true,
			cache: ' ',  // This forces qwest to not send cache control stuff.
			responseType: 'json',
		};

		window.qwest.get( 'http://development.gamejolt.com/site-api/widgets/sale/' + this.sellableKey, null, options )
			.then( ( xhr, response ) =>
			{
				this.processResponse( response );
			} )
			.catch( ( response ) =>
			{
				console.log( 'caught', response );
				this.invalidKey();
			} );

		this.form = new SaleForm( this.game, this.sellable, this.pricing );
	}

	private processResponse( response )
	{
		if ( response.user ) {
			this.user = response.user;
		}

		let payload = response.payload;

		this.game = payload.game;
		this.sellable = payload.sellable;
		this.pricing = payload.pricing;

		this.compileWidget( payload );
	}

	private compileWidget( payload )
	{
		let $thumbnailImg = <HTMLImageElement>document.getElementById( 'thumbnail-img' );
		let $packageTitle = document.getElementById( 'package-title' );
		let $packageDev = <HTMLAnchorElement>document.getElementById( 'package-dev' ).querySelector( 'a' );
		let $packagePrice = document.getElementById( 'package-price' );
		let $packageDescription = document.getElementById( 'package-description' );
		let $osIcons = document.getElementById( 'os-icons' );

		$thumbnailImg.src = this.game.img_thumbnail;

		$packageTitle.title = this.sellable.title;
		$packageTitle.textContent = this.sellable.title;

		$packageDev.href = this.game.developer.web_site || this.game.developer.url;
		$packageDev.textContent = this.game.developer.display_name;

		$packagePrice.textContent = window.accounting.formatMoney( this.pricing.amount / 100 );

		$packageDescription.textContent = this.sellable.description;

		if ( payload.operatingSystems && payload.operatingSystems.length ) {
			$osIcons.innerHTML = payload.operatingSystems.map( ( os ) =>
			{
				return '<span class="jolticon jolticon-' + (os == 'other' ? 'other-os' : os) + '" title="' + (os != 'other' ? ucwords( os ) : 'some other OS or device') + '"></span>';
			} ).join( ' ' );
		}

		document.body.classList.add( 'is-loaded' );
	}

	private handleTheme( theme: string )
	{
		if ( !theme ) {
			return;
		}

		if ( theme == 'light' ) {
			document.body.classList.add( 'light' );
		}
	}

	private invalidKey()
	{
		document.body.classList.add( 'has-invalid-key-error' );
	}
}
