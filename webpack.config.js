const path = require('path');
const webpack = require('webpack');

var config = {
    entry: [
        'webpack-hot-middleware/client',
        './assets/index'
    ],
    output: {
        path: path.join(__dirname,'assets/dist'),
        filename: 'bundle.js',
        publicPath: '/dist/'
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ],
    module: {
            loaders: [
                {
                    test: /\.js$/,
                    loaders: ['babel'],
                    include: path.join(__dirname,'assets/app')
                },
                {
                    test: /\.css$/,
                    loader: 'style!css'
                }
            ]
    }
};

module.exports = config;
