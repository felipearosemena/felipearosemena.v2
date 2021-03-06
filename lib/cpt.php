<?php 

/** 
*
* Custom Post Type Registration
*
*/

class CustomPostTypes
{

  // Place post types here. Singular and plural will be used to auto generate labels. Labels and args will overwrite defaults.
  protected $posttypes = [
    'project' => [
      'singular' => 'Project',
      'labels'   => [],
      'args'     => [
        'menu_icon' => 'dashicons-images-alt',
        'supports' => array('title', 'editor', 'thumbnail', 'excerpt', 'page-attributes')
      ],
    ],

    'agency' => [
      'singular' => 'Agency',
      'labels'   => [],
      'args'     => [
        'menu_icon' => 'dashicons-groups',
        'supports' => array('title'),
        'has_archive' => false
      ],
    ],
  ];

  // Default arguments to use for register_post_type
  protected $default_args = [
    'public'      => true,
    'has_archive' => true,
  ];


  public function __construct()
  {
    add_action( 'init', array( &$this, 'init__registerPostTypes' ), 1 );
  } /* __construct() */


  /**
   * Generate and register post types defined in $posttypes
   *
   * @author Tanner McColeman
   * @package CustomPostTypes.php
   */

  public function init__registerPostTypes()
  {
    foreach ( $this->posttypes as $slug => $options ) {
      $this->dynamicRegisterPostType($slug, $options);
    }

  } /* init__registerPostTypes() */


  /**
   * Register a post type with minimal effort
   *
   * @author Tanner McColeman <tanner@briteweb.com>
   * @package briteweb/package
   * @since 1.0.0
   * @param (string) $slug - The post type slug
   * @param (array) $options - Arguments to overwrite defaults (accepts singular, plural, labels, args)
   * @return (object | WP_Error) The registered post type object, or an error object
   */

  private function dynamicRegisterPostType($slug, $options)
  {
    if ( empty( $options['singular'] ) ) {
      $singular = preg_replace( '%[-_]%', ' ', $slug );
      $singular = ucwords( $singular );
    } else {
      $singular = $options['singular'];
    }

    $plural = ( empty( $options['plural'] ) ) ? $singular.'s' : $options['plural'];

    $labels = array(
      'name'               => __( $plural ),
      'singular_name'      => __( $singular ),
      'menu_name'          => __( $plural ),
      'name_admin_bar'     => __( $singular ),
      'add_new'            => _x( 'Add New', $singular ),
      'add_new_item'       => __( 'Add New '.$singular ),
      'new_item'           => __( 'New '.$singular ),
      'edit_item'          => __( 'Edit '.$singular ),
      'view_item'          => __( 'View '.$singular ),
      'all_items'          => __( 'All '.$plural ),
      'search_items'       => __( 'Search ' . $plural . '' ),
      'parent_item_colon'  => __( 'Parent ' . $plural . ':' ),
      'not_found'          => __( 'No ' . $plural . ' found.' ),
      'not_found_in_trash' => __( 'No ' . $plural . ' found in Trash.' ),
    );

    if ( !empty( $options['labels'] ) ) {
      $labels = array_merge( $labels, $options['labels'] );
    }

    $args = $this->default_args;
    $args['labels'] = $labels;
    $args['rewrite'] = array( 'slug' => $slug );

    if ( !empty( $options['args'] ) ) {
      $args = array_merge( $args, $options['args'] );
    }

    return register_post_type( $slug, $args );

  } /* dynamicRegisterPostType() */

}

$custom_post_types = new CustomPostTypes();
