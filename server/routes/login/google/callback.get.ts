import { OAuth2RequestError } from 'arctic'
import { eq } from 'drizzle-orm'
import { generateId } from 'lucia'
import { db } from '~/server/db/drizzle'
import { user } from '~/server/db/schema'

export default defineEventHandler(async event => {
  const query = getQuery(event)
  const code = query.code?.toString() ?? null
  const state = query.state?.toString() ?? null
  const storedState = getCookie(event, 'google_oauth_state') ?? null
  const codeVerifier = getCookie(event, 'google_code_verifier') ?? null

  if (!code || !state || !storedState || state !== storedState || !codeVerifier) {
    throw createError({
      status: 400,
      message: 'Something went wrong,try again later',
    })
  }

  try {
    const tokens = await googleAuth.validateAuthorizationCode(code, codeVerifier)
    const googleResponse = await fetch(
      'https://openidconnect.googleapis.com/v1/userinfo',
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      },
    )
    const googleUser: GoogleUserData = await googleResponse.json()

    const [existingUser] = await db
      .select()
      .from(user)
      .where(eq(user.googleId, googleUser.sub))

    if (existingUser) {
      const session = await lucia.createSession(existingUser.id, {})
      appendHeader(event, 'Set-Cookie', lucia.createSessionCookie(session.id).serialize())
      return sendRedirect(event, '/')
    }

    const [emailInUse] = await db
      .select({ email: user.email })
      .from(user)
      .where(eq(user.email, googleUser.email))

    if (emailInUse) {
      throw createError({
        status: 409,
        message: 'Email is already in use.',
      })
    }

    const userId = generateId(16)
    await db
      .insert(user)
      .values({
        id: userId,
        name: googleUser.name,
        email: googleUser.email,
        googleId: googleUser.sub,
        provider: 'google',
      })
      .returning()
    const session = await lucia.createSession(userId, {})
    appendHeader(event, 'Set-Cookie', lucia.createSessionCookie(session.id).serialize())
    return sendRedirect(event, '/')
  } catch (e: OAuth2RequestError | any) {
    if (e instanceof OAuth2RequestError && e.message === 'bad_verification_code') {
      throw createError({
        status: 400,
        message: e.message,
      })
    }
    throw createError({
      status: 500,
      message: e.message || 'Something went wrong',
    })
  }
})

interface GoogleUserData {
  sub: string
  name: string
  given_name: string
  family_name: string
  email: string
  email_verified: boolean
  locale: string
}
