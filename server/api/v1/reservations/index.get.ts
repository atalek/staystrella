import { SQLWrapper, and, desc, eq } from 'drizzle-orm'

import { db } from '~/server/db/drizzle'
import { reservation } from '~/server/db/schema'

export default eventHandler(async event => {
  try {
    const currentUser = event.context.user
    if (!currentUser) {
      throw createError({
        statusCode: 401,
        message: 'Unauthorized',
      })
    }

    const query = getQuery<{ listingId: string; userId: string }>(event)

    const filters: SQLWrapper[] = []
    if (query.listingId) {
      filters.push(eq(reservation.listingId, query.listingId))
    }
    if (query.userId) {
      filters.push(eq(reservation.userId, query.userId))
    }

    const reservations = await db.query.reservation.findMany({
      where: and(...filters),
      with: {
        listing: true,
        auth_user: {
          columns: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: [desc(reservation.createdAt)],
    })

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
