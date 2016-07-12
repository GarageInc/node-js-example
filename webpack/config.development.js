'use-strict'
var webpack = require('webpack');
var path = require('path');
var fs = require('fs')
var merge = require('webpack-merge');

var commonConfig = require('./config.common.js')

var devConfig = {

    devtool: 'source-map',

    context: path.resolve(__dirname, "./../"),

    output: {
        publicPath: "/"
    },

    entry: [
        'webpack-hot-middleware/client', 'webpack/hot/dev-server',
        './index.js'
        , './entry.js'
    ],

    watch: true,
    watchOptions: {
        aggregateTimeout: 100
    },

    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('development'),
                'NODE_PATH': "."
            },
            __DEVELOPMENT__: true
        }),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ]
};

var commonConfig = require('./config.common.js')

var mergeConfig = merge(commonConfig, devConfig)


module.exports = mergeConfig;