import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from '~/server/db/schema'
import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle'

export const sql = neon(process.env.DATABASE_URL!)
export const db = drizzle(sql, { schema })

export const adapter = new DrizzlePostgreSQLAdapter(db, schema.sessionTable, schema.user)
