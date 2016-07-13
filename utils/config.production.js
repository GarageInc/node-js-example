'use-strict'

var fs = require('fs');
var path = require('path');
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var merge = require('webpack-merge');
var CleanWebpackPlugin = require('clean-webpack-plugin');

var config = {

    watch: true,

    devtool:  "source-map" ,

    context: path.resolve(__dirname, "./../"),

    entry: [
        , './entry.js'
    ]


};


var commonConfig = require('./config.common.js')

var mergeConfig = merge(commonConfig, config)

mergeConfig.plugins.push(
    new webpack.DefinePlugin({
        'process.env': {
            'NODE_ENV': JSON.stringify('production'),
            'NODE_PATH': "."
        },
        __DEVELOPMENT__: false
    }),
    new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false,
            drop_console: true,
            unsafe: true
        },
        output: {
            comments: false
        }
    }),
    new webpack.optimize.DedupePlugin()
)


//console.log(mergeConfig)

module.exports = mergeConfig;
