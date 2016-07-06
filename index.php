<?php 

$context                    = Timber::get_context();
$context['post']            = Timber::get_post(get_option('page_for_posts'));
$context['posts']           = Timber::get_posts();
$context['sidebar']         = Timber::get_widgets('sidebar-blog'); // slug of sidebar to be included in this template
$context['categories_list'] = wp_list_categories('echo=0&title_li=');  

//  Accepts same array as argument as paginate_links(). Must be array.
$context['pagination']      = Timber::get_pagination(); 


Timber::render('index.twig', $context);