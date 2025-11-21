module.exports = {
	use: ['autoprefixer', 'cssnano', 'css-mqpacker'],
	plugins: [
		require('autoprefixer'),
		require('cssnano'),
		require('@hail2u/css-mqpacker'),
	],
};
