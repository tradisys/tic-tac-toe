/* global process, __dirname */
/* eslint no-process-env: 0, id-match: 0, optimize-regex/optimize-regex: 0 */
const path = require('path');

const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer'); // eslint-disable-line no-unused-vars
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const DuplicatePackageCheckerPlugin = require('duplicate-package-checker-webpack-plugin');

const DEVELOPMENT = 'development';
const PRODUCTION = 'production';

const NODE_ENV = process.env.NODE_ENV || DEVELOPMENT;

const IS_DEVELOPMENT = NODE_ENV === DEVELOPMENT;
const IS_PRODUCTION = NODE_ENV === PRODUCTION;

const CWD = __dirname;

const definePluginParams = {
    BUILD_DATE: Date.now(),
    // NODE_ENV: JSON.stringify(NODE_ENV),
    IS_PRODUCTION: JSON.stringify(IS_PRODUCTION),
    PROJECT_ID: JSON.stringify('my-best-project')
    // IS_DEVELOPMENT: JSON.stringify(IS_DEVELOPMENT)
};

const fileRegExp = /\.(png|jpg|jpeg|gif|svg|woff2?)(\?[\d&.=a-z]+)?$/;

const webpackConfig = {
    entry: [
        './www/css/root.scss',
        './www/js/root.js'
    ],
    output: {
        path: path.join(CWD, '/dist'),
        publicPath: '/',
        filename: '[name].js',
        chunkFilename: '[name].async-import.js'
    },

    devtool: IS_PRODUCTION ? false : 'source-map',

    optimization: Object.assign(
        {},
        IS_DEVELOPMENT ?
            {
                splitChunks: {
                    cacheGroups: {
                        main: {
                            chunks: 'initial',
                            name: 'main',
                            priority: -25,
                            reuseExistingChunk: true
                        },
                        style: {
                            chunks: 'initial',
                            name: 'style',
                            priority: -20,
                            reuseExistingChunk: true,
                            test: /\.s?css$/
                        },
                        image: {
                            chunks: 'initial',
                            name: 'image',
                            priority: -15,
                            test: fileRegExp
                        },
                        vendor: {
                            chunks: 'initial',
                            name: 'vendor',
                            priority: -10,
                            test: /node_modules/
                        }
                    }
                }
            } :
            {
                minimizer: [
                    new UglifyJsPlugin({
                        uglifyOptions: {
                            output: {
                                comments: false,
                                beautify: false
                            },
                            compress: {
                                drop_console: true, // eslint-disable-line camelcase
                                passes: 3
                            }
                        }
                    }),
                    new OptimizeCSSAssetsPlugin({})
                ]
            }
    ),
    module: {
        rules: [
            {
                test: /\.js$/,
                // exclude: /node_modules/,
                // query-string: query-string|strict-uri-encode
                // pixi-viewport: pixi-viewport|yy-[\w]+
                exclude: /node_modules(?!([/\\])(query-string|strict-uri-encode|pixi-viewport|yy-\w+))/,
                loader: 'babel-loader'
            },
            {
                test: fileRegExp,
                use: [
                    {
                        loader: 'base64-inline-loader',
                        // - limit - The limit can be specified with a query parameter. (Defaults to no limit).
                        // If the file is greater than the limit (in bytes) the file-loader is used and
                        // all query parameters are passed to it.
                        // - name - The name is a standard option.
                        query: {
                            limit: 10e3, // 10k bytes
                            name: 'img/img-[name]-[hash:6].[ext]'
                        }
                    },
                    {
                        loader: 'image-webpack-loader',
                        options: {
                            mozjpeg: {
                                quality: 80, // 0..100
                                progressive: true
                            },
                            // optipng: {
                            //     optimizationLevel: 7 // 0..7
                            // },
                            // pngquant: {
                            //     quality: '60-80', // 0..100
                            //     speed: 1 // 1..10
                            // },
                            svgo: {}, // no set up needed
                            gifsicle: {
                                optimizationLevel: 3 // 1..3
                            }
                            // webp brake MS Edge
                            // webp: {
                            //     quality: 75,
                            //     method: 6
                            // }
                        }
                    }
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    IS_PRODUCTION ?
                        MiniCssExtractPlugin.loader :
                        {
                            loader: 'style-loader',
                            options: {
                                sourceMap: IS_DEVELOPMENT,
                                singleton: true,
                                attrs: {
                                    'class': 'my-scss-module'
                                }
                            }
                        },
                    'css-modules-flow-types-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: IS_DEVELOPMENT,
                            modules: true,
                            localIdentName: IS_DEVELOPMENT ? '[local]----[hash:6]' : '[hash:6]', // '[local]----[path]--[name]--[hash:6]'
                            minimize: IS_PRODUCTION
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: true,
                            config: {
                                path: './postcss.config.js'
                            }
                        }
                    },
                    {loader: 'sass-loader', options: {sourceMap: IS_DEVELOPMENT}}
                ]
            },
            {
                test: /\.css$/,
                use: [
                    IS_PRODUCTION ?
                        MiniCssExtractPlugin.loader :
                        {
                            loader: 'style-loader',
                            options: {
                                sourceMap: IS_DEVELOPMENT,
                                singleton: true,
                                attrs: {
                                    'class': 'my-css-module'
                                }
                            }
                        },
                    'css-modules-flow-types-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: IS_DEVELOPMENT,
                            modules: true,
                            localIdentName: '[local]',
                            minimize: IS_PRODUCTION
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: true,
                            config: {
                                path: './postcss.config.js'
                            }
                        }
                    }
                ]
            }
        ]
    },
    // resolve module warning, see DuplicatePackageCheckerPlugin
    resolve: {
        alias: {
            warning: path.resolve(__dirname, 'node_modules/warning')
        }
    },
    plugins: [
        new DuplicatePackageCheckerPlugin(),
        new CleanWebpackPlugin(['./dist']),
        new webpack.DefinePlugin(definePluginParams),
        new HtmlWebpackPlugin({
            template: './www/index.html',
            minify: {
                collapseWhitespace: IS_PRODUCTION,
                removeComments: IS_PRODUCTION,
                minifyCSS: IS_PRODUCTION,
                minifyJS: IS_PRODUCTION
            },
            hash: true,
            filename: './index.html'
        }),
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: IS_DEVELOPMENT ? '[name].css' : '[name].[hash:6].css',
            chunkFilename: IS_DEVELOPMENT ? '[id].css' : '[id].[hash:6].css'
        }),
        new ScriptExtHtmlWebpackPlugin({defaultAttribute: 'defer'}),
        new CopyWebpackPlugin([{from: './www/favicon.ico', to: './favicon.ico'}], {debug: false}),
        new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en/)
    ]

    /*
        devServer: {
            proxy: {
                '/proxi-api': {
                    target: 'https://www.the-external-server.com/',
                    changeOrigin: true // for this option only: see documentations here https://github.com/chimurai/http-proxy-middleware#http-proxy-middleware-options
                }
            }
        }
    */
};

// webpackConfig.plugins.push(new BundleAnalyzerPlugin());

module.exports = webpackConfig;
