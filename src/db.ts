import { drizzle } from 'drizzle-orm/postgres-js'
import { sql } from 'drizzle-orm'
import postgres from 'postgres'
import * as schema from '@/db/schema.ts'

const user = encodeURIComponent(Deno.env.get('DB_USER') ?? '')
const password = encodeURIComponent(Deno.env.get('DB_PASSWORD') ?? '')
const host = Deno.env.get('DB_HOST') ?? ''
const port = Deno.env.get('DB_PORT') ?? ''
const dbName = Deno.env.get('DB_NAME') ?? ''

const connectionString =
  `postgresql://${user}:${password}@${host}:${port}/${dbName}`

const client = postgres(connectionString, {
  prepare: false,
})

export const db = drizzle(client, { schema })

// Test connection
console.log('🔧 Testing database connection...')
db.execute(sql`SELECT current_database(), current_user`)
  .then((result) => console.log('✅ Connected to:', result[0]))
  .catch((error) => console.error('❌ Connection failed:', error.message))
