<?php 

$context = Timber::get_context();
$post    = new TimberPost();
$context['post'] = $post;  
$context['share_post'] = new SharePost;

// Previous/Next post links
$prev_post =  get_adjacent_post(false,'',false);
$next_post =  get_adjacent_post(false,'',true);

if(is_object($prev_post)) {
    $context['prev_post'] = new TimberPost($prev_post->ID);
} 
if(is_object($next_post) ) {
    $context['next_post'] = new TimberPost($next_post->ID);
}

Timber::render('single.twig', $context);
