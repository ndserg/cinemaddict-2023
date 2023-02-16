const path = require(`path`);
const MomentLocalesPlugin = require(`moment-locales-webpack-plugin`);
const HtmlWebpackPlugin = require(`html-webpack-plugin`);

module.exports = {
  entry: `./src/main.js`,
  plugins: [
    new MomentLocalesPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, `public`, `index.html`),
      filename: `index.html`,
      inject: `body`,
      scriptLoading: `module`
    }),
  ],
  devServer: {
    static: {
      directory: path.resolve(__dirname, `public`),
    },
    open: true,
    port: 9000,
  },
  watchOptions: {
    ignored: /node_modules/,
  },
};
