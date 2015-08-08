module.exports = function( grunt ) { 

  grunt.initConfig({

    'pkg': grunt.file.readJSON( 'package.json' ),
    'sass': {
      'dist': { 
        'files': { 
          'core/app/public/style/css/style.css': 'core/app/public/style/scss/style.scss'
        }
      }
    },
    'watch': { 
      'css': { 
        'files': 'core/app/public/style/scss/**/*.scss',
        'tasks': ['sass'],
        'options': {
          'livereload': true  
        }
      },
      'jade': {
        'files': 'core/app/public/view/**/*.jade',
        'tasks': ['sass'],
        'options': { 
          'livereload': true,
        }
      },
      'js': {
        'files': 'core/app/public/**/*.js',
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
