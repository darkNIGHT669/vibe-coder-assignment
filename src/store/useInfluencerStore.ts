import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Platform, UserProfileSummary } from "@/types";

export interface SelectedInfluencer extends UserProfileSummary {
  platform: Platform;
}

interface InfluencerState {
  selectedInfluencers: SelectedInfluencer[];
  sidebarOpen: boolean;
  hasHydrated: boolean;

  // Actions
  addInfluencer: (influencer: UserProfileSummary, platform: Platform) => void;
  removeInfluencer: (userId: string) => void;
  clearList: () => void;
  toggleSidebar: (open?: boolean) => void;
  setHasHydrated: (state: boolean) => void;
}

export const useInfluencerStore = create<InfluencerState>()(
  persist(
    (set) => ({
      selectedInfluencers: [],
      sidebarOpen: false,
      hasHydrated: false,

      addInfluencer: (influencer, platform) =>
        set((state) => {
          // Check for duplication to prevent array pollution
          const exists = state.selectedInfluencers.some(
            (i) => i.user_id === influencer.user_id
          );
          if (exists) return {};
          return {
            selectedInfluencers: [
              ...state.selectedInfluencers,
              { ...influencer, platform },
            ],
          };
        }),

      removeInfluencer: (userId) =>
        set((state) => ({
          selectedInfluencers: state.selectedInfluencers.filter(
            (i) => i.user_id !== userId
          ),
        })),

      clearList: () => set({ selectedInfluencers: [] }),

      toggleSidebar: (open) =>
        set((state) => ({
          sidebarOpen: open !== undefined ? open : !state.sidebarOpen,
        })),

      setHasHydrated: (state) => set({ hasHydrated: state }),
    }),
    {
      name: "influencer-list-storage",
      // Exclude hasHydrated and sidebarOpen from persistence to avoid restoring stale layout states
      partialize: (state) => ({
        selectedInfluencers: state.selectedInfluencers,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHasHydrated(true);
        }
      },
    }
  )
);
