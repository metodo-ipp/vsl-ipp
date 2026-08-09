import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useJoinFreeGroup } from "@workspace/api-client-react";

// ---------------------------------------------------------------------------
// Configurações
// ---------------------------------------------------------------------------
const GROUP_URL = "https://chat.whatsapp.com/FqvP9CLNYwAFHYgnEEqfPI?s=cl&p=i&ilr=4";

// ---------------------------------------------------------------------------
// Styles helper (injected once via JSX)
// ---------------------------------------------------------------------------
function PageStyles() {
  return (
    <style>{`
      .green-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        padding: 25px 46px;
        border-radius: 10px;
        border: none;
        border-bottom: 3px solid #027F20;
        background: radial-gradient(165.91% 647.63% at 45.92% -308.33%, #00BB2D 0%, #009624 100%);
        color: #fff;
        font-family: 'Helvetica Neue', sans-serif;
        font-size: 18px;
        font-weight: 900;
        letter-spacing: 1px;
        text-decoration: none;
        text-transform: uppercase;
        text-align: center;
        position: relative;
        overflow: hidden;
        z-index: 0;
        cursor: pointer;
        transition: filter 0.2s;
      }
      .green-btn:hover { filter: brightness(1.08); }
      .green-btn:active { translate: 0 1px; }
      .green-btn:disabled { opacity: 0.6; cursor: not-allowed; }
      .green-btn::before {
        content: "";
        position: absolute;
        top: -10%;
        left: -80px;
        width: 60px;
        height: 120%;
        background: #fff;
        box-shadow: 0 0 30px 20px rgba(255,255,255,0.97);
        transform: skewX(-20deg);
        mix-blend-mode: plus-lighter;
        opacity: 0;
        animation: brilho 3s linear infinite;
        z-index: 1;
      }
      @keyframes brilho {
        0%   { left: -80px;  opacity: 0; }
        5%   { opacity: 1; }
        45%  { left: 110%;  opacity: 1; }
        46%  { opacity: 0; }
        100% { left: 110%;  opacity: 0; }
      }
      .gg-input {
        width: 100%;
        padding: 14px 16px;
        border-radius: 8px;
        border: 1.5px solid rgba(255,255,255,0.15);
        background: rgba(255,255,255,0.07);
        color: #fff;
        font-size: 16px;
        font-family: 'Helvetica Neue', sans-serif;
        outline: none;
        transition: border-color 0.2s;
        box-sizing: border-box;
      }
      .gg-input::placeholder { color: rgba(255,255,255,0.35); }
      .gg-input:focus { border-color: #00BB2D; }
      .gg-sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
      }
      .gg-error { color: #ff6b6b; font-size: 13px; margin-top: 4px; }

      /* ---- Photo layout ---- */
      .gg-photo-wrap {
        position: absolute;
        top: 0; right: 0;
        width: 50%;
        height: 100%;
        z-index: 0;
        pointer-events: none;
      }
      .gg-photo-img {
        width: 100%; height: 100%;
        object-fit: cover;
        object-position: top center;
        display: block;
      }
      .gg-grad-left {
        position: absolute; top: 0; left: 0;
        width: 70%; height: 100%;
        background: linear-gradient(to right, #060D1A 0%, transparent 100%);
        z-index: 1;
      }
      .gg-grad-bottom {
        position: absolute; bottom: 0; left: 0; right: 0;
        height: 35%;
        background: linear-gradient(to top, #060D1A 0%, transparent 100%);
        z-index: 1;
      }
      .gg-content-wrap {
        position: relative;
        z-index: 1;
        width: 100%;
        max-width: 1280px;
        min-height: 100dvh;
        margin: 0 auto;
        padding: 48px 64px 64px;
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(360px, 500px);
        align-items: center;
        gap: clamp(24px, 4.5vw, 64px);
        box-sizing: border-box;
      }
      .gg-hero-copy {
        max-width: 600px;
        padding-top: 0;
      }
      .gg-brand-lockup { display: none; }
      .gg-hero-eyebrow {
        display: inline-block;
        margin: 0 0 16px;
        padding: 8px 14px;
        border: 1px solid rgba(0,187,45,0.65);
        color: #00BB2D;
        font-size: 12.5px;
        font-weight: 700;
        letter-spacing: 2px;
        line-height: 1.25;
        text-transform: uppercase;
      }
      .gg-hero-title {
        margin: 0 0 18px;
        color: #fff;
        font-family: 'Helvetica Neue', sans-serif;
        font-size: clamp(38px, 4.2vw, 48px);
        font-weight: 700;
        letter-spacing: -1.4px;
        line-height: 1.04;
      }
      .gg-hero-description {
        max-width: 560px;
        margin: 0 0 18px;
        color: rgba(255,255,255,0.82);
        font-size: 16px;
        line-height: 1.5;
      }
      .gg-hero-benefits {
        display: flex;
        flex-direction: column;
        gap: 10px;
        max-width: 500px;
      }
      .gg-hero-benefit {
        display: flex;
        align-items: center;
        gap: 12px;
        margin: 0;
        padding: 10px 16px 10px 12px;
        border: 1px solid rgba(255,255,255,0.14);
        border-radius: 999px;
        background: rgba(6,13,26,0.68);
        color: rgba(255,255,255,0.84);
        font-size: 14px;
        line-height: 1.35;
      }
      .gg-hero-benefit-arrow {
        display: grid;
        flex: 0 0 32px;
        width: 32px;
        height: 32px;
        place-items: center;
        border-radius: 50%;
        background: #00BB2D;
        color: #fff;
        font-size: 18px;
        font-weight: 400;
        line-height: 1;
      }
      .gg-hero-benefit strong { flex: 1; }
      .gg-form-title {
        width: fit-content;
        max-width: 100%;
        margin: 0 auto 4px;
        padding: 10px 20px;
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 999px;
        background: rgba(0,0,0,0.58);
        color: rgba(255,255,255,0.9);
        font-size: 15px;
        font-weight: 800;
        line-height: 1.3;
        text-align: center;
      }
      .gg-form-card {
        position: relative;
        top: 140px;
        width: 100%;
        box-sizing: border-box;
        padding: 42px 40px 30px;
        border: 1px solid rgba(255,255,255,0.15);
        border-radius: 18px;
        background: rgba(6,13,26,0.78);
        box-shadow: 0 24px 80px rgba(0,0,0,0.35);
        backdrop-filter: blur(12px);
      }

      @media (max-width: 1050px) {
        .gg-content-wrap {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          max-width: 760px;
          min-height: auto;
          padding: 48px 32px 64px;
          gap: 40px;
        }
        .gg-hero-copy,
        .gg-form-card {
          width: 100%;
          max-width: 560px;
          margin: 0 auto;
          top: 0;
        }
      }

      @media (max-width: 768px) {
        .gg-photo-wrap {
          position: absolute;
          top: 0;
          right: 0;
          left: 0;
          width: 100%;
          height: 1450px;
          overflow: hidden;
        }
        .gg-photo-img {
          object-position: top center;
          opacity: 0.25;
        }
        .gg-grad-left {
          display: block;
          width: 100%;
          height: 100%;
          background:
            linear-gradient(to right, rgba(6,13,26,0.92) 0%, rgba(6,13,26,0.72) 58%, rgba(6,13,26,0.45) 100%),
            linear-gradient(to bottom, #000 0%, #000 14%, rgba(6,13,26,0.75) 36%, #060D1A 82%, #060D1A 100%);
        }
        .gg-grad-bottom {
          height: 70%;
          background: linear-gradient(to top, #060D1A 0%, rgba(6,13,26,0.8) 48%, transparent 100%);
        }
        .gg-content-wrap {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          width: calc(100% - 58px);
          max-width: 583px;
          min-height: auto;
          margin: 0 auto;
          padding: 60px 0 64px;
          gap: 28px;
          background: transparent;
        }
        .gg-hero-copy {
          width: 100%;
          max-width: 100%;
          padding-top: 0;
        }
        .gg-brand-lockup {
          display: block;
          width: 220px;
          margin: 0 auto 32px;
        }
        .gg-brand-logo {
          display: block;
          width: 100%;
          height: auto;
        }
        .gg-hero-eyebrow {
          width: 100%;
          box-sizing: border-box;
          text-align: center;
        }
        .gg-hero-title {
          font-size: 32px;
          letter-spacing: -0.8px;
          line-height: 1.1;
        }
        .gg-hero-description {
          margin-bottom: 16px;
          line-height: 1.2;
        }
        .gg-hero-benefit {
          background: rgba(6,13,26,0.8);
        }
        .gg-form-card {
          max-width: 322px;
          margin: 0 auto;
          padding: 32px 24px 24px;
          border-radius: 14px;
          background: rgba(6,13,26,0.86);
        }
        .gg-form-title {
          padding: 10px 20px;
          font-size: 12px;
        }
        .green-btn {
          padding: 20px 12px;
          font-size: 15px;
          letter-spacing: 0.5px;
        }
      }
    `}</style>
  );
}

