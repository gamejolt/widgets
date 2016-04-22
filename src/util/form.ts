export function hasFormError( fields: string[], form: any ): boolean
{
	for ( let i in fields ) {
		let field = form[ fields[i] ];

		if ( !field ) {
			continue;
		}

		if ( field.invalid && field.touched ) {
			return true;
		}
	}

	return false;
};

export function formErrorMessage( fields: string[], form: any ): string
{
	for ( let i in fields ) {
		let field = form[ fields[i] ];

		if ( !field ) {
			continue;
		}

		if ( field.invalid && field.touched && field.errors.length ) {
			return field.errors[0].message;
		}
	}

	return '';
};
