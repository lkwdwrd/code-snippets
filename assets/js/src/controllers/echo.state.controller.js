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
		if ( this.filters[ filter.param ] ) {
			filter.val( [ this.filters[ filter.param ] ] );
		} else if ( 'undefined' !== typeof filter.value ) {
			this.filters[ filter.param ] = filter.value;
		}
	}
	function removeFilter( filter ) {
		if ( ! _.isArray( filter ) ) {
			filter = [ filter ];
		}
		_.each( filter, _removeFilter, this );
		//this.get('library').applyFilters();
	}
	function _removeFilter( filter ) {
		if ( this.filters[ filter ] ) {
			filter.off( 'filter', this.applyFilters, this );
			delete( this.filters[ filter.param ] );
		}
	}
	function applyFilters( filter ){
		// If this filter is already this value, don't change anything.
		if ( this.filters[ filter.param ] === filter.value ) {
			return;
		}
		// Set it and update the library accordingly.
		if ( 'undefined' === typeof filter.value ) {
			delete( this.filters[ filter.param ] );
		} else {
			this.filters[ filter.param ] = filter.value;
		}
		console.log( this.filters );
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
		removeFilter: removeFilter,
		applyFilters: applyFilters
	};
})());
