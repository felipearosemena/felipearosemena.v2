<?php 

/**
*
* Script and Style Enqeueuing
*
*/

// loading modernizr and jquery, and reply script
function scripts_and_styles() {

  global $wp_styles; // call global $wp_styles variable
  if (!is_admin()) {
   
  // Remove jQuery
  wp_deregister_script('jquery');


  // Modernizr goes in the head
  wp_register_script( 'modernizr', get_stylesheet_directory_uri() . '/assets/js/modernizr-custom.min.js', array(), '', false );

  // Jquery and the rest of our script in thee footer
  wp_register_script( 'scripts', get_stylesheet_directory_uri() . '/assets/js/main' . (WP_DEBUG ? '' : '.min') . '.js', array(), '', true );
  wp_localize_script( 'scripts', AJAX_NAMESPACE, array(
      'url'   => admin_url( 'admin-ajax.php' ),
      'nonce' => wp_create_nonce( AJAX_NONCE ),
      'fieldPrefix' => FORM_FIELD_PREFIX
    )
  );

  wp_enqueue_script('modernizr');
  wp_enqueue_script('scripts');

  // Main Stylesheet
  wp_register_style( 'styles', get_stylesheet_directory_uri() . '/assets/css/main.min.css', array(), '', 'all' );
  wp_enqueue_style('styles');
  
  // Google Fonts
  // wp_register_style( 'google-fonts', 'http://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,700,300italic', array(), '', 'all' );
  // wp_enqueue_style('google-fonts');

  // comment reply script for threaded comments
  if ( is_single() AND comments_open() AND (get_option('thread_comments') == 1)) {
    wp_enqueue_script( 'comment-reply' );
  }

  }
}

add_action('wp_enqueue_scripts', 'scripts_and_styles', 100);
