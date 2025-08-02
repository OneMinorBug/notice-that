const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const BundleTracker = require('webpack-bundle-tracker');

module.exports = {
  entry: {
    comment_form: './js_src/comment_form.js',
    problem_form: './js_src/problem_form.js',
    math_render: './js_src/math_render.js',
    main: './css_src/main.css',
    comment: './js_src/comment.js',
    login: './js_src/login.js',
    signup: './js_src/signup.js',
    password_reset: './js_src/password_reset.js',
    password_reset_from_key: './js_src/password_reset_from_key.js',
    lightbox: './js_src/lightbox.js'
  },

  output: {
    path: path.resolve(__dirname, 'static/dist'),
    publicPath: '/static/dist/',
    filename: 'js/[name]-[contenthash].bundle.js',
    assetModuleFilename: 'fonts/[name][ext][query]',
    clean: true,
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].bundle.css',
    }),
    new BundleTracker({ 
        path: __dirname, 
        filename: 'webpack-stats.json' 
    }),
  ],
  
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },

  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },

  mode: 'development',
};