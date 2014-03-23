// A basic filter view.

echo.view.filter = media.View.extend((function(){
	function init( options ) {
		_.defaults( options || {}, {
			param:          '',
			template:       'filter',
			events:         [ 'change' ],
			preventDefault: false
		});

		this.param = options.param;
		this.template = wp.template( options.template );
		this.preventDefault = !! options.preventDefault;
		this.value = null;

		_.each( options.events, _addEvents, this );
	}
	function _addEvents( event ) {
		this.events[ event ] = 'filter';
	}
	function filter( event ) {
		if ( this.preventDefault ) {
			event.preventDefault();
		}

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
		this.taxonomy = options.taxonomy;
		this.term = options.term;
	}
	function filter( event ) {
		if ( this.preventDefault ) {
			event.preventDefault();
		}

		// Get and validate filter val
		var filterVal = this.$el.val();
		this.value.term = ( '' === filterVal ) ? null : filterVal;
		this.trigger( 'filter', this );
	}
	return {
		initialize: init,
		filter:     filter
	};
})());