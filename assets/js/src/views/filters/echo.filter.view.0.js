// A basic filter view.

echo.view.filter = media.View.extend((function(){
	function init( options ) {
		// Make sure keys exist.
		_.defaults( options || {}, {
			param:          's',
			template:       'filter',
			events:         [ 'change' ],
			preventDefault: false
		});

		// Gather option values with some validation
		this.param = options.param;
		this.value = null;
		this.template = wp.template( options.template );
		this.preventDefault = !! options.preventDefault;
		this.throttle = parseInt( options.throttle, 10 );
		if ( _.isNaN( this.throttle ) || 0 === this.throttle ) {
			this.throttle = false;
		}

		//Make filters work
		_.bindAll( this, 'filter' );
		_.each( options.events, _addEvents, this );
	}
	function _addEvents( event ) {
		this.events[ event ] = 'preFilter';
	}
	function preFilter( event ) {
		if ( this.preventDefault ) {
			event.preventDefault();
		}
		if ( ! this.throttle ) {
			this.filter();
		} else {
			this.clearTimeout( this.timeout );
			this.timeout = window.setTimeout( this.filter );
		}
	}
	function filter( event ) {
		// Get and validate filter val
		var filterVal = this.$el.val();
		this.value = ( '' === filterVal ) ? null : filterVal;
		this.trigger( 'filter', this );
	}
	return {
		initialize: init,
		filter:     filter
	};
})());

echo.view.filterTax = echo.view.filter.extend((function(){
	function init( options ) {
		echo.view.filter.prototype.initialize.apply( this, arguments );
		this.taxFilter = {
			taxonomy: options.taxonomy,
			field:    options.field,
			term:     null
		};
	}
	function filter( event ) {
		if ( this.preventDefault ) {
			event.preventDefault();
		}

		// Get and validate filter val
		var filterVal = this.$el.val();
		this.taxFilter.term = ( '' === filterVal ) ? null : filterVal;
		this.value = ( _.isNull( this.taxFilter.term ) ) ? null : this.taxFilter;
		this.trigger( 'filter', this );
	}
	return {
		initialize: init,
		filter:     filter
	};
})());