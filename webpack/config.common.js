'use-strict'

var fs = require('fs');
var path = require('path');
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var postcssImport = require('postcss-import');
var merge = require('webpack-merge');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var BowerWebpackPlugin = require('bower-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var development = require('./config.development.js');
var production = require('./config.production.js');

//require('babel-polyfill').default;

process.env.BABEL_ENV = process.env.npm_lifecycle_event;

var nodeModules = {};
fs.readdirSync(path.resolve(__dirname, './../node_modules'))
    .filter(x => ['.bin'].indexOf(x) === -1)
    .forEach(mod => { nodeModules[mod] = `commonjs ${mod}`; });

const common = {
    target: 'node',

    externals: nodeModules,

    entry: [
        path.resolve(__dirname, "./../bin/"),
        path.resolve(__dirname, "./../entry.js"),
    ],


    output: {
        path: path.resolve(__dirname, "./../build/"),
        publicPath: '',
        filename:  "[name].[chunkhash].js",
        chunkFilename: '[id].[chunkhash].js'
    },

    resolve: {
        extensions: ['', '.jsx', '.js', '.json', '.scss', '.css'],
        modulesDirectories: ['node_modules', 'bower_components'],
        modulesTemplates: ['*-loader', '*']
    },

    module: {
        loaders: [
            { test: /\.json$/, loader: "json-loader" },
            {
                test: /\.js$/,
                loader: 'babel',
                exclude: /(node_modules|bower_components)/
            },{
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
            },
            {
                test: /\.(png|ico|jpg|jpeg|gif|svg)$/,
                loaders: ['url-loader?limit=30000&&name=img/[name].[ext]']
            },
            {
                test: /\.(ttf|eot|woff|woff2)$/i,
                loaders: ['url-loader?limit=30000&&name=css/fonts/[name].[ext]']
            },
            {
                test: /\.html$/,
                loader: 'html-loader'
            },{
                test: /\.ejs$/,
                loader: 'ejs-loader?variable=data'
            },
        ]
    },

    plugins: [
        new BowerWebpackPlugin({
            modulesDirectories: ['bower_components'],
            manifestFiles: ['bower.json', '.bower.json'],
            includes: /.*/,
            excludes: /.*\.less$/
        }),
        new ExtractTextPlugin("[name].css",{
            allChunks: true
        }),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.NoErrorsPlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            name: "common",
            minChunks: 2
        }),
        new webpack.ProvidePlugin({
            _: "underscore"
        }),
        new HtmlWebpackPlugin()
    ],

    postcss: (webpack) => {
        return [
            autoprefixer({
                browsers: ['last 2 versions']
            }),
            postcssImport({
                addDependencyTo: webpack
            }),
        ];
    }
};


console.log("TARGET: " + process.env.NODE_ENV)

if ( process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {

    module.exports = merge( development, common);
} else {

    module.exports = merge( production, common);
}
