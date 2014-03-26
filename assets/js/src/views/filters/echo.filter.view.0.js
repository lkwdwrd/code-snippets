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