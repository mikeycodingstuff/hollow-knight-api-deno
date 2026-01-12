import { Hono } from 'hono'
import { api } from '@/api.ts'
import { db } from '@/db.ts'
import { sql } from 'drizzle-orm'
import { heartbeat } from '@/db/schema.ts'

const app = new Hono()

app.get('/', (c) => c.text('Welcome to my Hollow Knight API!'))
app.route('/api', api)

// Health check endpoint
app.get('/health', async (c) => {
  try {
    await db.insert(heartbeat).values({})

    // Clean up old records keep latest 100
    await db.execute(sql`
          DELETE FROM heartbeat
          WHERE id NOT IN (
              SELECT id FROM heartbeat
              ORDER BY pinged_at DESC
              LIMIT 100
              )
      `)

    return c.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      db: 'connected',
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return c.json({
      status: 'error',
      message,
    }, 500)
  }
})

// Only register cron in Deno Deploy (not locally)
if (Deno.env.get('DENO_DEPLOYMENT_ID')) {
  Deno.cron(
    'Keep Supabase DB active',
    { dayOfWeek: 1, hour: 0, minute: 0 },
    async () => {
      try {
        await db.insert(heartbeat).values({})
        console.log('✅ Weekly DB ping executed:', new Date().toISOString())
      } catch (error) {
        console.error('❌ Cron job failed:', error)
      }
    },
  )
}

Deno.serve(app.fetch)
