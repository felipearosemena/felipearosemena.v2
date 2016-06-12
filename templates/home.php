<?php

/**
 Template Name: Home
 */

$context = Timber::get_context();
$post    = new TimberPost();
$context['post'] = $post;
$context['contact'] = new TimberPost(62);
$context['about'] = new TimberPost(60);

Timber::render('home.twig', $context);


