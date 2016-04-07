export const emailRegex = /^[a-z0-9!#$%&'*+/=?^_`{|}~.-]+@[a-z0-9-]+(\.[a-z0-9-]+)*$/i;

export function ucwords( str: string )
{
	return ( str + '' )
		.replace( /^([a-z\u00E0-\u00FC])|\s+([a-z\u00E0-\u00FC])/g, ( $1 ) =>
		{
			return $1.toUpperCase();
		} );
}
