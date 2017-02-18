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
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', {
          loader: 'postcss-loader',
          options: {
            plugins: function () {
              return [
                require('postcss-nested'),
                require('autoprefixer')
              ]
            }
          }
        }]
      }
    ]
  },
  plugins: [
    new CheckerPlugin()
  ],
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      'vue$': 'vue/dist/vue.common.js'
    }
  }
}