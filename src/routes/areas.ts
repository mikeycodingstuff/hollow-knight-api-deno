import { Hono } from 'hono'
import { supabase } from '@/db.ts'

const areas = new Hono()

areas.get('/', async (c) => {
  const { data, error } = await supabase.from('areas').select('*')

  if (error) {
    return c.json({ error }, 500)
  }

  return c.json({ data })
})

areas.get('/:slug', async (c) => {
  const slug = c.req.param('slug')

  const { data, error } = await supabase
    .from('areas')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) {
    return c.json({ error: 'Area not found' }, 404)
  }

  return c.json({ data })
})

export default areas
