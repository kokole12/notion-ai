import { Liveblocks } from "@liveblocks/node";
const key = process.env.LIVEBLOCKS_PRIVATE_KEY;

if (!key) {
  throw new Error("Live blocks private key not set");
}

const liveBlocks = new Liveblocks({
  secret: key,
});

export default liveBlocks;
