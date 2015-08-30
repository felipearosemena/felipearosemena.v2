<?php 

/**
   Template Name: Content
 */

$context = Timber::get_context();
$post    = new TimberPost();
$context['post'] = $post;  

Timber::render('content.twig', $context);