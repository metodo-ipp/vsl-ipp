import { Router, type IRouter } from "express";
import { db, freeGroupLeadsTable } from "@workspace/db";
import { JoinFreeGroupBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/free-group/join", async (req, res): Promise<void> => {
  const parsed = JoinFreeGroupBody.safeParse(req.body);
  if (!parsed.success) {
    req.log.warn({ errors: parsed.error.message }, "Invalid free group join");
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const body = parsed.data;

  const [lead] = await db
    .insert(freeGroupLeadsTable)
    .values({
      name: body.name,
      email: body.email,
      whatsapp: body.whatsapp,
      utmSource: body.utmSource ?? null,
      utmMedium: body.utmMedium ?? null,
      utmCampaign: body.utmCampaign ?? null,
      utmContent: body.utmContent ?? null,
      utmTerm: body.utmTerm ?? null,
      landingUrl: body.landingUrl ?? null,
    })
    .returning({ id: freeGroupLeadsTable.id });

  res.status(201).json({ leadId: lead!.id });
});

export default router;
