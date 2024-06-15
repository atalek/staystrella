import { and, eq } from 'drizzle-orm'
import { generateIdFromEntropySize } from 'lucia'
import { db } from '~/server/db/drizzle'
import { user } from '~/server/db/schema'
import { sendEmailVerificationEmail } from '~/server/utils/email/sendEmailVerificationEmail'

export default defineEventHandler(async event => {
  try {
    const currentUser = event.context.user
    if (!currentUser) {
      throw createError({
        statusCode: 401,
        message: 'Unauthorized',
      })
    }
    const emailVerificationToken = generateIdFromEntropySize(64)

    const [userToVerify] = await db
      .update(user)
      .set({ emailVerificationToken, emailVerificationTokenCreatedAt: new Date() })
      .where(and(eq(user.email, currentUser.email)))
      .returning()

    if (!userToVerify) {
      throw createError({
        statusCode: 401,
        message: 'Unauthorized',
      })
    }
    await sendEmailVerificationEmail(userToVerify.email as string, emailVerificationToken)
    return { message: 'Verification email sent' }
  } catch (error) {}
})
