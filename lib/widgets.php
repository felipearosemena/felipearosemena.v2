<?php 


/*

    Widgets

*/


/*

    Page Navigation Widget

*/
class Page_Nav_Widget extends WP_Widget {

    /**
     * Register widget with WordPress.
     */
    function __construct() {
        parent::__construct(
            'page_navigation', // Base ID
            'Page Navigation', // Name
            array( 'description' => 'Displays subpages of the current page' ) // Args
        );
    }

    /**
     * Front-end display of widget.
     *
     * @see WP_Widget::widget()
     *
     * @param array $args     Widget arguments.
     * @param array $instance Saved values from database.
     */
    public function widget( $args, $instance ) {
        $items = $this->get_widget_items();

        if(!empty($items)) {

            echo $args['before_widget'];
            if ( ! empty( $instance['title'] ) ) {
                echo $args['before_title'] . apply_filters( 'widget_title', $instance['title'] ). $args['after_title'];
            }
            
            echo '<ul>'.$this->get_widget_items().'</ul>';

            echo $args['after_widget'];
            
        }
    }

    public static function get_widget_items() {

        global $post;

        $submenu; $child_of;

        // Using Submenu for pages
        if( get_post_type() == 'page' && is_page() ) {
            // If page has parent, use the 
            // parent page as the starting point 
            if($post->post_parent !== 0) {
                $child_of = $post->post_parent;
            } else {
            // Otherwise use the current page as a start
                $child_of = $post->ID;
            }

            $args    = array(
                'child_of' => $child_of,
                'echo'     => 0,
                'depth'    => 1,
                'title_li' => '' );

            $submenu = wp_list_pages($args);
        
        }

        if(isset($submenu)){
            return $submenu;
        }
    
    }

    /**
     * Back-end widget form.
     *
     * @see WP_Widget::form()
     *
     * @param array $instance Previously saved values from database.
     */
    public function form( $instance ) {
        $title = ! empty( $instance['title'] ) ? $instance['title'] : __( 'New title', 'text_domain' );
        ?>
        <p>
        <label for="<?php echo $this->get_field_id( 'title' ); ?>"><?php _e( 'Title:' ); ?></label> 
        <input class="widefat" id="<?php echo $this->get_field_id( 'title' ); ?>" name="<?php echo $this->get_field_name( 'title' ); ?>" type="text" value="<?php echo esc_attr( $title ); ?>">
        </p>
        <?php 
    }

    /**
     * Sanitize widget form values as they are saved.
     *
     * @see WP_Widget::update()
     *
     * @param array $new_instance Values just sent to be saved.
     * @param array $old_instance Previously saved values from database.
     *
     * @return array Updated safe values to be saved.
     */
    public function update( $new_instance, $old_instance ) {
        $instance = array();
        $instance['title'] = ( ! empty( $new_instance['title'] ) ) ? strip_tags( $new_instance['title'] ) : '';

        return $instance;
    }

}; // class Foo_Widget

add_action('widgets_init', function(){
    register_widget('Page_Nav_Widget');
});