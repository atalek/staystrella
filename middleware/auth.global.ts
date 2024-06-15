export default defineNuxtRouteMiddleware(async () => {
  const user = useUser()
  const data = await useRequestFetch()('/api/v1/user')

  if (data) {
    user.value = data
  }
})
