import { Hono } from 'hono'
import { supabase } from '@/db.ts'

const merchants = new Hono()

merchants.get('/', async (c) => {
  const { data, error } = await supabase.from('merchants').select('*')

  if (error) {
    return c.json({ error }, 500)
  }

  return c.json({ data })
})

merchants.get('/:slug', async (c) => {
  const slug = c.req.param('slug')

  const { data, error } = await supabase
    .from('merchants')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) {
    return c.json({ error: 'Merchant not found' }, 404)
  }

  return c.json({ data })
})

export default merchants
