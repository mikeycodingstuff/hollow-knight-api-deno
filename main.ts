import { Hono } from 'hono'
import { api } from '@/api.ts'

const app = new Hono()

app.route('/api', api)

Deno.serve(app.fetch)
