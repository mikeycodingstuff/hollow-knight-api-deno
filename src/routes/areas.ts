import { Hono } from 'hono'
import { eq } from 'drizzle-orm'
import { db } from '@/db.ts'
import { areas } from '@/db/schema.ts'
import { getIncludes } from '@/helpers.ts'

const areasRouter = new Hono()

function buildIncludeOptions(includes: string[]) {
  const withOptions: Record<string, any> = {}

  if (includes.includes('merchants')) {
    withOptions.areaMerchants = {
      with: {
        merchant: true,
      },
    }
  }

  if (includes.includes('charms')) {
    withOptions.areaCharms = {
      with: {
        charm: true,
      },
    }
  }

  return withOptions
}

areasRouter.get('/', async (c) => {
  const includes = getIncludes(c.req.query('include'))

  try {
    const withOptions = buildIncludeOptions(includes)

    const data = await db.query.areas.findMany({
      with: withOptions,
    })

    return c.json({ data })
  } catch (_) {
    return c.json({ error: 'Failed to fetch areas' }, 500)
  }
})

areasRouter.get('/:slug', async (c) => {
  const slug = c.req.param('slug')
  const includes = getIncludes(c.req.query('include'))

  try {
    const withOptions = buildIncludeOptions(includes)

    const data = await db.query.areas.findFirst({
      where: eq(areas.slug, slug),
      with: withOptions,
    })

    if (!data) {
      return c.json({ error: 'Area not found' }, 404)
    }

    return c.json({ data })
  } catch (_) {
    return c.json({ error: 'Failed to fetch area' }, 500)
  }
})

export default areasRouter
