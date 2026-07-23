import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    YT?: {
      Player: new (
        element: HTMLElement,
        options: {
          videoId: string;
          playerVars: Record<string, number>;
          events: {
            onReady: () => void;
            onStateChange: (event: { data: number }) => void;
          };
        },
      ) => YouTubePlayer;
      PlayerState: { ENDED: number; PLAYING: number };
    };
    onYouTubeIframeAPIReady?: () => void;
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

type YouTubePlayer = {
  destroy: () => void;
  getCurrentTime: () => number;
  getDuration: () => number;
};

const VIDEO_ID = "vfyM1IjgdLE";
const CHECKOUT_URL = "https://hub.la/r/cid-vsl-grupo";
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;
const CTA_VIDEO_TIME_SECONDS = 10 * 60;

function trackOnce(eventName: string) {
  const storageKey = `cid_grupo_${eventName}`;

  try {
    if (window.sessionStorage.getItem(storageKey)) return;
    window.sessionStorage.setItem(storageKey, "1");
  } catch {
    // O rastreamento continua funcionando mesmo se o navegador bloquear o storage.
  }

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || ((...args: unknown[]) => window.dataLayer?.push(args));
  window.gtag("event", eventName);
}

function checkoutWithUtms() {
  const checkoutUrl = new URL(CHECKOUT_URL);
  const currentParams = new URLSearchParams(window.location.search);

  currentParams.forEach((value, key) => {
    if (key.toLowerCase().startsWith("utm_")) checkoutUrl.searchParams.set(key, value);
  });

  return checkoutUrl.toString();
}

function GreenButton({ href, onClick }: { href: string; onClick: () => void }) {
  return (
    <>
      <style>{`
        .green-btn {
          display: inline-flex; align-items: center; justify-content: center; width: 100%; padding: 25px 46px;
          border-radius: 10px; border: none; border-bottom: 3px solid #027F20;
          background: radial-gradient(165.91% 647.63% at 45.92% -308.33%, #00BB2D 0%, #009624 100%);
          color: #fff; font-family: 'Montserrat', sans-serif; font-size: 18px; font-weight: 900; letter-spacing: 1px;
          text-decoration: none; text-transform: uppercase; text-align: center; position: relative; overflow: hidden;
          z-index: 0; cursor: pointer; transition: filter .2s;
        }
        .green-btn:hover { filter: brightness(1.08); }
        .green-btn:active { translate: 0 1px; }
        .green-btn::before {
          content: ""; position: absolute; top: -10%; left: -80px; width: 60px; height: 120%; background: #fff;
          box-shadow: 0 0 30px 20px rgba(255,255,255,.97); transform: skewX(-20deg); mix-blend-mode: plus-lighter;
          opacity: 0; animation: brilho 3s linear infinite; z-index: 1;
        }
        @keyframes brilho { 0% { left: -80px; opacity: 0; } 5% { opacity: 1; } 45% { left: 110%; opacity: 1; } 46%, 100% { left: 110%; opacity: 0; } }
      `}</style>
      <a href={href} onClick={onClick} className="green-btn">QUERO MINHA TRANSFORMAÇÃO AGORA</a>
    </>
  );
}

