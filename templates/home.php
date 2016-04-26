<?php

/**
 Template Name: Home
 */

$context = Timber::get_context();
$post    = new TimberPost();
$context['post'] = $post;
$context['contact'] = new TimberPost(62);

Timber::render('home.twig', $context);


