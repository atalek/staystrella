import { differenceInCalendarDays } from 'date-fns'
import { eq } from 'drizzle-orm'
import { generateIdFromEntropySize } from 'lucia'
import { db } from '~/server/db/drizzle'
import { listing, reservation } from '~/server/db/schema'
import { ReservationSchema } from '~/zod-schemas/listing-schema'

export default eventHandler(async event => {
  try {
    const currentUser = event.context.user
    if (!currentUser) {
      throw createError({
        statusCode: 401,
        message: 'Unauthorized',
      })
    }
    const parseResult = await readValidatedBody(event, ReservationSchema.safeParse)

    if (!parseResult.success) {
      throw createError({
        statusCode: 400,
        message: 'Start date and end date are required!',
      })
    }
    const { startDate, endDate, listingId } = parseResult.data

    const [reservationListing] = await db
      .select({ price: listing.price })
      .from(listing)
      .where(eq(listing.id, listingId))

    if (!reservationListing) {
      throw createError({
        statusCode: 404,
        message: 'Invalid listing',
      })
    }

    const dayCount = differenceInCalendarDays(new Date(endDate), new Date(startDate))
    const totalPrice =
      dayCount === 0 ? reservationListing.price : reservationListing.price * dayCount
    const id = generateIdFromEntropySize(16)

    await db.insert(reservation).values({
      id,
      userId: currentUser.id,
      totalPrice,
      startDate,
      endDate,
      listingId,
    })

    return { statusCode: 201, message: 'Reservation created!' }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Something went wrong',
    })
  }
})
