import { Router, type IRouter } from "express";
import { GetAreaParams, GetAreaResponse, ListAreasResponse } from "@workspace/api-zod";

export type AreaSlug =
  | "saude"
  | "emocional"
  | "familia"
  | "espiritual"
  | "profissional";

export interface AreaConfig {
  slug: AreaSlug;
  area: string;
  diagnosisTitle: string;
  vslUrl: string;
  poster: string | null;
  checkoutUrl497: string;
  checkoutUrl4997: string;
  whatsappGroupUrl: string;
}

const FALLBACK_VSL_URL =
  "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";
const FALLBACK_CHECKOUT_497 = "https://pay.example.com/escola-de-governo-497";
const FALLBACK_CHECKOUT_4997 = "https://pay.example.com/escola-de-governo-vip-4997";
const FALLBACK_WHATSAPP_GROUP = "https://chat.whatsapp.com/escola-de-governo";

export const AREAS: Record<AreaSlug, AreaConfig> = {
  saude: {
    slug: "saude",
    area: "Saúde Física",
    diagnosisTitle: "A Fortaleza Comprometida",
    vslUrl: process.env["VSL_URL_SAUDE"] ?? FALLBACK_VSL_URL,
    poster: process.env["VSL_POSTER_SAUDE"] ?? null,
    checkoutUrl497: process.env["CHECKOUT_URL_497"] ?? FALLBACK_CHECKOUT_497,
    checkoutUrl4997: process.env["CHECKOUT_URL_4997"] ?? FALLBACK_CHECKOUT_4997,
    whatsappGroupUrl: process.env["WHATSAPP_GROUP_SAUDE"] ?? FALLBACK_WHATSAPP_GROUP,
  },
  emocional: {
    slug: "emocional",
    area: "Controle Emocional",
    diagnosisTitle: "A Mente em Sobrecarga",
    vslUrl: process.env["VSL_URL_EMOCIONAL"] ?? FALLBACK_VSL_URL,
    poster: process.env["VSL_POSTER_EMOCIONAL"] ?? null,
    checkoutUrl497: process.env["CHECKOUT_URL_497"] ?? FALLBACK_CHECKOUT_497,
    checkoutUrl4997: process.env["CHECKOUT_URL_4997"] ?? FALLBACK_CHECKOUT_4997,
    whatsappGroupUrl: process.env["WHATSAPP_GROUP_EMOCIONAL"] ?? FALLBACK_WHATSAPP_GROUP,
  },
  familia: {
    slug: "familia",
    area: "Família e Lar",
    diagnosisTitle: "O Lar Desalinhado",
    vslUrl: process.env["VSL_URL_FAMILIA"] ?? FALLBACK_VSL_URL,
    poster: process.env["VSL_POSTER_FAMILIA"] ?? null,
    checkoutUrl497: process.env["CHECKOUT_URL_497"] ?? FALLBACK_CHECKOUT_497,
    checkoutUrl4997: process.env["CHECKOUT_URL_4997"] ?? FALLBACK_CHECKOUT_4997,
    whatsappGroupUrl: process.env["WHATSAPP_GROUP_FAMILIA"] ?? FALLBACK_WHATSAPP_GROUP,
  },
  espiritual: {
    slug: "espiritual",
    area: "Espiritual",
    diagnosisTitle: "A Bússola Desconectada",
    vslUrl: process.env["VSL_URL_ESPIRITUAL"] ?? FALLBACK_VSL_URL,
    poster: process.env["VSL_POSTER_ESPIRITUAL"] ?? null,
    checkoutUrl497: process.env["CHECKOUT_URL_497"] ?? FALLBACK_CHECKOUT_497,
    checkoutUrl4997: process.env["CHECKOUT_URL_4997"] ?? FALLBACK_CHECKOUT_4997,
    whatsappGroupUrl: process.env["WHATSAPP_GROUP_ESPIRITUAL"] ?? FALLBACK_WHATSAPP_GROUP,
  },
  profissional: {
    slug: "profissional",
    area: "Profissional/Financeiro",
    diagnosisTitle: "O Potencial Represado",
    vslUrl: process.env["VSL_URL_PROFISSIONAL"] ?? FALLBACK_VSL_URL,
    poster: process.env["VSL_POSTER_PROFISSIONAL"] ?? null,
    checkoutUrl497: process.env["CHECKOUT_URL_497"] ?? FALLBACK_CHECKOUT_497,
    checkoutUrl4997: process.env["CHECKOUT_URL_4997"] ?? FALLBACK_CHECKOUT_4997,
    whatsappGroupUrl: process.env["WHATSAPP_GROUP_PROFISSIONAL"] ?? FALLBACK_WHATSAPP_GROUP,
  },
};

// Tie-break priority when scores are equal, per PRD section 7.
export const TIE_BREAK_PRIORITY: AreaSlug[] = [
  "espiritual",
  "emocional",
  "profissional",
  "familia",
  "saude",
];

const router: IRouter = Router();

router.get("/areas", (_req, res) => {
  const data = ListAreasResponse.parse(Object.values(AREAS));
  res.json(data);
});

router.get("/areas/:slug", (req, res): void => {
  const params = GetAreaParams.safeParse(req.params);
  if (!params.success) {
    res.status(404).json({ error: "Area not found" });
    return;
  }

  const area = AREAS[params.data.slug];
  if (!area) {
    res.status(404).json({ error: "Area not found" });
    return;
  }

  res.json(GetAreaResponse.parse(area));
});

export default router;
