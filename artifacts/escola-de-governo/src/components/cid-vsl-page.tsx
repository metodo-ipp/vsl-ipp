import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ensureMetaPixel, trackMetaPixelPageView } from "@/lib/meta-pixel";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

type VideoSource =
  | { type: "vturb"; playerId: string; playerScript: string }
  | { type: "youtube"; videoId: string };

type CidVslPageProps = {
  checkoutUrl: string;
  trackingPrefix: string;
  video: VideoSource;
  metaPixelId?: string;
  videoAspectRatio?: "16 / 9" | "9 / 16";
  videoMaxWidth?: number;
  pitchDelaySeconds?: number;
};

type VturbSmartPlayerElement = HTMLElement & {
  displayHiddenElements: (delaySeconds: number, selectors: string[], options: { persist: boolean }) => void;
};

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;
const DEFAULT_PITCH_DELAY_SECONDS = 11 * 60 + 25;
const PITCH_CTA_SELECTOR = ".vsl-pitch-cta";
const PROGRESS_EVENTS = [
  [25, "vsl_progress_25"],
  [50, "vsl_progress_50"],
  [75, "vsl_progress_75"],
  [90, "vsl_progress_90"],
] as const;

function checkoutWithUtms(baseUrl: string) {
  const checkoutUrl = new URL(baseUrl);
  const pageUrl = new URL(window.location.href);

  pageUrl.searchParams.forEach((value, key) => checkoutUrl.searchParams.set(key, value));

  if (pageUrl.search) {
    const sck = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"]
      .map((parameter) => pageUrl.searchParams.get(parameter) ?? "")
      .join("|");
    checkoutUrl.searchParams.set("sck", sck);
  }

  return checkoutUrl.toString();
}

function VslCtaButton({ href, onClick }: { href: string; onClick: () => void }) {
  return (
    <>
      <style>{`
        .vsl-cta-button { display:flex; align-items:center; justify-content:center; width:100%; min-height:64px; padding:18px 24px; border:1px solid rgba(255,255,255,.2); border-bottom:3px solid #047b26; border-radius:12px; background:linear-gradient(180deg,#12d94b 0%,#00a82f 100%); box-shadow:0 12px 28px rgba(0,180,52,.2), inset 0 1px 0 rgba(255,255,255,.22); color:#fff; font-family:'Montserrat',sans-serif; font-size:clamp(15px,2vw,18px); font-weight:900; letter-spacing:.8px; line-height:1.2; text-decoration:none; text-transform:uppercase; text-align:center; cursor:pointer; transition:filter .2s, transform .2s, box-shadow .2s; }
        .vsl-cta-button:hover { filter:brightness(1.08); box-shadow:0 14px 32px rgba(0,180,52,.28), inset 0 1px 0 rgba(255,255,255,.24); }
        .vsl-cta-button:focus-visible { outline:3px solid rgba(255,215,0,.85); outline-offset:3px; }
        .vsl-cta-button:active { transform:translateY(1px); }
      `}</style>
      <a href={href} onClick={onClick} className="vsl-cta-button smartplayer-click-event">QUERO MINHA TRANSFORMAÇÃO AGORA</a>
    </>
  );
}

