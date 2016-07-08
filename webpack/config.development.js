var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var BowerWebpackPlugin = require('bower-webpack-plugin');

module.exports = {
    devtool: 'cheap-module-eval-source-map',

    entry: [
        'webpack-hot-middleware/client',
        './bin/server.js',
    ],

    output: {
        publicPath: '/public/'
    },

    module: {
        loaders: [ ]
    },

    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('development'),
                'NODE_PATH': ".",
                'LANG': JSON.stringify("ru-ru")
            },
            __DEVELOPMENT__: true
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
        new webpack.optimize.CommonsChunkPlugin({
            name: "common",
            minChunks: 2
        }),
        new webpack.ProvidePlugin({
            _: "underscore"
        }),
        // TODO: разобраться
        new webpack.optimize.OccurenceOrderPlugin()
    ]
};