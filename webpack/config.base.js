
const path = require('path');
const autoprefixer = require('autoprefixer');
const postcssImport = require('postcss-import');
const merge = require('webpack-merge');

const development = require('./config.development.js');
const production = require('./config.prodaction.js');

require('babel-polyfill').default;

const TARGET = process.env.npm_lifecycle_event;

const PATHS = {
    app: path.join(__dirname, '../bin/server.js'),
    build: path.join(__dirname, '../build')
};

process.env.BABEL_ENV = TARGET;

const common = {
    entry: [
        PATHS.app,
    ],

    output: {
        path: PATHS.build,
        filename: "[name].js",
        chunkFilename: "[id].js"
    },

    resolve: {
        extensions: ['', '.jsx', '.js', '.json', '.scss'],
        modulesDirectories: ['node_modules', 'bower_components', PATHS.app],
        modulesTemplates: ['*-loader', '*']
    },

    module: {
        preLoaders: [
            {
                test: /\.js$/,
                loaders: ['eslint'],
                include: [
                    path.resolve(__dirname, PATHS.app),
                ]
            }
        ],
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

    postcss: (webpack) => {
        return [
            autoprefixer({
                browsers: ['last 2 versions']
            }),
            postcssImport({
                addDependencyTo: webpack
            }),
        ];
    }
};

if (TARGET === 'start' || !TARGET) {
    module.exports = merge(development, common);
}

if (TARGET === 'build' || !TARGET) {
    module.exports = merge(production, common);
}
