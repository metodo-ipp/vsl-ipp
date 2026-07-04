import { Router, type IRouter } from "express";
import { db, leadsTable, quizAnswersTable, eventsTable } from "@workspace/db";
import { SubmitQuizBody, SubmitQuizResponse } from "@workspace/api-zod";
import { AREAS, TIE_BREAK_PRIORITY, type AreaSlug } from "./areas";

const router: IRouter = Router();

function computeWinningArea(
  scores: Record<AreaSlug, number>,
): AreaSlug {
  let best: AreaSlug = TIE_BREAK_PRIORITY[TIE_BREAK_PRIORITY.length - 1]!;
  let bestScore = -1;

  for (const slug of TIE_BREAK_PRIORITY) {
    const score = scores[slug];
    if (score > bestScore) {
      bestScore = score;
      best = slug;
    }
  }

  return best;
}

router.post("/quiz/submit", async (req, res): Promise<void> => {
  const parsed = SubmitQuizBody.safeParse(req.body);
  if (!parsed.success) {
    req.log.warn({ errors: parsed.error.message }, "Invalid quiz submission");
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const body = parsed.data;

  const scores: Record<AreaSlug, number> = {
    saude: 0,
    emocional: 0,
    familia: 0,
    espiritual: 0,
    profissional: 0,
  };

  for (const answer of body.answers) {
    if (
      answer.scoreArea &&
      Object.prototype.hasOwnProperty.call(scores, answer.scoreArea)
    ) {
      scores[answer.scoreArea as AreaSlug] += 1;
    }
  }

  const winningArea = computeWinningArea(scores);
  const area = AREAS[winningArea];
  const resultUrl = `/resultado/${winningArea}`;

  const [lead] = await db
    .insert(leadsTable)
    .values({
      name: body.name,
      email: body.email,
      whatsapp: body.whatsapp,
      maritalStatus: body.maritalStatus ?? null,
      intentLevel: body.intentLevel ?? null,
      winningArea,
      diagnosisTitle: area.diagnosisTitle,
      scoreSaude: scores.saude,
      scoreEmocional: scores.emocional,
      scoreFamilia: scores.familia,
      scoreEspiritual: scores.espiritual,
      scoreProfissional: scores.profissional,
      utmSource: body.utmSource ?? null,
      utmMedium: body.utmMedium ?? null,
      utmCampaign: body.utmCampaign ?? null,
      utmContent: body.utmContent ?? null,
      utmTerm: body.utmTerm ?? null,
      landingUrl: body.landingUrl ?? null,
      resultUrl,
    })
    .returning();

  if (!lead) {
    req.log.error("Failed to insert lead");
    res.status(400).json({ error: "Não foi possível salvar seus dados. Tente novamente." });
    return;
  }

  if (body.answers.length > 0) {
    await db.insert(quizAnswersTable).values(
      body.answers.map((answer) => ({
        leadId: lead.id,
        questionKey: answer.questionKey,
        questionText: answer.questionText,
        answerText: answer.answerText,
        scoreArea: answer.scoreArea ?? null,
      })),
    );
  }

  await db.insert(eventsTable).values([
    { leadId: lead.id, eventName: "lead_captured", eventPayload: null },
    { leadId: lead.id, eventName: "quiz_completed", eventPayload: { scores } },
    {
      leadId: lead.id,
      eventName: "result_generated",
      eventPayload: { winningArea, resultUrl },
    },
  ]);

  res.status(201).json(
    SubmitQuizResponse.parse({
      leadId: lead.id,
      winningArea,
      diagnosisTitle: area.diagnosisTitle,
      slug: winningArea,
      resultUrl,
    }),
  );
});

export default router;
