import { desc, eq } from 'drizzle-orm'
import { db } from '~/server/db/drizzle'
import { listing, reservation, user } from '~/server/db/schema'
import { Listing } from '~/types'

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

    const results = await db
      .select()
      .from(listing)
      .where(eq(listing.userId, currentUser.id))
      .innerJoin(reservation, eq(reservation.listingId, listing.id))
      .innerJoin(user, eq(reservation.userId, user.id))
      .orderBy(desc(reservation.startDate))
      .limit(pageSize)
      .offset((page - 1) * pageSize)

    const reservations: Listing[] = results.reduce((acc: Listing[], row) => {
      let listing = acc.find(l => l.id === row.listings.id)
      if (!listing) {
        listing = {
          id: row.listings.id,
          title: row.listings.title,
          locationValue: row.listings.locationValue,
          imageSrc: row.listings.imageSrc,
          reservations: [],
        }
        acc.push(listing)
      }

      if (row.reservations && row.auth_users) {
        const reservationWithUser = {
          ...row.reservations,
          createdAt: undefined,
          user: {
            id: row.auth_users.id,
            name: row.auth_users.name,
            image: row.auth_users.image,
          },
        }

        listing?.reservations?.push(reservationWithUser)
      }

      return acc
    }, [])

    return reservations
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Something went wrong',
    })
  }
})
