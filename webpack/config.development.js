'use-strict'
var webpack = require('webpack');

module.exports = {
    devtool: 'cheap-module-eval-source-map',

    entry: [
        'webpack-hot-middleware/client','webpack/hot/dev-server'
    ],

    watch: false,
    watchOptions: {
        aggregateTimeout: 300
    },

    devServer:{
        contentBase: "./public"
    },

    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('development'),
                'NODE_PATH': ".",
                'LANG': JSON.stringify("ru-ru")
            },
            __DEVELOPMENT__: true
        })
    ]
};