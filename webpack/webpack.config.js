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
var CleanWebpackPlugin = require('clean-webpack-plugin');

var development = require('./config.development.js');
var production = require('./config.production.js');

var nodeModules = {};
fs.readdirSync(path.resolve(__dirname, './../node_modules'))
    .filter(x => ['.bin'].indexOf(x) === -1)
    .forEach(mod => { nodeModules[mod] = `commonjs ${mod}`; });

var config = {

    target: 'node',

    externals: nodeModules,

    context: path.resolve(__dirname, "./../"),

    entry: {
        //path.resolve(__dirname, "./../bin/"),

        //app: "./bin/index.js",

        server: [
            "./bin/index.js"
        ],
        libs: [
            "./entry.js"
        ]
    },

    output: {
        path: path.join(__dirname, "build"),
        // filename:  "[name].[chunkhash].js",
        // chunkFilename: '[id].[chunkhash].js'
        filename:  "[name].js",
        chunkFilename: '[id].js'
    },

    resolve: {
        extensions: ['', '.js'],
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
                loaders: 'url-loader?limit=30000&name=[path][name].[ext]?[hash]'
            },
            {
                test: /\.(ttf|eot|woff|woff2)$/i,
                loaders: 'url-loader?limit=30000&name=[path][name].[ext]?[hash]'
            },
            {
                test: /\.html$/,
                loader: 'html-loader'
            },{
                test: /\.ejs$/,
                loader: 'ejs-loader?variable=data'
            },,
            {
                test: /\.html$/,
                loader: 'html-loader'
            }
        ]
    },

    plugins: [
        new CleanWebpackPlugin(path.resolve(__dirname, "./../build"),{
            verbose:true,
            root: path.resolve(__dirname, '../')
        }),
        new BowerWebpackPlugin({
            modulesDirectories: ['bower_components'],
            manifestFiles: ['bower.json', '.bower.json'],
            includes: /.*/,
            excludes: /.*\.less$/
        }),
        new ExtractTextPlugin("[name].css",{
            allChunks: true
        }),
        //new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.NoErrorsPlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            name: "common",
            minChunks: 2
        }),
        //new webpack.ProvidePlugin({
        //    _: "underscore"
        //}),
        new HtmlWebpackPlugin()
    ]

};


console.log("TARGET: " + process.env.NODE_ENV)

if ( process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {

    module.exports = merge( development, config);
} else {

    module.exports = merge( production, config);
}
