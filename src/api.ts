import { Hono } from 'hono'
import areas from '@/routes/areas.ts'
import charms from '@/routes/charms.ts'
import dlcs from '@/routes/dlcs.ts'
import merchants from '@/routes/merchants.ts'
import { db } from './db.ts'
import { sql } from 'drizzle-orm'

export const api = new Hono()

api.get('/', async (c) => {
  try {
    // Test basic database connection
    const connectionTest = await db.execute(
      sql`SELECT current_database(), current_user, version()`,
    )

    // Test table existence
    const tables = await db.execute(sql`
      SELECT table_name, table_type 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `)

    // Test if charms table specifically exists and has data
    let charmsInfo = null
    try {
      const charmsCount = await db.execute(
        sql`SELECT COUNT(*) as count FROM charms`,
      )
      const charmsColumns = await db.execute(sql`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'charms' AND table_schema = 'public'
        ORDER BY ordinal_position
      `)
      charmsInfo = {
        count: charmsCount[0].count,
        columns: charmsColumns.map((col) =>
          `${col.column_name} (${col.data_type})`
        ),
      }
    } catch (error) {
      charmsInfo = {
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }

    return c.json({
      message: 'Database connection successful!',
      connection: connectionTest[0],
      tables: tables.map((t) => `${t.table_name} (${t.table_type})`),
      charms: charmsInfo,
      environment: {
        isProduction: !!Deno.env.get('DENO_DEPLOYMENT_ID'),
        host: Deno.env.get('DB_HOST'),
        port: Deno.env.get('DB_PORT'),
      },
    })
  } catch (error) {
    console.error('Home route database error:', error)

    return c.json({
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      environment: {
        isProduction: !!Deno.env.get('DENO_DEPLOYMENT_ID'),
        host: Deno.env.get('DB_HOST'),
        port: Deno.env.get('DB_PORT'),
      },
    }, 500)
  }
})
api.route('/areas', areas)
api.route('/charms', charms)
api.route('/dlcs', dlcs)
api.route('/merchants', merchants)
