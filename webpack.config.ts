import path from 'path';

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
  devtool: 'source-map'
});

export default webpackConfig;
