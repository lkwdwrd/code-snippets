/*! Echo - v0.1.0
 * http://wordpress.org/plugins
 * Copyright (c) 2014; * Licensed GPLv2+ */
( function( window, undefined ) {
	'use strict';
	var echo = window.echo = window.echo || {},
		modal, media = wp.media;

	_.defaults( echo.data || {}, {

	});
	echo.Controller = media.controller.State.extend((function(){

		function init( options ) {

		}
		return {
			defaults: {
				id:         'codeLibrary',
				toolbar:    'select',
				sidebar:    'settings',
				content:    'upload',
				router:     'browse',
				menu:       'default',
				title:      'Code Snippets',

				// Uses a user setting to override the content mode.
				contentUserSetting: true,

				// Sync the selection from the last state when 'multiple' matches.
				syncSelection: true
			},
			init: init
		};
	})());
	echo.Modal = media.view.MediaFrame.extend((function(){
		function init() {
			media.view.MediaFrame.prototype.initialize.apply( this, arguments );
			
			_.defaults( this.options, {
				state:    'codeLibrary'
			});

			this.createStates();
			this.bindHandlers();
		}

		function createStates() {
			var options = this.options;

			if ( this.options.states ) {
				return;
			}

			// Add the default states.
			this.states.add([
				// Main states.
				new echo.Controller()
			]);
		}
		function bindHandlers() {
			
		}

		return {
			initialize: init,
			createStates: createStates,
			bindHandlers: bindHandlers
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