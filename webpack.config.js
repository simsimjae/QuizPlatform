const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

module.exports = (env, options) => {

  const config = {
    entry: {
      app: ['@babel/polyfill', './src/index.js']
    },
    output: {
      filename: '[name].bundle.js'
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
          test: /\.(css)$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                import: true
              }
            }
          ],
        },
        {
          test: /\.(html)$/,
          include: path.join(__dirname, 'src/'),
          use: {
            loader: 'html-loader',
            options: {
              interpolate: true
            }
          }
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
            context: 'src/resources/img',
            name: 'img/[name].[ext]'
          }
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin(),
      new CleanWebpackPlugin(),
      new WorkboxWebpackPlugin.InjectManifest({
        swSrc: 'src/src-sw.js',
        swDest: 'sw.js'
      }),
      new CopyWebpackPlugin([
        {
          from: 'src/resources/img/favicon.ico',
          to: 'img/favicon.ico'
        },
        {
          from: 'src/**/write.*',
          to: './',
          flatten: true,
        }
      ])
    ],
    resolve: {
      modules: ['node_modules'],
      extensions: ['.js', '.json', '.jsx', '.css'],
    },
    target: 'web'
  }

  if (options.mode === 'development') { 

    config.devtool = 'eval-source-map'; 

    config.output.path = path.resolve(__dirname, './dist/DevPickVs/resources'),
    config.output.publicPath = "/DevPickVs/resources/"

    config.devServer = {
      hot: true, // 서버에서 HMR을 켠다.
      //host: '0.0.0.0',  디폴트로는 "localhost" 로 잡혀있다. 외부에서 개발 서버에 접속해서 테스트하기 위해서는 '0.0.0.0'으로 설정해야 한다.
      contentBase: './dist/DevPickVs/', // 개발서버의 루트 경로
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
      new HtmlWebpackPlugin({
        template: 'src/index.html',
        filename: path.join(__dirname, 'dist/DevPickVs/resources/index.html'),
        showErrors: true // 에러 발생시 메세지가 브라우저 화면에 노출 된다.
      }),
      new webpack.DefinePlugin({
        URL_BASE: JSON.stringify('http://pickvs.com/DevPickVs/')
      })
    ];

  } 

  if (options.mode === 'production') {  

    config.devServer = {
      hot: true, // 서버에서 HMR을 켠다.
      //host: '0.0.0.0', // 디폴트로는 "localhost" 로 잡혀있다. 외부에서 개발 서버에 접속해서 테스트하기 위해서는 '0.0.0.0'으로 설정해야 한다.
      contentBase: './dist/', // 개발서버의 루트 경로
      stats: {
        color: true
      }
    };

    config.output.path = path.resolve(__dirname, './dist/resources'),
    config.output.publicPath = "/resources/"
    config.plugins = [
      ...config.plugins,
      new MiniCssExtractPlugin({
        filename: '[name].[hash].css',
        chunkFilename: '[id].[hash].css'
      }),
      new HtmlWebpackPlugin({
        template: 'src/index.html',
        filename: path.join(__dirname, 'dist/resources/index.html'),
        showErrors: true // 에러 발생시 메세지가 브라우저 화면에 노출 된다.
      }),
      new webpack.DefinePlugin({
        URL_BASE: JSON.stringify('http://pickvs.com/')
      })
    ]

  }


  return config; 
};
