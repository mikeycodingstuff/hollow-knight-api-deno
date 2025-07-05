import { Hono } from 'hono'
import charms from '@/routes/charms.ts'

const app = new Hono()

app.route('api/charms', charms)

Deno.serve(app.fetch)
