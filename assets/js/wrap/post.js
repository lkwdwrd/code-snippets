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
