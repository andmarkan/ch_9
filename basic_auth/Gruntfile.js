module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    concurrent: {
      dev: {
        tasks: ['nodemon:frontend', 'nodemon:api'],
        options: {
          logConcurrentOutput: true
        }
      }
    },

    nodemon: {
      frontend: {
        script: 'server.js',
        options: {
          env: {
            PORT: '5000'
          }
        }
      },
      api: {
        script: 'api.js',
        options: {
          env: {
            PORT: '5001'
          }
        }
      }
    },

    watch: {
      scripts: {
        files: 'app/**/*.js',
        tasks: ['browserify'],
        options: {
          interrupt: true
        }
      },
      templates: {
        files: 'app/**/*.hbs',
        tasks: ['handlebars'],
        options: {
          interrupt: true
        }
      },
    },

    handlebars: {
      compile: {
        options: {
          namespace: false,
          commonjs: true,
          processName: function(filename) {
            return filename.replace('app/templates/', '').replace('.hbs', '');
          }
        },
        src: "app/templates/**/*.hbs",
        dest: "app/templates/compiledTemplates.js"
      }
    },

    browserify: {
      options: {
        debug: true,
        aliasMappings: [
          {
            cwd: 'app/',
            src: ['**/*.js'],
            dest: 'app/'
          }
        ]
      },
      app: {
        src: [ 'app/**/*.js' ],
        dest: 'static/bundle.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-handlebars');
  grunt.loadNpmTasks('grunt-contrib-watch');


  grunt.registerTask('compile', ['handlebars', 'browserify']);

  // Run the server and watch for file changes
  grunt.registerTask('server', ['compile', 'concurrent:dev', 'watch']);

  // Default task(s).
  grunt.registerTask('default', ['compile']);

};
