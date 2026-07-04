import { pgTable, text, integer, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const leadsTable = pgTable("leads", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  whatsapp: text("whatsapp").notNull(),
  maritalStatus: text("marital_status"),
  intentLevel: text("intent_level"),
  winningArea: text("winning_area").notNull(),
  diagnosisTitle: text("diagnosis_title").notNull(),
  scoreSaude: integer("score_saude").notNull().default(0),
  scoreEmocional: integer("score_emocional").notNull().default(0),
  scoreFamilia: integer("score_familia").notNull().default(0),
  scoreEspiritual: integer("score_espiritual").notNull().default(0),
  scoreProfissional: integer("score_profissional").notNull().default(0),
  utmSource: text("utm_source"),
  utmMedium: text("utm_medium"),
  utmCampaign: text("utm_campaign"),
  utmContent: text("utm_content"),
  utmTerm: text("utm_term"),
  landingUrl: text("landing_url"),
  resultUrl: text("result_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertLeadSchema = createInsertSchema(leadsTable).omit({ id: true, createdAt: true });
export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Lead = typeof leadsTable.$inferSelect;
