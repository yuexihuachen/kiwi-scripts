const nodeEnv = require("kiwi-environment");
// 用于优化\最小化CSS
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const debug = require('debug')('kiwi-scripts: webpack-config ');

const { fromRoot } = require("../utils");

const babelConfig = require('../../babel.config')

const isProd = nodeEnv.isProd()

module.exports = () => {

    const mode = isProd ? "production" : "development";

    const postCssLoader = {
        loader: "postcss-loader",
        options: {
            sourceMap: true,
            postcssOptions: {
                plugins: [
                    [
                        "postcss-preset-env"
                    ],
                ],
            },
        },
    };

    const getCssLoader = (options) => ({
        loader: 'css-loader',
        options: {
            modules: {
                exportLocalsConvention: "camelCase",
            },
            importLoaders: 1,
            sourceMap: true,
            ...options,
        },
    });

    const styleLoader = {
        loader: 'style-loader',
    }
    const publicPath = '/client/'
    const config = {
        context: fromRoot('client/src'),
        entry: firstFile('./src/index.tsx', './src/index.ts', './src/index.js'),
        output: {
            path: fromRoot('dist'),
            filename: 'bundle.js',
            publicPath,
        },
        mode,
        devtool: isProd ? 'source-map' : 'cheap-module-source-map',
        optimization: {
            moduleIds: 'named',
            minimize: isProd,
            emitOnErrors: false,
            concatenateModules: isProd,
        },
        module: {
            rules: [
                {
                    test: /\.(js|tsx|ts)$/,
                    include: fromRoot('src'),
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true,
                        ...babelConfig,
                    },
                },
                {
                    test: /\.css$/,
                    exclude: /\.module\.css$/,
                    use: [
                        isProd ? MiniCssExtractPlugin.loader : styleLoader,
                        getCssLoader({ modules: false }),
                        postCssLoader,
                    ],
                },
                {
                    test: /\.s[ac]ss$/i,
                    use: [
                        isProd ? MiniCssExtractPlugin.loader : styleLoader,
                        getCssLoader({ modules: false }),
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: true,
                            },
                        },
                    ],
                }
            ]
        },
        plugins: [
            isProd ? new MiniCssExtractPlugin({ filename: '[name].css' }) : null
        ],
        performance: {
            hints: false,
            maxEntrypointSize: 1000000,
            maxAssetSize: 1000000,
        }
    };
    debug(config)
    return config
}