import CidVslPage from "@/components/cid-vsl-page";

export default function CidBio() {
  return <CidVslPage
    checkoutUrl="https://hub.la/r/cid-vsl-biografia"
    trackingPrefix="cid_bio"
    video={{
      type: "vturb",
      playerId: "vid-6a64060629f07dc8b65d2443",
      playerScript: "https://scripts.converteai.net/d96d1452-17dc-48ff-8763-0c764e770de2/players/6a64060629f07dc8b65d2443/v4/player.js",
    }}
  />;
}
