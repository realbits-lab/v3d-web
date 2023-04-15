const path = require("path");
const Merge = require("webpack-merge");
const terser = require("terser-webpack-plugin");

const baseConfig = {
    //* TODO: Handle later.
    // mode: "production",
    mode: "development",
    devtool: "source-map",
    entry: {
        v3dweb: path.resolve(__dirname, "src", "index"),
    },
    module: {
        rules: [
            {
                test: /\.(vert|frag)$/,
                type: "asset/source",
            },
            {
                test: /\.ts$/,
                use: "ts-loader",
            },
            {
                test: /\.m?js$/,
                resolve: {
                    fullySpecified: false,
                },
            },
        ],
    },
    resolve: {
        modules: [path.resolve(__dirname, "node_modules")],
        extensions: [".js", ".ts"],
        symlinks: false,
    },
    experiments: {
        futureDefaults: true,
        topLevelAwait: true,
    },
    target: ["es2021"],
    //* TODO: Handle later.
    // target: ["web"],
    // optimization: {
    //     minimize: true,
    //     minimizer: [
    //         new terser({
    //             extractComments: false,
    //         }),
    //     ],
    //     concatenateModules: true,
    // },
};

const config = [
    // UMD
    // Merge.merge(baseConfig, {
    //     output: {
    //         library: {
    //             name: "v3d-web",
    //             type: "umd",
    //         },
    //         filename: "[name].module.js",
    //         path: path.resolve(__dirname, "dist"),
    //     },
    // }),
    // ES6
    Merge.merge(baseConfig, {
        output: {
            library: {
                type: "module",
            },
            filename: "[name].es6.js",
            path: path.resolve(__dirname, "dist"),
            environment: { module: true },
        },
        externalsType: "module",
        experiments: {
            outputModule: true,
        },
    }),
    // browser global
    // Merge.merge(baseConfig, {
    //     output: {
    //         library: {
    //             name: "v3d-web",
    //             type: "window",
    //         },
    //         filename: "[name].js",
    //         path: path.resolve(__dirname, "dist"),
    //     },
    // }),
];

module.exports = config;
