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
    outputBuildProduction: path.join(__dirname, '../build')
};

process.env.BABEL_ENV = TARGET;

const common = {
    entry: [
        PATHS.app,
    ],

    output: {
        path: PATHS.outputBuildProduction,
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
