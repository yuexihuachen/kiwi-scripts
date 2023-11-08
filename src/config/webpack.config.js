

// const nodeEnv = require("kiwi-environment");
// // 用于优化\最小化CSS
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// const debug = require('debug')('kiwi-scripts: webpack-config ');

// const { fromRoot, firstFile } = require("../utils");

// const babelConfig = require('../../babel.config')

// const isProd = nodeEnv.isProd()

// module.exports = () => {

//     const mode = isProd ? "production" : "development";

//     const postCssLoader = {
//         loader: "postcss-loader",
//         options: {
//             sourceMap: true,
//             postcssOptions: {
//                 plugins: [
//                     [
//                         "postcss-preset-env"
//                     ],
//                 ],
//             },
//         },
//     };

//     const getCssLoader = (options) => ({
//         loader: 'css-loader',
//         options: {
//             modules: {
//                 exportLocalsConvention: "camelCase",
//             },
//             importLoaders: 1,
//             sourceMap: true,
//             ...options,
//         },
//     });

//     const styleLoader = {
//         loader: 'style-loader',
//     }
//     const publicPath = '/client/'
//     const config = {
//         context: fromRoot('client/src'),
//         entry: firstFile('./src/index.tsx', './src/index.ts', './src/index.js'),
//         output: {
//             path: fromRoot('dist'),
//             filename: 'bundle.js',
//             publicPath,
//         },
//         mode,
//         devtool: isProd ? 'source-map' : 'cheap-module-source-map',
//         optimization: {
//             moduleIds: 'named',
//             minimize: isProd,
//             emitOnErrors: false,
//             concatenateModules: isProd,
//         },
//         module: {
//             rules: [
//                 {
//                     test: /\.(js|tsx|ts)$/,
//                     include: fromRoot('src'),
//                     loader: 'babel-loader',
//                     options: {
//                         cacheDirectory: true,
//                         ...babelConfig,
//                     },
//                 },
//                 {
//                     test: /\.css$/,
//                     exclude: /\.module\.css$/,
//                     use: [
//                         isProd ? MiniCssExtractPlugin.loader : styleLoader,
//                         getCssLoader({ modules: false }),
//                         postCssLoader,
//                     ],
//                 },
//                 {
//                     test: /\.s[ac]ss$/i,
//                     use: [
//                         isProd ? MiniCssExtractPlugin.loader : styleLoader,
//                         getCssLoader({ modules: false }),
//                         {
//                             loader: 'sass-loader',
//                             options: {
//                                 sourceMap: true,
//                             },
//                         },
//                     ],
//                 }
//             ]
//         },
//         plugins: [
//             isProd ? new MiniCssExtractPlugin({ filename: '[name].css' }) : null
//         ],
//         performance: {
//             hints: false,
//             maxEntrypointSize: 1000000,
//             maxAssetSize: 1000000,
//         }
//     };
//     debug(config)
//     return config
// }


const webpack = require('webpack')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const { WebpackManifestPlugin } = require('webpack-manifest-plugin')
const debug = require('debug')('kiwi-scripts:config:webpack')
const { utilsFor } = require('../utils')

const { fromRoot, firstFile, rootDir, hasFile } = utilsFor('client')

