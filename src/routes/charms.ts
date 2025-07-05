import { Hono } from 'hono'
import { eq } from 'drizzle-orm'
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
    const withOptions = buildIncludeOptions(includes)

    const data = await db.query.charms.findMany({
      with: withOptions,
    })

    return c.json({ data })
  } catch (_) {
    return c.json({ error: 'Failed to fetch charms' }, 500)
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
