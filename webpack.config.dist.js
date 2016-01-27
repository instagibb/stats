/*eslint-disable */

var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var deps = Object.keys(require('./package.json').dependencies)

module.exports = {
  entry: {
	app: './app/App.js',
  vendor: deps.concat([])
  },
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
        loaders: ['babel?presets[]=react&presets[]=es2015']
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
		new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false } }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.DefinePlugin({ 'process.env': { COMPRESS: 1, NODE_ENV: JSON.stringify('production') } }),
    new webpack.optimize.CommonsChunkPlugin(/* chunkName= */'vendor', /* filename= */'vendor.bundle.js'),
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
