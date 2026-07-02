import { useInfluencerStore } from "@/store/useInfluencerStore";
import { formatFollowers } from "@/utils/formatters";
import { X, Trash2, UserMinus, FileSpreadsheet, FileJson, Users, Sparkles, ExternalLink } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

function SidebarAvatar({ picture, fullname }: { picture: string; fullname: string }) {
  const [imgError, setImgError] = useState(false);
  if (imgError) {
    return (
      <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-xs bg-gradient-to-tr from-indigo-500 to-violet-600 border border-slate-200/50 dark:border-slate-800/50 flex-shrink-0">
        {fullname ? fullname.charAt(0).toUpperCase() : "@"}
      </div>
    );
  }
  return (
    <img
      src={picture}
      alt={fullname}
      onError={() => setImgError(true)}
      className="w-10 h-10 rounded-full object-cover border border-slate-200/50 dark:border-slate-800/50 flex-shrink-0"
    />
  );
}

export function SelectedListSidebar() {
  const selectedInfluencers = useInfluencerStore((state) => state.selectedInfluencers);
  const sidebarOpen = useInfluencerStore((state) => state.sidebarOpen);
  const toggleSidebar = useInfluencerStore((state) => state.toggleSidebar);
  const removeInfluencer = useInfluencerStore((state) => state.removeInfluencer);
  const clearList = useInfluencerStore((state) => state.clearList);
  const hasHydrated = useInfluencerStore((state) => state.hasHydrated);

  // Derived count state using selectors/useMemo
  const totalCount = useMemo(() => selectedInfluencers.length, [selectedInfluencers]);

  // CSV Exporter
  const handleExportCSV = () => {
    if (totalCount === 0) return;
    const headers = ["User ID", "Username", "Full Name", "Platform", "Followers", "Engagement Rate", "URL"];
    const rows = selectedInfluencers.map((item) => [
      item.user_id,
      item.username,
      item.fullname,
      item.platform,
      item.followers,
      item.engagement_rate !== undefined ? (item.engagement_rate * 100).toFixed(2) + "%" : "N/A",
      item.url,
    ]);
    
    const csvContent = [headers, ...rows]
      .map((e) => e.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(","))
      .join("\n");
      
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `influencer_list_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // JSON Exporter
  const handleExportJSON = () => {
    if (totalCount === 0) return;
    const dataStr = JSON.stringify(selectedInfluencers, null, 2);
    const blob = new Blob([dataStr], { type: "application/json;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `influencer_list_${new Date().toISOString().split("T")[0]}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!sidebarOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop Backdrop backdrop-blur Overlay */}
      <div
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs transition-opacity duration-300"
        onClick={() => toggleSidebar(false)}
      />

      {/* Drawer Container */}
      <div className="relative w-full max-w-md h-full bg-white dark:bg-slate-900 border-l border-slate-200/80 dark:border-slate-800/80 flex flex-col shadow-2xl animate-fade-in text-left">
        {/* Header */}
        <div className="p-4 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 rounded-lg">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-0">My Campaign List</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {hasHydrated ? `${totalCount} creator(s) selected` : "Loading..."}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => toggleSidebar(false)}
            className="p-1.5 rounded-lg border border-slate-200/60 dark:border-slate-800/60 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Selected List Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {!hasHydrated ? (
            /* Hydration loading state */
            <div className="flex flex-col items-center justify-center h-48 space-y-2">
              <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm text-slate-400 font-medium">Hydrating selection...</p>
            </div>
          ) : totalCount === 0 ? (
            /* Empty list state */
            <div className="flex flex-col items-center justify-center h-64 text-center p-6 space-y-4">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800/50 rounded-full flex items-center justify-center text-slate-400">
                <Sparkles className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Your list is empty</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-[240px] mx-auto">
                  Browse profiles and click "Add to List" to start building your campaign queue.
                </p>
              </div>
            </div>
          ) : (
            /* List of selected influencers */
            selectedInfluencers.map((item) => (
              <div
                key={item.user_id}
                className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900/60 border border-slate-200/40 dark:border-slate-800/40 rounded-xl hover:border-slate-300 dark:hover:border-slate-700 transition-colors group"
              >
                <SidebarAvatar picture={item.picture} fullname={item.fullname} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <Link
                      to={`/profile/${item.username}?platform=${item.platform}`}
                      onClick={() => toggleSidebar(false)}
                      className="text-xs font-bold text-slate-800 dark:text-slate-200 hover:text-indigo-500 dark:hover:text-indigo-400 truncate flex items-center gap-0.5"
                    >
                      @{item.username}
                      <ExternalLink className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                    <span className="text-[10px] uppercase font-bold px-1 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded">
                      {item.platform}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {item.fullname}
                  </div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500">
                    {formatFollowers(item.followers)} followers
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeInfluencer(item.user_id)}
                  className="p-1.5 text-slate-400 hover:text-rose-500 dark:text-slate-500 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/20 cursor-pointer transition-colors"
                  title="Remove from list"
                >
                  <UserMinus className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer Actions */}
        {hasHydrated && totalCount > 0 && (
          <div className="p-4 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/50 space-y-3">
            {/* Export buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleExportCSV}
                className="flex items-center justify-center gap-1.5 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors cursor-pointer"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Export CSV</span>
              </button>
              <button
                type="button"
                onClick={handleExportJSON}
                className="flex items-center justify-center gap-1.5 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors cursor-pointer"
              >
                <FileJson className="w-3.5 h-3.5 text-orange-500" />
                <span>Export JSON</span>
              </button>
            </div>

            {/* Clear button */}
            <button
              type="button"
              onClick={() => {
                if (confirm("Are you sure you want to clear your selected list?")) {
                  clearList();
                }
              }}
              className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 hover:bg-rose-600 hover:text-white dark:hover:bg-rose-650 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer border border-rose-100 dark:border-rose-900/30"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear Entire List</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
