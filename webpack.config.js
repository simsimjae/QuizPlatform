const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development',
  devtool: 'eval-source-map',
  devServer: {
    contentBase: path.join(__dirname,'dist'),
    compress: true,
    port: 9000
  },
  entry: {
    app: ['@babel/polyfill', './src/index.js']
  },
  output: {
    path: path.resolve(__dirname, './dist/resources'),
    publicPath: '/resources/'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              import: true,
            }
          }
        ],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        loader: 'file-loader',
        options: {
          context: 'src/resources/img',
          name: 'img/[name].[ext]'
        }
      }
    ]
  },
  plugins: [],
  optimization: {},
  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.json', '.jsx', '.css'],
  },
  plugins: [
      new HtmlWebpackPlugin({
        template: 'index.html',
        filename: path.join(__dirname, 'dist/resources/index.html')
      }),
      new MiniCssExtractPlugin(),
      new CleanWebpackPlugin({
        //cleanAfterEveryBuildPatterns: ['resources/img/**','!resources/img','!resources/img/favicon.ico'],
      }),
      new WorkboxWebpackPlugin.InjectManifest({
        swSrc: 'src/src-sw.js',
        swDest: 'sw.js'
      }),
      new CopyWebpackPlugin([
        {
          from : 'src/resources/img/favicon.ico',
          to : 'img/favicon.ico'
        }
      ])
  ]
};