export default defineNuxtRouteMiddleware(async () => {
  const user = useUser()
  if (!!user.value?.emailVerified) {
    return navigateTo('/')
  }
})
