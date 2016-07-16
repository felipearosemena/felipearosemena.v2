<?php

/**
 Template Name: Work
 */

$context = Timber::get_context();
$post    = new TimberPost();
$context['post'] = $post;

Timber::render('work.twig', $context);

