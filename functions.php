<?php  

define(AJAX_NAMESPACE, 'FA_AJAX');
define(AJAX_NONCE, 'fa-ajax-nonce');

// backend/administration
include('lib/admin.php');                           // Admin config
include('lib/util.php');                            // Utility functions
include('lib/thumbs.php');                          // Site Image Sizes
include('lib/scripts.php');                         // Scripts and Styles Enqeueuing
include('lib/forms.php');                           // Forms
include('lib/sidebars.php');                        // Site Sidebars
include('lib/widgets.php');                         // Site Widgets
include('lib/cpt.php');                             // Custom Post Types

// global theme configuration, always include last
include('lib/config.php');                          // Site config ( Load Last to ensure dependencies are present )


?>