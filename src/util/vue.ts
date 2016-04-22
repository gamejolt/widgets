export class VueComponent
{
	$form: any;
	$on: ( event: string, callback: ( ...args ) => void ) => void;
	$once: ( event: string, callback: ( ...args ) => void ) => void;
	$off: ( event: string, callback: Function ) => void;
	$emit: ( event: string, ...args ) => void;
	$dispatch: ( event: string, ...args ) => void;
	$broadcast: ( event: string, ...args ) => void;
	$watch: ( expOrFn: string | Function, callback: ( newVal?: any, oldVal?: any ) => void, options?: { deep?: boolean, immediate?: boolean } ) => void;
}
