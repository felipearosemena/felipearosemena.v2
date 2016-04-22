<?php 

/** 
*
* Forms
*
*/

add_action( 'wp_ajax_submit_contact_form' , 'handle_submit_contact_form' );
add_action( 'wp_ajax_nopriv_submit_contact_form', 'handle_submit_contact_form' );

function handle_submit_contact_form() {
  // check nonce
  $nonce = $_POST['nonce'];

  if ( ! wp_verify_nonce( $nonce, AJAX_NONCE ) ) {
    die( 'The form is no longer valid, please refresh and try again' );
  }

  // generate the response
  $response = json_encode( $_POST );

  // response output
  header( "Content-Type: application/json" );
  echo $response;
  // IMPORTANT: don't forget to "exit"
  exit;
}