const slsw = require("serverless-webpack");
var nodeExternals = require('webpack-node-externals');

module.exports = {
    entry: slsw.lib.entries,
    target: 'node',
    externals: ["aws-sdk", nodeExternals()],
    mode: "production",
    optimization: {
        // We no not want to minimize our code.
        minimize: false
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: "babel-loader",
                include: __dirname,
                exclude: /node_modules/
            }
        ]
    }
};