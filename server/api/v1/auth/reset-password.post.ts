import { and, eq } from 'drizzle-orm'
import { generateIdFromEntropySize } from 'lucia'
import { db } from '~/server/db/drizzle'
import { user } from '~/server/db/schema'
import { sendPasswordResetEmail } from '~/server/utils/email/sendPasswordResetEmail'
import { EmailSchema } from '~/zod-schemas/auth-schemas'

export default defineEventHandler(async event => {
  const body = await readBody(event)

  const parseResult = EmailSchema.safeParse(body.email)
  if (!parseResult.success) {
    throw createError({
      statusCode: 400,
      message: parseResult.error.errors[0].message || 'Invalid email',
    })
  }

  const email = parseResult.data

  const token = generateIdFromEntropySize(64)

  const [resetUser] = await db
    .update(user)
    .set({
      passwordResetToken: token,
      passwordResetTokenCreatedAt: new Date(),
    })
    .where(and(eq(user.email, email), eq(user.provider, 'email')))
    .returning()

  await sendPasswordResetEmail(
    resetUser.email as string,
    resetUser.passwordResetToken as string,
  )

  if (!resetUser) {
    throw createError({
      statusCode: 404,
      message: "We can't find a user with that email address.",
    })
  }

  return { message: 'Password reset email sent' }
})
