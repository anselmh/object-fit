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
				'src/polyfill.object-fit.core.js'
			],
			options: {
				jshintrc: '.jshintrc'
			}
		},

		concat: {
			csss: {
				src: 'src/polyfill.object-fit.css',
				dest: 'dist/polyfill.object-fit.css'
			},
			js: {
				src: ['src/polyfill.getMatchedCSSRules.js', 'src/polyfill.rAF.js', 'src/polyfill.object-fit.core.js'],
				dest: 'dist/polyfill.object-fit.js'
			}
		},

		uglify: {
			options: {
				mangle: false,
				banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
						'<%= grunt.template.today("yyyy-mm-dd") %> */'
			},
			js: {
				files: {
					'dist/polyfill.object-fit.min.js': 'dist/polyfill.object-fit.js'
				}
			}
		},

		watch: {
			js: {
				files: [
					'Gruntfile.js',
					'src/polyfill.object-fit.css',
					'src/polyfill.getMatchedCSSRules.js',
					'src/polyfill.rAF.js',
					'src/polyfill.object-fit.core.js'
				],
				tasks: ['jshint', 'concat', 'uglify']
			}
		}
	});

	// Load some stuff
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-concat');

	// Default task
	grunt.registerTask('default', ['jshint', 'concat', 'uglify']);

};
