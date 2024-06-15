import { asc, eq } from 'drizzle-orm'
import { db } from '~/server/db/drizzle'
import { listing, reservation, user } from '~/server/db/schema'

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
    const pageSize = 4

    const results = await db
      .select()
      .from(reservation)
      .where(eq(reservation.userId, currentUser.id))
      .innerJoin(listing, eq(listing.id, reservation.listingId))
      .innerJoin(user, eq(listing.userId, user.id))
      .orderBy(asc(reservation.startDate))
      .limit(pageSize)
      .offset((page - 1) * pageSize)

    const reservations = results.map(t => ({
      reservation: t.reservations,
      listing: t.listings,
      user: {
        id: t.auth_users.id,
        name: t.auth_users.name,
        image: t.auth_users.image,
      },
    }))

    if (!reservations) {
      throw createError({
        statusCode: 404,
        message: 'No reservations found',
      })
    }

    return reservations || []
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Something went wrong',
    })
  }
})
