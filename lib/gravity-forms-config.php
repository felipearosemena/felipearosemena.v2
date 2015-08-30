<?php

/*

    Gravity Forms Configuration

*/

add_filter('gform_field_css_class', 'config_classes', 10, 3);

function config_classes($classes, $field, $form) {
    
    $classes.= ' gfield--' . $field['type'];
    return $classes;
}

// Move Gravity Form Scripts to the footer
add_filter( 'gform_init_scripts_footer', '__return_true' );