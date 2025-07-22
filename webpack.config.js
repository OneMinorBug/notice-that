const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: {
    comment_form: './js_src/comment_form.js',
    post: './js_src/post.js',
    math_render: './js_src/math_render.js',
    main: './css_src/main.css',
    comment: './js_src/comment.js',
    password_reset_from_key: './js_src/password_reset_from_key.js',
    password_reset: './js_src/password_reset.js',
    signup: './js_src/signup.js',
  },

  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'static/js'),
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: '../css/[name].bundle.css',
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

  mode: 'development',
};