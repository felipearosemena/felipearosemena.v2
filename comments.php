<?php

/*
    The template for displaying comments
   
    The area of the page that contains both current comments
    and the comment form.
 */

/*
    If the current post is protected by a password and
    the visitor has not yet entered the password we will
    return early without loading the comments.
 */
    
if ( post_password_required() ) {
    return;
}

$comment_list_args = array(
    'avatar_size' => 0,
    'callback' => 'lms_comment_tag' // Defined in lib/comment.php
);

ob_start();
wp_list_comments($comment_list_args);
$comments = ob_get_clean();

$comment_form_args = array(
    'comment_notes_after' => ''
);

$context['comment_list']   = $comments;
$context['comments_open']  = comments_open();
$context['comments']       = get_comments('post_id='.$post->ID);
$context['comment_form']   = TimberHelper::get_comment_form( null, $comment_form_args );

Timber::render('includes/comments.twig', $context);

?>
