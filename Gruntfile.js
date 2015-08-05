var path = require('path');
module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);
  grunt.initConfig({
    browserify: {
      options: {
        transform: ['reactify'],
        extensions: ['.js'],
        debug: true 
      },
      dist: {
        files: {
          './public/js/bundle.js': [
            './public/js/app.js',
            './public/js/**/*/js'
          ]
        }
      }
    },
    watch : {
      app: {
        files: ['./public/js/app.js', './public/js/**/*.js'],
        options: {
          livereload: true
        },
        tasks: ['browserify']
      }
    }
  });

  grunt.registerTask('default', ['browserify', 'watch']);
};