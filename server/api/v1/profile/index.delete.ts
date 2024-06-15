import { eq } from 'drizzle-orm'
import { db } from '~/server/db/drizzle'
import { listing, user } from '~/server/db/schema'

export default eventHandler(async event => {
  try {
    const currentUser = event.context.user
    if (!currentUser || !event.context.session) {
      throw createError({
        statusCode: 401,
        message: 'Unauthorized',
      })
    }

    const deletedUserListings = await db
      .select({ imagePublicId: listing.imagePublicId })
      .from(listing)
      .where(eq(listing.userId, currentUser.id))

    const [deletedUser] = await db
      .delete(user)
      .where(eq(user.id, currentUser.id))
      .returning()
    if (deletedUser.imagePublicId && deletedUser.image !== 'bdzdebalgjgnbsgevvkd.webp')
      await deleteCloudinaryImage(deletedUser.imagePublicId)

    for (const listing of deletedUserListings) {
      if (listing.imagePublicId) {
        await deleteCloudinaryImage(listing.imagePublicId)
      }
    }

    event.context.user = null
    await lucia.invalidateSession(event.context.session.id)
    appendHeader(event, 'Set-Cookie', lucia.createBlankSessionCookie().serialize())
    return 'Signed deleted account'
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Something went wrong',
    })
  }
})
