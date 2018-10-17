const path = require('path');

module.exports = {
  entry: {
    "index.html": "./lib/index.js",
    "foods.html": "./lib/foods.js",
    "calendar.html": "./lib/calendar.js",
    test: "mocha!./test/index.js"
  },
  output: {
    path: __dirname,
    filename: "[name].bundle.js"
  },
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
      { test: /\.css$/, loader: "style!css" },
      { test: /\.scss$/, loaders: ["style-loader", "css-loader", "sass-loader"] },
    ]
  },
  resolve: {
    extensions: ['', '.js', '.json', '.css', '.scss']
  }
};
