import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useJoinFreeGroup } from "@workspace/api-client-react";
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Configurações
// ---------------------------------------------------------------------------
const GROUP_URL = "https://chat.whatsapp.com/C2GjkOdDo6zDGxhPOCbhLT?mode=gi_t";

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
        font-family: 'Montserrat', sans-serif;
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
        font-family: 'DM Sans', 'Inter', sans-serif;
        outline: none;
        transition: border-color 0.2s;
        box-sizing: border-box;
      }
      .gg-input::placeholder { color: rgba(255,255,255,0.35); }
      .gg-input:focus { border-color: #00BB2D; }
      .gg-label {
        display: block;
        color: rgba(255,255,255,0.7);
        font-size: 13px;
        font-weight: 600;
        margin-bottom: 6px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
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
        max-width: 560px;
        padding: 48px 48px 64px;
        display: flex;
        flex-direction: column;
        gap: 32px;
      }

      @media (max-width: 768px) {
        .gg-photo-wrap {
          position: relative;
          width: 100%;
          height: 280px;
          overflow: hidden;
        }
        .gg-photo-img { object-position: top center; }
        .gg-grad-left { display: none; }
        .gg-grad-bottom { height: 55%; }
        .gg-content-wrap {
          max-width: 100%;
          padding: 32px 24px 64px;
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
  whatsapp: z.string().min(14, "Informe um WhatsApp válido com DDD."),
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
    document.title = "Grupo Gratuito de Declarações – Samuel Pereira";
  }, []);

  const formatWhatsApp = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 2) return `(${numbers}`;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

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
        fontFamily: "'DM Sans', 'Inter', sans-serif",
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
        <div style={{ textAlign: "center" }}>
          <p
            style={{
              fontSize: "13px",
              fontWeight: 700,
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: "#00BB2D",
              marginBottom: "12px",
            }}
          >
            Grupo Grátis de declarações diárias
          </p>
          <h1
            style={{
              fontSize: "clamp(26px, 5vw, 38px)",
              fontWeight: 900,
              lineHeight: 1.15,
              fontFamily: "'Montserrat', sans-serif",
              marginBottom: "16px",
            }}
          >
            Como usar o{" "}
            <span style={{ color: "#00BB2D" }}>poder das palavras</span>{" "}
            para imprimir dinheiro na sua vida.
          </h1>

        </div>

        {/* ---- Badge animado + Benefícios ---- */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "center" }}>
          {[
            { icon: "🎙️", text: "Áudio de declaração todo dia, de graça" },
            { icon: "💸", text: "Declarações específicas para cada uma das cinco áreas da sua vida" },
            { icon: "", text: "Tudo direto no WhatsApp, sem complicação" },
          ].map(({ icon, text }) => (
            <AnimatedGradientText key={text} className="bg-black/60 dark:bg-black/60 shadow-none">
              {icon}{" "}
              <hr className="mx-2 h-4 w-px shrink-0 bg-white/30" />
              <span
                className={cn(
                  "inline animate-gradient bg-gradient-to-r from-[#00BB2D] via-[#ffd700] to-[#00BB2D] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent font-semibold",
                )}
              >
                {text}
              </span>
            </AnimatedGradientText>
          ))}
        </div>

        {/* ---- Form ---- */}
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          noValidate
        >
          <p
            style={{
              fontSize: "15px",
              fontWeight: 700,
              color: "rgba(255,255,255,0.85)",
              marginBottom: "4px",
              textAlign: "center",
            }}
          >
            Preencha abaixo para entrar no grupo:
          </p>

          <div>
            <label className="gg-label" htmlFor="gg-name">
              Nome completo
            </label>
            <input
              id="gg-name"
              className="gg-input"
              placeholder="Seu nome"
              autoComplete="name"
              {...form.register("name")}
            />
            {form.formState.errors.name && (
              <p className="gg-error">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="gg-label" htmlFor="gg-email">
              E-mail
            </label>
            <input
              id="gg-email"
              type="email"
              className="gg-input"
              placeholder="seu@email.com"
              autoComplete="email"
              {...form.register("email")}
            />
            {form.formState.errors.email && (
              <p className="gg-error">{form.formState.errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="gg-label" htmlFor="gg-whatsapp">
              WhatsApp (com DDD)
            </label>
            <input
              id="gg-whatsapp"
              type="tel"
              className="gg-input"
              placeholder="(11) 99999-9999"
              autoComplete="tel"
              {...form.register("whatsapp", {
                onChange: (e) => {
                  e.target.value = formatWhatsApp(e.target.value);
                },
              })}
            />
            {form.formState.errors.whatsapp && (
              <p className="gg-error">
                {form.formState.errors.whatsapp.message}
              </p>
            )}
          </div>

          {submitError && (
            <p style={{ color: "#ff6b6b", fontSize: "14px", textAlign: "center" }}>
              {submitError}
            </p>
          )}

          <button type="submit" className="green-btn" disabled={joinFreeGroup.isPending}>
            {joinFreeGroup.isPending ? "Entrando..." : "QUERO ENTRAR NO GRUPO GRATUITO"}
          </button>
        </form>

        <p
          style={{
            fontSize: "12px",
            color: "rgba(255,255,255,0.35)",
            textAlign: "center",
            lineHeight: 1.5,
          }}
        >
          Seus dados estão seguros. Não enviamos spam.
        </p>
      </div>
    </div>
  );
}
