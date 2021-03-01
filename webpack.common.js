const path = require('path');

module.exports = {
	mode: 'development',
	context: path.join(__dirname, 'src'),
	entry: {
		app: './shape-drawer.ts'
	},
	output: {
		filename: 'shape-drawer.js',
		path: path.resolve(__dirname, 'dist')
	},
	resolve: {
		extensions: [ '.ts', '.tsx' ]
	},

	module: {
		rules: [
			{
				test: /\.ts/,
				exclude: /node_modules/,
				loader: 'ts-loader',
				options: {
					transpileOnly: true
				}
			}
		]
	}
};