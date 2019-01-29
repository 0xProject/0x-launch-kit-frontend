const proxy = require('http-proxy-middleware')

const context = '/api'

const options = {
  // By default, this is configured to proxy http://localhost:3000/api requests
  // to a running instance in localhost:3000, unless
  // process.env.LAUNCH_KIT_BACKEND_URL specify another thing (restart
  // create-react-app development server to read env var value)
  target: process.env.LAUNCH_KIT_BACKEND_URL
    ? process.env.LAUNCH_KIT_BACKEND_URL
    : 'http://localhost:3000',
  // rewrite paths
  pathRewrite: {
    '^/api': ''
  },
  changeOrigin: true
}

const apiProxy = proxy(context, options)

module.exports = (app) => { app.use(apiProxy) }
