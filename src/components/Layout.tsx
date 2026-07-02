import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Sparkles, Heart } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

export function Layout({ children, title }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400">
      {/* Sticky Premium Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-900/50 shadow-xs transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 group cursor-pointer text-left decoration-none"
          >
            <div className="p-1.5 bg-gradient-to-tr from-indigo-550 to-violet-600 text-white rounded-xl shadow-md group-hover:scale-105 transition-transform duration-300">
              <Sparkles className="w-4.5 h-4.5" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent">
                Wobb
              </span>
              <span className="font-bold text-xs text-slate-400 dark:text-slate-500 block -mt-1 uppercase tracking-widest">
                Campaign Manager
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>Assignment Portal</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 md:px-6 py-6 space-y-6">
        {title && (
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 mb-2 border-b border-slate-200/50 dark:border-slate-800/50 pb-2">
            {title}
          </h2>
        )}
        {children}
      </main>

      {/* Modern Footer */}
      <footer className="mt-auto border-t border-slate-200/50 dark:border-slate-900/50 py-6 bg-white/40 dark:bg-slate-950/40 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 md:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-450 dark:text-slate-500 font-medium">
          <p>© {new Date().getFullYear()} Wobb. All rights reserved.</p>
          <p className="flex items-center gap-1">
            <span>Built with</span>
            <Heart className="w-3 h-3 text-rose-500 fill-rose-500 animate-pulse" />
            <span>for Vibe Coder Shortlist</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
