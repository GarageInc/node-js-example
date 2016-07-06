
var path = require('path');
var webpack = require('webpack');
var fs = require('fs');
var glob = require('glob')  ;

var BowerWebpackPlugin = require('bower-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin')
var WebpackDevServer = require('webpack-dev-server');
//var CleanWebpackPlugin = require('clean-webpack-plugin');

var DEVELOPMENT = "development"
var PRODUCTION = "production"

var FRONTEND_DIR = "frontend"
var BUILD_DIR = "build"

var buildPath = path.resolve(__dirname, BUILD_DIR);

const NODE_ENV =  process.env.NODE_ENV || DEVELOPMENT


var config = {

    name: 'browser',

    devtool: NODE_ENV == DEVELOPMENT ? "source-map" : null,

    context: __dirname,

    entry: [
        './app',
        'webpack/hot/dev-server',
        'webpack-dev-server/client?http://localhost:8081'
    ],

    output: {
        path: buildPath,
        publicPath: 'http://localhost:8081/assets/'
        filename: "[name].js",
        chunkFilename: "[id].js"
    },

    extensions: [
        '',
        '.jsx', '.js',
        '.json',
        '.html',
        '.css', '.styl', '.scss', '.sass'
    ],

    resolve: {
        extensions: ['', '.js'],
        modulesDirectories: ['node_modules', 'bower_components'],
        modulesTemplates: ['*-loader', '*']
    },
    module: {
        loaders: [
            { test: /\.json$/, loader: "json-loader" },
            {
                test: /\.js$/,
                loader: 'babel',
                exclude: /(node_modules|bower_components)/
            },{
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
            },{
                test: /\.(eot|woff|woff2|ttf|svg|png|jpe?g)$/,
                loader: 'url-loader?limit=30000&name=[path][name].[ext]?[hash]'
            },{
                test: /\.html$/,
                loader: 'html-loader'
            },{
                test: /\.ejs$/,
                loader: 'ejs-loader?variable=data'
            }
        ]
    },
    postcss: [
        require('autoprefixer-core')
    ],
    plugins: [
        new webpack.HotModuleReplacementPlugin(),

        new webpack.DefinePlugin({
            NODE_ENV: JSON.stringify( NODE_ENV),
            LANG: JSON.stringify("ru-ru")
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


        //new HtmlWebpackPlugin({
        //    template: 'pages/example.html',
        //    minify:
        //    {
        //        removeAttributeQuotes: true
        //    }
        //}),

        new webpack.NoErrorsPlugin(),

        new webpack.optimize.CommonsChunkPlugin({
            name: "common",
            minChunks: 2
        }),
        new webpack.ProvidePlugin({
            _: "underscore"
        }),
        // TODO: разобраться
        new webpack.optimize.OccurenceOrderPlugin()

        //new CleanWebpackPlugin(['./build'], {
        //    verbose: true,
        //    dry: false
        //}),
    ]
};


if(NODE_ENV == PRODUCTION){
    config.plugins.push(

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
    )
}

if(NODE_ENV == DEVELOPMENT){
    // TODO: BECAUSE GULP!
    //
    //var devServer = new WebpackDevServer(
    //    webpack(config),
    //    {
    //        contentBase: path.join(__dirname, 'frontend/pages')
    //        //hot: true
    //    }
    //).listen(8088, '127.0.0.1');
    //
    //config.watch = true;
    //config.watchOptions = {
    //    aggregateTimeout: 1000
    //}
}



module.exports = config

