<?php 

/**
   Template Name: Contact
 */

$context = Timber::get_context();
$post    = new TimberPost();
$context['post'] = $post;

$context['form_fields'] = array(

  array(
    'name' => 'contact-reason',
    'type' => 'select',
    'label' => 'Hello! I\'m reaching out because',
    'options' => [
      array(
        'value' => '1',
        'label' => 'I\'d like to hire your services',
      ),

      array(
        'value' => '2',
        'label' => 'I have an idea I would want to share with you',
      ),

      array(
        'value' => '3',
        'label' => 'I\'m looking to connect',
      )
      
    ]
  ),

  array(
    'name' => 'email_address',
    'type' => 'email',
    'label' => 'My email address is',
    'placeholder' => 'address@somewhere.biz'
  ),

  // array(
  //   'name' => 'contact_name',
  //   'type' => 'text',
  //   'label' => 'My name is',
  //   'placeholder' => 'Jhon Appleseed',
  //   'required' => false
  // ),

  array(
    'name' => 'budget',
    'type' => 'radio',
    'label' => 'My budget is',
    'options' => [
      array(
        'value' => 0,
        'checked' => true,
        'label' => 'Not defined yet'
      ),
      array(
        'value' => 1,
        'label' => 'Around <b>$1000</b>'
      ),

      array(
        'value' => 2,
        'label' => 'Close to <b>$5000</b>'
      ),

      array(
        'value' => 3,
        'label' => 'More like <b>$10000+</b>'
      )
    ]
  ),

);

Timber::render('contact.twig', $context);