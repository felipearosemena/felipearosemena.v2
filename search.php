<?php 

$templates = array('search.twig', 'archive.twig', 'index.twig');
$context = Timber::get_context();
$context['page_title'] = 'Search results for "'. get_search_query(). '"';
$context['query'] = get_search_query();
$context['posts'] = Timber::get_posts();

// If the query is for a specific posts type, we display the results in that
// post types archive template, falling back to index.twig
if( isset($_GET['post_type']) ) {
    $context['sidebar']         = Timber::get_widgets('sidebar-blog'); // slug of sidebar to be included in this template
    $context['categories_list'] = wp_list_categories('echo=0&title_li=');
    $templates = array('archive-' . $_GET['post_type'] . '.twig', 'index.twig' );
}

//  Accepts same array as argument as paginate_links(). Must be array.
$context['pagination']      = Timber::get_pagination(); 

Timber::render($templates, $context);