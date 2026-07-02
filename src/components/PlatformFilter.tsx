import type { Platform } from "@/types";
import { PLATFORMS, getPlatformLabel } from "@/utils/dataHelpers";
import { Search, X } from "lucide-react";
import { InstagramIcon, YoutubeIcon, TikTokIcon } from "./BrandIcons";

interface PlatformFilterProps {
  selected: Platform;
  onChange: (platform: Platform) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function PlatformFilter({
  selected,
  onChange,
  searchQuery,
  onSearchChange,
}: PlatformFilterProps) {
  // Styles for selected/unselected platforms
  const platformTabConfig = {
    instagram: {
      activeClass: "bg-pink-500/10 dark:bg-pink-500/15 text-pink-600 dark:text-pink-400 border-pink-500/30",
      inactiveClass: "text-slate-500 hover:text-pink-500 dark:hover:text-pink-400 dark:text-slate-400 border-transparent hover:bg-pink-50/50 dark:hover:bg-pink-950/10",
      icon: <InstagramIcon className="w-4 h-4" />,
    },
    youtube: {
      activeClass: "bg-red-500/10 dark:bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30",
      inactiveClass: "text-slate-500 hover:text-red-500 dark:hover:text-red-400 dark:text-slate-400 border-transparent hover:bg-red-50/50 dark:hover:bg-red-950/10",
      icon: <YoutubeIcon className="w-4 h-4" />,
    },
    tiktok: {
      activeClass: "bg-slate-900/10 dark:bg-slate-100/10 text-slate-800 dark:text-slate-200 border-slate-900/30 dark:border-slate-100/30",
      inactiveClass: "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 dark:text-slate-400 border-transparent hover:bg-slate-100/50 dark:hover:bg-slate-900/50",
      icon: <TikTokIcon className="w-4 h-4" />,
    },
  };

  return (
    <div className="space-y-5 w-full">
      {/* Platform Switcher Tabs */}
      <div className="flex gap-2 p-1.5 bg-slate-100/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-200/50 dark:border-slate-800/50 max-w-md mx-auto">
        {PLATFORMS.map((p) => {
          const config = platformTabConfig[p];
          const isSelected = selected === p;
          return (
            <button
              key={p}
              type="button"
              onClick={() => onChange(p)}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-semibold rounded-xl border transition-all duration-200 cursor-pointer
                ${isSelected ? config.activeClass + " shadow-sm font-bold" : config.inactiveClass}
              `}
            >
              {config.icon}
              <span>{getPlatformLabel(p)}</span>
            </button>
          );
        })}
      </div>

      {/* Premium Search Container */}
      <div className="relative w-full max-w-lg mx-auto group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={`Search ${getPlatformLabel(selected)} creators by name or username...`}
          className="w-full pl-11 pr-11 py-3 bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm transition-all duration-200"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
          >
            <X className="w-4 h-4 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-full" />
          </button>
        )}
      </div>
    </div>
  );
}
