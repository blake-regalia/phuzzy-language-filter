//
const path = require('path');

// gulp & tasker
const gulp = require('gulp');
const soda = require('gulp-soda');

// 
soda(gulp, {
	// 
	inputs: {
		styles: 'less-css',
	},

	// 
	targets: {
		// compile less to css
		'less-css': [
			'less',
		],
	},
});
