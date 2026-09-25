import { useEffect, useState, type FormEvent } from "react";
import {
  ensureMetaPixel,
  trackMetaPixelPageView,
} from "@/lib/meta-pixel";

const GROUP_URL =
  "https://chat.whatsapp.com/F5XrFdoiS2fGC0xOuZAVVd?mode=gi_t";
const META_PIXEL_ID = "1361984078704850";

function PageStyles() {
  return (
    <style>{`
      .go-page {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        min-height: 100dvh;
        padding: 24px;
        box-sizing: border-box;
        background: #060D1A;
        color: #fff;
        font-family: 'Helvetica Neue', sans-serif;
      }
      .go-content {
        width: 100%;
        max-width: 440px;
        margin: 0 auto;
      }
      .go-card {
        padding: 26px 22px 22px;
        border: 1px solid rgba(255,255,255,0.14);
        border-radius: 16px;
        background: #0A1323;
        text-align: center;
      }
      #root .go-card-title {
        margin: 0 0 18px;
        color: #fff;
        font-size: 20px;
        font-family: 'Helvetica Neue', sans-serif;
        font-weight: 700;
        line-height: 1.35;
      }
      .go-form {
        display: flex;
        flex-direction: column;
        gap: 12px;
        text-align: left;
      }
      .go-label {
        display: block;
        margin-bottom: 6px;
        color: rgba(255,255,255,0.9);
        font-size: 14px;
        font-weight: 600;
      }
      .go-input {
        width: 100%;
        min-height: 52px;
        padding: 13px 14px;
        box-sizing: border-box;
        border: 1px solid rgba(255,255,255,0.2);
        border-radius: 9px;
        background: #060D1A;
        color: #fff;
        font: inherit;
        font-size: 16px;
      }
      .go-input::placeholder { color: rgba(255,255,255,0.48); }
      .go-input:focus-visible {
        outline: 3px solid rgba(0,187,45,0.65);
        outline-offset: 2px;
      }
      .go-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        min-height: 56px;
        padding: 16px;
        box-sizing: border-box;
        border: 0;
        border-bottom: 3px solid #027F20;
        border-radius: 10px;
        background: #00A827;
        color: #fff;
        font-family: inherit;
        font-size: 15px;
        font-weight: 800;
        letter-spacing: 0.3px;
        line-height: 1.25;
        text-align: center;
        text-decoration: none;
        text-transform: uppercase;
        transition: filter 0.2s, translate 0.1s;
      }
      .go-button:hover { filter: brightness(1.08); }
      .go-button:active { translate: 0 1px; }
      .go-button:focus-visible {
        outline: 3px solid #fff;
        outline-offset: 3px;
      }
      .go-button:disabled { cursor: wait; opacity: 0.7; }
      .go-error {
        margin: 0;
        color: #ff9a9a;
        font-size: 14px;
        line-height: 1.4;
        text-align: center;
      }
      .go-privacy-note {
        margin: 2px 0 0;
        color: rgba(255,255,255,0.68);
        font-size: 12px;
        line-height: 1.45;
        text-align: center;
      }
      @media (prefers-reduced-motion: reduce) {
        .go-button { transition: none; }
      }
    `}</style>
  );
}

export default function GrupoOportunidade() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Grupo de Oportunidades - Samuel Pereira";
    ensureMetaPixel(META_PIXEL_ID);
    trackMetaPixelPageView(META_PIXEL_ID, window.location.href);
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    const trimmedName = name.trim();
    const phoneDigits = phone.replace(/\D/g, "");
    const validPhone =
      phoneDigits.length === 10 ||
      phoneDigits.length === 11 ||
      (phoneDigits.startsWith("55") &&
        (phoneDigits.length === 12 || phoneDigits.length === 13));

    if (trimmedName.length < 2) {
      setFormError("Informe seu nome.");
      return;
    }
    if (!validPhone) {
      setFormError("Informe um telefone válido com DDD.");
      return;
    }

    setSubmitting(true);
    setFormError(null);

    try {
      const response = await fetch("/api/opportunity-group/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmedName, phone: phoneDigits }),
      });

      if (!response.ok) {
        throw new Error("Não foi possível salvar seu cadastro.");
      }

      window.location.assign(GROUP_URL);
    } catch {
      setFormError(
        "Não foi possível continuar agora. Confira sua conexão e tente novamente.",
      );
      setSubmitting(false);
    }
  }

  return (
    <main className="go-page">
      <PageStyles />
      <div className="go-content">
        <section className="go-card" aria-labelledby="go-card-title">
          <h2 id="go-card-title" className="go-card-title">
            Acesse o grupo para saber mais sobre a oportunidade
          </h2>
          <form className="go-form" onSubmit={handleSubmit} noValidate>
            <div>
              <label className="go-label" htmlFor="opportunity-name">
                Seu nome
              </label>
              <input
                id="opportunity-name"
                className="go-input"
                type="text"
                autoComplete="name"
                maxLength={120}
                placeholder="Digite seu nome"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </div>
            <div>
              <label className="go-label" htmlFor="opportunity-phone">
                Seu telefone com DDD
              </label>
              <input
                id="opportunity-phone"
                className="go-input"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                maxLength={20}
                placeholder="(11) 99999-9999"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                required
              />
            </div>
            {formError && (
              <p className="go-error" role="alert">
                {formError}
              </p>
            )}
            <button className="go-button" type="submit" disabled={submitting}>
              {submitting ? "Salvando..." : "Continuar para o WhatsApp"}
            </button>
            <p className="go-privacy-note">
              Seu nome e telefone serão registrados junto ao seu interesse nesta oportunidade.
            </p>
          </form>
        </section>
      </div>
    </main>
  );
}
