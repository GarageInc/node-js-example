'use-strict'

var fs = require('fs');
var path = require('path');
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var merge = require('webpack-merge');

var config = {

    watch: false,

    devtool:  "source-map" ,

    context: path.resolve(__dirname, "./../"),

    entry: {
        libs:[
            "./entry.js"
        ]
    },

    output: {
        path: path.join(__dirname, "..", "browser"),
        filename:  "[name].js",
        chunkFilename: '[id].js'
        //filename:  "[name].js",
        //chunkFilename: '[id].js'
    }

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
}))


//console.log(mergeConfig)

module.exports = mergeConfig;
