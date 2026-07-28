import CidVslPage from "@/components/cid-vsl-page";

const META_PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID as string | undefined;

export default function CidFbAds() {
  return <CidVslPage
    checkoutUrl="https://hub.la/r/cid-vsl-fb-ads"
    trackingPrefix="cid_fb_ads"
    metaPixelId={META_PIXEL_ID}
    video={{
      type: "vturb",
      playerId: "vid-6a64060629f07dc8b65d2443",
      playerScript: "https://scripts.converteai.net/d96d1452-17dc-48ff-8763-0c764e770de2/players/6a64060629f07dc8b65d2443/v4/player.js",
    }}
  />;
}
