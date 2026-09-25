import { Router, type IRouter } from "express";
import { JoinOpportunityGroupBody } from "@workspace/api-zod";
import { db, opportunityGroupLeadsTable } from "@workspace/db";

const router: IRouter = Router();

router.post("/opportunity-group/join", async (req, res): Promise<void> => {
  const parsed = JoinOpportunityGroupBody.safeParse(req.body);

  if (!parsed.success) {
    req.log.warn("Invalid opportunity group lead submission");
    res.status(400).json({
      error: "Informe seu nome e um telefone válido com DDD.",
    });
    return;
  }

  await db.insert(opportunityGroupLeadsTable).values({
    name: parsed.data.name,
    phone: parsed.data.phone,
  });

  res.status(201).json({ ok: true });
});

export default router;
