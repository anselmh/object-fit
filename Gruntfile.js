module.exports = function (grunt) {

	'use strict';

	// Project configuration.
	grunt.initConfig({
		pkg: './package.json',
		meta: {
			banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
			'<%= grunt.template.today("yyyy-mm-dd") %> */'
		},

		requirejs: {
			compile: {
				options: {
					mainConfigFile: 'src/config.js',
					include: ['../node_modules/requirejs/require'],
					out: 'dist/polyfill.object-fit.js',

					// Wrap in IIFE
					wrap: true,

					// Source Maps
					generateSourceMaps: true,

					// Do not preserve license comments when working with source maps, incompatible.
					preserveLicenseComments: false,

					optimize: 'uglify2'
				}
			}
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

		// JavaScript files
		js: {
			files: [
				'src/*.js'
			],
			config: 'src/config.js',
			dest: 'dist/polyfill.object-fit.js'
		},

		concat: {
			css: {
				src: 'src/polyfill.object-fit.css',
				dest: 'dist/polyfill.object-fit.css'
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
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-requirejs');

	// Default task
	grunt.registerTask('default', ['jshint', 'requirejs', 'concat', 'uglify']);

};
