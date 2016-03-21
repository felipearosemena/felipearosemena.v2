<?php

/**
 Template Name: Home
 */

$context = Timber::get_context();
$post    = new TimberPost();
$context['post'] = $post;

$context['projects'] = Timber::get_posts(array(
  'post_type' => 'project',
  'posts_per_page' => -1
));

Timber::render('home.twig', $context);


