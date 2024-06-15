import { and, eq } from 'drizzle-orm'
import { db } from '~/server/db/drizzle'
import { user } from '~/server/db/schema'
import { hash } from '@node-rs/argon2'
import { PasswordSchema } from '~/zod-schemas/auth-schemas'

export default defineEventHandler(async event => {
  try {
    const query = getQuery<{ token: string }>(event)
    const token = query.token
    const body = await readBody<{ password: string }>(event)

    if (token === undefined || token.trim() === '') {
      throw createError({
        statusCode: 404,
        message: 'No reset token provided',
      })
    }

    const parseResult = PasswordSchema.safeParse(body.password)

    if (!parseResult.success) {
      throw createError({
        statusCode: 400,
        message:
          parseResult.error.errors.map(e => e.message).join(', ') || 'Invalid password',
      })
    }

    const password = parseResult.data

    const hashedPassword = await hash(password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    })

    const [updatedUser] = await db
      .update(user)
      .set({
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetTokenCreatedAt: null,
      })
      .where(and(eq(user.passwordResetToken, token), eq(user.provider, 'email')))
      .returning()

    if (!updatedUser) {
      throw createError({
        statusCode: 400,
        message: 'Unable to reset password. Please request a new password reset.',
      })
    }

    const session = await lucia.createSession(updatedUser.id, {})
    appendHeader(event, 'Set-Cookie', lucia.createSessionCookie(session.id).serialize())

    return { message: 'New password set' }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'An error occurred',
    })
  }
})
