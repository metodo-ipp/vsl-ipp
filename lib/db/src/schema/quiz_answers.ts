import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { leadsTable } from "./leads";

export const quizAnswersTable = pgTable("quiz_answers", {
  id: uuid("id").primaryKey().defaultRandom(),
  leadId: uuid("lead_id").references(() => leadsTable.id),
  questionKey: text("question_key").notNull(),
  questionText: text("question_text").notNull(),
  answerText: text("answer_text").notNull(),
  scoreArea: text("score_area"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertQuizAnswerSchema = createInsertSchema(quizAnswersTable).omit({ id: true, createdAt: true });
export type InsertQuizAnswer = z.infer<typeof insertQuizAnswerSchema>;
export type QuizAnswer = typeof quizAnswersTable.$inferSelect;
