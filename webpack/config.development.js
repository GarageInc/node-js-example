'use-strict';

const webpack = require('webpack');
const baseConfig = require('./config.base');
var path = require('path');
var fs = require('fs');

const config = Object.create(baseConfig);
config.debug = true;

//var nodeModules = {};
//
//fs.readdirSync(path.resolve(__dirname, 'node_modules'))
//    .filter(function(x) {
//        return ['.bin'].indexOf(x) === -1;
//    })
//    .forEach(function(mod) {
//        nodeModules[mod] = 'commonjs ' + mod;
//    });
//
//config.externals = nodeModules,
//config.target = 'node',

config.entry = [
    'webpack-hot-middleware/client?path=http://localhost:3011/__webpack_hmr',
    './app/index'
];

config. devtool = "source-map";

config.output.publicPath = 'http://localhost:3000/public/';


config.watch = true;

config.watchOptions = {
    aggregateTimeout: 1000
}


config.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
        '__DEV__': true,
        'process.env': {
            'NODE_ENV': JSON.stringify('development')
        },

        NODE_PATH: ".",
        NODE_ENV: JSON.stringify( 'development'),
        LANG: JSON.stringify("ru-ru")
    })
);

module.exports = config;
