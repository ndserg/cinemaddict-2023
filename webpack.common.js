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
};
