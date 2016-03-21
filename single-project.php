<?php 

$context = Timber::get_context();
$post    = new TimberPost();
$context['post'] = $post;

$context['videos'] = array(
  array(
    'src' => 'http://felipearosemena.v2.dev/wp-content/uploads/2016/03/aj-tailor-3.mp4',
    'type' => 'mp4'
  )
);

// Previous/Next post links
$prev_post =  get_adjacent_post(false,'',false);
if(!is_object($prev_post)) {
  $context['prev_post'] = Timber::get_posts('post_type=project&posts_per_page=1&order=DESC')[0];
} else {
  $context['prev_post'] = new TimberPost($prev_post->ID);
}

$next_post =  get_adjacent_post(false,'',true);
if(!is_object($next_post) ) {
  $context['next_post'] = Timber::get_posts('post_type=project&posts_per_page=1&order=ASC')[0];
} else {
  $context['next_post'] = new TimberPost($next_post->ID);
}

Timber::render('single-project.twig', $context);
