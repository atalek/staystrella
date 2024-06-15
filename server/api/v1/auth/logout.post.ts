export default eventHandler(async event => {
  try {
    if (!event.context.session) {
      throw createError({
        statusCode: 401,
      })
    }
    event.context.user = null
    await lucia.invalidateSession(event.context.session.id)
    appendHeader(event, 'Set-Cookie', lucia.createBlankSessionCookie().serialize())
    return 'Signed out successfully'
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'An error occurred',
    })
  }
})
