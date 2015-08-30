<?php  

/// Helper libraries
include('lib/kint/Kint.class.php');                 // Debugging tool

// backend/administration
include('lib/admin.php');                           // Admin config

// global dependencies
include('lib/timber/timber.php');                   // Timber library

include('lib/util.php');                            // Utility functions
include('lib/thumbs.php');                          // Site Image Sizes

include('lib/scripts.php');                         // Scripts and Styles Enqeueuing
include('lib/sidebars.php');                        // Site Sidebars
include('lib/widgets.php');                         // Site Widgets

// extra packages/configurations
if (class_exists( 'GFForms' ) ) {
    include('lib/gravity-forms-config.php');        // Gravity Forms config
} 

// global theme configuration, always include last
include('lib/config.php');                          // Site config ( Load Last to ensure dependencies are present )


?>