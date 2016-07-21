<?php 

/*

    Thumbs

    Image Configuration

*/

// Thumbnail sizes
add_image_size('masthead', 1920);
add_image_size('full', 9999);
add_image_size('featured', 1600);
add_image_size('featured-md', 1200, 675, array('center', 'top'));
add_image_size('featured-sm', 800, 450, array('center', 'top'));
// add_image_size('grid-2'  , 600 );
// add_image_size('grid-3'  , 450 );
// add_image_size('grid-4'  , 300 );
// add_image_size('brand'   , 300);
/*
to add more sizes, simply copy a line from above
and change the dimensions & name. As long as you
upload a "featured image" as large as the biggest
set width or height, all the other sizes will be
auto-cropped.

To call a different size, simply change the text
inside the thumbnail function.

For example, to call the 300 x 300 sized image,
we would use the function:
<?php the_post_thumbnail( 'drive-thumb-300' ); ?>
for the 600 x 100 image:
<?php the_post_thumbnail( 'drive-thumb-600' ); ?>

You can change the names and dimensions to whatever
you like. Enjoy!
*/
 

// Expose Custom Image Sizes for the insert Media
function lms_show_image_sizes($sizes) {
    $sizes['masthead'] = 'Masthead';
    $sizes['featured'] = 'featured';
    $sizes['grid-2']   = '2 Column Grid';
    $sizes['grid-3']   = '3 Column Grid';
    $sizes['grid-4']   = '4 Column Grid';
 
    return $sizes;
}

add_filter('image_size_names_choose', 'lms_show_image_sizes');


// Make Media Items have no link by default
function lms_imagelink_setup() {
    $image_set = get_option( 'image_default_link_type' );
    
    if ($image_set !== 'none') {
        update_option('image_default_link_type', 'none');
    }
}

add_action('admin_init', 'lms_imagelink_setup', 10);

// Additional custom classes for images inserted through the wp-editor
function lms_add_classes_to_images($html) {

    $html = str_replace('align','js-wp-editor-img align', $html);
    return $html;

}

add_filter('image_send_to_editor', 'lms_add_classes_to_images',10,8);

// Remove inline styles inserted by WP when inserting a gallery into the editor
add_filter( 'use_default_gallery_style', '__return_false' );

