<?php 

$context = Timber::get_context();
$post    = new TimberPost();
$context['post'] = $post;

$next_post =  get_adjacent_post(false,'',true);
if(!is_object($next_post) ) {
  $context['next_post'] = Timber::get_posts('post_type=project&posts_per_page=1&order=ASC')[0];
} else {
  $context['next_post'] = new TimberPost($next_post->ID);
}

if($post->agency) {
  $context['agency'] = new TimberPost($post->agency);
}

Timber::render('single-project.twig', $context);
