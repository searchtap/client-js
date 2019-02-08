const path = require('path');
const webpack = require("webpack");
const dts = require('dts-bundle');
var nodeExternals = require('webpack-node-externals');

function DtsBundlePlugin() {
}

DtsBundlePlugin.prototype.apply = function (compiler) {
  compiler.plugin('done', function () {
    dts.bundle({
      name: 'searchtap-api-client',
      main: './lib/**/*.d.ts',
      out: './index.d.ts',
      removeSource: true,
      outputAsModuleFolder: true
    });
  });
};
module.exports = {
  entry: "./src/main/SearchTapAPIClient.ts",
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  devtool: 'source-map',
  plugins: [
    new DtsBundlePlugin()
  ],
  module: {
    rules: [{
      test: /\.tsx?$/,
      loader: 'awesome-typescript-loader',
      exclude: /node_modules/
    }]
  },
  output: {
    path: path.resolve(__dirname, './lib'),
    filename: 'index.js',
    libraryTarget: 'umd',
    library: 'searchtap-api-client',
    globalObject: "typeof self !== \"undefined\" ? self : this"
  },
  target: "node",
  externals: [nodeExternals()]
};