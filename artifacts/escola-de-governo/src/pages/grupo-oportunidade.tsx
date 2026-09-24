import { useEffect } from "react";
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
        margin: 0 0 22px;
        color: #fff;
        font-size: 20px;
        font-family: 'Helvetica Neue', sans-serif;
        font-weight: 700;
        line-height: 1.35;
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
      @media (prefers-reduced-motion: reduce) {
        .go-button { transition: none; }
      }
    `}</style>
  );
}

export default function GrupoOportunidade() {
  useEffect(() => {
    document.title = "Grupo de Oportunidades - Samuel Pereira";
    ensureMetaPixel(META_PIXEL_ID);
    trackMetaPixelPageView(META_PIXEL_ID, window.location.href);
  }, []);

  return (
    <main className="go-page">
      <PageStyles />
      <div className="go-content">
        <section className="go-card" aria-labelledby="go-card-title">
          <h2 id="go-card-title" className="go-card-title">
            Acesse o grupo para saber mais sobre a oportunidade
          </h2>
          <a className="go-button" href={GROUP_URL}>
            Acessar grupo no WhatsApp
          </a>
        </section>
      </div>
    </main>
  );
}
