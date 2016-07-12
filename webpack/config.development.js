'use-strict'
var webpack = require('webpack');

module.exports = {
    devtool: 'cheap-module-eval-source-map',

    entry: [
        'webpack-hot-middleware/client', 'webpack/hot/dev-server'
    ],

    watch: true,
    watchOptions: {
        aggregateTimeout: 300
    },

    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('development'),
                'NODE_PATH': ".",
            },
            __DEVELOPMENT__: true
        })
    ]
};