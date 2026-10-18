import React, { useState, useEffect } from 'react';
import {
  Image as ImageIcon,
  Check,
  Monitor,
  Layout,
  RefreshCw,
  Sparkles,
  Layers,
} from 'lucide-react';
import { Button } from './Button';
import { Badge } from './Badge';

export interface WallpaperItem {
  id: string;
  name: string;
  description: string;
  preview_url: string;
  accent_color: string;
  catppuccin: string;
}

interface WallpaperGalleryProps {
  onWallpaperApplied?: (wallpaper: WallpaperItem) => void;
  compact?: boolean;
}

export const WallpaperGallery: React.FC<WallpaperGalleryProps> = ({
  onWallpaperApplied,
  compact = false,
}) => {
  const [wallpapers, setWallpapers] = useState<WallpaperItem[]>([]);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string>('cinematic-mountain');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isApplying, setIsApplying] = useState<boolean>(false);
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  const fetchWallpapers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/computer/desktop/wallpapers');
      if (res.ok) {
        const data = await res.json();
        if (data.wallpapers) {
          setWallpapers(data.wallpapers);
          if (data.current) {
            setCurrentId(data.current);
            setSelectedId(data.current);
          }
        }
      }
    } catch (err: any) {
      console.error('Failed to load wallpapers:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWallpapers();
  }, []);

  const handleApply = async (targetId?: string) => {
    const idToApply = targetId || selectedId;
    setIsApplying(true);
    setStatusNotice(`Applying wallpaper '${idToApply}'...`);
    try {
      const res = await fetch('/api/computer/desktop/wallpaper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wallpaper_id: idToApply,
          apply_to: 'desktop',
        }),
      });
      const data = await res.json();
      if (res.ok && data.ok && data.verified && data.current === idToApply) {
        setCurrentId(data.current);
        setStatusNotice('Applied and verified on the Linux Desktop.');
        const item = wallpapers.find((w) => w.id === idToApply);
        if (item && onWallpaperApplied) {
          onWallpaperApplied(item);
        }
      } else {
        const detail = typeof data.detail === 'string' ? data.detail : data.detail?.message;
        setStatusNotice(`Apply not confirmed: ${detail || data.error || 'Server error'}`);
      }
    } catch (err: any) {
      setStatusNotice(`Network error: ${err.message}`);
    } finally {
      setIsApplying(false);
    }
  };

  const selectedWallpaper = wallpapers.find((w) => w.id === selectedId) || wallpapers[0];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-semibold text-os-primary uppercase tracking-wider">
            Curated Atmosphere & Wallpapers
          </span>
          <Badge variant="cyan" size="sm">
            5 Moods
          </Badge>
        </div>

        <span className="text-[11px] text-os-secondary">Applies to Linux Desktop</span>
      </div>

      {/* Grid of 5 Curated Wallpapers */}
      {isLoading ? (
        <div className="p-8 flex items-center justify-center text-xs text-os-secondary">
          <RefreshCw className="w-4 h-4 animate-spin mr-2 text-cyan-400" />
          Loading curated gallery...
        </div>
      ) : (
        <div className={`grid gap-3 ${compact ? 'grid-cols-2 sm:grid-cols-5' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-5'}`}>
          {wallpapers.map((w) => {
            const isCurrent = w.id === currentId;
            const isSelected = w.id === selectedId;

            return (
              <div
                key={w.id}
                onClick={() => {
                  setSelectedId(w.id);
                  handleApply(w.id);
                }}
                className={`group relative cursor-pointer rounded-xl overflow-hidden border transition-all duration-200 ${
                  isCurrent
                    ? 'border-blue-500 shadow-lg shadow-blue-500/20 ring-2 ring-blue-500/30'
                    : isSelected
                    ? 'border-cyan-400/80 shadow-md ring-1 ring-cyan-400/40'
                    : 'border-os-border/70 hover:border-os-border hover:shadow-md'
                }`}
              >
                {/* Thumbnail Image */}
                <div className="relative aspect-[16/10] bg-slate-950 overflow-hidden">
                  <img
                    src={w.preview_url}
                    alt={w.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Active Badge */}
                  {isCurrent && (
                    <div className="absolute top-2 right-2 flex items-center gap-1 bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                      <Check className="w-3 h-3 stroke-[3]" />
                      Active
                    </div>
                  )}

                  {/* Catppuccin Accent Pill */}
                  <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/60 backdrop-blur-md border border-white/10 text-[9px] font-mono px-1.5 py-0.5 rounded text-slate-200">
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: w.accent_color }}
                    />
                    {w.catppuccin}
                  </div>

                  {/* Name & Subtitle on Image */}
                  <div className="absolute bottom-2 left-2 right-2 text-left">
                    <div className="text-xs font-bold text-white drop-shadow-sm leading-tight">
                      {w.name}
                    </div>
                  </div>
                </div>

                {/* Footer Description */}
                {!compact && (
                  <div className="p-2.5 bg-os-surface/80 backdrop-blur-sm text-[11px] text-os-secondary leading-snug line-clamp-2">
                    {w.description}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Status & Feedback */}
      {statusNotice && (
        <div className="text-xs font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-500/30 px-3 py-1.5 rounded-lg flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            {statusNotice}
          </span>
          {isApplying && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
        </div>
      )}
    </div>
  );
};
