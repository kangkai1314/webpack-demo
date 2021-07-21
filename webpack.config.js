const path=require('path')
const HtmlWebpackPlugin =require('html-webpack-plugin')
const { CleanWebpackPlugin} =require('clean-webpack-plugin')
const  MiniCssExtractPlugin  =require('mini-css-extract-plugin')
const  OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const TerserWebpackPlugin =require('terser-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader/dist/index')
const { BundleAnalyzerPlugin}=require('webpack-bundle-analyzer')

module.exports={
    mode:'development',
    entry:'./src/index.js',
    output:{
        path:path.resolve(__dirname,'dist'),
        filename:'bundle.[contenthash:8].js'
    },
    devtool:'eval-cheap-module-source-map',
    module:{
        rules:[
            {
                test:/\.(jsx|js)$/,
                use:'babel-loader',
                exclude:/node_modules/,
            },
            {
                test:/\.css$/,
                use:[
                    // 'style-loader',
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ]  
            },
            {
                test:/\.less$/,
                use:[
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'less-loader'
                ]
            },
            {
                test:/\.(jpg|png\jpeg|gif|bmp)$/,
                use:[{
                    loader:'url-loader',
                    options:{
                        limit:1024,
                        fallback:{
                            loader:'file-loader',
                            options:{
                                name:'[name].[ext]'
                            }
                        }
                    }
                },{
                    loader:'image-webpack-loader',
                    options:{
                        mozjpeg:{
                            progressive:true
                        },
                        optipng:{
                            enable:true
                        },
                        pngquant:{
                            quality:[0.65,0.90],
                            speed:4
                        },
                        gifsicle:{
                            interlaced:false
                        },
                        webap:{
                            quality:75
                        }
                    }
                }]

            },
            {
                test:/\.(mp4|ogg|mp3|wav)$/,
                use:{
                    loader:'url-loader',
                    options:{
                        limit:1024,
                        fallback:{
                            loader:'file-loader',
                            options:{
                                name:'[name].[ext]'
                            }
                        }
                    }
                }
            },
            {
             test:/\.ts$/,
             use:[{
                 loader:'ts-loader',
                 options:{
                    transpileOnly:true,
                    getCustomTransformers:()=>({
                        before:[
                            tsImportPluginFactory({
                                libraryName:'vant',
                                libraryDirectory:'es',
                                style:(name)=>`${name}/style/less`
                            })
                        ]
                    }),
                    compileOptions:{
                        module:'es2015'
                    }
                }
             }
                 
             ],
             exclude:/node_modules/
            },{
                test:/\.vue$/,
                use:[
                    'vue-loader'
                ]
            }
        ]
    },
    plugins:[
        new HtmlWebpackPlugin({
            template:path.resolve(__dirname,'./public/index.html'),
            inject:'body',
            scriptLoading:'blocking',
            minify:{
                collapseWhitespace:true,//去掉空格
                removeComments:true
            }
        }),
        new CleanWebpackPlugin(),
        new OptimizeCssAssetsPlugin(),
        new MiniCssExtractPlugin({
            filename:'css/[name].css'
        }),
        new VueLoaderPlugin(),
        new BundleAnalyzerPlugin()
    ],
    devServer:{
        port:'3001',
        hot:true,
        stats:'errors-only',
        compress:true,
        proxy:{
            '/api':{
                target:'http://0.0.0.0:80',
                pathRewrite:{
                    '/api':''
                }
            }
        }
    },
    optimization:{
        minimize:true,
        minimizer:[
            new TerserWebpackPlugin()
        ]
    },
    cache:{
    type:'filesystem',
    buildDependencies:{
        config:[__filename]
    }
    }
}