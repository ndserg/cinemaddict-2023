const path = require(`path`);
const {merge} = require(`webpack-merge`);
const common = require(`./webpack.common.js`);
const FileManagerPlugin = require(`filemanager-webpack-plugin`);

module.exports = merge(common, {
  mode: `production`,
  output: {
    filename: `js/[name].bundle.js`,
    path: path.resolve(__dirname, `dist`),
    clean: true,
  },
  optimization: {
    runtimeChunk: `single`,
    splitChunks: {
      chunks: `all`,
      maxInitialRequests: Infinity,
      minSize: 0,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];

            return `npm.${packageName.replace('@', '')}`;
          },
        },
      },
    },
  },
  plugins: [
    new FileManagerPlugin({
      events: {
        onStart: {
          delete: [`dist`],
        },
        onEnd: {
          copy: [
            {source: `public/**/*`,
              destination: `dist`,
              globOptions: {
                ignore: `public/index.html`,
              },
            },
          ],
        },
      },
    }),
  ],
});
