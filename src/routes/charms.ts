import { Hono } from 'hono'
import { eq, sql } from 'drizzle-orm'
import { db } from '@/db.ts'
import { charms } from '@/db/schema.ts'
import { getIncludes } from '@/helpers.ts'

const charmsRouter = new Hono()

function buildIncludeOptions(includes: string[]) {
  const withOptions: Record<string, any> = {}

  if (includes.includes('dlc')) {
    withOptions.downloadableContent = true
  }

  if (includes.includes('areas')) {
    withOptions.areaCharms = {
      with: {
        area: true,
      },
    }
  }

  return withOptions
}

charmsRouter.get('/', async (c) => {
  const includes = getIncludes(c.req.query('include'))

  try {
    console.log('🔍 Fetching charms with includes:', includes)

    const withOptions = buildIncludeOptions(includes)
    console.log('🔧 With options:', withOptions)

    const data = await db.query.charms.findMany({
      with: withOptions,
    })

    console.log('✅ Fetched charms:', data.length, 'items')
    return c.json({ data })
  } catch (error) {
    console.error('❌ Charms fetch error:', error)

    // Log more details about the error
    if (error instanceof Error) {
      console.error('Error name:', error.name)
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }

    return c.json({
      error: 'Failed to fetch charms',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, 500)
  }
})

charmsRouter.get('/debug', async (c) => {
  try {
    // Test basic query
    const result = await db.execute(sql`SELECT 1 as test`)

    // Test table existence
    const tables = await db.execute(sql`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'charms'
    `)

    return c.json({
      connection: 'OK',
      testQuery: result,
      charmsTableExists: tables.length > 0,
      tables: tables
    })
  } catch (error) {
    console.error('Debug route error:', error)
    return c.json({
      error: error instanceof Error ? error.message : 'Unknown error',
      connection: 'FAILED'
    }, 500)
  }
})

charmsRouter.get('/:slug', async (c) => {
  const slug = c.req.param('slug')
  const includes = getIncludes(c.req.query('include'))

  try {
    const withOptions = buildIncludeOptions(includes)

    const data = await db.query.charms.findFirst({
      where: eq(charms.slug, slug),
      with: withOptions,
    })

    if (!data) {
      return c.json({ error: 'Charm not found' }, 404)
    }

    return c.json({ data })
  } catch (_) {
    return c.json({ error: 'Failed to fetch charm' }, 500)
  }
})

export default charmsRouter
