import { desc, eq, and, SQLWrapper, gte, lte, exists, not } from 'drizzle-orm'
import { db } from '~/server/db/drizzle'
import { listing, reservation } from '~/server/db/schema'
import { QueryParams } from '~/types'

export default eventHandler(async event => {
  try {
    const query = getQuery<QueryParams>(event)
    const page = Number(query.page) || 1
    const pageSize = 12

    const filters: SQLWrapper[] = []

    if (query.category) {
      filters.push(eq(listing.category, query.category))
    }
    if (query.locationValue) {
      filters.push(eq(listing.locationValue, query.locationValue))
    }
    if (query.guestCount) {
      filters.push(gte(listing.guestCount, query.guestCount))
    }
    if (query.roomCount) {
      filters.push(gte(listing.roomCount, query.roomCount))
    }
    if (query.startDate && query.endDate) {
      const dateFilter = not(
        exists(
          db
            .select()
            .from(reservation)
            .where(
              and(
                eq(reservation.listingId, listing.id),
                lte(reservation.startDate, query.endDate),
                gte(reservation.endDate, query.startDate),
              ),
            ),
        ),
      )
      filters.push(dateFilter)
    }

    const listings = await db
      .select({
        id: listing.id,
        title: listing.title,
        imageSrc: listing.imageSrc,
        category: listing.category,
        price: listing.price,
        locationValue: listing.locationValue,
        createdAt: listing.createdAt,
      })
      .from(listing)
      .where(and(...filters))
      .orderBy(desc(listing.createdAt))
      .limit(pageSize)
      .offset((page - 1) * pageSize)

    if (!listings) {
      throw createError({
        statusCode: 404,
        message: 'No listings found',
      })
    }

    return listings || []
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Something went wrong',
    })
  }
})
