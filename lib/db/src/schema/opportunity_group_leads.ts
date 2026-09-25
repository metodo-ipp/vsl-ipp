import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const opportunityGroupLeadsTable = pgTable("opportunity_group_leads", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type OpportunityGroupLead =
  typeof opportunityGroupLeadsTable.$inferSelect;
