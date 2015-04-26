<?php

$templates = array('archive.twig', 'index.twig');
$context = Timber::get_context();
$context['title'] = 'Archive';

if (is_day()) {
    $context['title'] = 'Archive: ' . get_the_date('D M Y');
} 
else if (is_month()) {
    $context['title'] = 'Archive: ' . get_the_date('M Y');
} 
else if (is_year()) {
    $context['title'] = 'Archive: ' . get_the_date('Y');
} 
else if (is_tag()) {
    $context['title'] = single_tag_title('', false);
} 
else if (is_category()) {
    $context['title'] = single_cat_title('', false);
    array_unshift($templates, 'archive-' . get_query_var('cat') . '.twig');
} 
else if (is_post_type_archive()) {
    $context['title'] = post_type_archive_title('', false);
    array_unshift($templates, 'archive-' . get_post_type() . '.twig');
}

$context['posts'] = lms_get_posts();

$context['page_title'] = get_the_title(get_option('page_for_posts', true));
$context['sidebar'] = Timber::get_widgets('sidebar-blog'); // slug of sidebar to be included in this template

//  Accepts same array as argument as paginate_links(). Must be array.
$context['pagination'] = Timber::get_pagination();

$context['categories_list'] = wp_list_categories('echo=0&title_li=');

Timber::render($templates, $context);
