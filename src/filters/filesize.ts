const UNITS = [
	'bytes',
	'KB',
	'MB',
	'GB',
	'TB',
	'PB'
];

export function filesize( bytes )
{
	if ( isNaN( parseFloat( bytes ) ) || !isFinite( bytes ) ) {
		return '?';
	}
	else if ( bytes < 1024 ) {
		return bytes + ' ' + UNITS[0];
	}

	var unit = 0;

	while ( bytes >= 1024 ) {
		bytes /= 1024;
		++unit;
	}

	return bytes.toFixed( 2 ) + ' ' + UNITS[unit];
}
