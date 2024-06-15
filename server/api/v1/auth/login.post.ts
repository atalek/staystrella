import { and, eq } from 'drizzle-orm'
import { db } from '~/server/db/drizzle'
import { user } from '~/server/db/schema'
import { verify } from '@node-rs/argon2'
import { LoginSchema } from '~/zod-schemas/auth-schemas'

export default defineEventHandler(async event => {
  const parseResult = await readValidatedBody(event, LoginSchema.safeParse)

  if (!parseResult.success) {
    throw createError({
      statusCode: 400,
      message: 'Email and password are required!',
    })
  }
  const { email, password } = parseResult.data

  try {
    const [existingUser] = await db
      .select()
      .from(user)
      .where(and(eq(user.email, email), eq(user.provider, 'email')))

    if (!existingUser) {
      throw createError({
        message: 'User does not exist',
        statusCode: 400,
      })
    }

    const validPassword = await verify(existingUser.password as string, password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    })

    if (!validPassword) {
      throw createError({
        message: 'Incorrect email or password',
        statusCode: 400,
      })
    }

    const session = await lucia.createSession(existingUser.id, {})

    appendHeader(event, 'Set-Cookie', lucia.createSessionCookie(session.id).serialize())
    return sendRedirect(event, '/')
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'An error occurred',
    })
  }
})
