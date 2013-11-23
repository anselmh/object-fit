module.exports = function (grunt) {

	'use strict';

	// Project configuration.
	grunt.initConfig({
		pkg: './package.json',
		meta: {
			banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
			'<%= grunt.template.today("yyyy-mm-dd") %> */'
		},

		jshint: {
			all: [
				'Gruntfile.js',
				'js/*.js'
			],
			options: {
				jshintrc: '.jshintrc'
			}
		},

		uglify: {
			options: {
				mangle: false,
				banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
						'<%= grunt.template.today("yyyy-mm-dd") %> */'
			},
			deploy: {
				files: {
					'polyfill.object-fit.min.js': 'polyfill.object-fit.js'
				}
			}
		},

		watch: {
			js: {
				files: [
					'Gruntfile.js',
					'js/*.js'
				],
				tasks: 'jshint'
			}
		}
	});

	// Load some stuff
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-concat');

	// A task for development
	grunt.registerTask('dev', ['jshint']);

	// A task for deployment
	grunt.registerTask('deploy', ['jshint', 'uglify']);

	// Default task
	grunt.registerTask('default', ['jshint', 'uglify']);

	// Travis CI task
	grunt.registerTask('travis', ['jshint']);

};
