import { Hono } from 'hono'
import { eq } from 'drizzle-orm'
import { db } from '@/db.ts'
import { dlcs } from '@/db/schema.ts'
import { getIncludes } from '@/helpers.ts'

const dlcsRouter = new Hono()

function buildIncludeOptions(includes: string[]) {
  const withOptions: Record<string, any> = {}

  if (includes.includes('charms')) {
    withOptions.charms = true
  }

  return withOptions
}

dlcsRouter.get('/', async (c) => {
  const includes = getIncludes(c.req.query('include'))

  try {
    const withOptions = buildIncludeOptions(includes)

    const data = await db.query.dlcs.findMany({
      with: withOptions,
    })

    return c.json({ data })
  } catch (_) {
    return c.json({ error: 'Failed to fetch DLCs' }, 500)
  }
})

dlcsRouter.get('/:slug', async (c) => {
  const slug = c.req.param('slug')
  const includes = getIncludes(c.req.query('include'))

  try {
    const withOptions = buildIncludeOptions(includes)

    const data = await db.query.dlcs.findFirst({
      where: eq(dlcs.slug, slug),
      with: withOptions,
    })

    if (!data) {
      return c.json({ error: 'DLC not found' }, 404)
    }

    return c.json({ data })
  } catch (_) {
    return c.json({ error: 'Failed to fetch DLC' }, 500)
  }
})

export default dlcsRouter
