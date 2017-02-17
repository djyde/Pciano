const { CheckerPlugin } = require('awesome-typescript-loader')

module.exports = {
  entry: './src/index.ts',
  output: {
    path: './lib',
    filename: 'index.js'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader'
      }
    ]
  },
  plugins: [
    new CheckerPlugin()
  ]
}