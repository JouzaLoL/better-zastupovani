const path = require('path');

module.exports = {
	entry: ['@babel/polyfill', './src/main.ts'],
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist')
	},
	resolve: {
		extensions: ['.ts', '.js', '.json']
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: ['babel-loader', 'ts-loader'],
				exclude: [/node_modules/]
			},
			{
				test: /\.(html)$/,
				use: [{
					loader: 'file-loader',
					options: {
						context: path.resolve(__dirname, 'src'),
						outputPath: '',
						name: '[name].[ext]',
					}
				}]
			},
			{
				test: /\.(png|jpg|gif)$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							context: path.resolve(__dirname, 'src'),
							outputPath: '',
							name: '[name].[ext]'
						}
					}
				]
			}]
	}
};

