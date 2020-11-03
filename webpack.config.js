/*eslint no-undef: "error"*/
/*eslint-env node*/
/* eslint-disable @typescript-eslint/no-var-requires */
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const PreloadWebpackPlugin = require('preload-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const path = require('path');

const APP_DIR = path.resolve(__dirname, './src');
const BUILD_DIR = path.resolve(__dirname, './dist');

const config = {
    entry: {
        app: './src/index.ts',
        coming: './src/coming.ts',
    },
    devServer: {
        contentBase: BUILD_DIR,
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        transpileOnly: true,
                        experimentalWatchApi: true,
                    },
                },
                include: APP_DIR,
                exclude: /node_modules/,
            },
            {
                test: /\.js$/,
                use: 'babel-loader',
                include: APP_DIR,
                exclude: /node_modules/,
            },
            {
                test: /\.s?[ac]ss$/,
                use: [
                    'style-loader',
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            url: false,
                            sourceMap: true,
                        },
                    },
                    { loader: 'postcss-loader', options: { sourceMap: true } },
                    { loader: 'resolve-url-loader', options: { sourceMap: true } },
                    {
                        loader: 'sass-loader',
                        options: {
                            implementation: require('sass'),
                            sourceMap: true,
                        },
                    },
                ],
            },
            {
                test: /\.(woff\d*|eot|ttf|otf)$/,
                use: [
                    {
                        loader: 'file-loader',
                    },
                ],
            },
            {
                test: /\.(png|svg|jp(e*)g|gif|webp)$/,
                use: [
                    {
                        loader: 'file-loader',
                    },
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10000,
                        },
                    },
                ],
            },
        ],
    },
    optimization: {
        moduleIds: 'hashed',
        runtimeChunk: 'single',
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all',
                    priority: -10,
                },
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true,
                },
            },
        },
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.jsx'],
        symlinks: false,
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: path.resolve(__dirname, 'src', 'index.html'),
            chunks: ['app'],
        }),
        new HtmlWebpackPlugin({
            filename: 'coming-soon.html',
            template: path.resolve(__dirname, 'src', 'coming-soon.html'),
            chunks: ['coming'],
        }),
        new ScriptExtHtmlWebpackPlugin({
            defer: ['app', 'coming'],
            module: ['vendor'],
        }),
        new FaviconsWebpackPlugin({
            logo: APP_DIR + '/assets/icons/logo.png',
            inject: true,
            outputPath: 'assets/icons/',
            prefix: 'assets/icons/',
        }),
        // new ScriptExtHtmlWebpackPlugin({
        //     preload: {
        //         test: /\app.*.js$/
        //     }
        // }),
        // new PreloadWebpackPlugin({
        //     rel: 'preload',
        //     as(entry) {
        //         if (/\.css$/.test(entry)) return 'style';
        //         // if (/\.(woff\d*|eot|ttf|otf)$/.test(entry)) return 'font';
        //         //   if (/\.(png|svg|jp(e*)g|gif|webp)$/.test(entry)) return 'image';
        //         return 'script';
        //     },
        //     as: 'script',
        //     include: 'allAssets',
        //     fileBlacklist: [/\.(png|svg|jp(e*)g|gif|webp|ico|json|xml)$/]
        // }),
        new MiniCssExtractPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                { from: './src/assets/', to: './assets/' },
                { from: './src/php/', to: './php/' },
            ],
        }),
        new ForkTsCheckerWebpackPlugin({
            eslint: {
                files: './src/**/*.{ts,tsx,js,jsx}', // required - same as command `eslint ./src/**/*.{ts,tsx,js,jsx} --ext .ts,.tsx,.js,.jsx`
            },
        }),
    ],
    output: {
        path: BUILD_DIR,
        filename: '[name].bundle.js',
    },
};

module.exports = (env, argv) => {
    const isProduction = argv.mode === 'production';
    config.devtool = isProduction ? 'none' : 'inline-source-map';
    config.output.filename = isProduction ? '[name].[chunkhash].bundle.js' : '[name].bundle.js';
    config.output.pathinfo = isProduction ? false : true;
    config.optimization.flagIncludedChunks = isProduction ? true : false;
    config.optimization.occurrenceOrder = isProduction ? true : false;
    config.optimization.usedExports = isProduction ? true : false;
    config.optimization.sideEffects = isProduction ? true : false;
    config.optimization.noEmitOnErrors = isProduction ? true : false;
    if (isProduction) {
        config.plugins.push(new ManifestPlugin());
    }

    return config;
};
