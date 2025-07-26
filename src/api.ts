import { Hono } from 'hono'
import areas from '@/routes/areas.ts'
import charms from '@/routes/charms.ts'
import dlcs from '@/routes/dlcs.ts'
import merchants from '@/routes/merchants.ts'

export const api = new Hono()

api.get('/', (c) => c.text('home page!'))
api.route('/areas', areas)
api.route('/charms', charms)
api.route('/dlcs', dlcs)
api.route('/merchants', merchants)
