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

    const query = getQuery<{ page: number }>(event)

    const page = Number(query.page) || 1
    const pageSize = 5

    const results = await db
      .select({
        listing: {
          id: listing.id,
          imageSrc: listing.imageSrc,
          title: listing.title,
          description: listing.description,
          price: listing.price,
          locationValue: listing.locationValue,
        },
      })
      .from(listing)
      .where(eq(listing.userId, id))
      .orderBy(desc(listing.createdAt))
      .limit(pageSize)
      .offset((page - 1) * pageSize)

    const listings = results.map(result => result.listing)
    return listings || []
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Something went wrong',
    })
  }
})
