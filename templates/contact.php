<?php 

/**
   Template Name: Contact
 */

$context = Timber::get_context();
$post    = new TimberPost();
$context['post'] = $post;

$context['form_fields'] = array(

  array(
    'name' => 'test',
    'type' => 'text',
    'label' => 'My email address is:',
    'placeholder' => 'address@somewhere.biz'
  ),

  array(
    'name' => 'contact-reason',
    'type' => 'select',
    'label' => 'Hello! I\'m reaching out because:',
    'options' => [
      array(
        'value' => '1',
        'label' => 'I\'d like to hire you',
      ),

      array(
        'value' => '2',
        'label' => 'I have an idea I would want to share with you',
      ),

      array(
        'value' => '3',
        'label' => 'Just looking to connect',
      )
      
    ]
  )


);

Timber::render('contact.twig', $context);