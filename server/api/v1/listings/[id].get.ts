import { eq } from 'drizzle-orm'
import { db } from '~/server/db/drizzle'
import { listing } from '~/server/db/schema'

export default eventHandler(async event => {
  try {
    const id = getRouterParam(event, 'id')

    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'Invalid id',
      })
    }

    const listingById = await db.query.listing.findFirst({
      where: eq(listing.id, id),
      with: {
        auth_user: {
          columns: {
            id: true,
            name: true,
            image: true,
          },
        },
        reservations: {
          columns: {
            id: true,
            startDate: true,
            endDate: true,
            totalPrice: true,
          },
        },
      },
    })
    if (!listingById) {
      throw createError({
        statusCode: 400,
        message: 'Listing with that ID does not exist',
      })
    }
    return listingById
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Something went wrong',
    })
  }
})
