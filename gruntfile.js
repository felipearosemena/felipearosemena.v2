'use strict';
module.exports = function(grunt) {
    // Load all tasks
    require('load-grunt-tasks')(grunt); 

    // Show elapsed time
    require('time-grunt')(grunt);
 
    grunt.initConfig({
        sass: {
            options: {
                sourceMap: true,
                outputStyle: 'compressed'
            },
            dist: {
                files: {
                    'css/main.css': 'scss/main.scss', 
                }
            } 
        },
        concat: {
            options: {
                separator: ';',
            },
            dist: {
                src: 'js/main.js',
                dest: 'js/main.min.js'
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
                    'js/main.min.js': 'js/main.min.js'
                }
            }
        },
        autoprefixer: {
            options: {
                browsers: ['last 2 versions', 'ie 9', 'Firefox > 23', 'Chrome > 23', 'ios >= 6', 'android 2.3', 'android 4', 'opera 12']
            }, 
            build: {
                src: 'css/main.css'
            }
        },
        modernizr: {
            build: {
                devFile: 'bower_components/modernizr/modernizr.js',
                outputFile: 'js/modernizr-custom.min.js',
                files: {
                    'src': [
                        ['js/main.js'],
                        ['css/main.css']
                    ]
                },
                extra: {    
                    mq: true,
                    touch: true,
                    flexbox:true,
                    csstransforms:true
                },
                uglify: true,
                parseFiles: true
            }
        },

        requirejs : {
            release:{
                options: {
                    mainConfigFile: "js/config.js",
                    generateSourceMaps: true,
                    include: ["main"],
                    out: "js/main.min.js",
                    optimize: "uglify2",
                    baseUrl: "/Users/Felipe/Sites/starterdeck/js",

                    paths:{
                      "almond": "../bower_components/almond/almond",
                    },

                    // Include a minimal AMD implementation shim.
                    name: "almond",

                    // Wrap everything in an IIFE.
                    wrap: true,

                    // Do not preserve any license comments when working with source maps.
                    // These options are incompatible.
                    preserveLicenseComments: false,
                }
            }

        }, 

        watch: {
            sass: {
                files: [
                    'scss/*.scss',
                    'scss/**/*.scss'
                ],
                tasks: ['sass:dist', 'autoprefixer:build']
            },
            js: {
                files: [
                    'main.js'
                ],
                tasks: ['concat', 'uglify']
            },
            livereload: {
                // Browser live reloading
                // https://github.com/gruntjs/grunt-contrib-watch#live-reloading
                options: {
                    livereload: true,
                },
                files: [
                    'css/main.css',
                    'js/main.js',  
                    '**/*.php',
                    '*.php'
                ]
            }
        }

    }); 

    // Register tasks
    grunt.registerTask('default', [
        'build'
    ]); 

    grunt.registerTask('build', [
        'sass:dist',
        'autoprefixer:build',
        'concat',
        'uglify',
        'modernizr' 
    ]);
};