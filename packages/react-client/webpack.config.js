const {resolve} = require("path");
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports={
    mode:"production",
    entry:{
        "index.cjs":{
            import: resolve(__dirname,"src/index.ts"),
            library: {
                type: 'commonjs2',
            },
        },
        "index.esm":{
            import:resolve(__dirname,"src/index.ts"),
            library: {
                type: 'module',
            },
        },
    },
    output:{
        filename:'[name].js',
        clean:true,
        path:resolve(__dirname,"./lib/dist"),
    },
    // plugins:[new BundleAnalyzerPlugin()],
    module:{
        rules:[
            {
                test:/\.(js|jsx)$/,
                exclude:/node_modules/,
                use:[
                    "babel-loader"
                ]
            },
            {
                test:/\.(ts|tsx)$/,
                exclude:/node_moudles/,
                use:[
                    'babel-loader',
                    {
                        loader:'ts-loader',
                        options:{
                            transpileOnly: true,
                        }
                    }
                ]
            }
        ]
    },
    externals:{
        react: "react",
        "hotkeys-js":"hotkeys-js",
        querystring:"querystring"
    },
    resolve:{
        extensions:['.js','.jsx','.ts','.tsx'],
    },
    experiments: {
        outputModule: true,
    },
}