/*! Echo - v0.1.0
 * http://wordpress.org/plugins
 * Copyright (c) 2014; * Licensed GPLv2+ */
( function( window, undefined ) {
	'use strict';
	var echo = window.echo = window.echo || {},
		modal, media = wp.media;

	_.defaults( echo.data || {}, {

	});

	echo.view = {};
	echo.model = {};
	echo.controller = {};

// Our take on the wp media frame modal system.
echo.controller.Modal = media.view.MediaFrame.extend((function(){
	function init() {
		media.view.MediaFrame.prototype.initialize.apply( this, arguments );
		this.on( 'all', function( action ){ console.log( action ); } );
		_.defaults( this.options, {
			state:    'codeLibrary',
			button:   {
				text: 'Insert Jot'
			}
		});

		// Register our controller
		this.states.add([
			new echo.controller.State()
		]);
		// Do stuff when stuff happens!
		this.bindHandlers();
	}

	function bindHandlers() {
		this.on( 'router:create:tabs',         this.createRouter,   this );
		this.on( 'router:render:tabs',         this.renderRouter,   this );
		this.on( 'content:create:codeLibrary', this.libraryContent, this );
		this.on( 'content:create:codeEdit',    this.editContent,    this );
		this.on( 'toolbar:create:insert',      this.createToolbar,  this );
	}

	function renderRouter( view ) {
		view.set({
			codeLibrary: {
				text:     'Jot Library',
				priority: 20
			},
			codeEdit: {
				text:     'Edit Jot',
				priority: 40
			}
		});
	}

	function libraryContent( content ) {
		content.view = new echo.view.Library({
			controller: this
		});
	}

	function editContent( content ) {
		content.view = new echo.view.Edit({
			controller: this
		});
	}

	function createToolbar( toolbar, options ) {
		options = options || this.options.button || {};
		options.controller = this;

		toolbar.view = new media.view.Toolbar.Select( options );
	}

	return {
		initialize:     init,
		bindHandlers:   bindHandlers,
		renderRouter:   renderRouter,
		libraryContent: libraryContent,
		editContent:    editContent,
		createToolbar:  createToolbar

	};
})());

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

// A basic filter view.

echo.view.filter = media.View.extend((function(){
	function construct( options ) {
		var i;
		
		// Make sure keys exist.
		_.defaults( options || {}, {
			tagName:        'input',
			className:      'echoFilter',
			attributes:     { type: 'text' },
			param:          's',
			events:         {},
			filterEvents:   [ 'change', 'keyup' ],
			preventDefault: false
		});

		this._inputEl = new media.View( options );

		//Set up filter event handlers
		_.bindAll( this, 'preFilter', 'filter' );
		this.filterEvents = options.filterEvents;

		// Allow tags and parameters to be set on the parent
		options.tagName = options._tagName;
		delete( options._tagName );
		options.className = options._className;
		delete( options._className );
		options.attributes = options._attributes;
		delete( options._attributes );
		options.id = options._id;
		delete( options._id );

		// clear undefined values
		for ( i in options ) {
			if ( 'undefined' === typeof options[ i ] ) {
				delete( options[ i ] );
			}
		}

		// Run the constructor and add the input el as a subview.
		media.View.prototype.constructor.call( this, options );
		this.views.add( this._inputEl );
	}
	function init( options ) {
		// Gather option values with some validation
		this.param = options.param;
		this.value = options.value;
		this.preventDefault = !! options.preventDefault;
		this.throttle = parseInt( options.throttle, 10 );
		if ( _.isNaN( this.throttle ) || 0 === this.throttle ) {
			this.throttle = false;
		}
	}
	function delegateEvents(){
		media.View.prototype.delegateEvents.apply( this, arguments );
		_.each( this.filterEvents, _addEvents, this );
		this._inputEl.delegateEvents();
	}
	function _addEvents( event ) {
		this._inputEl.events[ event ] = this.preFilter;
	}
	function preFilter( event ) {
		if ( this.preventDefault ) {
			event.preventDefault();
		}
		if ( ! this.throttle ) {
			this.filter();
		} else {
			window.clearTimeout( this.timeout );
			this.timeout = window.setTimeout( this.filter, this.throttle );
		}
	}
	function filter( event ) {
		// Get and validate filter val
		var filterVal = this._inputEl.$el.val();
		this.value = ( '' === filterVal ) ? undefined : filterVal;
		this.trigger( 'filter', this );
	}
	return {
		filterEvents:   {},
		constructor:    construct,
		initialize:     init,
		delegateEvents: delegateEvents,
		filter:         filter,
		preFilter:      preFilter
	};
})());

echo.view.filterTax = echo.view.filter.extend((function(){
	function init( options ) {
		echo.view.filter.prototype.initialize.apply( this, arguments );

		this._value = _.defaults( options.value || {}, {
			taxonomy: options.taxonomy,
			field:    options.field,
			term:     undefined
		});

		this.on( 'prepare', this.rawValue, this );
	}
	function filter( event ) {
		if ( this.preventDefault ) {
			event.preventDefault();
		}

		// Get and validate filter val
		var filterVal = this._inputEl.$el.val();
		this._value.term = ( '' === filterVal ) ? undefined : filterVal;
		this.value = ( _.isUndefined( this._value.term ) ) ? undefined : this._value;
		this.trigger( 'filter', this );
	}
	function rawValue( data ) {
		data = this._value.term;
		return data;
	}
	return {
		initialize: init,
		filter:     filter
	};
})());
// The wrapper view for the editor view
echo.view.Edit = media.View.extend((function(){
	function init() {
		
		this.createSidebar();
	}
	function createSidebar() {
		var options = this.options,
			selection = options.selection,
			sidebar = this.sidebar = new media.view.Sidebar({
				controller: this.controller
			});

		this.views.add( this.sidebar );


		//selection.on( 'selection:single', this.createSingle, this );
		//selection.on( 'selection:unsingle', this.disposeSingle, this );

		//if ( selection.single() )
			//this.createSingle();
	}
	return {
		tagName:       'div',
		className:     'jot-editor',
		initialize:    init,
		createSidebar: createSidebar
	};
})());
// The wrapper view for the library views
echo.view.Library = media.View.extend((function(){
	function init() {
		
		this.createSidebar();
		this.createToolbar();
	}
	function createSidebar() {
		var options = this.options,
			selection = options.selection,
			sidebar = this.sidebar = new media.view.Sidebar({
				controller: this.controller
			});

		this.views.add( sidebar );


		//selection.on( 'selection:single', this.createSingle, this );
		//selection.on( 'selection:unsingle', this.disposeSingle, this );

		//if ( selection.single() )
			//this.createSingle();
	}
	function createToolbar() {
		var search;

		this.toolbar = new media.view.Toolbar({
			controller: this.controller
		});
		this.views.add( this.toolbar );

		search = new echo.view.filter({
			tagName:   'input',
			className: 'jot-search',
			id:        'jot-search',
			throttle:   300
		});
		this.toolbar.views.add( search );
		this.controller.state().addFilter( search );
	}
	return {
		tagName:       'div',
		className:     'jot-library',
		initialize:    init,
		createSidebar: createSidebar,
		createToolbar: createToolbar
	};
})());
	// Helper functions for open and close.
	function open() {
		if ( 'undefined' === typeof modal ) {
			modal = new echo.controller.Modal();
		}
		modal.open();
	}
	function close() {
		if ( 'undefined' === typeof modal || 'function' !== typeof modal.close ) {
			return;
		}
		modal.close();
	}
	echo.open = open;
	echo.close = close;
} )( this );
