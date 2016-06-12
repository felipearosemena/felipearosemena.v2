<?php 

/* 

    Sidebars

    Registering and Configuring Site Sidebars

*/

function register_site_sidebars(){

    // Primary Sidebar
    $sidebar_page_args = array(
        'name'          => 'Page Sidebar',
        'id'            => 'sidebar-page',
        'description'   => '',
      'class'         => '',
        'before_widget' => '<li id="%1$s" class="widget %2$s">',
        'after_widget'  => '</li>',
        'before_title'  => '<h2 class="widget-title">',
        'after_title'   => '</h2>'  
    );

    register_sidebar($sidebar_page_args);

    // Primary Sidebar
    $sidebar_blog_args = array(
        'name'          => 'Blog Sidebar',
        'id'            => 'sidebar-blog',
        'description'   => '',
      'class'         => '',
        'before_widget' => '<li id="%1$s" class="widget %2$s">',
        'after_widget'  => '</li>',
        'before_title'  => '<h2 class="widget-title">',
        'after_title'   => '</h2>'  
    );

    register_sidebar($sidebar_blog_args);

    $sidebar_contact_args = array(
        'name'          => 'Contact Sidebar',
        'id'            => 'sidebar-contact',
        'description'   => '',
      'class'         => '',
        'before_widget' => '<li id="%1$s" class="widget %2$s">',
        'after_widget'  => '</li>',
        'before_title'  => '<h2 class="widget-title">',
        'after_title'   => '</h2>'  
    );

    register_sidebar($sidebar_contact_args);

}

add_action('widgets_init', 'register_site_sidebars');

