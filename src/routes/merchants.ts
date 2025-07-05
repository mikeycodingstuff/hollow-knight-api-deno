import { Hono } from 'hono'
import { eq } from 'drizzle-orm'
import { db } from '@/db.ts'
import { merchants } from '@/db/schema.ts'
import { getIncludes } from '@/helpers.ts'

const merchantsRouter = new Hono()

function buildIncludeOptions(includes: string[]) {
  const withOptions: Record<string, any> = {}

  if (includes.includes('areas')) {
    withOptions.areaMerchants = {
      with: {
        area: true,
      },
    }
  }

  return withOptions
}

merchantsRouter.get('/', async (c) => {
  const includes = getIncludes(c.req.query('include'))

  try {
    const withOptions = buildIncludeOptions(includes)

    const data = await db.query.merchants.findMany({
      with: withOptions,
    })

    return c.json({ data })
  } catch (_) {
    return c.json({ error: 'Failed to fetch merchants' }, 500)
  }
})

merchantsRouter.get('/:slug', async (c) => {
  const slug = c.req.param('slug')
  const includes = getIncludes(c.req.query('include'))

  try {
    const withOptions = buildIncludeOptions(includes)

    const data = await db.query.merchants.findFirst({
      where: eq(merchants.slug, slug),
      with: withOptions,
    })

    if (!data) {
      return c.json({ error: 'Merchant not found' }, 404)
    }

    return c.json({ data })
  } catch (_) {
    return c.json({ error: 'Failed to fetch merchant' }, 500)
  }
})

export default merchantsRouter
