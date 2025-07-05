import {
  date,
  integer,
  pgTable,
  primaryKey,
  text,
  varchar,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

export const areas = pgTable('areas', {
  id: integer('id').primaryKey(),
  name: varchar('name').notNull(),
  slug: varchar('slug').notNull().unique(),
  description: varchar('description'),
})

export const merchants = pgTable('merchants', {
  id: integer('id').primaryKey(),
  name: varchar('name').notNull(),
  slug: varchar('slug').notNull().unique(),
  description: text('description'),
})

export const dlcs = pgTable('downloadable_contents', {
  id: integer('id').primaryKey(),
  name: varchar('name').notNull(),
  slug: varchar('slug').notNull().unique(),
  releaseData: date('release_date'),
})

export const charms = pgTable('charms', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  notches: integer('notches'),
  downloadableContentId: integer('downloadable_content_id').references(() =>
    dlcs.id
  ),
})

export const areaMerchants = pgTable('area_merchant', {
  areaId: integer('area_id').notNull().references(() => areas.id),
  merchantId: integer('merchant_id').notNull().references(() => merchants.id),
}, (table) => [
  primaryKey({ columns: [table.areaId, table.merchantId] }),
])

export const areaCharms = pgTable('area_charm', {
  areaId: integer('area_id').notNull().references(() => areas.id),
  charmId: integer('charm_id').notNull().references(() => charms.id),
}, (table) => [
  primaryKey({ columns: [table.areaId, table.charmId] }),
])

export const areasRelations = relations(areas, ({ many }) => ({
  areaMerchants: many(areaMerchants),
  areaCharms: many(areaCharms),
}))

export const merchantsRelations = relations(merchants, ({ many }) => ({
  areaMerchants: many(areaMerchants),
}))

export const charmsRelations = relations(charms, ({ many, one }) => ({
  areaCharms: many(areaCharms),
  downloadableContent: one(dlcs, {
    fields: [charms.downloadableContentId],
    references: [dlcs.id],
  }),
}))

export const dlcsRelations = relations(dlcs, ({ many }) => ({
  charms: many(charms),
}))

export const areaMerchantsRelations = relations(areaMerchants, ({ one }) => ({
  area: one(areas, {
    fields: [areaMerchants.areaId],
    references: [areas.id],
  }),
  merchant: one(merchants, {
    fields: [areaMerchants.merchantId],
    references: [merchants.id],
  }),
}))

export const areaCharmsRelations = relations(areaCharms, ({ one }) => ({
  area: one(areas, {
    fields: [areaCharms.areaId],
    references: [areas.id],
  }),
  charm: one(charms, {
    fields: [areaCharms.charmId],
    references: [charms.id],
  }),
}))