export default function CidVslPage({
  checkoutUrl: checkoutBaseUrl,
  trackingPrefix,
  video,
  metaPixelId,
  videoAspectRatio = "16 / 9",
  videoMaxWidth,
  pitchDelaySeconds = DEFAULT_PITCH_DELAY_SECONDS,
}: CidVslPageProps) {
  const playerElementRef = useRef<HTMLDivElement>(null);
  const pitchCtaRef = useRef<HTMLDivElement>(null);
  const [checkoutUrl, setCheckoutUrl] = useState(checkoutBaseUrl);
  const [isPitchCtaVisible, setIsPitchCtaVisible] = useState(false);
  const BG = "#060D1A";
  const placeholderPadding = videoAspectRatio === "9 / 16" ? "177.77777777777777%" : "56.25%";
  const videoFrameStyle: CSSProperties = {
    borderRadius: "6px",
    overflow: "hidden",
    border: "2px solid rgba(255,215,0,.5)",
    boxShadow: "0 0 40px rgba(255,215,0,.08)",
    aspectRatio: videoAspectRatio,
    background: "#000",
    marginBottom: "28px",
    ...(videoMaxWidth
      ? {
          maxWidth: `${videoMaxWidth}px`,
          marginInline: "auto",
        }
      : {}),
  };

  useEffect(() => {
    if (!isPitchCtaVisible) return;

    const frame = window.requestAnimationFrame(() => {
      pitchCtaRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [isPitchCtaVisible]);

  useEffect(() => {
    const trackedEvents = new Set<string>();
    const track = (eventName: string) => {
      if (trackedEvents.has(eventName)) return;
      trackedEvents.add(eventName);

      try {
        const storageKey = `${trackingPrefix}_${eventName}`;
        if (window.sessionStorage.getItem(storageKey)) return;
        window.sessionStorage.setItem(storageKey, "1");
      } catch {
        // O rastreamento continua funcionando mesmo se o navegador bloquear o storage.
      }

      window.dataLayer = window.dataLayer || [];
      window.gtag = window.gtag || ((...args: unknown[]) => window.dataLayer?.push(args));
      window.gtag("event", eventName);
    };

    setCheckoutUrl(checkoutWithUtms(checkoutBaseUrl));
    track("vsl_page_view");

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

    setIsPitchCtaVisible(false);
    const pitchCtaTimer = window.setTimeout(() => {
      setIsPitchCtaVisible(true);
    }, pitchDelaySeconds * 1000);

    if (video.type === "vturb") {
      const player = document.createElement("vturb-smartplayer") as VturbSmartPlayerElement;
      player.id = video.playerId;
      player.style.cssText = "display:block;margin:0 auto;width:100%;height:100%;";
      const placeholder = document.createElement("div");
      placeholder.className = "vturb-player-placeholder";
      placeholder.style.cssText = `position:relative;width:100%;padding:${placeholderPadding} 0 0;z-index:0;background-color:black;`;
      player.appendChild(placeholder);
      container.replaceChildren(player);

      const script = document.createElement("script");
      script.src = video.playerScript;
      script.async = true;
      document.head.appendChild(script);

      let pitchCtaConfigured = false;
      const configurePitchCta = () => {
        if (pitchCtaConfigured || typeof player.displayHiddenElements !== "function") return;
        pitchCtaConfigured = true;
        player.displayHiddenElements(pitchDelaySeconds, [PITCH_CTA_SELECTOR], { persist: true });
      };

      player.addEventListener("player:ready", configurePitchCta);
      return () => {
        window.clearTimeout(pitchCtaTimer);
        player.removeEventListener("player:ready", configurePitchCta);
        script.remove();
        container.replaceChildren();
      };
    }

    const iframe = document.createElement("iframe");
    iframe.title = "Vídeo Como Imprimir Dinheiro com Suas Palavras";
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.allowFullscreen = true;
    iframe.src = `https://www.youtube.com/embed/${video.videoId}?enablejsapi=1&playsinline=1&rel=0`;
    iframe.style.cssText = "display:block;width:100%;height:100%;border:0;";
    container.replaceChildren(iframe);

    let timer: number | undefined;
    const askForTime = () => {
      iframe.contentWindow?.postMessage(JSON.stringify({ event: "command", func: "getCurrentTime", args: [] }), "https://www.youtube.com");
      iframe.contentWindow?.postMessage(JSON.stringify({ event: "command", func: "getDuration", args: [] }), "https://www.youtube.com");
    };
    const onMessage = (message: MessageEvent) => {
      if (message.origin !== "https://www.youtube.com") return;
      let payload: unknown = message.data;
      if (typeof payload === "string") {
        try { payload = JSON.parse(payload); } catch { return; }
      }
      if (!payload || typeof payload !== "object") return;
      const data = payload as { event?: string; info?: unknown };
      if (data.event === "onStateChange" && data.info === 1) {
        track("vsl_start");
        if (!timer) timer = window.setInterval(askForTime, 1000);
      }
      if (data.event === "onStateChange" && data.info === 0) track("vsl_complete");
      if (data.event !== "infoDelivery" || !data.info || typeof data.info !== "object") return;
      const info = data.info as { currentTime?: number; duration?: number };
      if (!info.duration || !info.currentTime) return;
      const progress = (info.currentTime / info.duration) * 100;
      PROGRESS_EVENTS.forEach(([threshold, eventName]) => { if (progress >= threshold) track(eventName); });
      if (progress >= 99.5) track("vsl_complete");
    };
    iframe.addEventListener("load", () => {
      iframe.contentWindow?.postMessage(JSON.stringify({ event: "listening", id: 1 }), "https://www.youtube.com");
      askForTime();
    });
    window.addEventListener("message", onMessage);
    return () => {
      window.clearTimeout(pitchCtaTimer);
      if (timer) window.clearInterval(timer);
      window.removeEventListener("message", onMessage);
      container.replaceChildren();
    };
  }, [checkoutBaseUrl, pitchDelaySeconds, placeholderPadding, trackingPrefix, video]);

  useEffect(() => {
    if (!metaPixelId) return;

    ensureMetaPixel(metaPixelId);
    trackMetaPixelPageView(metaPixelId, window.location.href);
    window.fbq?.("track", "ViewContent");
  }, [metaPixelId]);

  const checkout = () => {
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || ((...args: unknown[]) => window.dataLayer?.push(args));
    window.gtag("event", "checkout_click");
    if (metaPixelId) window.fbq?.("trackCustom", "vsl_checkout_click");
  };

  return (
    <div style={{ backgroundColor: BG, color: "#fff", fontFamily: "'DM Sans', 'Inter', sans-serif", overflowX: "hidden", minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
      <style>{`
        .vsl-photo { display:block; } .vsl-content { padding:48px 32px 60px 48px; max-width:760px; } .vsl-headline,.vsl-subtitle { text-align:left; } .vsl-vturb-player,.vsl-vturb-player > vturb-smartplayer { width:100% !important; height:100% !important; border:0; display:block; } .vsl-btn { font-size:16px; letter-spacing:1.5px; white-space:nowrap; } .vsl-urgency { font-size:20px; letter-spacing:3px; white-space:nowrap; } .vsl-pitch-cta { display:none; box-sizing:border-box; padding:0; background:transparent; line-height:normal; }
        .vsl-cta-trust { display:flex; align-items:center; justify-content:center; gap:20px; margin-top:12px; color:rgba(255,255,255,.62); font-family:'DM Sans','Inter',sans-serif; font-size:12px; font-weight:600; line-height:16px; text-align:center; }
        .vsl-cta-trust span { color:#9af3b3; }
        @media (max-width:768px) { .vsl-photo { display:none !important; } .vsl-content { padding:36px 20px 48px; max-width:100%; } .vsl-headline,.vsl-subtitle { text-align:center; } .vsl-btn { font-size:15px; letter-spacing:.5px; white-space:normal; } .vsl-urgency { font-size:14px; letter-spacing:1.5px; } .vsl-cta-trust { gap:14px; font-size:11px; } }
      `}</style>
      <div className="vsl-urgency" style={{ backgroundColor: "#D92020", padding: "14px 24px", textAlign: "center", fontWeight: 700, textTransform: "uppercase", color: "#fff", flexShrink: 0, whiteSpace: "nowrap", overflow: "hidden", fontFamily: "'Montserrat', sans-serif" }}>ASSISTA ANTES QUE SAIA DO AR</div>
      <section style={{ position: "relative", flex: 1, display: "flex", alignItems: "flex-start", overflow: "hidden", minHeight: "calc(100dvh - 50px)" }}>
        <div aria-hidden className="vsl-photo" style={{ position: "absolute", top: 0, right: 0, width: "52%", height: "100%", zIndex: 0 }}><img src="/Samuel - Perfil.png" alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }} /><div style={{ position: "absolute", top: 0, left: 0, width: "60%", height: "100%", background: `linear-gradient(to right, ${BG} 0%, transparent 100%)`, zIndex: 1 }} /><div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "30%", background: `linear-gradient(to top, ${BG} 0%, transparent 100%)`, zIndex: 1 }} /></div>
        <div className="vsl-content" style={{ position: "relative", zIndex: 1, width: "100%" }}>
          <h1 className="vsl-headline" style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "clamp(28px, 3.8vw, 52px)", fontWeight: 900, lineHeight: 1.05, textTransform: "uppercase", letterSpacing: ".5px", margin: "0 0 18px", color: "#fff" }}>COMO USAR O PODER DAS <span>PALAVRAS</span> <span style={{ color: "#00E64D" }}>PARA IMPRIMIR DINHEIRO</span> NA SUA VIDA</h1>
          <p className="vsl-subtitle" style={{ fontSize: "16px", lineHeight: 1.7, color: "rgba(255,255,255,.8)", margin: "0 0 28px" }}>Aprenda o que declarar, quando declarar e como alinhar sua boca, sua fé e suas ações para destravar uma <strong style={{ color: "#00E64D" }}>nova vida financeira</strong>.</p>
          <div aria-label="Vídeo Como Imprimir Dinheiro com Suas Palavras" style={videoFrameStyle}><div ref={playerElementRef} className="vsl-vturb-player" /></div>
          <div ref={pitchCtaRef} className="vsl-pitch-cta" style={{ display: isPitchCtaVisible ? "block" : "none", ...(videoMaxWidth ? { maxWidth: `${videoMaxWidth}px`, margin: "0 auto 28px" } : {}) }}><VslCtaButton href={checkoutUrl} onClick={checkout} /><div className="vsl-cta-trust"><span>✓ 7 dias de garantia</span><span>✓ 100% Seguro</span></div></div>
        </div>
      </section>
      <footer style={{ borderTop: "1px solid rgba(255,255,255,.07)", padding: "20px 24px", textAlign: "center", flexShrink: 0 }}><p style={{ fontSize: "12px", color: "rgba(255,255,255,.25)", margin: 0, textTransform: "uppercase", letterSpacing: "1px" }}>Política de Privacidade &nbsp;|&nbsp; Termos de Uso</p><p style={{ fontSize: "12px", color: "rgba(255,255,255,.2)", margin: "6px 0 0", letterSpacing: ".5px" }}>Todos os Direitos Reservados - 2026 - Samuel Pereira</p></footer>
    </div>
  );
}
