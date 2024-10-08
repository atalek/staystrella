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
  ],
  experimental: {
    typedPages: true,
  },

  routeRules: {
    '/': { prerender: true },
    '/listings/**': { swr: true },
    '/users/**': { swr: true },
    '/new-password': { prerender: true },

    '/login': { prerender: true, appMiddleware: 'unauthenticated' },
    '/register': { prerender: true, appMiddleware: 'unauthenticated' },
    '/reset-password': { prerender: true, appMiddleware: 'unauthenticated' },

    '/verify-email': { prerender: true, appMiddleware: ['email-verified'] },

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

  hooks: {
    'build:manifest': manifest => {
      const css = manifest['node_modules/nuxt/dist/app/entry.js']?.css
      if (css) {
        for (let i = css.length - 1; i >= 0; i--) {
          if (css[i].startsWith('entry')) css.splice(i, 1)
        }
      }

      for (let key in manifest) {
        const cssFiles = manifest[key]?.css
        if (cssFiles) {
          for (let i = cssFiles.length - 1; i >= 0; i--) {
            if (
              /Calendar\..*\.css/.test(cssFiles[i]) ||
              /Map\..*\.css/.test(cssFiles[i])
            ) {
              cssFiles.splice(i, 1)
            }
          }
        }
      }
    },
  },

  app: {
    head: {
      htmlAttrs: {
        lang: 'en',
      },
      link: [
        { rel: 'icon', type: 'image/webp', href: '/logo.webp' },
        { rel: 'preconnect', href: 'https://www.googletagmanager.com' },
        { rel: 'preconnect', href: 'https://upload-widget.cloudinary.com' },
      ],

      script: [
        { src: 'https://upload-widget.cloudinary.com/global/all.js', defer: true },
      ],
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
      gtagId: process.env.GTAG_ID,
    },
  },

  image: {
    cloudinary: {
      baseURL: process.env.CLOUDINARY_PATH,
    },
  },
})
