import { and, eq } from 'drizzle-orm'
import { db } from '~/server/db/drizzle'
import { listing } from '~/server/db/schema'

export default eventHandler(async event => {
  try {
    const currentUser = event.context.user
    if (!currentUser) {
      throw createError({
        statusCode: 401,
        message: 'Unauthorized',
      })
    }

    const id = getRouterParam(event, 'id')
    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'Invalid id',
      })
    }

    await db
      .delete(listing)
      .where(and(eq(listing.userId, currentUser.id), eq(listing.id, id)))

    return 'Listing deleted'
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Something went wrong',
    })
  }
})
