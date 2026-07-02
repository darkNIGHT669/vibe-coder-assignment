import { useNavigate } from "react-router-dom";
import type { Platform, UserProfileSummary } from "@/types";
import { VerifiedBadge } from "./VerifiedBadge";
import { useInfluencerStore } from "@/store/useInfluencerStore";
import { formatFollowers } from "@/utils/formatters";
import { Plus, Check } from "lucide-react";
import { InstagramIcon, YoutubeIcon, TikTokIcon } from "./BrandIcons";
import { useMemo, useState } from "react";

interface ProfileCardProps {
  profile: UserProfileSummary;
  platform: Platform;
  searchQuery: string;
  onProfileClick?: (username: string) => void;
}

export function ProfileCard({
  profile,
  platform,
  searchQuery,
  onProfileClick,
}: ProfileCardProps) {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  // Zustand Store
  const selectedInfluencers = useInfluencerStore((state) => state.selectedInfluencers);
  const addInfluencer = useInfluencerStore((state) => state.addInfluencer);
  const removeInfluencer = useInfluencerStore((state) => state.removeInfluencer);

  // Derived state check via useMemo
  const isSelected = useMemo(() => {
    return selectedInfluencers.some((item) => item.user_id === profile.user_id);
  }, [selectedInfluencers, profile.user_id]);

  const handleClick = () => {
    if (onProfileClick) onProfileClick(profile.username);
    navigate(`/profile/${profile.username}?platform=${platform}`);
  };

  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSelected) {
      removeInfluencer(profile.user_id);
    } else {
      addInfluencer(profile, platform);
    }
  };

  // Modern platform icon & styling configurations
  const platformConfig = {
    instagram: {
      color: "bg-pink-50 dark:bg-pink-950/20 text-pink-600 dark:text-pink-400 border-pink-100 dark:border-pink-900/30",
      icon: <InstagramIcon className="w-3.5 h-3.5" />,
      label: "Instagram",
    },
    youtube: {
      color: "bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border-red-100 dark:border-red-900/30",
      icon: <YoutubeIcon className="w-3.5 h-3.5" />,
      label: "YouTube",
    },
    tiktok: {
      color: "bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-800",
      icon: <TikTokIcon className="w-3.5 h-3.5" />,
      label: "TikTok",
    },
  };

  const currentPlatform = platformConfig[platform] || platformConfig.instagram;

  return (
    <div
      onClick={handleClick}
      className={`group flex items-center gap-4 p-4 mb-3 cursor-pointer w-full text-left
        bg-white/60 dark:bg-slate-900/40 backdrop-blur-md 
        border border-slate-200/50 dark:border-slate-800/50 rounded-2xl
        shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5
        ${isSelected ? "ring-2 ring-indigo-500/30 border-indigo-500/50" : ""}
      `}
      data-search={searchQuery}
    >
      {/* Avatar Container with Hover Scale */}
      <div className="relative flex-shrink-0">
        {imgError ? (
          <div className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-white text-base bg-gradient-to-tr from-indigo-500 to-violet-600 shadow-sm border border-slate-250 dark:border-slate-805/80 group-hover:scale-105 transition-transform duration-300">
            {profile.fullname ? profile.fullname.charAt(0).toUpperCase() : "@"}
          </div>
        ) : (
          <img
            src={profile.picture}
            alt={profile.fullname}
            onError={() => setImgError(true)}
            className="w-14 h-14 rounded-full border border-slate-200 dark:border-slate-800 object-cover shadow-sm group-hover:scale-105 transition-transform duration-300"
          />
        )}
        <div className={`absolute -bottom-1 -right-1 flex items-center justify-center w-6 h-6 rounded-full border border-white dark:border-slate-950 shadow-sm ${currentPlatform.color}`}>
          {currentPlatform.icon}
        </div>
      </div>

      {/* Info details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="font-bold text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors truncate">
            @{profile.username}
          </span>
          <VerifiedBadge verified={profile.is_verified} />
        </div>
        <div className="text-sm text-slate-500 dark:text-slate-400 truncate mb-1">
          {profile.fullname}
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            {formatFollowers(profile.followers)} <span className="font-normal text-slate-400">followers</span>
          </span>
          {profile.engagement_rate !== undefined && (
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
              {(profile.engagement_rate * 100).toFixed(2)}% ER
            </span>
          )}
        </div>
      </div>

      {/* Action Button */}
      <button
        type="button"
        onClick={handleActionClick}
        className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all duration-200 cursor-pointer
          ${
            isSelected
              ? "bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30 hover:bg-rose-100 dark:hover:bg-rose-900/40"
              : "bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/30 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600"
          }
        `}
      >
        {isSelected ? (
          <>
            <Check className="w-3.5 h-3.5" />
            <span>Added</span>
          </>
        ) : (
          <>
            <Plus className="w-3.5 h-3.5" />
            <span>Add to List</span>
          </>
        )}
      </button>
    </div>
  );
}
