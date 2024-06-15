import { Lucia } from 'lucia'
import { adapter } from '~/server/db/drizzle'

import { GitHub } from 'arctic'
import { Google } from 'arctic'

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: !process.dev,
    },
  },
  getUserAttributes: attributes => {
    return {
      id: attributes.id,
      name: attributes.name,
      email: attributes.email,
      image: attributes.image,
      provider: attributes.provider,
      favoriteIds: attributes.favoriteIds,
      emailVerified: attributes.emailVerified,
    }
  },
})

declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia
    DatabaseUserAttributes: DatabaseUserAttributes
  }
}

interface DatabaseUserAttributes {
  [x: string]: any
  id: string
  name?: string
  email: string
  image: string
  favoriteIds?: string[]
  provider: string
  emailVerified: string
}

export const githubAuth = new GitHub(
  process.env.GITHUB_CLIENT_ID as string,
  process.env.GITHUB_CLIENT_SECRET as string,
)
export const googleAuth = new Google(
  process.env.GOOGLE_CLIENT_ID as string,
  process.env.GOOGLE_CLIENT_SECRET as string,
  (process.env.BASE_URL as string) + 'login/google/callback',
)
