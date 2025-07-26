import { drizzle } from 'drizzle-orm/postgres-js'
import { sql } from 'drizzle-orm'
import postgres from 'postgres'
import * as schema from '@/db/schema.ts'

const encodedPassword = encodeURIComponent(Deno.env.get('DB_PASSWORD')!)

const connectionString =
  `postgresql://postgres.atshaldvksaehwxunuve:${encodedPassword}@aws-0-eu-west-2.pooler.supabase.com:5432/postgres`

console.log(
  '🔗 Using connection string (password hidden):',
  connectionString.replace(/:([^@]+)@/, ':***@'),
)

const client = postgres(connectionString, {
  prepare: false,
})

export const db = drizzle(client, { schema })

// Test connection
console.log('🔧 Testing database connection...')
db.execute(sql`SELECT current_database(), current_user`)
  .then((result) => console.log('✅ Connected to:', result[0]))
  .catch((error) => console.error('❌ Connection failed:', error.message))
