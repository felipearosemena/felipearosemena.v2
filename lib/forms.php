<?php 

/** 
*
* Forms
*
*/

class ContactForm {

  public function __construct() {

    add_action( 'wp_ajax_submit_contact_form' , array(&$this, 'handle_submit_contact_form') );
    add_action( 'wp_ajax_nopriv_submit_contact_form', array(&$this, 'handle_submit_contact_form') );

  }

  public function handle_submit_contact_form() {

    // check nonce
    if ( ! wp_verify_nonce( $_POST['nonce'], AJAX_NONCE ) ) {
      die( 'The form is no longer valid, please refresh and try again' );
    }

    if (!isset($_POST['form_id'])) {
      die( 'No form id has been provided');
    }

    if(!class_exists(GFAPI)) {
      die('GFAPI is not defined');
    }


    /*
    
      Replace the form prefix to the default GF 'input_' format.
      This is a workaround to prevent GF capturing the form submission
    
    */

    $fields = array();
    foreach ($_POST as $k => $v) {
      if(strpos($k, FORM_FIELD_PREFIX) !== false) {
        $fields[str_replace(FORM_FIELD_PREFIX, GF_FIELD_PREFIX, $k)] = $v;
      }
    }

    $result = GFAPI::submit_form($_POST['form_id'], $fields);

    // generate the response
    $response = json_encode( $result );

    // response output
    header( "Content-Type: application/json" );
    echo $response;
    // IMPORTANT: don't forget to "exit"
    exit;
  }
}

new ContactForm();

