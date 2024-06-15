import { desc, eq } from 'drizzle-orm'
import { db } from '~/server/db/drizzle'
import { listing } from '~/server/db/schema'

export default eventHandler(async event => {
  try {
    const currentUser = event.context.user

    if (!currentUser) {
      throw createError({
        statusCode: 401,
        message: 'You must be logged in to favorite listings',
      })
    }

    const query = getQuery<{ page: number }>(event)

    const page = Number(query.page) || 1
    const pageSize = 6

    const listings = await db
      .select()
      .from(listing)
      .where(eq(listing.userId, currentUser.id))
      .orderBy(desc(listing.createdAt))
      .limit(pageSize)
      .offset((page - 1) * pageSize)

    if (!listings) {
      throw createError({
        statusCode: 404,
        message: 'No properties found',
      })
    }

    return listings
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Something went wrong',
    })
  }
})
