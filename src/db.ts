import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from '@/db/schema.ts'

const client = postgres({
  host: Deno.env.get('DB_HOST')!,
  port: parseInt(Deno.env.get('DB_PORT') || '5432'),
  database: Deno.env.get('DB_NAME')!,
  username: Deno.env.get('DB_USER')!,
  password: Deno.env.get('DB_PASSWORD')!,
  prepare: false,
})

export const db = drizzle(client, { schema })
