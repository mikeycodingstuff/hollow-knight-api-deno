import { Hono } from 'hono'
import areas from '@/routes/areas.ts'
import charms from '@/routes/charms.ts'
import dlcs from '@/routes/dlcs.ts'
import merchants from '@/routes/merchants.ts'

const app = new Hono()

app.route('api/areas', areas)
app.route('api/dlcs', dlcs)
app.route('api/charms', charms)
app.route('api/merchants', merchants)

Deno.serve(app.fetch)
