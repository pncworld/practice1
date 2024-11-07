const { defineConfig } = require('@vue/cli-service');

  module.exports = defineConfig({
    '/api': {
      target: 'http://pncoffice.com:8085',
      pathRewrite: {
        '^/api': ''
      }
    },
  })
