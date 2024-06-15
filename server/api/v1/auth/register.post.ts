import { user } from '~/server/db/schema'
import { db } from '~/server/db/drizzle'
import { eq } from 'drizzle-orm'
import { hash } from '@node-rs/argon2'
import { generateIdFromEntropySize } from 'lucia'
import { RegisterUserSchema } from '~/zod-schemas/auth-schemas'

export default defineEventHandler(async event => {
  try {
    const parseResult = await readValidatedBody(event, RegisterUserSchema.safeParse)

    if (!parseResult.success) {
      throw createError({
        statusCode: 400,
        message: parseResult.error.errors.map(e => e.message).join(', '),
      })
    }

    const { name, email, password } = parseResult.data

    const userExists = await db.select().from(user).where(eq(user.email, email))

    if (userExists.length > 0) {
      throw createError({
        statusCode: 400,
        message: 'User with that email already exists',
      })
    }

    const hashedPassword = await hash(password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    })

    const userId = generateIdFromEntropySize(16)

    const [newUser] = await db
      .insert(user)
      .values({ id: userId, name, email, password: hashedPassword, provider: 'email' })
      .returning()

    if (newUser) {
      const session = await lucia.createSession(newUser.id, {})
      appendHeader(event, 'Set-Cookie', lucia.createSessionCookie(session.id).serialize())

      return 'Signed up successfully'
    } else {
      throw createError({
        statusCode: 400,
        message: 'Invalid user data',
      })
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'An error occurred',
    })
  }
})
