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
    __metaPixelLeadKeys?: Set<string>;
  }
}

const FACEBOOK_EVENTS_SCRIPT_URL = "https://connect.facebook.net/en_US/fbevents.js";
let sharedMetaPixelFunction: MetaPixelFunction | undefined;

function getMetaPixelState() {
  window.__metaPixelInitializedIds ??= new Set<string>();
  window.__metaPixelPageViewKeys ??= new Set<string>();
  window.__metaPixelLeadKeys ??= new Set<string>();

  return {
    initializedIds: window.__metaPixelInitializedIds,
    pageViewKeys: window.__metaPixelPageViewKeys,
    leadKeys: window.__metaPixelLeadKeys,
  };
}

function getOrCreateMetaPixelFunction() {
  if (window.fbq) {
    sharedMetaPixelFunction = window.fbq;
    return window.fbq;
  }

  if (sharedMetaPixelFunction) {
    window.fbq = sharedMetaPixelFunction;
    window._fbq = sharedMetaPixelFunction;
    return sharedMetaPixelFunction;
  }

  const fbq = ((...args: unknown[]) => {
    if (fbq.callMethod) fbq.callMethod(...args);
    else fbq.queue.push(args);
  }) as MetaPixelFunction;

  fbq.queue = [];
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = "2.0";
  sharedMetaPixelFunction = fbq;
  window.fbq = fbq;
  window._fbq = fbq;
  return fbq;
}

export function ensureMetaPixel(pixelId: string) {
  if (typeof window === "undefined" || !pixelId) return;

  const fbq = getOrCreateMetaPixelFunction();

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
    fbq("init", pixelId);
    initializedIds.add(pixelId);
  }
}

export function trackMetaPixelPageView(pixelId: string, pageKey: string) {
  if (typeof window === "undefined") return;

  const fbq = getOrCreateMetaPixelFunction();

  const { pageViewKeys } = getMetaPixelState();
  const key = `${pixelId}:${pageKey}`;
  if (pageViewKeys.has(key)) return;

  fbq("track", "PageView");
  pageViewKeys.add(key);
}

export function trackMetaPixelLead(pixelId: string, submissionKey: string) {
  if (typeof window === "undefined" || !pixelId || !submissionKey) return false;

  const fbq = getOrCreateMetaPixelFunction();
  const { leadKeys } = getMetaPixelState();
  const key = `${pixelId}:${submissionKey}`;
  const storageKey = `meta_pixel_lead:${key}`;

  if (leadKeys.has(key)) return false;

  try {
    if (window.sessionStorage.getItem(storageKey)) {
      leadKeys.add(key);
      return false;
    }
  } catch {
    // O rastreamento continua funcionando mesmo se o navegador bloquear o storage.
  }

  leadKeys.add(key);
  try {
    window.sessionStorage.setItem(storageKey, "1");
  } catch {
    // A deduplicação em memória continua válida durante a sessão atual.
  }

  fbq("track", "Lead");
  return true;
}
