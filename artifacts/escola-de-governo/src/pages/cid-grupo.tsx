import { useEffect, useRef } from "react";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const CHECKOUT_URL = "https://hub.la/r/cid-vsl-grupo";
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;
const VTURB_PLAYER_ID = "vid-6a6233971ac7c381ab3cd275";
const VTURB_PLAYER_SCRIPT = "https://scripts.converteai.net/d96d1452-17dc-48ff-8763-0c764e770de2/players/6a6233971ac7c381ab3cd275/v4/player.js";

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

export default function CidGrupo() {
  const playerElementRef = useRef<HTMLDivElement>(null);
  const BG = "#060D1A";

  useEffect(() => {
    trackOnce("vsl_page_view");

    const trackCheckoutClick = (event: MouseEvent) => {
      const checkoutLink = event.composedPath().find(
        (target): target is HTMLAnchorElement =>
          target instanceof HTMLAnchorElement && target.href.startsWith(CHECKOUT_URL),
      );

      if (checkoutLink) trackOnce("checkout_click");
    };

    document.addEventListener("click", trackCheckoutClick, true);

    if (GA_MEASUREMENT_ID) {
      const gaScript = document.createElement("script");
      gaScript.async = true;
      gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
      document.head.appendChild(gaScript);
      window.gtag = (...args: unknown[]) => window.dataLayer?.push(args);
      window.gtag("js", new Date());
      window.gtag("config", GA_MEASUREMENT_ID);
    }

    const container = playerElementRef.current;
    if (!container) return;

    const syncCheckoutUrl = () => {
      const checkoutUrl = checkoutWithUtms();
      container.querySelectorAll<HTMLAnchorElement>(`a[href^="${CHECKOUT_URL}"]`).forEach((link) => {
        link.href = checkoutUrl;
      });
    };

    const checkoutObserver = new MutationObserver(syncCheckoutUrl);
    checkoutObserver.observe(container, { childList: true, subtree: true });

    const player = document.createElement("vturb-smartplayer");
    player.id = VTURB_PLAYER_ID;
    player.style.cssText = "display:block;margin:0 auto;width:100%;height:100%;";
    const placeholder = document.createElement("div");
    placeholder.className = "vturb-player-placeholder";
    placeholder.style.cssText = "position:relative;width:100%;padding:56.25% 0 0;z-index:0;background-color:black;";
    player.appendChild(placeholder);
    container.replaceChildren(player);

    const script = document.createElement("script");
    script.src = VTURB_PLAYER_SCRIPT;
    script.async = true;
    document.head.appendChild(script);

    return () => {
      document.removeEventListener("click", trackCheckoutClick, true);
      checkoutObserver.disconnect();
      script.remove();
      container.replaceChildren();
    };
  }, []);

  return (
    <div style={{ backgroundColor: BG, color: "#fff", fontFamily: "'DM Sans', 'Inter', sans-serif", overflowX: "hidden", minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
      <style>{`
        .vsl-photo { display: block; }
        .vsl-content { padding: 48px 32px 60px 48px; max-width: 760px; }
        .vsl-headline, .vsl-subtitle { text-align: left; }
        .vsl-vturb-player, .vsl-vturb-player > vturb-smartplayer { width: 100% !important; height: 100% !important; border: 0; display: block; }
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
            <div ref={playerElementRef} className="vsl-vturb-player" />
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "24px", marginTop: "14px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "14px", color: "rgba(255,255,255,.75)", fontWeight: 600 }}>✓ 7 dias de garantia</span>
            <span style={{ fontSize: "14px", color: "rgba(255,255,255,.75)", fontWeight: 600 }}>✓ 100% Seguro</span>
          </div>
        </div>
      </section>
      <footer style={{ borderTop: "1px solid rgba(255,255,255,.07)", padding: "20px 24px", textAlign: "center", flexShrink: 0 }}>
        <p style={{ fontSize: "12px", color: "rgba(255,255,255,.25)", margin: 0, textTransform: "uppercase", letterSpacing: "1px" }}>Política de Privacidade &nbsp;|&nbsp; Termos de Uso</p>
        <p style={{ fontSize: "12px", color: "rgba(255,255,255,.2)", margin: "6px 0 0", letterSpacing: ".5px" }}>Todos os Direitos Reservados - 2026 - Samuel Pereira</p>
      </footer>
    </div>
  );
}
