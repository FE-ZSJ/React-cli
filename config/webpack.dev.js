const path = require('path')
const ESLintPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

// 返回处理样式loader的函数
const getStyleLoaders = (pre) => {
    return [
        'style-loader', // style-loader动态标签将css插入到页面上生效
        'css-loader',
        {
            loader: 'postcss-loader', // css样式兼容性问题
            options: { // 选项
                postcssOptions: {
                    plugins: ['postcss-preset-env'] // postcss智能预设插件,结合package.json中的browserslist指定兼容程度
                }
            }
        },
        pre
    ].filter(Boolean); // 过滤掉undefined，pre有可能没有
}

module.exports = {
    entry: './src/main.js', // 入口文件
    output: { // 输出打包后的文件
        path: undefined, // 开发模式没有输出，也不需要清空
        filename: 'static/js/[name].js', //文件名，以chunk名称自动补全文件名，开发模式没写contenthash
        chunkFilename: 'static/js/[name].chunk.js', // 动态导入的chunk或node_module打包的chunk等，.chunk与入口模块进行区分
        assetModuleFilename: 'static/media/[hash:10][ext][query]', // 图片资源,ext文件扩展名,query其他参数
    },
    module: { // loader匹配规则
        rules: [
            // 处理css
            {
                test: /\.css$/,
                use: getStyleLoaders()
            },
            {
                test: /\.less$/,
                use: getStyleLoaders('less-loader')
            },
            {
                test: /\.s[ac]ss$/,
                use: getStyleLoaders('sass-loader')
            },
            {
                test: /\.styl$/,
                use: getStyleLoaders('stylus-loader')
            },
            // 处理图片
            {
                test: /\.(jpe?g|png|gif|webp|svg)$/,
                type: 'asset',
                parser: { // 图片体积小于10kb处理成base64
                    dataUrlCondition: {
                        maxSize: 10 * 1024
                    }
                }
            },
            // 处理其他资源
            {
                test: /\.(woff2?|eot|ttf|otf|mp4|mp3|avi)$/,
                type: 'asset/resource', // 与asset区别，asset/resource原封不动输出
            },
            // 处理js
            {
                test: /\.jsx?$/,
                include: path.resolve(__dirname, '../src'), // 只处理src目录下的js文件
                loader: 'babel-loader',
                options: {
                    cacheDirectory: true, // 开启babel编译缓存
                    cacheCompression: false, // 关闭压缩缓存
                    plugins: ['react-refresh/babel'], // js的HMR
                }
            }
        ]
    },
    plugins: [
        new ESLintPlugin({
            context: path.resolve(__dirname, '../src'), // eslint处理的文件目录
            exclude: 'node_modules', // 限制eslint处理文件的范围，排除node_modules
            cache: true, // 开启缓存,第二次再编译时更快
            cacheLocation: path.resolve(__dirname, '../node_modules/.cache/.eslintcache'),
        }),
        // 以 public/index.html为模板创建文件: 1.内容和源文件一致 2.自动引入打包生成的js等资源
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../public/index.html')
        }),
        new ReactRefreshWebpackPlugin() // js的HMR
    ],
    mode: 'development',// 开发环境
    devtool: "cheap-module-source-map", // 没有列映射
    optimization: {
        // 代码分割配置,主要是node_module和动态导入的
        splitChunks: {
            chunks: "all",
        },
        runtimeChunk: {// 防止代码分割导致文件缓存失效
            name: (entrypoint) => `runtime~${entrypoint.name}.js`, // runtime文件命名规则
        },
    },
    //  webpack解析模块加载选项
    resolve: {
        extensions: ['.jsx', '.js', '.json'] // 自动补全文件扩展名
    },
    devServer: {
        host: "localhost", // 启动服务器域名
        port: "8080", // 启动服务器端口号
        open: true, // 是否自动打开浏览器
        hot: true, // 开启HMR功能（只用于开发环境，生产环境不需要）
        historyApiFallback: true, // 解决前端路由刷新404
    },
}
