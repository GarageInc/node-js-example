'use-strict'
var webpack = require('webpack');

module.exports = {
    devtool: 'source-map',

    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production'),
                'NODE_PATH': ".",
                'LANG': JSON.stringify("ru-ru")
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
        })
    ]
};