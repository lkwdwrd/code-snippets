/**
 * Echo
 * http://wordpress.org/plugins
 *
 * Copyright (c) 2013 lkwdwrd, tddewey, 10up
 * Licensed under the GPLv2+ license.
 */
 
( function( window, undefined ) {
	'use strict';
	var echo = window.echo = window.echo || {},
		modal, media = wp.media;

	_.defaults( echo.data || {}, {

	});
	// A very basic wp media system controller
	echo.Controller = media.controller.State.extend((function(){

		function init( options ) {
			this.set( 'library', new Backbone.Collection() );
			this.set( 'selection', new Backbone.Collection() );
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
			initialize: init
		};
	})());
	
	// Our take on the wp media frame modal system.
	echo.Modal = media.view.MediaFrame.extend((function(){
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
				new echo.Controller()
			]);
			// Do stuff when stuff happens!
			this.bindHandlers();
		}

		function bindHandlers() {
			this.on( 'router:create:tabs',         this.createRouter,   this );
			this.on( 'router:render:tabs',         this.renderRouter,   this );
			this.on( 'content:create:codeLibrary', this.libraryContent, this );
			this.on( 'content:render:codeEdit',    this.editContent,    this );
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

		function libraryContent( content, options ) {
			content.view = new echo.view.Library({
				controller: this
			});
		}

		function editContent( content ) {
			content.view = new media.View();
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

	// Lets make some views!
	echo.view = {};

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
			this.toolbar = new media.view.Toolbar({
				controller: this.controller
			});

			this.views.add( this.toolbar );
		}
		return {
			tagName:       'div',
			className:     'jot-library',
			initialize:    init,
			createSidebar: createSidebar,
			createToolbar: createToolbar
		};
	})());
	function open() {
		if ( 'undefined' === typeof modal ) {
			modal = new echo.Modal();
		}
		modal.open();
	}
	echo.open = open;
} )( this );