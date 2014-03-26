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