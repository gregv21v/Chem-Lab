const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");


module.exports = {
  mode: 'development',
  entry: './src/main.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'], // order is important here.
      },
      { 
        test: /\.html$/,
        use: {
            loader: 'html-loader'
        }
      },
      { 
        test: /\.hbr$/,
        use: {
            loader: 'handlebars-loader',
            options: {
                precompileOptions: {
                    knownHelpersOnly: false,
                },
                helperDirs: [
                  path.resolve(__dirname, ' src/helpers')
                ]
            }
        }
      },
    ],
  },
  devServer: {
      static: {
          directory: path.join(__dirname, 'dist'),
      }
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Chemistry Lab',
      template: path.join(__dirname, '/src/templates/index.ejs'),
      filename: "index.html",
      inject: true
    })
  ],
};