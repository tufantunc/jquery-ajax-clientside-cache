'use strict';
module.exports = function(grunt) {

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-clean');

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('jquery-ajax-clientside-cache.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= _.map(pkg.authors, "name").join(", ") %>;' +
      ' Licensed <%= _.map(pkg.licenses, "type").join(", ") %> */\n',
    // Task configuration.
    clean: {
      src: ['dist']
    },
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      dist: {
        src: ['src/jquery.ajaxclientsidecache.js'],
        dest: 'dist/jquery.ajaxclientsidecache.js'
      },
    },
    jshint: {
      options: {
        globals: {
          jshintrc: '.jshintrc'
        }
      },
      file: ['src/jquery.ajaxclientsidecache.js']
    },
    uglify: {
      options: {
        mangle: {
          except: ['jQuery']
        }
      },
      cscplugin: {
        files: {
          'dist/jquery.ajaxclientsidecache.min.js': ['<%= jshint.file %>']
        }
      }
    },
    watch: {
      cscplugin: {
        files: '<%= jshint.file %>',
        tasks: ['jshint', 'clean', 'concat', 'uglify']
      }
    }
  });

  // Default task.
  grunt.registerTask('default', 'watch');

};
