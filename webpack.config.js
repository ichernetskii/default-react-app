/* --------------- modules & plugins --------------------------- */

const htmlWebpackPlugin = require("html-webpack-plugin");
const MiniCSSExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");
const {CleanWebpackPlugin} = require("clean-webpack-plugin");

/* --------------- config -------------------------------------- */

const paths = {
    src: {
        abs: path.resolve(__dirname, "src"),
        rel: "src"
    },
    dist: {
        debug: {
            abs: path.resolve(__dirname, "dist/debug"),
            rel: "dist/debug"
        },
        release: {
            abs: path.resolve(__dirname, "dist/release"),
            rel: "dist/release"
        }
    },
    folders: {
        js: "js",
        style: "style",
        translation: "translation",
        img: "img",
        html: "ejs"
    }
};

/* ---------------- module.exports ----------------------------- */

module.exports = (env = {}) => {

/* --------------- const --------------------------------------- */

    const {mode = "development"} = env;
    const isDev = mode === "development";
    const isProd = mode === "production";

/* --------------- functions ----------------------------------- */

    const getFilenameTemplate = (ext) => isProd ? `[name]-[hash:8].${ext}` : `[name].${ext}`;
    const getPlugins = () => {
        let plugins = [
            new CleanWebpackPlugin({
                // cleanStaleWebpackAssets: isProd // очищать неиспользуемое при ребилде?
            }),
            new htmlWebpackPlugin({
                inject: false,
                chunks: ["main"],
                template: path.join(paths.folders.html, "index.ejs"),
                filename: "index.html",
                lang: "ru",
                mobile: true,
                buildDate: new Date().toString(),
                minify: isProd
            })
        ];

        if (isProd) {
            plugins.push(
                new MiniCSSExtractPlugin({
                    filename: path.join(paths.folders.style, "main-[hash:8].css")
                })
            )
        }

        return plugins;
    }

    const cssLoaders = extra => {
        let loaders = [
            isProd ? MiniCSSExtractPlugin.loader : "style-loader",
            "css-loader"
        ];

        // post css
        if (isProd) {
            loaders.push({
                loader: "postcss-loader",
                options: {
                    postcssOptions: {
                        plugins: [[
                            "postcss-preset-env",
                            { autoprefixer: {grid: "autoplace"} },
                            "postcss-object-fit-images"
                        ]],
                    },
                },
            });
        }

        // extra css
        if (extra) {
            if (typeof extra === "string") {
                loaders.push(extra);
            } else if (extra instanceof Array) {
                loaders = loaders.concat(extra);
            }
        }

        return loaders;
    }

/* --------------- return  ------------------------------------- */

    return {
        context: paths.src.abs,
        target: isProd ? "browserslist" : "web", // disable browserslist for development
        devtool: isProd ? undefined : "source-map",
        resolve: {
            alias: {
                "@": paths.src.abs,
                "@js": path.resolve(paths.src.abs, paths.folders.js),
                "@style": path.resolve(paths.src.abs, paths.folders.style),
                "@img": path.resolve(paths.src.abs, paths.folders.img),
                "@translation": path.resolve(paths.src.abs, paths.folders.translation),
            }
        },
        optimization: {
            splitChunks: {
                chunks: isProd ? "all" : "async"
            }
        },
        performance: {
            maxEntrypointSize: isProd ? 250000 : 1024*1024,
            maxAssetSize: isProd ? 250000 : 1024*1024
        },
        mode: isProd ? "production" : "development",
        devServer: {
            open: true,
            port: 4200,
            overlay: {
                warnings: true,
                errors: true
            }
        },
        entry: {
            main: "./" + path.join(paths.folders.js, "index.js")
        },
        output: {
            path: isProd ? paths.dist.release.abs : paths.dist.debug.abs,
            publicPath: "./",
            filename: path.join(paths.folders.js, getFilenameTemplate("js"))
        },
        module: {
            rules: [
                // HTML
                {
                    test: /\.ejs$/i,
                    exclude: /node_modules/,
                    loader: 'ejs-loader',
                    options: {
                        esModule: false
                    }
                },

                // Loading images
                {
                    test: /\.(png|jpe?g|gif|ico)$/,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: "file-loader",
                            options: {
                                outputPath: paths.folders.img,
                                name: getFilenameTemplate("[ext]"),
                                esModule: false
                            }
                        }
                    ]
                },

                // Loading fonts
                {
                    test: /\.(ttf|otf|eot|woff|woff2)$/,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: "file-loader",
                            options: {
                                outputPath: "fonts",
                                name: "[name].[ext]",
                                esModule: false
                            }
                        }
                    ]
                },

                // Babel loader
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: "babel-loader"
                },

                // CSS loaders
                {
                    test: /\.(css)$/,
                    exclude: /node_modules/,
                    use: cssLoaders()
                },

                // SCSS loaders
                {
                    test: /\.(s[ca]ss)$/,
                    exclude: /node_modules/,
                    use: cssLoaders("sass-loader")
                }
            ]
        },
        plugins: getPlugins()
    };
}
