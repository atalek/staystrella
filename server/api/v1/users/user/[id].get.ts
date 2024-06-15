import { desc, eq } from 'drizzle-orm'
import { db } from '~/server/db/drizzle'
import { listing, user } from '~/server/db/schema'

export default eventHandler(async event => {
  try {
    const id = getRouterParam(event, 'id')

    if (!id) {
      throw createError({
        statusCode: 404,
        message: 'Invalid ID',
      })
    }

    const [userProfile] = await db
      .select({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          description: user.description,
        },
      })
      .from(user)
      .where(eq(user.id, id))

    if (!userProfile.user) {
      throw createError({
        statusCode: 404,
        message: 'User does not exist',
      })
    }
    return userProfile.user
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Something went wrong',
    })
  }
})
