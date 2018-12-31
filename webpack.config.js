const webpack = require('webpack');
const path = require('path');

module.exports = {
  mode: 'production',
  entry: path.join(__dirname, '/client/App.jsx'),
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        }
      }
    ]
  },
  output: {
    path: path.join(__dirname, '/public'),
    filename: 'bundle.js',
  },
}