<?php

/*

    Admin

    Admin area configuration

*/ 

function login_screen_url() {
    return home_url();
};

add_filter('login_headerurl', 'login_screen_url');

function login_logo() { ?>
    <style type="text/css">
        #login h1 a {
            background-image: url("<?php echo get_field('site_logo', 'options') ['url']; ?>");
        }
    </style>
<?php
}
add_action('login_enqueue_scripts', 'login_logo');  