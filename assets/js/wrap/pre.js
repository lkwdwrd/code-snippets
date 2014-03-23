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

	echo.view = {};
	echo.model = {};
	echo.controller = {};
