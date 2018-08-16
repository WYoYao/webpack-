let path=require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports={
    mode:"production",
    entry:"./src/app.js",
    output:{
        path:path.resolve("./dist"),
        filename:"bundles.js"
    },
    module:{
        rules:[
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader"
                ]
            }
        ]
    },
    plugins:[
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: "index.css",
            chunkFilename: "[id].css"
          })
    ]
}