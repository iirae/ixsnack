module.exports = function ( grunt ) {
    'use strict';

    var pkg = grunt.file.readJSON( 'package.json' ),
        comment = '/**\n * <%= pkg.name %> - Javascript Library (jQuery plugin)\n * jQuery v1.8~ (http://jquery.com) + ixBand v1.0~ (http://ixband.com)\n * @version v<%= pkg.buildVersion %> (<%= grunt.template.today("yymmddHHMM") %>)\n * The MIT License (MIT), http://ixsnack.com\n */\n';

    // Project configuration.
    grunt.initConfig({
        pkg: pkg,
        'concat': {
            options: {
                separator: '\n\n\n',
                stripBanners: true,
                banner: comment + ";(function ( $, $B ) {\n    'use strict';\n\n",
                process: function( src, filepath ) {
                    var result = src.replace( /VERSION: '',/, "VERSION: '" + pkg.buildVersion + "'," );
                    return result.replace( /^/gm, '    ' );
                },
                footer: '\n})( jQuery, ixBand );'
            },
            dist: {
                src: [
                    'src/main.js',
                    'src/plugin.js',
                    'src/ListIndexManager.js',
                    'src/ThumbController.js',
                    'src/SlideMax.js',
                    'src/SlideLite.js',
                    'src/OverlayList.js',
                    'src/OverlayList.Motion.js',
                    'src/OverlayList.OverlayMotion.js',
                    'src/OverlayList.SlideMotion.js',
                    'src/BaseSlider.js',
                    'src/Slider.js',
                    'src/RangeSlider.js'
                ],
                dest: 'bin/v<%= pkg.version %>/<%= pkg.name %>_<%= pkg.version %>.js'
            }
        },
        'uglify': {
            options: {
                banner: comment,
                ASCIIOnly: true
            },
            my_target: {
                files: [{
                    expand: true,
                    cwd: 'bin/v<%= pkg.version %>',
                    src: ['<%= pkg.name %>_<%= pkg.version %>.js'],
                    dest: 'bin/v<%= pkg.version %>/',
                    rename: function ( dest, src ) {
                        return dest + src.replace( /.js$/, '.min.js' );
                    }
                }]
            }
        },
        'string-replace': {
            dist: {
                files: [{
                    expand: true,
                    cwd: 'test/',
                    src: '**/*',
                    dest: 'test/'
                }],
                options: {
                    //ixBand new version source
                    replacements: [{
                        pattern: /\/v[0-9.]+\//g,
                        replacement: '/v' + pkg.version + '/'
                    }, {
                        pattern: /\/ixBand_([0-9.]+)(.min)*.js/g,
                        replacement: function ( match, p1, p2 ) {
                            return '/ixSnack_' + pkg.version + ( p2 || '' ) + '.js';
                        }
                    }]
                }
            }
        },
        'watch': {
            template: {
                options: {
                    liereload: true
                },
                files: ['src/**/*.js'],
                tasks: ['concat']
            }
        }
    });

    grunt.loadNpmTasks( 'grunt-contrib-watch' );
    grunt.loadNpmTasks( 'grunt-contrib-uglify' );
    grunt.loadNpmTasks( 'grunt-contrib-concat' );
    grunt.loadNpmTasks( 'grunt-string-replace' );

    // Default task(s).
    grunt.registerTask( 'default', ['concat', 'watch'] );
    //JS compress
    grunt.registerTask( 'compress', ['uglify'] );
    //*.html ixband version replace
    grunt.registerTask( 'html-replace', ['string-replace'] );
};