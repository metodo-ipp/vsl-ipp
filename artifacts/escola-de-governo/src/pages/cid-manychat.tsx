import CidVslPage from "@/components/cid-vsl-page";

const PITCH_DELAY_SECONDS = 9 * 60 + 10;

export default function CidManychat() {
  return <CidVslPage
    checkoutUrl="https://hub.la/r/cid-vsl-manychat"
    trackingPrefix="cid_manychat"
    videoAspectRatio="9 / 16"
    videoMaxWidth={400}
    pitchDelaySeconds={PITCH_DELAY_SECONDS}
    video={{
      type: "vturb",
      playerId: "vid-6a892e63245921387e3bf113",
      playerScript: "https://scripts.converteai.net/d96d1452-17dc-48ff-8763-0c764e770de2/players/6a892e63245921387e3bf113/v4/player.js",
    }}
  />;
}
