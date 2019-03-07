const webpack = require('webpack');
const path = require('path');

module.exports = {
  mode: 'development',
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
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:1337',
        pathRewrite: {'^/api' : ''}
      }
    }
  },
  externals: /^socket.io$/i
}