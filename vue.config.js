module.exports = {
    css: {
        loaderOptions: {
          css: {},
          postcss: {
            plugins: [
              require('postcss-px2rem')({
                remUnit: 37.5
              })
            ]
          }
        }
    },
    // devServer: {
      // proxy: {
          // '/kpi': {
              // target: 'http://47.114.102.94:8081/kpi',
              // pathRewrite: {'^/api' : ''}
          // }
      // }
  // }
}