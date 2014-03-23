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

		function libraryContent( content ) {
			content = new media.View();
		}

		function editContent( content ) {
			content = new media.View();
		}

		function createToolbar( toolbar, options ) {
			options = options || this.options.button || {};
			options.controller = this;

			toolbar.view = new media.view.Toolbar.Select( options );
		}

		return {
			initialize:    init,
			bindHandlers:  bindHandlers,
			renderRouter:  renderRouter,
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