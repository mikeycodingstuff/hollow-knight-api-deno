import { drizzle } from 'drizzle-orm/postgres-js'
import { sql } from 'drizzle-orm'
import postgres from 'postgres'
import * as schema from '@/db/schema.ts'

const isProduction = !!Deno.env.get('DENO_DEPLOYMENT_ID')

// Build connection string
const host = Deno.env.get('DB_HOST')!
const port = Deno.env.get('DB_PORT') || '5432'
const database = Deno.env.get('DB_NAME')!
const username = Deno.env.get('DB_USER')!
const password = Deno.env.get('DB_PASSWORD')!

// Use connection string for production, object for local
let client

if (isProduction) {
  const connectionString = `postgresql://${username}:${encodeURIComponent(password)}@${host}:${port}/${database}?sslmode=require`
  console.log('🔗 Using connection string (password hidden):', connectionString.replace(/:([^@]+)@/, ':***@'))

  client = postgres(connectionString, {
    prepare: false,
  })
} else {
  // Local development
  client = postgres({
    host,
    port: parseInt(port),
    database,
    username,
    password,
    prepare: false,
  })
}

export const db = drizzle(client, { schema })

// Test connection
if (isProduction) {
  console.log('🔧 Testing database connection...')
  db.execute(sql`SELECT current_database(), current_user`)
      .then(result => console.log('✅ Connected to:', result[0]))
      .catch(error => console.error('❌ Connection failed:', error.message))
}