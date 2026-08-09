import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const edgLeadsAulaSemanalGratisTable = pgTable(
  "edg-leads-aula-semanal-gratis",
  {
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
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
);

export const insertEdgLeadsAulaSemanalGratisSchema = createInsertSchema(
  edgLeadsAulaSemanalGratisTable,
).omit({ id: true, createdAt: true });
export type InsertEdgLeadsAulaSemanalGratis = z.infer<
  typeof insertEdgLeadsAulaSemanalGratisSchema
>;
export type EdgLeadsAulaSemanalGratis =
  typeof edgLeadsAulaSemanalGratisTable.$inferSelect;
