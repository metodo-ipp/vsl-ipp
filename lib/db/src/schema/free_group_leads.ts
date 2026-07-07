import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const freeGroupLeadsTable = pgTable("free_group_leads", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  whatsapp: text("whatsapp").notNull(),
  utmSource: text("utm_source"),
  utmMedium: text("utm_medium"),
  utmCampaign: text("utm_campaign"),
  utmContent: text("utm_content"),
  utmTerm: text("utm_term"),
  landingUrl: text("landing_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertFreeGroupLeadSchema = createInsertSchema(freeGroupLeadsTable).omit({ id: true, createdAt: true });
export type InsertFreeGroupLead = z.infer<typeof insertFreeGroupLeadSchema>;
export type FreeGroupLead = typeof freeGroupLeadsTable.$inferSelect;
