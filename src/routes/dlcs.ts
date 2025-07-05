import { Hono } from 'hono'
import { supabase } from '@/db.ts'

const dlcs = new Hono()

dlcs.get('/', async (c) => {
  const { data, error } = await supabase.from('downloadable_contents').select(
    '*',
  )

  if (error) {
    return c.json({ error }, 500)
  }

  return c.json({ data })
})

dlcs.get('/:slug', async (c) => {
  const slug = c.req.param('slug')

  const { data, error } = await supabase
    .from('downloadable_contents')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) {
    return c.json({ error: 'DLC not found' }, 404)
  }

  return c.json({ data })
})

export default dlcs
