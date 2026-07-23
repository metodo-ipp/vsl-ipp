import CidVslPage from "@/components/cid-vsl-page";

export default function CidBio() {
  return <CidVslPage
    checkoutUrl="https://hub.la/r/cid-vsl-biografia"
    trackingPrefix="cid_bio"
    video={{
      type: "vturb",
      playerId: "vid-6a6233971ac7c381ab3cd275",
      playerScript: "https://scripts.converteai.net/d96d1452-17dc-48ff-8763-0c764e770de2/players/6a6233971ac7c381ab3cd275/v4/player.js",
    }}
  />;
}
