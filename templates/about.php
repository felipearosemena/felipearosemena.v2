<?php

/**
 Template Name: About
 */

$context = Timber::get_context();
$post    = new TimberPost();
$context['post'] = $post;

$context['related_project'] = Timber::get_post('post_type=project&posts_per_page=1');

Timber::render('about.twig', $context);


