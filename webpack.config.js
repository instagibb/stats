/*eslint-disable */

var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  devtool: 'eval',
  entry: [
	'webpack-dev-server/client?http://0.0.0.0:8000/',
	'webpack/hot/only-dev-server',
	'./app/App.js'
  ],
  output: {
    filename: 'bundle.js',
    publicPath: '/',
    path: path.join(__dirname, 'public')
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/, 
        loaders: ['react-hot', 'babel?presets[]=react&presets[]=es2015']
      },
      { 
        test: /\.css$/, 
        loader: ExtractTextPlugin.extract("style-loader", "css-loader") 
      },
      {
        test: /\.(woff|woff2)$/, 
        loader: 'url-loader?limit=10000&mimetype=application/font-woff'
      },
      {
        test: /\.(ttf|eot|svg|png|jpeg|jpg|gif)$/, 
        loader: 'file-loader'
      },
      {
        test: /\.json$/, 
        loader: 'json-loader'
      }
    ]
  },
  plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoErrorsPlugin(),
    new webpack.ProvidePlugin({$: 'jquery', jQuery: 'jquery'}),
    new HtmlWebpackPlugin({
      title: 'Strava stats',
      mobile: true,
      template: 'node_modules/html-webpack-template/index.html',
      appMountId: 'app'
    }),
    new ExtractTextPlugin("styles.css")
	]
};
