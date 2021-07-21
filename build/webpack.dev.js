const {merge}=require('webpack-merge')
const baseConfig=require('./webpack.base')

module.exports=merge(baseConfig,{
    mode:'development',
    devtool:'eval-cheap-module-source-map',
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
})