export default function CidGrupo() {
  const playerElementRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YouTubePlayer | null>(null);
  const intervalRef = useRef<number | null>(null);
  const [checkoutUrl, setCheckoutUrl] = useState(CHECKOUT_URL);
  const [showCTA, setShowCTA] = useState(false);
  const BG = "#060D1A";

  useEffect(() => {
    setCheckoutUrl(checkoutWithUtms());
    trackOnce("vsl_page_view");

    if (GA_MEASUREMENT_ID) {
      const gaScript = document.createElement("script");
      gaScript.async = true;
      gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
      document.head.appendChild(gaScript);
      window.gtag = (...args: unknown[]) => window.dataLayer?.push(args);
      window.gtag("js", new Date());
      window.gtag("config", GA_MEASUREMENT_ID);
    }

    const checkProgress = () => {
      const player = playerRef.current;
      const duration = player?.getDuration() || 0;
      if (!player || !duration) return;
      const currentTime = player.getCurrentTime();
      const progress = (currentTime / duration) * 100;
      if (progress >= 25) trackOnce("vsl_progress_25");
      if (progress >= 50) trackOnce("vsl_progress_50");
      if (progress >= 75) trackOnce("vsl_progress_75");
      if (progress >= 90) trackOnce("vsl_progress_90");
      if (currentTime >= CTA_VIDEO_TIME_SECONDS) setShowCTA(true);
    };

    const createPlayer = () => {
      if (!playerElementRef.current || !window.YT?.Player) return;
      playerRef.current = new window.YT.Player(playerElementRef.current, {
        videoId: VIDEO_ID,
        playerVars: { enablejsapi: 1, playsinline: 1, rel: 0 },
        events: {
          onReady: () => undefined,
          onStateChange: (event) => {
            if (event.data === 1) {
              trackOnce("vsl_start");
              checkProgress();
              if (intervalRef.current === null) intervalRef.current = window.setInterval(checkProgress, 1000);
            }
            if (event.data === 0) {
              checkProgress();
              trackOnce("vsl_complete");
              if (intervalRef.current !== null) window.clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
          },
        },
      });
    };

    if (window.YT?.Player) {
      createPlayer();
    } else {
      const previousReady = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        previousReady?.();
        createPlayer();
      };
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      document.head.appendChild(script);
    }

    return () => {
      if (intervalRef.current !== null) window.clearInterval(intervalRef.current);
      playerRef.current?.destroy();
    };
  }, []);

  return (
    <div style={{ backgroundColor: BG, color: "#fff", fontFamily: "'DM Sans', 'Inter', sans-serif", overflowX: "hidden", minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
      <style>{`
        .vsl-photo { display: block; }
        .vsl-content { padding: 48px 32px 60px 48px; max-width: 760px; }
        .vsl-headline, .vsl-subtitle { text-align: left; }
        .vsl-youtube-player, .vsl-youtube-player iframe { width: 100% !important; height: 100% !important; border: 0; display: block; }
        .vsl-btn { font-size: 16px; letter-spacing: 1.5px; white-space: nowrap; }
        .vsl-urgency { font-size: 20px; letter-spacing: 3px; white-space: nowrap; }
        @media (max-width: 768px) {
          .vsl-photo { display: none !important; }
          .vsl-content { padding: 36px 20px 48px; max-width: 100%; }
          .vsl-headline, .vsl-subtitle { text-align: center; }
          .vsl-btn { font-size: 15px; letter-spacing: .5px; white-space: normal; }
          .vsl-urgency { font-size: 14px; letter-spacing: 1.5px; }
        }
      `}</style>

      <div className="vsl-urgency" style={{ backgroundColor: "#D92020", padding: "14px 24px", textAlign: "center", fontWeight: 700, textTransform: "uppercase", color: "#fff", flexShrink: 0, whiteSpace: "nowrap", overflow: "hidden", fontFamily: "'Montserrat', sans-serif" }}>ASSISTA ANTES QUE SAIA DO AR</div>
      <section style={{ position: "relative", flex: 1, display: "flex", alignItems: "flex-start", overflow: "hidden", minHeight: "calc(100dvh - 50px)" }}>
        <div aria-hidden className="vsl-photo" style={{ position: "absolute", top: 0, right: 0, width: "52%", height: "100%", zIndex: 0 }}>
          <img src="/Samuel - Perfil.png" alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }} />
          <div style={{ position: "absolute", top: 0, left: 0, width: "60%", height: "100%", background: `linear-gradient(to right, ${BG} 0%, transparent 100%)`, zIndex: 1 }} />
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "30%", background: `linear-gradient(to top, ${BG} 0%, transparent 100%)`, zIndex: 1 }} />
        </div>

        <div className="vsl-content" style={{ position: "relative", zIndex: 1, width: "100%" }}>
          <h1 className="vsl-headline" style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "clamp(28px, 3.8vw, 52px)", fontWeight: 900, lineHeight: 1.05, textTransform: "uppercase", letterSpacing: ".5px", margin: "0 0 18px", color: "#fff" }}>COMO USAR O PODER DAS <span>PALAVRAS</span> <span style={{ color: "#00E64D" }}>PARA IMPRIMIR DINHEIRO</span> NA SUA VIDA</h1>
          <p className="vsl-subtitle" style={{ fontSize: "16px", lineHeight: 1.7, color: "rgba(255,255,255,.8)", margin: "0 0 28px" }}>Aprenda o que declarar, quando declarar e como alinhar sua boca, sua fé e suas ações para destravar uma <strong style={{ color: "#00E64D" }}>nova vida financeira</strong>.</p>
          <div aria-label="Vídeo Como Imprimir Dinheiro com Suas Palavras" style={{ borderRadius: "6px", overflow: "hidden", border: "2px solid rgba(255,215,0,.5)", boxShadow: "0 0 40px rgba(255,215,0,.08)", aspectRatio: "16/9", background: "#000", marginBottom: "28px" }}>
            <div ref={playerElementRef} className="vsl-youtube-player" />
          </div>
          {showCTA && (
            <div style={{ transition: "opacity .6s ease, transform .6s ease", opacity: 1, transform: "translateY(0)" }}>
              <GreenButton href={checkoutUrl} onClick={() => trackOnce("checkout_click")} />
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "24px", marginTop: "14px", flexWrap: "wrap" }}>
                <span style={{ fontSize: "14px", color: "rgba(255,255,255,.75)", fontWeight: 600 }}>✓ 7 dias de garantia</span>
                <span style={{ fontSize: "14px", color: "rgba(255,255,255,.75)", fontWeight: 600 }}>✓ 100% Seguro</span>
              </div>
            </div>
          )}
        </div>
      </section>
      <footer style={{ borderTop: "1px solid rgba(255,255,255,.07)", padding: "20px 24px", textAlign: "center", flexShrink: 0 }}>
        <p style={{ fontSize: "12px", color: "rgba(255,255,255,.25)", margin: 0, textTransform: "uppercase", letterSpacing: "1px" }}>Política de Privacidade &nbsp;|&nbsp; Termos de Uso</p>
        <p style={{ fontSize: "12px", color: "rgba(255,255,255,.2)", margin: "6px 0 0", letterSpacing: ".5px" }}>Todos os Direitos Reservados - 2026 - Samuel Pereira</p>
      </footer>
    </div>
  );
}
