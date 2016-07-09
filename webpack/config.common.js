'use-strict'
var path = require('path');
var autoprefixer = require('autoprefixer');
var postcssImport = require('postcss-import');
var merge = require('webpack-merge');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var development = require('./config.development.js');
var production = require('./config.production.js');

require('babel-polyfill').default;

var TARGET = process.env.npm_lifecycle_event;

const PATHS = {
    app: path.join(__dirname, '../bin/server.js'),
    outputBuild: path.join(__dirname, '../build')
};

process.env.BABEL_ENV = TARGET;

const common = {
    entry: [
        PATHS.app,
    ],

    output: {
        path: PATHS.outputBuild,
        filename:  "[name].[chunkhash].js",
        chunkFilename: '[id].[chunkhash].js',
    },

    resolve: {
        extensions: ['', '.jsx', '.js', '.json', '.scss'],
        modulesDirectories: ['node_modules', 'bower_components', PATHS.app],
        modulesTemplates: ['*-loader', '*']
    },

    module: {
        //preLoaders: [
        //    {
        //        test: /\.js$/,
        //        loaders: ['eslint'],
        //        include: [
        //            path.resolve(__dirname, PATHS.app),
        //        ]
        //    }
        //],
        loaders: [
            { test: /\.json$/, loader: "json-loader" },
            {
                test: /\.js$/,
                loader: 'babel',
                exclude: /(node_modules|bower_components)/
            },{
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
            },{
                test: /\.(eot|woff|woff2|ttf|svg|png|jpe?g)$/,
                loader: 'url-loader?limit=30000&name=[path][name].[ext]?[hash]'
            },{
                test: /\.html$/,
                loader: 'html-loader'
            },{
                test: /\.ejs$/,
                loader: 'ejs-loader?variable=data'
            }
        ]
    },

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


console.log("TARGET: " + TARGET)

if ( TARGET === 'start' || !TARGET) {

    module.exports = merge( development, common);
} else {

    module.exports = merge( production, common);
}
