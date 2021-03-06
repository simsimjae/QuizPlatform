const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const SvgSpriteHtmlWebpackPlugin = require('svg-sprite-html-webpack');

module.exports = (env, options) => {
	const config = {
		entry: {
			app: ['@babel/polyfill', './src/issueTeller/index.js'],
			write: ['./src/issueTeller/resources/write/index.js'],
			share: ['./src/issueTeller/resources/js/kakaoShare.js']
		},
		output: {
			filename: '[name].bundle.js',
			path: path.resolve(__dirname, './dist/resources/'),
			publicPath: '/issueTeller/resources/'
		},
		optimization: {
			splitChunks: {
				cacheGroups: {
					commons: {
						test: /[\\/]node_modules[\\/]/,
						name: 'vendors',
						chunks: 'all'
					}
				}
			}
		},
		module: {
			rules: [
				{
					test: /\.s[ac]ss$/i,
					exclude: /node_modules/,
					use: [
						//MiniCssExtractPlugin.loader,
						'style-loader',
						'css-loader',
						{
							loader: 'postcss-loader',
							options: {
								plugins: () => [
									require('postcss-flexbugs-fixes'),
									require('postcss-preset-env')({
										autoprefixer: {
											flexbox: 'no-2009'
										},
										stage: 3
									})
								]
							}
						},
						'sass-loader'
					]
				},
				{
					test: /\.css$/i,
					exclude: /node_modules/,
					use: ['style-loader', 'css-loader']
				},
				{
					test: /\.(html)$/,
					include: path.join(__dirname, 'src/issueTeller/'),
					use: [
						{
							loader: 'html-loader',
							options: {
								interpolate: true,
								removeComments: true,
								collapseWhitespace: true
							}
						}
					]
				},
				{
					test: /\.js$/,
					exclude: /node_modules/,
					use: {
						loader: 'babel-loader'
					}
				},
				{
					test: /\.(png|jpe?g|gif)$/i,
					loader: 'file-loader',
					options: {
						context: 'src/issueTeller/resources/img',
						name: 'img/[name].[ext]'
					}
				},
				{
					test: /\.svg?$/,
					exclude: /node_modules/,
					use: SvgSpriteHtmlWebpackPlugin.getLoader()
				}
			]
		},
		plugins: [
			new MiniCssExtractPlugin(),
			new CleanWebpackPlugin(),
			new WorkboxWebpackPlugin.InjectManifest({
				swSrc: 'src/issueTeller/src-sw.js',
				swDest: 'sw.js'
			}),
			new HtmlWebpackPlugin({
				template: 'src/issueTeller/write.html',
				inject: true,
				chunks: ['write', 'vendors'],
				filename: path.join(__dirname, 'dist/write.html'),
				showErrors: true // 에러 발생시 메세지가 브라우저 화면에 노출 된다.
			}),
			new HtmlWebpackPlugin({
				template: 'src/issueTeller/kakaoShare.html',
				inject: true,
				chunks: ['share'],
				filename: path.join(__dirname, 'dist/kakaoShare.html'),
				showErrors: true // 에러 발생시 메세지가 브라우저 화면에 노출 된다.
			}),
			new CopyWebpackPlugin([
				{
					from: 'src/issueTeller/resources/img/favicon.ico',
					to: 'img/favicon.ico'
				}
				// {
				//   from: 'src/issueTeller/**/write/*',
				//   to: './write/',
				//   flatten: true,
			]),
			new HtmlWebpackPlugin({
				template: 'src/issueTeller/index.html',
				chunks: ['app', 'vendors'],
				filename: path.join(__dirname, 'dist/index.html'),
				showErrors: true // 에러 발생시 메세지가 브라우저 화면에 노출 된다.
			}),
			new SvgSpriteHtmlWebpackPlugin({
				includeFiles: ['src/issueTeller/resources/img/*.svg']
			})
		],
		resolve: {
			modules: ['node_modules'],
			extensions: ['.js', '.json', '.jsx', '.css', '.scss']
		},
		target: 'web'
	};

	if (options.mode === 'development') {
		config.devtool = 'eval-source-map';

		config.devServer = {
			hot: true,
			inline: true,
			host: '0.0.0.0', //디폴트로는 "localhost" 로 잡혀있다. 외부에서 개발 서버에 접속해서 테스트하기 위해서는 '0.0.0.0'으로 설정해야 한다.
			contentBase: './dist/', // 개발서버의 루트 경로
			historyApiFallback: true,
			stats: {
				color: true
			}
		};

		config.plugins = [
			...config.plugins,
			new MiniCssExtractPlugin({
				filename: '[name].css',
				chunkFilename: '[id].css'
			}),
			new webpack.HotModuleReplacementPlugin(),
			new webpack.DefinePlugin({
				URL_BASE: JSON.stringify('http://2weeks.io/issueTeller/')
			})
		];
	}

	if (options.mode === 'production') {
		config.devServer = {
			hot: true, // 서버에서 HMR을 켠다.
			inline: true,
			host: '0.0.0.0', // 디폴트로는 "localhost" 로 잡혀있다. 외부에서 개발 서버에 접속해서 테스트하기 위해서는 '0.0.0.0'으로 설정해야 한다.
			port: 8080,
			contentBase: './dist/', // 개발서버의 루트 경로
			stats: {
				color: true
			}
		};

		config.plugins = [
			...config.plugins,
			new MiniCssExtractPlugin({
				filename: '[name].[hash].css',
				chunkFilename: '[id].[hash].css'
			}),
			new webpack.DefinePlugin({
				URL_BASE: JSON.stringify('http://2weeks.io/issueTeller/')
			})
		];
	}

	return config;
};
