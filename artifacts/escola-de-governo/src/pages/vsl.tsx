import { useState, useEffect } from "react";

// ---------------------------------------------------------------------------
// Configurações
// ---------------------------------------------------------------------------
const CHECKOUT_URL = "#"; // TODO: URL do checkout
const BUNNY_LIBRARY_ID = "000000"; // TODO: Library ID Bunny.net
const BUNNY_VIDEO_ID = "00000000-0000-0000-0000-000000000000"; // TODO: Video ID Bunny.net
const HERO_IMAGE_URL = "/Samuel - Perfil.png";

// Tempo em ms após o qual o botão de compra aparece.
// Em produção: ajuste para corresponder ao momento certo do vídeo (ex: 80% da duração).
const CTA_DELAY_MS = 5000;

// ---------------------------------------------------------------------------
// GreenButton — estilo Basta Sentir
// ---------------------------------------------------------------------------
function GreenButton({ href = "#", children }: { href?: string; children: React.ReactNode }) {
  return (
    <>
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
      `}</style>

      <a href={href} className="green-btn">
        {children}
      </a>
    </>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function VSL() {
  const [showCTA, setShowCTA] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowCTA(true), CTA_DELAY_MS);
    return () => clearTimeout(t);
  }, []);

  const BG = "#060D1A";

  return (
    <div
      style={{
        backgroundColor: BG,
        color: "#fff",
        fontFamily: "'DM Sans', 'Inter', sans-serif",
        overflowX: "hidden",
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ----------------------------------------------------------------
          Estilos responsivos
      ---------------------------------------------------------------- */}
      <style>{`
        .vsl-photo        { display: block; }
        .vsl-content      { padding: 48px 32px 60px 48px; max-width: 640px; }
        .vsl-headline     { text-align: left; }
        .vsl-subtitle     { text-align: left; }
        .vsl-btn          { font-size: 16px; letter-spacing: 1.5px; white-space: nowrap; }
        .vsl-urgency      { font-size: 20px; letter-spacing: 3px; white-space: nowrap; }

        @media (max-width: 768px) {
          .vsl-photo    { display: none !important; }
          .vsl-content  { padding: 36px 20px 48px; max-width: 100%; }
          .vsl-headline { text-align: center; }
          .vsl-subtitle { text-align: center; }
          .vsl-btn      { font-size: 15px; letter-spacing: 0.5px; white-space: normal; }
          .vsl-urgency  { font-size: 14px; letter-spacing: 1.5px; }
        }
      `}</style>

      {/* ================================================================
          URGENCY BAR
      ================================================================ */}
      <div
        className="vsl-urgency"
        style={{
          backgroundColor: "#D92020",
          padding: "14px 24px",
          textAlign: "center",
          fontWeight: 700,
          textTransform: "uppercase",
          color: "#fff",
          flexShrink: 0,
          whiteSpace: "nowrap",
          overflow: "hidden",
          fontFamily: "'Montserrat', sans-serif",
        }}
      >
        ASSISTA ANTES QUE SAIA DO AR
      </div>

      {/* ================================================================
          MAIN SECTION
      ================================================================ */}
      <section
        style={{
          position: "relative",
          flex: 1,
          display: "flex",
          alignItems: "flex-start",
          overflow: "hidden",
          minHeight: "calc(100dvh - 50px)",
        }}
      >
        {/* Foto de fundo — lado direito (oculta no mobile) */}
        <div
          aria-hidden
          className="vsl-photo"
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "52%",
            height: "100%",
            zIndex: 0,
          }}
        >
          <img
            src={HERO_IMAGE_URL}
            alt=""
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "top center",
            }}
          />
          {/* Fusão esquerda */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "60%",
              height: "100%",
              background: `linear-gradient(to right, ${BG} 0%, transparent 100%)`,
              zIndex: 1,
            }}
          />
          {/* Fusão base */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "30%",
              background: `linear-gradient(to top, ${BG} 0%, transparent 100%)`,
              zIndex: 1,
            }}
          />
        </div>

        {/* Conteúdo */}
        <div className="vsl-content" style={{ position: "relative", zIndex: 1, width: "100%" }}>
          {/* Headline */}
          <h1
            className="vsl-headline"
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "clamp(28px, 3.8vw, 52px)",
              fontWeight: 900,
              lineHeight: 1.05,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              margin: "0 0 18px",
              color: "#fff",
            }}
          >
            COMO USAR O PODER DAS{" "}
            <span style={{ color: "#fff" }}>PALAVRAS</span>{" "}
            <span style={{ color: "#00E64D" }}>PARA IMPRIMIR DINHEIRO</span>{" "}
            NA SUA VIDA
          </h1>

          {/* Subtítulo */}
          <p
            className="vsl-subtitle"
            style={{
              fontSize: "16px",
              lineHeight: 1.7,
              color: "rgba(255,255,255,0.8)",
              margin: "0 0 28px",
            }}
          >
            Aprenda o que declarar, quando declarar e como alinhar sua boca, sua fé e suas ações para destravar uma{" "}
            <strong style={{ color: "#00E64D" }}>nova vida financeira</strong>.
          </p>

          {/* Vídeo */}
          <div
            style={{
              borderRadius: "6px",
              overflow: "hidden",
              border: "2px solid rgba(255,215,0,0.5)",
              boxShadow: "0 0 40px rgba(255,215,0,0.08)",
              aspectRatio: "16/9",
              background: "#000",
              marginBottom: "28px",
            }}
          >
            <iframe
              src={`https://iframe.mediadelivery.net/embed/${BUNNY_LIBRARY_ID}/${BUNNY_VIDEO_ID}?autoplay=false&loop=false&muted=false&preload=true`}
              loading="lazy"
              allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              style={{ width: "100%", height: "100%", border: "none", display: "block" }}
            />
          </div>

          {/* Botão de compra — aparece após CTA_DELAY_MS */}
          <div
            style={{
              transition: "opacity 0.6s ease, transform 0.6s ease",
              opacity: showCTA ? 1 : 0,
              transform: showCTA ? "translateY(0)" : "translateY(12px)",
              pointerEvents: showCTA ? "auto" : "none",
            }}
          >
            <GreenButton href={CHECKOUT_URL}>
              QUERO MINHA TRANSFORMAÇÃO AGORA
            </GreenButton>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "24px",
                marginTop: "14px",
                flexWrap: "wrap",
              }}
            >
              {/* 7 dias de garantia */}
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <svg width="18" height="18" viewBox="0 0 512 512" fill="#00BB2D">
                  <path d="M458.622 255.92l45.985-45.005c13.708-12.977 7.316-36.039-10.664-40.339l-62.65-15.99 17.661-62.015c4.991-17.838-11.829-34.663-29.661-29.671l-61.994 17.667-15.984-62.671C337.085.197 313.765-6.276 300.99 7.228L256 53.57 211.011 7.229c-12.63-13.351-36.047-7.234-40.325 10.668l-15.984 62.671-61.995-17.667C74.87 57.907 58.056 74.738 63.046 92.572l17.661 62.015-62.65 15.99C.069 174.878-6.31 197.944 7.392 210.915l45.985 45.005-45.985 45.004c-13.708 12.977-7.316 36.039 10.664 40.339l62.65 15.99-17.661 62.015c-4.991 17.838 11.829 34.663 29.661 29.671l61.994-17.667 15.984 62.671c4.439 18.575 27.696 24.018 40.325 10.668L256 458.61l44.989 46.001c12.5 13.488 35.987 7.486 40.325-10.668l15.984-62.671 61.994 17.667c17.836 4.994 34.651-11.837 29.661-29.671l-17.661-62.015 62.65-15.99c17.987-4.302 24.366-27.367 10.664-40.339l-45.984-45.004z"/>
                </svg>
                <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.75)", fontWeight: 600 }}>
                  7 dias de garantia
                </span>
              </div>

              {/* 100% Seguro */}
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <svg width="18" height="18" viewBox="0 0 640 512" fill="#00BB2D">
                  <path d="M224 256A128 128 0 1 0 96 128a128 128 0 0 0 128 128zm96 64a63.08 63.08 0 0 1 8.1-30.5c-4.8-.5-9.5-1.5-14.5-1.5h-16.7a174.08 174.08 0 0 1-145.8 0h-16.7A134.43 134.43 0 0 0 0 422.4V464a48 48 0 0 0 48 48h280.9a63.54 63.54 0 0 1-8.9-32zm288-32h-32v-80a80 80 0 0 0-160 0v80h-32a32 32 0 0 0-32 32v160a32 32 0 0 0 32 32h224a32 32 0 0 0 32-32V320a32 32 0 0 0-32-32zM496 432a32 32 0 1 1 32-32 32 32 0 0 1-32 32zm32-144h-64v-80a32 32 0 0 1 64 0z"/>
                </svg>
                <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.75)", fontWeight: 600 }}>
                  100% Seguro
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          FOOTER
      ================================================================ */}
      <footer
        style={{
          borderTop: "1px solid rgba(255,255,255,0.07)",
          padding: "20px 24px",
          textAlign: "center",
          flexShrink: 0,
        }}
      >
        <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.25)", margin: 0, textTransform: "uppercase", letterSpacing: "1px" }}>
          Política de Privacidade &nbsp;|&nbsp; Termos de Uso
        </p>
        <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.2)", margin: "6px 0 0", letterSpacing: "0.5px" }}>
          Todos os Direitos Reservados – 2026 – Samuel Pereira
        </p>
      </footer>
    </div>
  );
}

