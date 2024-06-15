// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    'nuxt-icon',
    '@nuxt/image',
    '@vueuse/nuxt',
    '@nuxt/fonts',
    'nuxt-rate-limit',
    'nuxt-gtag',
  ],
  experimental: {
    typedPages: true,
  },

  routeRules: {
    '/': { prerender: true },
    '/listings/**': { swr: true },
    '/users/**': { swr: true },
    '/new-password': { prerender: true, appMiddleware: 'no-token' },

    '/login': { prerender: true, appMiddleware: 'unauthenticated' },
    '/register': { prerender: true, appMiddleware: 'unauthenticated' },
    '/reset-password': { prerender: true, appMiddleware: 'unauthenticated' },

    '/verify-email': { prerender: true, appMiddleware: ['email-verified', 'no-token'] },

    '/favorites': { prerender: true, appMiddleware: 'authenticated' },
    '/properties/**': { prerender: true, appMiddleware: 'authenticated' },
    '/reservations': { prerender: true, appMiddleware: 'authenticated' },
    '/trips': { prerender: true, appMiddleware: 'authenticated' },
    '/create-listing': { prerender: true, appMiddleware: 'authenticated' },
    '/account-settings': { prerender: true, appMiddleware: 'authenticated' },
    '/account-settings/info': { prerender: true, appMiddleware: 'authenticated' },
    '/account-settings/profile': { prerender: true, appMiddleware: 'authenticated' },
  },

  nuxtRateLimit: {
    routes: {
      '/api/v1/auth/**': { maxRequests: 10, intervalSeconds: 300 },
      '/api/v1/favorites/**': {
        maxRequests: 20,
        intervalSeconds: 60,
      },
      '/api/v1/email/request-verification': {
        maxRequests: 2,
        intervalSeconds: 60 * 60 * 24,
      },
      '/api/v1/email/reset-password': {
        maxRequests: 2,
        intervalSeconds: 60 * 60 * 24,
      },
    },
  },

  build: {
    transpile: ['vue-toastification'],
  },

  nitro: {
    compressPublicAssets: true,
    prerender: {
      autoSubfolderIndex: false,
    },
  },

  app: {
    head: {
      htmlAttrs: {
        lang: 'en',
      },
      link: [{ rel: 'icon', type: 'image/webp', href: '/logo.webp' }],
      script: [{ src: 'https://upload-widget.cloudinary.com/global/all.js' }],
    },
  },
  runtimeConfig: {
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    public: {
      imageUrl: process.env.CLOUDINARY_PATH,
      cloudinaryName: process.env.CLOUDINARY_NAME,
      cloudinaryFolder: process.env.CLOUDINARY_FOLDER,
    },
  },

  image: {
    cloudinary: {
      baseURL: process.env.CLOUDINARY_PATH,
    },
  },

  gtag: {
    id: process.env.GTAG_ID,
  },
})
