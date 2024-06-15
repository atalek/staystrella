import { and, eq } from 'drizzle-orm'
import { db } from '~/server/db/drizzle'
import { listing } from '~/server/db/schema'
import { ListingValuesSchema } from '~/zod-schemas/listing-schema'
import { deleteCloudinaryImage } from '~/server/utils/cloudinary'

export default eventHandler(async event => {
  try {
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
    } = parseResult.data
    const currentUser = event.context.user
    const id = getRouterParam(event, 'id')

    if (!currentUser) {
      throw createError({
        statusCode: 401,
        message: 'Unauthorized',
      })
    }

    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'Invalid id',
      })
    }
    const [oldListing] = await db
      .select({ imagePublicId: listing.imagePublicId })
      .from(listing)
      .where(and(eq(listing.userId, currentUser.id), eq(listing.id, id)))

    const [updatedListing] = await db
      .update(listing)
      .set({
        title,
        description,
        imageSrc,
        category,
        roomCount,
        guestCount,
        bathroomCount,
        price,
        locationValue: locationValue!.value,
      })
      .where(and(eq(listing.userId, currentUser.id), eq(listing.id, id)))
      .returning()

    if (
      oldListing.imagePublicId !== updatedListing.imagePublicId &&
      oldListing.imagePublicId
    ) {
      await deleteCloudinaryImage(oldListing.imagePublicId)
    }

    return { statusCode: 201, message: 'Listing updated' }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Something went wrong',
    })
  }
})
