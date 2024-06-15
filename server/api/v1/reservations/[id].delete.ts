import { and, eq, or, sql } from 'drizzle-orm'
import { db } from '~/server/db/drizzle'
import { reservation, user, listing } from '~/server/db/schema'

export default eventHandler(async event => {
  try {
    const currentUser = event.context.user
    if (!currentUser) {
      throw createError({
        statusCode: 401,
        message: 'You must be logged in to favorite listings',
      })
    }
    const id = getRouterParam(event, 'id')
    if (!id || typeof id !== 'string') {
      throw createError({
        statusCode: 400,
        message: 'Invalid ID',
      })
    }

    await db.execute(
      sql`DELETE FROM reservations
					 WHERE id = ${id}
					 AND (
						 user_id = ${currentUser.id}
						 OR listing_id IN (
							 SELECT id FROM listings
							 WHERE user_id = ${currentUser.id}
							 AND id = reservations.listing_id
						 )
					 )`,
    )

    return { statusCode: 204, message: 'Reservation cancelled' }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Something went wrong',
    })
  }
})
