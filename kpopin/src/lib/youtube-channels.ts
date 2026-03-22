// Official YouTube channel IDs for each K-pop group
// To find a channel ID: go to the channel page → view source → search for "channelId"
// or use https://www.youtube.com/@channelname/about and check the URL

export const YOUTUBE_CHANNELS: Record<
  string,
  { channelId: string; handle: string }
> = {
  bts: { channelId: "UCLkAepWjdylmXSltofFvsYQ", handle: "@BANGTANTV" },
  blackpink: { channelId: "UCOmHUn--16B90oW2L6FRR3A", handle: "@BLACKPINK" },
  twice: { channelId: "UCaO6TYtlC8U5ttz62hTrZgg", handle: "@JYPEntertainment" },
  exo: { channelId: "UCzCedBCSSltI1TFd3bKyN6g", handle: "@weareoneEXO" },
  "nct-127": { channelId: "UCk2E0dbAyEJWnrN2bbQOcbg", handle: "@NCT127" },
  aespa: { channelId: "UC9GtSLeksfK4yuJ_g1lgQbg", handle: "@aespa" },
  itzy: { channelId: "UCDhM2k2Cua-JdobAh5moMFg", handle: "@ITZY" },
  "stray-kids": {
    channelId: "UC9rMiEjNaCSsebs31MRDCRA",
    handle: "@StrayKids",
  },
  seventeen: { channelId: "UCfkXDY7vwkcJ8ddFGz8KusA", handle: "@pledis17" },
  newjeans: {
    channelId: "UCMki_UkHb4qSc0qyEcOHHJw",
    handle: "@NewJeans_official",
  },
  ive: { channelId: "UC-Fnix71vRP64WXeo0ikd0Q", handle: "@IVEstarship" },
  "le-sserafim": {
    channelId: "UCs-QBT4qkj_YiQw1ZntDO3g",
    handle: "@LESSERAFIM_official",
  },
};
