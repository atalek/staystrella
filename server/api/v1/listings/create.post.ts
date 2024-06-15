import { generateIdFromEntropySize } from 'lucia'
import { db } from '~/server/db/drizzle'
import { listing } from '~/server/db/schema'
import { ListingValuesSchema } from '~/zod-schemas/listing-schema'

export default defineEventHandler(async event => {
  try {
    const currentUser = event.context.user
    if (!currentUser) {
      throw createError({
        statusCode: 401,
        message: 'Unauthorized',
      })
    }
    const parseResult = await readValidatedBody(event, ListingValuesSchema.safeParse)

    if (!parseResult.success) {
      throw createError({
        statusCode: 400,
        message: 'All fiends required',
      })
    }

    const {
      category,
      guestCount,
      roomCount,
      bathroomCount,
      imageSrc,
      locationValue,
      price,
      title,
      description,
      imagePublicId,
    } = parseResult.data

    const id = generateIdFromEntropySize(16)

    await db.insert(listing).values({
      id,
      userId: String(currentUser.id),
      category,
      locationValue: locationValue!.value,
      guestCount,
      roomCount,
      bathroomCount,
      imageSrc,
      price,
      title,
      description,
      imagePublicId,
    })

    return { statusCode: 201, message: 'Listing created!' }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Something went wrong',
    })
  }
})
