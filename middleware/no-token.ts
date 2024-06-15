export default defineNuxtRouteMiddleware(to => {
  const { query } = to
  const token = query.token
  if (!token || token.length < 100) {
    return navigateTo('/?error')
  }
})
