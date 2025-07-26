import { Hono } from 'hono'
import { api } from '@/api.ts'

const app = new Hono()

app.get('/', (c) => c.text('Welcome to my Hollow Knight API!'))
app.route('/api', api)

Deno.serve(app.fetch)
