const HtmlWebpackPlugin = require('html-webpack-plugin');
const FileManagerPlugin = require('filemanager-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackInjector = require('html-webpack-injector');
const path = require('path');

const dir = path.resolve(__dirname, 'src');
const dist = path.resolve(__dirname, 'dist');

module.exports = (env, ...opts) => {
	const { mode } = opts[0];
	const isLocal = mode === 'development';

	return {
		mode,
		devtool: isLocal ? "cheap-module-source-map" : false,

		entry: {
			main: dir + '/js/main.js',
			styles_head: dir + '/scss/styles.scss',
		},
		output: {
			path: dist,
			filename: './js/[name].js?h=[chunkhash]',
			assetModuleFilename: path.join('[name].[ext]'),
			publicPath: '/'
		},
		devServer: {
			static: {
				directory: dist,
			},
			watchFiles: dir,
			port: 9000,
			open: true,
		},
		module: {
			rules: [
				{
					test: /\.html$/,
					use: [
						{
							loader: "underscore-template-loader",
							options: {
								attributes: []
							},
						}
					]
				},
				{
					test: /\.js$/,
					use: 'babel-loader',
					exclude: /node_modules/,
				},
				{
					test: /\.(scss|css)$/,
					use: [
						{
							loader: MiniCssExtractPlugin.loader,
						},
						{
							loader: 'css-loader',
							options: {
								sourceMap: isLocal,
								url: false,
							},
						},
						{
							loader: 'postcss-loader',
						},
						{
							loader: 'sass-loader',
							options: {
								sourceMap: isLocal,
							},
						}
					],
				},
			],
		},
		plugins: [
			new HtmlWebpackPlugin({
				template: dir + '/template/index.html',
				filename: 'index.html',
				chunks: ["main", "styles_head"]
			}),
			new FileManagerPlugin({
				events: {
					onStart: {
						delete: ['dist'],
					},
					onEnd: {
						copy: [
							{
								source: dir + '/assets/img/',
								destination: 'dist/assets/img',
							},
							{
								source: dir + '/assets/fonts/',
								destination: 'dist/assets/fonts',
							}
						]
					}
				},
			}),
			new MiniCssExtractPlugin({
				filename: 'css/[name].css?h=[contenthash]',
			}),
			new HtmlWebpackInjector(),
		],
	};
};