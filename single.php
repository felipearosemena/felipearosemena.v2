<?php 

$context = Timber::get_context();
$post    = new TimberPost();
$context['post'] = $post;   

$next_post =  get_adjacent_post(false,'',true);
if(!is_object($next_post) ) {
  $context['next_post'] = Timber::get_posts('post_type=post&posts_per_page=1&order=ASC')[0];
} else {
  $context['next_post'] = new TimberPost($next_post->ID);
}

Timber::render('page.twig', $context);
