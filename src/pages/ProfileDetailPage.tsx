import { useEffect, useState, useMemo } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import { SelectedListSidebar } from "@/components/SelectedListSidebar";
import type { FullUserProfile, ProfileDetailResponse, Platform } from "@/types";
import { formatEngagementRate } from "@/utils/formatters";
import { loadProfileByUsername } from "@/utils/profileLoader";
import { useInfluencerStore } from "@/store/useInfluencerStore";
import { InstagramIcon, YoutubeIcon, TikTokIcon } from "@/components/BrandIcons";
import {
  ArrowLeft,
  Check,
  Plus,
  Users,
  TrendingUp,
  Heart,
  MessageSquare,
  Eye,
  Layers,
  Building2,
  ExternalLink,
  Target,
  Sparkles,
} from "lucide-react";

function formatFollowersDetail(count: number) {
  if (count >= 1000000) return (count / 1000000).toFixed(2) + "M";
  if (count >= 1000) return (count / 1000).toFixed(1) + "K";
  return String(count);
}

export function ProfileDetailPage() {
  const { username } = useParams<{ username: string }>();
  const [searchParams] = useSearchParams();
  const urlPlatform = searchParams.get("platform") || "unknown";
  
  const [profileData, setProfileData] = useState<ProfileDetailResponse | null>(null);
  const [loaded, setLoaded] = useState(false);

  // Zustand Store hooks
  const selectedInfluencers = useInfluencerStore((state) => state.selectedInfluencers);
  const addInfluencer = useInfluencerStore((state) => state.addInfluencer);
  const removeInfluencer = useInfluencerStore((state) => state.removeInfluencer);
  const toggleSidebar = useInfluencerStore((state) => state.toggleSidebar);
  const hasHydrated = useInfluencerStore((state) => state.hasHydrated);

  useEffect(() => {
    if (!username) return;

    loadProfileByUsername(username).then((data) => {
      setProfileData(data);
      setLoaded(true);
    });
  }, [username]);

  // Derived user profile data
  const user = useMemo((): FullUserProfile | null => {
    return profileData?.data?.user_profile || null;
  }, [profileData]);

  // Resolve true platform type based on profile data type, fallback to search parameters
  const platform = useMemo((): Platform => {
    if (user?.type && ["instagram", "youtube", "tiktok"].includes(user.type)) {
      return user.type as Platform;
    }
    if (["instagram", "youtube", "tiktok"].includes(urlPlatform)) {
      return urlPlatform as Platform;
    }
    return "instagram";
  }, [user, urlPlatform]);

  // Derived check: is this influencer selected?
  const isSelected = useMemo(() => {
    if (!user) return false;
    return selectedInfluencers.some((item) => item.user_id === user.user_id);
  }, [selectedInfluencers, user]);

  const handleActionClick = () => {
    if (!user) return;
    if (isSelected) {
      removeInfluencer(user.user_id);
    } else {
      addInfluencer(user, platform);
    }
  };

  // Modern platform icon & styling configurations
  const platformConfig = {
    instagram: {
      color: "bg-pink-50 dark:bg-pink-950/20 text-pink-600 dark:text-pink-400 border-pink-100 dark:border-pink-900/30",
      icon: <InstagramIcon className="w-4 h-4" />,
      label: "Instagram",
      bannerColor: "from-pink-500/20 to-purple-600/20",
    },
    youtube: {
      color: "bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border-red-100 dark:border-red-900/30",
      icon: <YoutubeIcon className="w-4 h-4" />,
      label: "YouTube",
      bannerColor: "from-red-500/20 to-rose-600/20",
    },
    tiktok: {
      color: "bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-800",
      icon: <TikTokIcon className="w-4 h-4" />,
      label: "TikTok",
      bannerColor: "from-slate-700/20 to-slate-900/20",
    },
  };

  const currentPlatform = platformConfig[platform] || platformConfig.instagram;

  if (!username) {
    return (
      <Layout>
        <div className="max-w-md mx-auto text-center py-12 space-y-4">
          <p className="text-red-500 font-bold">Invalid username parameter.</p>
          <Link to="/" className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-md hover:bg-indigo-700">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Search</span>
          </Link>
        </div>
      </Layout>
    );
  }

  if (!loaded) {
    return (
      <Layout title={`@${username}`}>
        <div className="flex flex-col items-center justify-center py-24 space-y-3">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 font-medium">Fetching detailed profile analytics...</p>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout title={`@${username}`}>
        <div className="max-w-md mx-auto text-center py-12 border border-slate-250 dark:border-slate-850 p-8 rounded-3xl bg-white/40 dark:bg-slate-900/40 backdrop-blur-md space-y-4">
          <p className="text-red-500 font-bold">Could not load profile details for @{username}.</p>
          <p className="text-slate-500 dark:text-slate-400 text-xs">
            Verify that the data file matches the username exactly.
          </p>
          <Link to="/" className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-md hover:bg-indigo-700">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Search</span>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="">
      {/* Top sticky navigation bar */}
      <div className="flex items-center justify-between mb-6 animate-fade-in">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to search</span>
        </Link>

        {/* View Campaign Queue Toggle */}
        <button
          type="button"
          onClick={() => toggleSidebar(true)}
          className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
        >
          <Users className="w-4 h-4" />
          <span>Queue ({selectedInfluencers.length})</span>
        </button>
      </div>

      {/* Main Profile container */}
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        {/* Profile Card / Header Banner */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/65 dark:border-slate-800/65 rounded-3xl overflow-hidden shadow-md relative text-left">
          {/* Theme Banner Grid Background */}
          <div className={`h-36 bg-gradient-to-r ${currentPlatform.bannerColor} relative overflow-hidden border-b border-slate-200/50 dark:border-slate-850`}>
            {/* Banner details pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-30"></div>
          </div>

          {/* Profile Core Metadata */}
          <div className="px-6 pb-6 pt-0 relative flex flex-col sm:flex-row sm:items-start gap-6">
            {/* Large Avatar container */}
            <div className="-mt-16 relative flex-shrink-0 mx-auto sm:mx-0">
              <img
                src={user.picture}
                alt={user.fullname}
                className="w-28 h-28 rounded-full border-4 border-white dark:border-slate-950 object-cover shadow-md"
              />
              <div className={`absolute bottom-0 right-0 flex items-center justify-center w-8 h-8 rounded-full border-2 border-white dark:border-slate-950 shadow-sm ${currentPlatform.color}`}>
                {currentPlatform.icon}
              </div>
            </div>

            {/* Profile descriptions */}
            <div className="flex-1 space-y-3 pt-2 text-center sm:text-left">
              <div className="space-y-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-center sm:justify-start">
                  <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 m-0">
                    {user.fullname}
                  </h2>
                  <div className="inline-flex items-center justify-center gap-1.5 px-2.5 py-0.5 rounded-full border text-xs font-semibold self-center sm:self-auto capitalize shadow-xs bg-slate-50 dark:bg-slate-800/60 border-slate-200/60 dark:border-slate-800/60">
                    <VerifiedBadge verified={user.is_verified} />
                    <span>@{user.username}</span>
                  </div>
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-3 text-xs font-medium text-slate-400 dark:text-slate-500">
                  <span className="capitalize">{currentPlatform.label} Creator</span>
                  {user.is_business && (
                    <span className="flex items-center gap-1 text-indigo-500">
                      <Building2 className="w-3.5 h-3.5" />
                      <span>Business Account</span>
                    </span>
                  )}
                </div>
              </div>

              {user.description && (
                <p className="text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                  {user.description}
                </p>
              )}

              {/* URL & Action buttons */}
              <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3">
                {/* Condition Hydration Selection Button */}
                {hasHydrated ? (
                  <button
                    type="button"
                    onClick={handleActionClick}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all duration-200 cursor-pointer border
                      ${
                        isSelected
                          ? "bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-900/30 hover:bg-rose-650 hover:text-white dark:hover:bg-rose-600"
                          : "bg-indigo-600 text-white border-indigo-650 hover:bg-indigo-700 hover:border-indigo-750 hover:shadow-md"
                      }
                    `}
                  >
                    {isSelected ? (
                      <>
                        <Check className="w-4 h-4 animate-pulse" />
                        <span>Remove from Campaign</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        <span>Add to Campaign Queue</span>
                      </>
                    )}
                  </button>
                ) : (
                  /* Hydration loading state */
                  <div className="h-10 w-44 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-xl"></div>
                )}

                {user.url && (
                  <a
                    href={user.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-750 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <span>View Profile</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Analytics Grid */}
        <div className="space-y-4 text-left">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 px-1 m-0 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-500" />
            <span>Creator Analytics</span>
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {/* Stat: Followers */}
            <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl shadow-xs">
              <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1.5">
                <Users className="w-4 h-4 text-indigo-500" />
                <span>Followers</span>
              </div>
              <div className="text-xl font-black text-slate-800 dark:text-slate-100">
                {formatFollowersDetail(user.followers)}
              </div>
            </div>

            {/* Stat: Engagement Rate */}
            <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl shadow-xs">
              <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                <span>Engagement Rate</span>
              </div>
              <div className="text-xl font-black text-slate-800 dark:text-slate-100">
                {formatEngagementRate(user.engagement_rate)}
              </div>
            </div>

            {/* Stat: Total Posts */}
            {user.posts_count !== undefined && (
              <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl shadow-xs">
                <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1.5">
                  <Layers className="w-4 h-4 text-indigo-500" />
                  <span>Posts Count</span>
                </div>
                <div className="text-xl font-black text-slate-800 dark:text-slate-100">
                  {user.posts_count}
                </div>
              </div>
            )}

            {/* Stat: Avg Likes */}
            {user.avg_likes !== undefined && (
              <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl shadow-xs">
                <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1.5">
                  <Heart className="w-4 h-4 text-rose-500" />
                  <span>Avg Likes</span>
                </div>
                <div className="text-xl font-black text-slate-800 dark:text-slate-100">
                  {formatFollowersDetail(user.avg_likes)}
                </div>
              </div>
            )}

            {/* Stat: Avg Comments */}
            {user.avg_comments !== undefined && (
              <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl shadow-xs">
                <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1.5">
                  <MessageSquare className="w-4 h-4 text-indigo-500" />
                  <span>Avg Comments</span>
                </div>
                <div className="text-xl font-black text-slate-800 dark:text-slate-100">
                  {formatFollowersDetail(user.avg_comments)}
                </div>
              </div>
            )}

            {/* Stat: Avg Views */}
            {user.avg_views !== undefined && user.avg_views > 0 && (
              <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl shadow-xs">
                <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1.5">
                  <Eye className="w-4 h-4 text-sky-500" />
                  <span>Avg Views</span>
                </div>
                <div className="text-xl font-black text-slate-800 dark:text-slate-100">
                  {formatFollowersDetail(user.avg_views)}
                </div>
              </div>
            )}

            {/* Stat: Raw Engagements count */}
            {user.engagements !== undefined && (
              <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl shadow-xs">
                <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1.5">
                  <Sparkles className="w-4 h-4 text-violet-500" />
                  <span>Engagements Count</span>
                </div>
                <div className="text-xl font-black text-slate-800 dark:text-slate-100">
                  {formatFollowersDetail(user.engagements)}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Demographics / Targeted Audience details if present */}
        {(user.gender || user.age_group) && (
          <div className="space-y-4 text-left border-t border-slate-200/60 dark:border-slate-800/60 pt-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 px-1 m-0 flex items-center gap-2">
              <Target className="w-4 h-4 text-indigo-500" />
              <span>Target Audience Demographics</span>
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {user.gender && (
                <div className="p-4 bg-slate-50 dark:bg-slate-900/60 border border-slate-200/40 dark:border-slate-800/40 rounded-2xl">
                  <span className="text-xs font-semibold text-slate-400 uppercase">Primary Gender Bias</span>
                  <div className="text-base font-bold text-slate-850 dark:text-slate-200 mt-1 capitalize">
                    {user.gender.toLowerCase()} Audience Profile
                  </div>
                </div>
              )}
              {user.age_group && (
                <div className="p-4 bg-slate-50 dark:bg-slate-900/60 border border-slate-200/40 dark:border-slate-800/40 rounded-2xl">
                  <span className="text-xs font-semibold text-slate-400 uppercase">Dominant Age Bracket</span>
                  <div className="text-base font-bold text-slate-850 dark:text-slate-200 mt-1">
                    {user.age_group} Years Old
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Selected Influencers Overlay Drawer */}
      <SelectedListSidebar />
    </Layout>
  );
}
