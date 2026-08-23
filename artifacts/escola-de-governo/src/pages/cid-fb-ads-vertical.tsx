import CidVslPage from "@/components/cid-vsl-page";

const META_PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID as string | undefined;
const PITCH_DELAY_SECONDS = 9 * 60 + 10;

export default function CidFbAdsVertical() {
  return (
    <CidVslPage
      checkoutUrl="https://hub.la/r/fb-ads-vertical"
      trackingPrefix="cid_fb_ads_vertical"
      metaPixelId={META_PIXEL_ID}
      videoAspectRatio="9 / 16"
      videoMaxWidth={400}
      pitchDelaySeconds={PITCH_DELAY_SECONDS}
      video={{
        type: "vturb",
        playerId: "vid-6a892e63245921387e3bf113",
        playerScript: "https://scripts.converteai.net/d96d1452-17dc-48ff-8763-0c764e770de2/players/6a892e63245921387e3bf113/v4/player.js",
      }}
    />
  );
}
