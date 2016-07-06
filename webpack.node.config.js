'use-strict';
var webpack = require('webpack');
var path = require('path');
var fs = require('fs');

var nodeModules = {};

fs.readdirSync(path.resolve(__dirname, 'node_modules'))
     .filter(function(x) {
         return ['.bin'].indexOf(x) === -1;
     })
     .forEach(function(mod) {
         nodeModules[mod] = 'commonjs ' + mod;
     });

module.exports =
{
    name: 'server',
    target: 'node',
    entry: './app/server/serverEntryPrototype.js',
    output: {
        path: './bin/',
        publicPath: 'bin/',
        filename: 'serverEntryPoint.js'
    },
    externals: nodeModules,
    module: {
        loaders: [
            { test: /\.js$/,
                loaders: [
                    'babel-loader'
                ]
            },
            { test:  /\.json$/, loader: 'json-loader' },
        ]
    },
    plugins: [
        // new webpack.NormalModuleReplacementPlugin("^(react-bootstrap-modal)$", "^(react)$")
        // new webpack.IgnorePlugin(new RegExp("^(react-bootstrap-modal)$"))
        // new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
    ]
};