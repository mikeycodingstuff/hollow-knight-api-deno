import { drizzle } from 'drizzle-orm/postgres-js'
import { sql } from 'drizzle-orm'
import postgres from 'postgres'
import * as schema from '@/db/schema.ts'

const requiredEnvVars = ['DB_HOST', 'DB_NAME', 'DB_USER', 'DB_PASSWORD']
const missing = requiredEnvVars.filter(key => !Deno.env.get(key))

if (missing.length > 0) {
  throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
}

const client = postgres({
  host: Deno.env.get('DB_HOST')!,
  port: parseInt(Deno.env.get('DB_PORT') || '5432'),
  database: Deno.env.get('DB_NAME')!,
  username: Deno.env.get('DB_USER')!,
  password: Deno.env.get('DB_PASSWORD')!,
  prepare: false,
})

export const db = drizzle(client, { schema })

// Debug database connection on startup
async function debugDatabase() {
  try {
    console.log('🔧 DB Config:', {
      host: Deno.env.get('DB_HOST'),
      port: Deno.env.get('DB_PORT'),
      database: Deno.env.get('DB_NAME'),
      user: Deno.env.get('DB_USER'),
      hasPassword: !!Deno.env.get('DB_PASSWORD'),
    })

    // Test basic connection
    const result = await db.execute(sql`SELECT current_database(), current_user, version()`)
    console.log('✅ DB Connected:', result[0])

    // List tables
    const tables = await db.execute(sql`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `)
    console.log('📋 Available tables:', tables.map(t => t.table_name))

  } catch (error) {
    console.error('❌ DB Connection Error:', error)
  }
}

// Run debug (only in production to see Deploy logs)
debugDatabase()