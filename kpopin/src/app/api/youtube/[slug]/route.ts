export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { YOUTUBE_CHANNELS } from "@/lib/youtube-channels";

export const revalidate = 3600; // cache for 1 hour

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } },
) {
  const channel = YOUTUBE_CHANNELS[params.slug];

  if (!channel) {
    return NextResponse.json({ videos: [] });
  }

  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "YouTube API key not configured" },
      { status: 500 },
    );
  }

  try {
    // Fetch latest 6 videos from the channel
    const url = new URL("https://www.googleapis.com/youtube/v3/search");
    url.searchParams.set("key", apiKey);
    url.searchParams.set("channelId", channel.channelId);
    url.searchParams.set("part", "snippet");
    url.searchParams.set("order", "date");
    url.searchParams.set("type", "video");
    url.searchParams.set("maxResults", "6");

    const res = await fetch(url.toString());
    if (!res.ok) {
      const err = await res.json();
      console.error("YouTube API error:", err);
      return NextResponse.json(
        { error: "YouTube API error" },
        { status: res.status },
      );
    }

    const data = await res.json();

    const videos =
      data.items?.map((item: any) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.medium.url,
        publishedAt: item.snippet.publishedAt,
        description: item.snippet.description,
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      })) ?? [];

    return NextResponse.json({ videos, handle: channel.handle });
  } catch (err) {
    console.error("YouTube fetch error:", err);
    return NextResponse.json(
      { error: "Failed to fetch videos" },
      { status: 500 },
    );
  }
}
