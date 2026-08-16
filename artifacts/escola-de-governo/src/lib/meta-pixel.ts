type MetaPixelFunction = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  push?: (...args: unknown[]) => void;
  queue: unknown[][];
  loaded?: boolean;
  version?: string;
};

declare global {
  interface Window {
    fbq?: MetaPixelFunction;
    _fbq?: MetaPixelFunction;
    __metaPixelInitializedIds?: Set<string>;
    __metaPixelPageViewKeys?: Set<string>;
  }
}

const FACEBOOK_EVENTS_SCRIPT_URL = "https://connect.facebook.net/en_US/fbevents.js";

function getMetaPixelState() {
  window.__metaPixelInitializedIds ??= new Set<string>();
  window.__metaPixelPageViewKeys ??= new Set<string>();

  return {
    initializedIds: window.__metaPixelInitializedIds,
    pageViewKeys: window.__metaPixelPageViewKeys,
  };
}

export function ensureMetaPixel(pixelId: string) {
  if (typeof window === "undefined" || !pixelId) return;

  if (!window.fbq) {
    const fbq = ((...args: unknown[]) => {
      if (fbq.callMethod) fbq.callMethod(...args);
      else fbq.queue.push(args);
    }) as MetaPixelFunction;

    fbq.queue = [];
    fbq.push = fbq;
    fbq.loaded = true;
    fbq.version = "2.0";
    window.fbq = fbq;
    window._fbq = fbq;
  }

  const hasFacebookEventsScript = Array.from(document.scripts).some(
    (script) => script.src.startsWith(FACEBOOK_EVENTS_SCRIPT_URL),
  );

  if (!hasFacebookEventsScript) {
    const script = document.createElement("script");
    script.async = true;
    script.src = FACEBOOK_EVENTS_SCRIPT_URL;
    document.head.appendChild(script);
  }

  const { initializedIds } = getMetaPixelState();
  if (!initializedIds.has(pixelId)) {
    window.fbq("init", pixelId);
    initializedIds.add(pixelId);
  }
}

export function trackMetaPixelPageView(pixelId: string, pageKey: string) {
  if (typeof window === "undefined" || !window.fbq) return;

  const { pageViewKeys } = getMetaPixelState();
  const key = `${pixelId}:${pageKey}`;
  if (pageViewKeys.has(key)) return;

  window.fbq("track", "PageView");
  pageViewKeys.add(key);
}
