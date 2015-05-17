'use strict';
module.exports = function(grunt) {
    // Load all tasks
    require('load-grunt-tasks')(grunt);
    // Show elapsed time
    require('time-grunt')(grunt);

    var jsVendorList = [
        'assets/vendor/jquery-easing/jquery.easing.js',
        'assets/vendor/bootstrap/js/transition.js',
        'assets/vendor/bootstrap/js/collapse.js',
        'assets/vendor/flexslider/jquery.flexslider.js',
        'assets/vendor/imagesloaded/imagesloaded.pkgd.js',
    ];

    var jsFileList = [
        'assets/js/custom-plugins/_*.js',
        'assets/js/_*.js',
    ];

    grunt.initConfig({
        sass: {
            options: {
                sourceMap: true,
                outputStyle: 'compressed'
            },
            dist: {
                files: {
                    'assets/css/styles.css': 'assets/scss/styles.scss',
                    'assets/css/login.css': 'assets/scss/login.scss',
                    'assets/css/admin.css': 'assets/scss/admin.scss'
                }
            } 
        },
        concat: {
            options: {
                separator: ';',
            },
            dist: {
                src: [jsVendorList, jsFileList],
                dest: 'assets/js/scripts.js',
            },
        },
        uglify: {
            options: {
                compress: {
                    drop_console: true
                }
            },
            my_target: {
                files: {
                    'assets/js/scripts.min.js': ['assets/js/scripts.js']
                }
            }
        },
        rename: {
            icomoon: {
                files: [{
                    src: ['assets/vendor/icomoon/style.css'],
                    dest: 'assets/vendor/icomoon/style.scss'
                }, ]
            }
        },
        autoprefixer: {
            options: {
                browsers: ['last 2 versions', 'ie 9', 'Firefox > 23', 'Chrome > 23', 'ios >= 6', 'android 2.3', 'android 4', 'opera 12']
            },
            dev: {
                src: 'assets/css/styles.css'
            },
            build: {
                src: 'assets/css/styles.min.css'
            }
        },
        modernizr: {
            build: {
                devFile: 'assets/vendor/modernizr/modernizr.js',
                outputFile: 'assets/js/modernizr-custom.min.js',
                files: {
                    'src': [
                        ['assets/js/scripts.min.js'],
                        ['assets/css/styles.min.css']
                    ]
                },
                extra: {
                    mq: true,
                    touch: true
                },
                uglify: true,
                parseFiles: true
            }
        },
        watch: {
            sass: {
                files: [
                    'assets/scss/*.scss',
                    'assets/scss/**/*.scss',
                    'woocommerce/*.scss'
                ],
                tasks: ['sass:dist', 'autoprefixer:dev', 'modernizr']
            },
            js: {
                files: [
                    jsVendorList, jsFileList
                ],
                tasks: ['concat']
            },
            rename: {
                files: ['assets/vendor/icomoon/*'],
                tasks: ['rename']
            },
            livereload: {
                // Browser live reloading
                // https://github.com/gruntjs/grunt-contrib-watch#live-reloading
                options: {
                    livereload: true,
                },
                files: [
                    'assets/css/styles.css',
                    'assets/js/scripts.js',
                    'assets/js/app.js',
                    'templates/*.php',
                    'partials/*.php',
                    '*.php'
                ]
            }
        }
    });

    // Register tasks
    grunt.registerTask('default', [
        'dev'
    ]);
    grunt.registerTask('dev', [
        'sass:dist',
        'autoprefixer:dev',
        'concat',
        'modernizr'
    ]);
    grunt.registerTask('build', [
        'sass:dist',
        'autoprefixer:build',
        'concat',
        'uglify',
        'modernizr',
        'rename'
    ]);
};