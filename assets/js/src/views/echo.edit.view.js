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