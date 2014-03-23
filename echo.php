<?php
/**
 * Plugin Name: Echo
 * Plugin URI:  http://wordpress.org/plugins
 * Description: Store and organize bits of code and text that you can then echo into your posts, just like you add  media. No more going to a custom post type to create your snippets!
 * Version:     0.1.0
 * Author:      lkwdwrd, tddewey, 10up
 * Author URI:  http://10up.com
 * License:     GPLv2+
 * Text Domain: echo
 * Domain Path: /languages
 */

/**
 * Copyright (c) 2013 lkwdwrd, tddewey, 10up (email : luke.woodward@10up.com)
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License, version 2 or, at
 * your discretion, any later version, as published by the Free
 * Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
 */

/**
 * Built using grunt-wp-plugin
 * Copyright (c) 2013 10up, LLC
 * https://github.com/10up/grunt-wp-plugin
 */

// Useful global constants
define( 'ECHO_VERSION', '0.1.0' );
define( 'ECHO_URL',     plugins_url( basename( __DIR__ ) ) );
define( 'ECHO_PATH',    dirname( __FILE__ ) );
define( 'ECHO_JS_URL',  ECHO_URL . '/assets/js' );
define( 'ECHO_INC',     ECHO_PATH . '/includes' );

/**
 * Default initialization for the plugin:
 * - Registers the default textdomain.
 */
function echo_init() {
	$locale = apply_filters( 'plugin_locale', get_locale(), 'echo' );
	load_textdomain( 'echo', WP_LANG_DIR . '/echo/echo-' . $locale . '.mo' );
	load_plugin_textdomain( 'echo', false, dirname( plugin_basename( __FILE__ ) ) . '/languages/' );
}

function echo_scripts() {
	wp_enqueue_script( 'echo-admin', ECHO_JS_URL . '/echo.js', array( 'media-views' ), ECHO_VERSION, true );
}

/**
 * Activate the plugin
 */
function echo_activate() {
	// First load the init scripts in case any rewrite functionality is being loaded
	echo_init();

	flush_rewrite_rules();
}
register_activation_hook( __FILE__, 'echo_activate' );

/**
 * Deactivate the plugin
 * Uninstall routines should be in uninstall.php
 */
function echo_deactivate() {

}
register_deactivation_hook( __FILE__, 'echo_deactivate' );

// Wireup actions
add_action( 'init', 'echo_init' );
add_action( 'admin_enqueue_scripts', 'echo_scripts' );

// Wireup filters

// Wireup shortcodes
