<?php

$templates = array('archive.twig', 'index.twig');
$context = Timber::get_context();

$context['page_title'] = get_the_title(get_option('page_for_posts', true));

if (is_day()) {
    $context['page_title'] = 'Archive: ' . get_the_date('D M Y');
} 
else if (is_month()) {
    $context['page_title'] = 'Archive: ' . get_the_date('M Y');
} 
else if (is_year()) {
    $context['page_title'] = 'Archive: ' . get_the_date('Y');
} 
else if (is_tag()) {
    $context['page_title'] = single_tag_title('', false);
} 
else if (is_category()) {
    $context['page_title'] = single_cat_title('', false);
    array_unshift($templates, 'archive-' . get_query_var('cat') . '.twig');
} 
else if (is_post_type_archive()) {
    $context['page_title'] = post_type_archive_title('', false);
    array_unshift($templates, 'archive-' . get_post_type() . '.twig');
}

$context['posts'] = Timber::get_posts();
$context['sidebar'] = Timber::get_widgets('sidebar-blog'); // slug of sidebar to be included in this template

//  Accepts same array as argument as paginate_links(). Must be array.
$context['pagination'] = Timber::get_pagination();

$context['categories_list'] = wp_list_categories('echo=0&title_li=');

Timber::render($templates, $context);