// ---------------------------------------------------------------------------
// Form schema
// ---------------------------------------------------------------------------
const formSchema = z.object({
  name: z.string().min(2, "Informe seu nome completo."),
  email: z.string().email("Informe um e-mail válido."),
  whatsapp: z
    .string()
    .regex(/^[0-9+()\s-]+$/, "Use apenas números e os símbolos +, (), espaço ou hífen.")
    .refine(
      (value) => {
        const digits = value.replace(/\D/g, "");
        return digits.length >= 8 && digits.length <= 15;
      },
      "Informe um WhatsApp válido com DDI."
    ),
});

type FormValues = z.infer<typeof formSchema>;

// ---------------------------------------------------------------------------
// UTM helpers
// ---------------------------------------------------------------------------
function getUtmParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get("utm_source"),
    utm_medium: params.get("utm_medium"),
    utm_campaign: params.get("utm_campaign"),
    utm_content: params.get("utm_content"),
    utm_term: params.get("utm_term"),
  };
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function GrupoGratis() {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const joinFreeGroup = useJoinFreeGroup();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", whatsapp: "" },
  });

  useEffect(() => {
    document.title = "Aula semanal grátis - Samuel Pereira";
  }, []);

  const onSubmit = (data: FormValues) => {
    setSubmitError(null);
    const utmParams = getUtmParams();

    joinFreeGroup.mutate(
      {
        data: {
          name: data.name,
          email: data.email,
          whatsapp: data.whatsapp.replace(/\D/g, ""),
          utmSource: utmParams.utm_source,
          utmMedium: utmParams.utm_medium,
          utmCampaign: utmParams.utm_campaign,
          utmContent: utmParams.utm_content,
          utmTerm: utmParams.utm_term,
          landingUrl: window.location.href,
        },
      },
      {
        onSuccess: () => {
          window.location.href = GROUP_URL;
        },
        onError: () => {
          setSubmitError("Ocorreu um erro. Tente novamente.");
        },
      }
    );
  };

  const BG = "#060D1A";

  return (
    <div
      style={{
        backgroundColor: BG,
        color: "#fff",
        fontFamily: "'Helvetica Neue', sans-serif",
        overflowX: "hidden",
        minHeight: "100dvh",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
      }}
    >
      <PageStyles />

      {/* ---- Foto com degradê ---- */}
      <div className="gg-photo-wrap" aria-hidden>
        <img src="/Samuel - Perfil.png" alt="" className="gg-photo-img" />
        <div className="gg-grad-left" />
        <div className="gg-grad-bottom" />
      </div>

      <div className="gg-content-wrap">
        {/* ---- Hero ---- */}
        <div className="gg-hero-copy">
          <div className="gg-brand-lockup" aria-hidden="true">
            <img src="/edg-white.png" alt="" className="gg-brand-logo" />
          </div>
          <p className="gg-hero-eyebrow">
            TODA SEGUNDA · 20H · GOOGLE MEET · GRATUITO
          </p>
          <h1 className="gg-hero-title">
            Você quer melhorar de vida.
            <br />
            Mas suas decisões estão te levando pra lá?
          </h1>
          <p className="gg-hero-description">
            Toda semana, Samuel Pereira conduz uma aula prática e ao vivo para te
            ajudar a avançar nas áreas que mais mexem com o rumo da sua vida:
            <br />
            <strong>dinheiro, mente, emoções, família, corpo e vida espiritual.</strong>
          </p>
          <p className="gg-hero-description">
            Não é mais conteúdo para você salvar e ver depois.
          </p>
          <p className="gg-hero-description">
            É uma aula para entender o que precisa mudar, tomar decisões melhores
            e começar a colocar sua vida no rumo certo.
          </p>
          <div className="gg-hero-benefits">
            <p className="gg-hero-benefit">
              <span className="gg-hero-benefit-arrow" aria-hidden="true">→</span>
              <strong>Saia de cada aula sabendo o que fazer a seguir</strong>
            </p>
            <p className="gg-hero-benefit">
              <span className="gg-hero-benefit-arrow" aria-hidden="true">→</span>
              <strong>Uma área importante da sua vida trabalhada por vez</strong>
            </p>
          </div>
        </div>

        {/* ---- Form ---- */}
        <div className="gg-form-card">
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            noValidate
          >
          <p className="gg-form-title">
            Segunda-feira às 20h. Sem replay.
          </p>

          <div>
            <label className="gg-sr-only" htmlFor="gg-name">
              Seu nome
            </label>
            <input
              id="gg-name"
              className="gg-input"
              placeholder="SEU NOME"
              autoComplete="name"
              {...form.register("name")}
            />
            {form.formState.errors.name && (
              <p className="gg-error">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="gg-sr-only" htmlFor="gg-whatsapp">
              Seu WhatsApp
            </label>
            <input
              id="gg-whatsapp"
              type="tel"
              className="gg-input"
              placeholder="SEU WHATSAPP"
              autoComplete="tel"
              {...form.register("whatsapp")}
            />
            {form.formState.errors.whatsapp && (
              <p className="gg-error">
                {form.formState.errors.whatsapp.message}
              </p>
            )}
          </div>

          <div>
            <label className="gg-sr-only" htmlFor="gg-email">
              Seu melhor e-mail
            </label>
            <input
              id="gg-email"
              type="email"
              className="gg-input"
              placeholder="SEU MELHOR E-MAIL"
              autoComplete="email"
              {...form.register("email")}
            />
            {form.formState.errors.email && (
              <p className="gg-error">{form.formState.errors.email.message}</p>
            )}
          </div>

          <p
            style={{
              fontSize: "14px",
              lineHeight: 1.5,
              color: "rgba(255,255,255,0.72)",
              textAlign: "center",
              margin: "0 0 2px",
            }}
          >
            Ao se inscrever, você será direcionado para o grupo onde os avisos
            e o link da aula são enviados.
          </p>

          {submitError && (
            <p style={{ color: "#ff6b6b", fontSize: "14px", textAlign: "center" }}>
              {submitError}
            </p>
          )}

          <button type="submit" className="green-btn" disabled={joinFreeGroup.isPending}>
            {joinFreeGroup.isPending ? "Entrando..." : "QUERO PARTICIPAR DAS AULAS"}
          </button>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: "8px 16px",
              color: "rgba(255,255,255,0.72)",
              fontSize: "13px",
              lineHeight: 1.5,
            }}
          >
            <span>✓ Gratuito</span>
            <span>✓ Ao vivo</span>
            <span>✓ Google Meet</span>
            <span>✓ Sem replay</span>
          </div>
          </form>

          <p
            style={{
              fontSize: "12px",
              color: "rgba(255,255,255,0.35)",
              textAlign: "center",
              lineHeight: 1.5,
              margin: "20px 0 0",
            }}
          >
            Seus dados estão seguros. Não enviamos spam.
          </p>
        </div>
      </div>
    </div>
  );
}
