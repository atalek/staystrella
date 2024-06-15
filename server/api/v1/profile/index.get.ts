import { eq } from 'drizzle-orm'
import { db } from '~/server/db/drizzle'
import { user } from '~/server/db/schema'

export default eventHandler(async event => {
  try {
    const currentUser = event.context.user
    if (!currentUser) {
      throw createError({
        statusCode: 401,
        message: 'Unauthorized',
      })
    }
    const [profileInfo] = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        provider: user.provider,
        description: user.description,
        emailVerified: user.emailVerified,
      })
      .from(user)
      .where(eq(user.id, currentUser.id))

    if (!profileInfo) {
      throw createError({
        statusCode: 404,
        message: 'User does not exist',
      })
    }

    return profileInfo
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Something went wrong',
    })
  }
})
