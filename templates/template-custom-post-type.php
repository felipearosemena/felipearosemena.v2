<?php 
/**
 Template Name: Custom Post Type ( Rename )
 */


$cpt_name = 'custom_post_type_name';

global $paged;
if (!isset($paged) || !$paged){
    $paged = 1;
}
$context = Timber::get_context();
$args = array(
    'post_type' => $cpt_name, 
    'paged' => $paged,
    'posts_per_page' => 3
);

/* THIS LINE IS CRUCIAL */
/* in order for WordPress to know what to paginate */
/* your args have to be the default query */
query_posts($args);

$context['posts']           = Timber::get_posts();
$context['page_title']      = get_the_title();
$context['sidebar']         = Timber::get_widgets('sidebar-blog'); // slug of sidebar to be included in this template

//  Accepts same array as argument as paginate_links(). Must be array.
$context['pagination']      = Timber::get_pagination(); 

Timber::render('index.twig', $context);
