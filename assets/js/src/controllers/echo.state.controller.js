// A wp media system controller for jots
echo.controller.State = media.controller.State.extend((function(){

	function init( options ) {
		var all =       new Backbone.Collection(),
			library =   new Backbone.Collection(),
			selection = new Backbone.Collection();

		this.set( 'cache',     all );
		this.set( 'library',   library );
		this.set( 'selection', selection );
	}
	function addFilter( filter ) {
		if ( ! _.isArray( filter ) ) {
			filter = [ filter ];
		}
		_.each( filter, _addFilter, this );
	}
	function _addFilter( filter ) {
		filter.on( 'filter', this.applyFilters, this );
		this.filters[ filter.param ] = filter.value;
	}
	function applyFilters( filter ){
		// If this filter is already this value, don't change anything.
		if ( this.filters[ filter.param ] === filter.value ) {
			return;
		}
		// Set it and update the library accordingly.
		this.filters[ filter.param ] = filter.value;
		//this.get('library').applyFilters();
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
		filters:      {},
		initialize:   init,
		addFilter:    addFilter,
		applyFilters: applyFilters
	};
})());
