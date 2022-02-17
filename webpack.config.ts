import path from 'path';
import UglifyJsPlugin from 'uglifyjs-webpack-plugin';

const webpackConfig = () => ({
  mode: 'development',
  entry: path.resolve(__dirname, './src/index.ts'),
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  output: {
    filename: 'script.js',
    path: path.resolve(__dirname, 'public', 'static', 'bundle')
  },
  optimization: {
    minimize: false,
    minimizer: [
      new UglifyJsPlugin({
        test: /\.js(\?.*)?$/i
      })
    ]
  },
  devtool: 'source-map'
});

export default webpackConfig;
