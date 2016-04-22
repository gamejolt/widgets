export const price = {
	read: ( amount: number | string ) =>
	{
		let num: number;
		if ( typeof amount !== 'number' ) {
			num = parseFloat( amount );
		}
		else {
			num = amount;
		}

		return (num / 100).toFixed( 2 );
	},
	write: ( amount ) =>
	{
		let num = +amount.replace( /[^\d.]/g, '' );
		return isNaN( num ) ? 0 : parseFloat( num.toFixed( 2 ) ) * 100;
	},
};
