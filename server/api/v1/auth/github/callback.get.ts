import { OAuth2RequestError } from 'arctic'
import { eq } from 'drizzle-orm'
import { generateId } from 'lucia'
import { db } from '~/server/db/drizzle'
import { user } from '~/server/db/schema'

export default defineEventHandler(async event => {
  const query = getQuery(event)
  const code = query.code?.toString() ?? null
  const state = query.state?.toString() ?? null
  const storedState = getCookie(event, 'github_oauth_state') ?? null
  if (!code || !state || !storedState || state !== storedState) {
    throw createError({
      status: 400,
    })
  }

  try {
    const tokens = await githubAuth.validateAuthorizationCode(code)
    const githubUserResponse = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    })
    const githubUser: GitHubUserData = await githubUserResponse.json()

    const [existingUser] = await db
      .select()
      .from(user)
      .where(eq(user.githubId, githubUser.id))

    if (existingUser) {
      const session = await lucia.createSession(existingUser.id, {})
      appendHeader(event, 'Set-Cookie', lucia.createSessionCookie(session.id).serialize())
      return sendRedirect(event, '/')
    }

    const userId = generateId(16)
    await db
      .insert(user)
      .values({
        id: userId,
        name: githubUser.name || githubUser.login,
        email: githubUser.email,
        githubId: githubUser.id,
        provider: 'github',
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

interface GitHubUserData {
  id: string
  name?: string
  login: string
  email?: string
}
