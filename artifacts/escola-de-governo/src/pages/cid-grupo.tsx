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
const CTA_DELAY_MS = 10 * 60 * 1000;

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
    <a href={href} onClick={onClick} className="cid-green-button">
      QUERO MINHA TRANSFORMAÇÃO AGORA
    </a>
  );
}

export default function CidGrupo() {
  const playerElementRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YouTubePlayer | null>(null);
  const intervalRef = useRef<number | null>(null);
  const unlockTimerRef = useRef<number | null>(null);
  const playbackStartedAtRef = useRef<number | null>(null);
  const watchedMsRef = useRef(0);
  const [checkoutUrl, setCheckoutUrl] = useState(CHECKOUT_URL);
  const [showCTA, setShowCTA] = useState(false);

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
      const progress = (player.getCurrentTime() / duration) * 100;
      if (progress >= 25) trackOnce("vsl_progress_25");
      if (progress >= 50) trackOnce("vsl_progress_50");
      if (progress >= 75) trackOnce("vsl_progress_75");
      if (progress >= 90) trackOnce("vsl_progress_90");
    };

    const stopPlaybackTimer = () => {
      if (playbackStartedAtRef.current !== null) {
        watchedMsRef.current += Date.now() - playbackStartedAtRef.current;
        playbackStartedAtRef.current = null;
      }
      if (unlockTimerRef.current !== null) window.clearTimeout(unlockTimerRef.current);
      unlockTimerRef.current = null;
      if (watchedMsRef.current >= CTA_DELAY_MS) setShowCTA(true);
    };

    const startPlaybackTimer = () => {
      if (showCTA || playbackStartedAtRef.current !== null) return;
      playbackStartedAtRef.current = Date.now();
      const remainingMs = Math.max(0, CTA_DELAY_MS - watchedMsRef.current);
      unlockTimerRef.current = window.setTimeout(() => {
        watchedMsRef.current = CTA_DELAY_MS;
        playbackStartedAtRef.current = null;
        setShowCTA(true);
      }, remainingMs);
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
              startPlaybackTimer();
              if (intervalRef.current === null) intervalRef.current = window.setInterval(checkProgress, 1000);
            }
            if (event.data !== 1) stopPlaybackTimer();
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
      if (unlockTimerRef.current !== null) window.clearTimeout(unlockTimerRef.current);
      playerRef.current?.destroy();
    };
  }, []);

  return (
    <div className="cid-page">
      <style>{`
        .cid-page { min-height: 100dvh; overflow-x: hidden; background: #060D1A; color: #fff; font-family: 'DM Sans', 'Inter', sans-serif; }
        .cid-urgency { padding: 14px 20px; background: #D92020; color: #fff; font-family: 'Montserrat', sans-serif; font-size: clamp(12px, 3.7vw, 20px); font-weight: 700; letter-spacing: clamp(1px, .7vw, 3px); text-align: center; text-transform: uppercase; }
        .cid-main { width: min(100%, 900px); margin: 0 auto; padding: 48px 24px 60px; }
        .cid-headline { margin: 0 0 18px; color: #fff; font-family: 'Montserrat', sans-serif; font-size: clamp(28px, 6vw, 52px); font-weight: 900; letter-spacing: .5px; line-height: 1.05; text-align: center; text-transform: uppercase; }
        .cid-subtitle { margin: 0 auto 28px; max-width: 740px; color: rgba(255,255,255,.8); font-size: 16px; line-height: 1.7; text-align: center; }
        .cid-player { aspect-ratio: 16 / 9; width: 100%; overflow: hidden; border: 2px solid rgba(255,215,0,.5); border-radius: 6px; background: #000; box-shadow: 0 0 40px rgba(255,215,0,.08); }
        .cid-player iframe { width: 100%; height: 100%; border: 0; display: block; }
        .cid-cta { margin: 28px auto 0; max-width: 700px; }
        .cid-green-button { display: inline-flex; box-sizing: border-box; align-items: center; justify-content: center; width: 100%; min-height: 72px; padding: 20px 24px; border-bottom: 3px solid #027F20; border-radius: 10px; background: radial-gradient(165.91% 647.63% at 45.92% -308.33%, #00BB2D 0%, #009624 100%); color: #fff; font-family: 'Montserrat', sans-serif; font-size: clamp(14px, 3.7vw, 18px); font-weight: 900; letter-spacing: 1px; text-align: center; text-decoration: none; text-transform: uppercase; }
        .cid-green-button:hover { filter: brightness(1.08); }
        .cid-trust { display: flex; justify-content: center; gap: 24px; margin-top: 14px; color: rgba(255,255,255,.75); font-size: 14px; font-weight: 600; }
        .cid-footer { padding: 20px 24px; border-top: 1px solid rgba(255,255,255,.07); color: rgba(255,255,255,.25); font-size: 12px; letter-spacing: 1px; text-align: center; text-transform: uppercase; }
        @media (max-width: 560px) { .cid-main { padding: 36px 16px 48px; } .cid-trust { gap: 14px; font-size: 12px; } }
      `}</style>

      <div className="cid-urgency">Assista antes que saia do ar</div>
      <main className="cid-main">
        <h1 className="cid-headline">Como usar o poder das palavras para <span style={{ color: "#00E64D" }}>imprimir dinheiro</span> na sua vida</h1>
        <p className="cid-subtitle">Aprenda o que declarar, quando declarar e como alinhar sua boca, sua fé e suas ações para destravar uma <strong style={{ color: "#00E64D" }}>nova vida financeira</strong>.</p>
        <div className="cid-player" aria-label="Vídeo Como Imprimir Dinheiro com Suas Palavras">
          <div ref={playerElementRef} />
        </div>
        {showCTA && (
          <div className="cid-cta">
            <GreenButton href={checkoutUrl} onClick={() => trackOnce("checkout_click")} />
            <div className="cid-trust"><span>✓ 7 dias de garantia</span><span>✓ 100% Seguro</span></div>
          </div>
        )}
      </main>
      <footer className="cid-footer">Todos os Direitos Reservados - 2026 - Samuel Pereira</footer>
    </div>
  );
}
