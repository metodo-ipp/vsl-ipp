import { Router, type IRouter } from "express";
import { db, eventsTable } from "@workspace/db";
import { CreateEventBody, CreateEventResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/events", async (req, res): Promise<void> => {
  const parsed = CreateEventBody.safeParse(req.body);
  if (!parsed.success) {
    req.log.warn({ errors: parsed.error.message }, "Invalid event payload");
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const body = parsed.data;

  const [event] = await db
    .insert(eventsTable)
    .values({
      leadId: body.leadId ?? null,
      eventName: body.eventName,
      eventPayload: body.eventPayload ?? null,
    })
    .returning();

  if (!event) {
    res.status(400).json({ error: "Não foi possível registrar o evento." });
    return;
  }

  res.status(201).json(CreateEventResponse.parse(event));
});

export default router;
