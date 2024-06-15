import { desc, inArray } from 'drizzle-orm'
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

    const query = getQuery<{ page: number }>(event)

    const page = Number(query.page) || 1
    const pageSize = 6

    const favoriteIds = currentUser.favoriteIds || []
    let listings
    if (favoriteIds.length > 0) {
      listings = await db
        .select({
          id: listing.id,
          title: listing.title,
          imageSrc: listing.imageSrc,
          category: listing.category,
          price: listing.price,
          locationValue: listing.locationValue,
        })
        .from(listing)
        .where(inArray(listing.id, favoriteIds))
        .orderBy(desc(listing.createdAt))
        .limit(pageSize)
        .offset((page - 1) * pageSize)
    }

    return listings || []
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Something went wrong',
    })
  }
})