const configFn = () => {

  const postcssLoader = {
    loader: require.resolve('postcss-loader'),
    options: {
      ident: 'postcss',
      sourceMap: true,
      plugins: () => [
        require('postcss-flexbugs-fixes'),
        require('autoprefixer')({
          overrideBrowserslist: [
            '>1%',
            'last 4 versions',
            'Firefox ESR',
            'not ie < 9',
          ],
          flexbox: 'no-2009',
        }),
      ],
    },
  }
  const getCssLoader = (options) => ({
    loader: require.resolve('css-loader'),
    options: {
      modules: {
        localsConvention: 'camelCase',
      },
      importLoaders: 1,
      sourceMap: true,
      ...options,
    },
  })
  const styleLoader = {
    loader: require.resolve('style-loader'),
  }
  const publicPath = '/client/'
  
  const config = {
    context: fromRoot('src'),
    entry: firstFile('./src/index.tsx', './src/index.ts', './src/index.js'),
    output: {
      path: fromRoot('dist'),
      pathinfo: true,
      filename: 'bundle.js',
      publicPath,
    },
    mode: 'development',
    resolve: {
      modules: [fromRoot('src'), 'shared', 'node_modules'],
      extensions: ['.tsx', '.ts', '.js', '.json'],
      fallback: {
        dgram: false,
        fs: false,
        net: false,
        tls: false,
        child_process: false,
      },
    },
    devtool: 'cheap-module-source-map',
    optimization: {
      moduleIds: 'named',
      minimize: false,
      emitOnErrors: false,
      concatenateModules: false,
    },
    module: {
      rules: [
        {
          oneOf: [
            {
              test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
              loader: require.resolve('url-loader'),
              options: {
                limit: 100000,
                name: 'assets/[name].[ext]'
              },
            },
            {
              test: /\.(js|tsx|ts)$/,
              include: fromRoot('src'),
              loader: require.resolve('babel-loader'),
              options: {
                cacheDirectory: true
              },
            },
            {
              test: /\.module\.css$/,
              use: [
                styleLoader,
                getCssLoader({ modules: true }),
                postcssLoader,
              ],
            },
            {
              test: /\.css$/,
              exclude: /\.module\.css$/,
              use: [
                styleLoader,
                getCssLoader({ modules: false }),
                postcssLoader,
              ],
            },
            {
              test: /\.scss$/,
              use: [
                styleLoader,
                getCssLoader({ modules: false }),
                {
                  loader: 'sass-loader',
                  options: {
                    sourceMap: true,
                  },
                },
              ],
            },
            {
              exclude: [
                /\.(js|ts|tsx)$/,
                /\.html$/,
                /\.json$/,
                /\.ejs$/,
                /\.mjs$/,
              ],
              loader: require.resolve('file-loader'),
              options: {
                name: 'assets/[name].[ext]',
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.CLIENT_PORT': JSON.stringify(process.env.CLIENT_PORT),
        'process.env.PORT': JSON.stringify(process.env.PORT),
      }),
      new webpack.IgnorePlugin({
        resourceRegExp: /^\.\/locale$/,
        contextRegExp: /moment$/,
      }),
      new CaseSensitivePathsPlugin(),
      new WebpackManifestPlugin({
        fileName: 'asset-manifest.json',
        // we write the file all the time so we can keep the server up-to-date
        writeToFileEmit: true,
        seed: {
          info: 'this file is generated by the webpack build from kiwi-scripts. Do not modify directly.',
          assets: {},
        },
        generate(seed, files) {
          return files.reduce((manifest, asset) => {
            const {
              // pluck off the chunk because it's way too much useless info
              chunk: ignoredChunk,
              ...assetProps
            } = asset
            manifest.assets[asset.name] = {
              ...assetProps,
              path: assetProps.path.replace(/^\/client\//, ''),
              fullPath: assetProps.path,
            }
            return manifest
          }, seed)
        },
      }),
      //在打包构建中输出当前的进度和简述
      new webpack.ProgressPlugin(),
    ],
    performance: {
      hints: false,
      maxEntrypointSize: 1000000,
      maxAssetSize: 1000000,
    },
    bail: false,
    devServer: {
      client: {
        overlay: false,
        logging: 'info',
      },
      devMiddleware: {
        publicPath,
      },
      static: {
        directory: fromRoot('dist'),
      },
      historyApiFallback: true,
      host: 'localhost',
      hot: true,
      allowedHosts: [
        'localhost',
        'localhost.kiwi.com',
        'localhost.qa.kiwi.com',
        '.kiwi.com',
        '.kiwiinc.com',
      ],
      port: process.env.CLIENT_PORT || 7975,
    },
  }
  debug(config)
  return config
}


module.exports = configFn()
