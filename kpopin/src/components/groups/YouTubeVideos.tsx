'use client';

import { useEffect, useState } from 'react';
import { Youtube, ExternalLink, Play } from 'lucide-react';
import { timeAgo } from '@/lib/utils';

interface Video {
  id:          string;
  title:       string;
  thumbnail:   string;
  publishedAt: string;
  url:         string;
}

interface YouTubeVideosProps {
  slug: string;
  groupName: string;
}

export function YouTubeVideos({ slug, groupName }: YouTubeVideosProps) {
  const [videos, setVideos]   = useState<Video[]>([]);
  const [handle, setHandle]   = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/youtube/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) { setError(data.error); return; }
        setVideos(data.videos ?? []);
        setHandle(data.handle ?? '');
      })
      .catch(() => setError('Failed to load videos'))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="bg-kpop-card rounded-xl p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Youtube size={18} className="text-red-500" />
          <h2 className="font-display text-lg font-700">Latest Videos</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-lg overflow-hidden bg-white/5 animate-pulse">
              <div className="aspect-video bg-white/10" />
              <div className="p-2 space-y-1">
                <div className="h-3 bg-white/10 rounded w-3/4" />
                <div className="h-3 bg-white/10 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || videos.length === 0) return null;

  return (
    <div className="bg-kpop-card rounded-xl p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Youtube size={18} className="text-red-500" />
          <h2 className="font-display text-lg font-700">Latest Videos</h2>
        </div>
        {handle && (
          <a
            href={`https://www.youtube.com/${handle}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-kpop-muted hover:text-white transition-colors"
          >
            {handle} <ExternalLink size={11} />
          </a>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {videos.map((video) => (
          <a
            key={video.id}
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-lg overflow-hidden bg-white/5 border border-kpop-border hover:border-kpop-pink/40 transition-all"
          >
            <div className="relative aspect-video overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center">
                  <Play size={16} className="text-white ml-0.5" fill="white" />
                </div>
              </div>
            </div>
            <div className="p-2">
              <p className="text-xs font-medium text-white line-clamp-2 leading-snug mb-1">
                {video.title}
              </p>
              <p className="text-xs text-kpop-muted">{timeAgo(video.publishedAt)}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}