<?php 

/*
  Site Configuration
*/

class StarterSite extends TimberSite {
  
  function __construct(){

    add_theme_support('post-formats');
    add_theme_support('post-thumbnails');
    add_theme_support('automatic-feed-links');
    
    add_filter('init', array($this, 'register_menus'));
    add_filter('init', array($this, 'global_site_resets'));
    add_filter('init', array($this, 'register_acf_defaults'));
    add_filter('init', array($this, 'register_shortcodes'));
    add_filter('body_class', array($this, 'additional_body_classes'));
    add_filter('timber_context', array($this, 'add_to_context'));

    add_filter('get_twig', array($this, 'register_custom_filters'));
    
    parent::__construct();
  }
  
  // Add Data to Timber (twig) Context
  function add_to_context($context){

    $site_settings               = get_fields('options');
    $main_nav                    = new TimberMenu('main-nav'); // Remember to assign the 
    $context['menu']             = $main_nav; // Remember to assign the 
    $context['site']             = $this;
    $context['site_settings']    = $site_settings;

    $context['briteweb_url']     = 'http://briteweb.com';

    $social = array();
    foreach($site_settings['social_accounts'] as $v) {
      $social[$v['account_type']] = $v['account_url'];
    }

    foreach ($main_nav->get_items() as $item) {
      $context['post_' . $item->slug] = $item;
    }

    $context['social'] = $social;

    $this->context = $context;

    return $context;
  }


  function register_menus(){

    register_nav_menus( array(
      'main-nav'        => 'Main Navigation' ,  
      'footer-nav'      => 'Footer Navigation', 
    ));

  }

  function global_site_resets(){

    remove_action( 'wp_head', 'rsd_link' ); // windows live writer
    remove_action( 'wp_head', 'wlwmanifest_link' ); // index link
    remove_action( 'wp_head', 'index_rel_link' ); // previous link
    remove_action( 'wp_head', 'parent_post_rel_link', 10, 0 ); // start link
    remove_action( 'wp_head', 'start_post_rel_link', 10, 0 ); // links for adjacent posts
    remove_action( 'wp_head', 'adjacent_posts_rel_link_wp_head', 10, 0 ); // WP version
    remove_action( 'wp_head', 'wp_generator' ); // remove WP version from css
    remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
    
    add_filter('show_admin_bar', '__return_false'); // Hide Admin Bar from Front of site 
  }


  function register_acf_defaults(){
    
    if( function_exists('acf_add_options_page') ) {
      
      acf_add_options_page(array(
        'page_title'    => 'Site Settings',
        'menu_title'    => 'Site Settings',
        'menu_slug'     => 'site-general-settings',
        'capability'    => 'edit_posts',
        'redirect'      => false
      )); 
      
    }
    
  }

  function additional_body_classes($classes) {

    if(get_post()){
      global $post;
      $id = $post -> ID ;
       
      $current_theme = get_post_meta( $id, '_wp_page_template', true );

      // remove .page-template* classes
      foreach($classes as $key => $value) {
        if (substr($value, 0 , 13 ) === 'page-template') {
          unset($classes[$key]);
        }
      }

      $class  = '';
      $directory        = 'templates/';
      $directory_strlen = strlen($directory);
      // cleanup the class for the page templates inside page-templates directory
      if(substr($current_theme, 0 , $directory_strlen ) === $directory ) {
        $class = substr(substr($current_theme, $directory_strlen), 0, -4); // cleanup the class returned to match the page template's name
      }
      if($class != 'home') {
        $classes[] = $class;
      }

    }
    
    return $classes;
  }

  public function register_shortcodes() {

    $shortcodes = array(
      'social-nav' => function () {
        return Timber::compile('includes/nav-social.twig', $this->context);
      },

      'skillset' => function () {
        return Timber::compile('includes/skillset.twig', $this->context);
      },

      'site-email' => function () {
        return $this->$context['site_settings']['site_email_address'];
      }
    );

    foreach($shortcodes as $k => $v) {
      add_shortcode($k, $v);
    }

  }

  public function register_custom_filters($twig) {
    
    $twig->addFilter(new Twig_SimpleFilter('debug', array(&$this, 'twig_filter_debug')));
    $twig->addFilter(new Twig_SimpleFilter('file_content', array(&$this, 'twig_filter_file_content')));
    $twig->addFilter(new Twig_SimpleFilter('template_uri', array(&$this, 'twig_filter_template_uri')));
    $twig->addFilter(new Twig_SimpleFilter('assets_uri', array(&$this, 'twig_filter_assets_uri')));
    $twig->addFilter(new Twig_SimpleFilter('view_exists', array(&$this, 'twig_filter_view_exists')));

    return $twig;
  }

  public function twig_filter_debug($value) {
    class_exists('Kint') ? d($value) : var_dump($value);
    return $value;
  }

  public function twig_filter_file_content($string) {
    return !@file_get_contents($string) ? null : file_get_contents($string);
  }

  public function twig_filter_template_uri($string) {
    return get_stylesheet_directory_uri() . '/' . $string;
  }

  public function twig_filter_assets_uri($string) {
    return $this->twig_filter_template_uri(null) . 'assets/' . $string;
  }

  public function twig_filter_view_exists($view) {
    return file_exists(get_template_directory() . '/views/' . $view);
  }

}

$site = new StarterSite(); 

