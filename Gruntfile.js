module.exports = function( grunt ) { 

  grunt.initConfig({

    'pkg': grunt.file.readJSON( 'package.json' ),
    'sass': {
      'dist': { 
        'files': { 
          'static/style/css/style.css': 'static/style/scss/style.scss'
        }
      }
    },
    'watch': { 
      'css': { 
        'files': 'static/style/scss/**/*.scss',
        'tasks': ['sass'],
        'options': {
          'livereload': true  
        }
      },
      'html': {
        'files': '**/*.html',
        'tasks': ['sass'],
        'options': { 
          'livereload': true,
        }
      },
      'js': {
        'files': '**/*.js',
        'tasks': ['sass'],
        'options': { 
          'livereload': true,
        }         
      }
    }
  });

  grunt.loadNpmTasks( 'grunt-sass' );
  grunt.loadNpmTasks( 'grunt-contrib-watch' );
  grunt.registerTask( 'default', ['watch'] );
}
