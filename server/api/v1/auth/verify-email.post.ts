import { differenceInHours } from 'date-fns'
import { and, eq, gt } from 'drizzle-orm'
import { db } from '~/server/db/drizzle'
import { user } from '~/server/db/schema'

export default defineEventHandler(async event => {
  try {
    const query = getQuery<{ token: string }>(event)
    const token = query.token

    const [userRecord] = await db
      .select({ emailVerificationTokenCreatedAt: user.emailVerificationTokenCreatedAt })
      .from(user)
      .where(eq(user.emailVerificationToken, token))
      .execute()

    if (!userRecord || !userRecord.emailVerificationTokenCreatedAt) {
      throw createError({
        statusCode: 404,
        message: 'Reset token not found.',
      })
    }

    const hoursSinceTokenCreation = differenceInHours(
      new Date(),
      new Date(userRecord.emailVerificationTokenCreatedAt),
    )

    if (hoursSinceTokenCreation > 24) {
      throw createError({
        statusCode: 400,
        message: 'The reset token has expired. Please request a new one.',
      })
    }

    const [updatedUser] = await db
      .update(user)
      .set({
        emailVerified: new Date(),
        emailVerificationToken: null,
        emailVerificationTokenCreatedAt: null,
      })
      .where(
        and(
          eq(user.emailVerificationToken, token),
          gt(
            user.emailVerificationTokenCreatedAt,
            new Date(Date.now() - 24 * 60 * 60 * 1000),
          ),
        ),
      )
      .returning()

    if (!updatedUser) {
      throw createError({
        statusCode: 400,
        message: 'Unable to verify email. Please request a new email verification.',
      })
    }
    return { message: 'Email verified' }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Something went wrong',
    })
  }
})
