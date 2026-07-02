import { useState, useMemo } from "react";
import type { Platform } from "@/types";
import { Layout } from "@/components/Layout";
import { PlatformFilter } from "@/components/PlatformFilter";
import { ProfileList } from "@/components/ProfileList";
import { SelectedListSidebar } from "@/components/SelectedListSidebar";
import { extractProfiles, filterProfiles } from "@/utils/dataHelpers";
import { useInfluencerStore } from "@/store/useInfluencerStore";
import { formatFollowers } from "@/utils/formatters";
import { Users, BarChart3, TrendingUp, Sparkles, SlidersHorizontal } from "lucide-react";

export function SearchPage() {
  const [platform, setPlatform] = useState<Platform>("instagram");
  const [searchQuery, setSearchQuery] = useState("");
  const [clickCount, setClickCount] = useState(0);

  // Zustand selections
  const selectedInfluencers = useInfluencerStore((state) => state.selectedInfluencers);
  const toggleSidebar = useInfluencerStore((state) => state.toggleSidebar);
  const hasHydrated = useInfluencerStore((state) => state.hasHydrated);

  // Caching profile extraction using useMemo
  const allProfiles = useMemo(() => {
    return extractProfiles(platform);
  }, [platform]);

  // Caching filtered profiles using useMemo
  const filtered = useMemo(() => {
    return filterProfiles(allProfiles, searchQuery);
  }, [allProfiles, searchQuery]);

  // Derived campaign state using useMemo
  const campaignStats = useMemo(() => {
    const totalSelected = selectedInfluencers.length;
    
    // Sum total followers in selected list
    const totalFollowers = selectedInfluencers.reduce(
      (sum, item) => sum + item.followers,
      0
    );

    // Derived average engagement rate
    const influencersWithER = selectedInfluencers.filter(
      (item) => item.engagement_rate !== undefined
    );
    const avgEngagementRate =
      influencersWithER.length > 0
        ? influencersWithER.reduce(
            (sum, item) => sum + (item.engagement_rate || 0),
            0
          ) / influencersWithER.length
        : 0;

    return {
      totalSelected,
      totalFollowers,
      avgEngagementRate,
    };
  }, [selectedInfluencers]);

  const handleProfileClick = (username: string) => {
    setClickCount((prev) => prev + 1);
    console.log("Clicked profile:", username, "session clicks:", clickCount + 1);
  };

  return (
    <Layout title="">
      {/* SearchPage Banner */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-indigo-650 to-violet-700 text-white p-6 md:p-8 rounded-3xl shadow-lg relative overflow-hidden">
        {/* Decorative background gradients */}
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none"></div>
        <div className="absolute left-1/3 bottom-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-xl -mb-16 pointer-events-none"></div>
        
        <div className="relative z-10 space-y-1.5 text-left max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Discover Top Talent</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white m-0">
            Find the Perfect Influencer
          </h1>
          <p className="text-indigo-100 text-sm md:text-base font-medium">
            Search, filter, and shortlist premium creators for your next marketing campaign.
          </p>
        </div>

        {/* Action Toggle Campaign Queue */}
        <button
          type="button"
          onClick={() => toggleSidebar(true)}
          className="relative z-10 flex items-center justify-center gap-2 px-5 py-3.5 bg-white text-indigo-600 hover:bg-slate-50 active:scale-95 transition-all duration-200 rounded-2xl text-sm font-bold shadow-md cursor-pointer group"
        >
          <Users className="w-5 h-5 group-hover:scale-105 transition-transform" />
          <span>View Campaign Queue</span>
          {hasHydrated && campaignStats.totalSelected > 0 && (
            <span className="flex items-center justify-center w-5.5 h-5.5 bg-rose-500 text-white text-[11px] font-extrabold rounded-full animate-bounce">
              {campaignStats.totalSelected}
            </span>
          )}
        </button>
      </div>

      {/* Campaign Analytics Stats Bar */}
      {hasHydrated && campaignStats.totalSelected > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 text-left animate-fade-in">
          {/* Card 1: Selected Count */}
          <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl shadow-xs flex items-center gap-4">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Shortlisted Creators
              </p>
              <h3 className="text-xl font-extrabold text-slate-800 dark:text-slate-200 m-0">
                {campaignStats.totalSelected}
              </h3>
            </div>
          </div>

          {/* Card 2: Combined Reach */}
          <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl shadow-xs flex items-center gap-4">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Combined Reach
              </p>
              <h3 className="text-xl font-extrabold text-slate-800 dark:text-slate-200 m-0">
                {formatFollowers(campaignStats.totalFollowers)}
              </h3>
            </div>
          </div>

          {/* Card 3: Avg Engagement Rate */}
          <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl shadow-xs flex items-center gap-4">
            <div className="p-3 bg-amber-50 dark:bg-amber-950/20 text-amber-500 dark:text-amber-400 rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Avg Engagement Rate
              </p>
              <h3 className="text-xl font-extrabold text-slate-800 dark:text-slate-200 m-0">
                {(campaignStats.avgEngagementRate * 100).toFixed(2)}%
              </h3>
            </div>
          </div>
        </div>
      )}

      {/* Filter and Content Card container */}
      <div className="bg-white/40 dark:bg-slate-900/20 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/50 p-6 md:p-8 rounded-3xl space-y-6">
        {/* Platform selection and Search filters */}
        <div className="flex flex-col items-center gap-4">
          <PlatformFilter
            selected={platform}
            onChange={(p) => {
              setPlatform(p);
              setSearchQuery("");
            }}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </div>

        {/* Showing statistics row */}
        <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 px-1 border-b border-slate-200/50 dark:border-slate-800/50 pb-3">
          <div className="flex items-center gap-1">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>
              Showing <strong>{filtered.length}</strong> of {allProfiles.length} creators on {platform}
            </span>
          </div>
          {searchQuery && (
            <span>
              Filtered by: "<strong>{searchQuery}</strong>"
            </span>
          )}
        </div>

        {/* Profile Card grid listing */}
        <ProfileList
          profiles={filtered}
          platform={platform}
          searchQuery={searchQuery}
          onProfileClick={handleProfileClick}
        />
      </div>

      {/* Selected Influencers Overlay Drawer */}
      <SelectedListSidebar />
    </Layout>
  );
}
