import { Hono } from 'hono'
import { supabase } from '@/db.ts'

const charms = new Hono()

charms.get('/', async (c) => {
  const { data, error } = await supabase.from('charms').select('*')

  if (error) {
    return c.json({ error }, 500)
  }

  return c.json({ data })
})

charms.get('/:slug', async (c) => {
  const slug = c.req.param('slug')

  const { data, error } = await supabase
    .from('charms')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) {
    return c.json({ error: 'Charm not found' }, 404)
  }

  return c.json({ data })
})

export default charms
