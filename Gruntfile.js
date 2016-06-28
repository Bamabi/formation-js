module.exports = function(grunt) {
	  var port = grunt.option('port') || 8001;
    var url = grunt.option('url') || "http://localhost:" + port;
    
  	// Grunt configuration
  	grunt.initConfig({

        /* -------------------------------------------------------------------*/
        /* -----------------------------DEV-----------------------------------*/
        /* -------------------------------------------------------------------*/
        open: {
            all: {
                // Gets the port from the connect configuration
                path: url
            }
        },
        connect: {
            dev: {
                options: {
                    port: port,
                    keepalive: true
                }
            },
           build: {
                options: {
                    base: 'dist',
                    port: port,
                    keepalive: true
                }
            }
        },
      
        clean: {
            dist: {
                src: [ 'dist/']
            },
            tmp: {
                src: ['.tmp']
            }
        },
         filerev: {
            options: {
              algorithm: 'md5',
              length: 16
            },
            dist: {
              src: 'dist/{js,css}/**'
            }
        
        },

        // Reads HTML for usemin blocks to enable smart builds that automatically
        // concat, minify and revision files. Creates configurations in memory so
        // additional tasks can operate on them
        useminPrepare: {
            html: 'index.html',
            options: {
                dest:'dist/',
                flow: {
                    html: {
                        steps: {
                            js: ['concat', 'uglifyjs'],
                            css: ['cssmin']
                        },
                        post: {}
                    }
                }
            }
        },
       
        // Performs rewrites based on rev and the useminPrepare configuration
        usemin: {
            html: ['dist/*.html'],
            options: {
                assetsDirs: ['dist']
            }
        },
        // Just copy index.html and font for bootstrap
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dest: 'dist',
                    src: [
                        '**/*.html'
                    ]
                }]
            },
            fonts: {
                 files: [{
                    expand: true,
                    flatten: true,
                    src: ['bower_components/bootstrap/fonts/**'],
                    dest: 'dist/fonts/',
                    filter: 'isFile'
                    }
             ]
            },
        }
  	});


 	// Dev tasks
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-open');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-usemin');
    grunt.loadNpmTasks('grunt-filerev');

  	// Tasks definition
    grunt.registerTask('default', ['open', 'connect:dev']);
    grunt.registerTask('build', [
        'clean:dist', 
        'useminPrepare',
        'concat', 
        'copy', 
        'cssmin', 
        'uglify',
        'filerev',
        'usemin', 
        'clean:tmp',
         // To test release in web browser
        'open',
        'connect:build'
    ]);

}


