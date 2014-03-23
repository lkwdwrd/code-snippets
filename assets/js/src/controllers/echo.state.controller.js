// A very basic wp media system controller
echo.controller.State = media.controller.State.extend((function(){

	function init( options ) {
		this.set( 'library', new Backbone.Collection() );
		this.set( 'selection', new Backbone.Collection() );
	}
	return {
		defaults: {
			id:         'codeLibrary',
			toolbar:    'insert',
			router:     'tabs',
			sidebar:    'settings',
			content:    'codeLibrary',
			menu:       'default',
			title:      'Code Jots',
			select:      true
		},
		initialize: init
	};
})());
