// The wrapper view for the library views
echo.view.Library = media.View.extend((function(){
	function init() {
		
		this.createSidebar();
		this.createToolbar();
	}
	function createSidebar() {
		var categories,
			options = this.options,
			selection = options.selection,
			sidebar = this.sidebar = new media.view.Sidebar({
				controller: this.controller
			});

		this.views.add( sidebar );

		categories = new echo.view.filterTax({
			tagName:   'select',
			className: 'jot-category',
			id:        'jot-category',
			title:     'Categories'
		});
		sidebar.views.add( categories );
		this.controller.state().addFilter( categories );
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
			template:  'echo-textfield',
			title:     'Search',
			throttle:  300
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