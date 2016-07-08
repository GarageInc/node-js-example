const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    devtool: 'cheap-module-eval-source-map',

    entry: [
        'webpack-hot-middleware/client',
        './www/server.js',
    ],

    output: {
        publicPath: '/public/'
    },

    module: {
        loaders: [{
            test: /\.scss$/,
            loader: 'style!css?localIdentName=[path][name]--[local]!postcss-loader!sass'
        }]
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