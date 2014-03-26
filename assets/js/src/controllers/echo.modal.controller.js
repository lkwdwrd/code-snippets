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
