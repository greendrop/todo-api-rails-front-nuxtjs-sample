const pkg = require('./package')
require('dotenv').config()

module.exports = {
  mode: 'universal',

  /*
  ** Headers of the page
  */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons'
      }
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },

  /*
  ** Global CSS
  */
  css: ['~/assets/style/app.styl'],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: ['@/plugins/vuetify'],

  /*
  ** Nuxt.js modules
  */
  modules: ['@nuxtjs/axios', '@nuxtjs/auth', '@nuxtjs/dotenv'],
  axios: {},
  auth: {
    redirect: {
      login: '/users/sign_in',
      logout: '/users/sign_in',
      callback: '/auth/callback',
      home: '/',
    },
    strategies: {
      doorkeeper: {
        _scheme: '~/lib/auth-module/lib/schemes/oauth2-doorkeeper.js',
        _name: 'doorkeeper',
        authorization_endpoint: `${process.env.API_URL}/oauth/authorize`,
        access_token_endpoint: `${process.env.API_URL}/oauth/token`,
        userinfo_endpoint: `${process.env.API_URL}/api/v1/me`,
        scope: [],
        client_id: process.env.DOORKEEPER_CLIENT_ID,
        client_secret: process.env.DOORKEEPER_CLIENT_SECRET
      }
    }
  },

  router: {
    middleware: ['auth']
  },

  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
}
