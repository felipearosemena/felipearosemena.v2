<?php 

/**
   Template Name: Contact
 */

$context = Timber::get_context();
$post    = new TimberPost();
$context['post'] = $post;
$context['gf_contact_form'] = class_exists('GFAPI') ? GFAPI::get_form(1) : [];

Timber::render('contact.twig', $context);