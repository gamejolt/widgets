export class VueComponent
{
	$form: any;
	$on: ( event: string, callback: ( ...args: any[] ) => void ) => void;
	$once: ( event: string, callback: ( ...args: any[] ) => void ) => void;
	$off: ( event: string, callback: Function ) => void;
	$emit: ( event: string, ...args: any[] ) => void;
	$dispatch: ( event: string, ...args: any[] ) => void;
	$broadcast: ( event: string, ...args: any[] ) => void;
	$watch: ( expOrFn: string | Function, callback: ( newVal?: any, oldVal?: any ) => void, options?: { deep?: boolean, immediate?: boolean } ) => void;
}
