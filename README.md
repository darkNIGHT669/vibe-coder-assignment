# Wobb Frontend Assignment

A starter influencer search application built with **React**, **TypeScript**, **Vite**, and **Tailwind CSS**. This project is intentionally left in a rough-but-working state for candidates to improve.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the app.

## What's Included

- **Search / Dashboard** — filter influencers by platform (Instagram, YouTube, TikTok) and search by username or full name
- **Profile Details** — click a profile to view extended data loaded from individual JSON files
- **Routing** — `react-router-dom` with `/` (search) and `/profile/:username` (details)

Sample data lives in:

- `src/assets/data/search/` — platform search results (10 profiles each)
- `src/assets/data/profiles/` — detailed profile JSON per username

## How to Submit

1. **Download or clone** this starter project to your machine.
2. **Create a new repository** on your own GitHub account. Do not fork the original assignment repo — push your work to a repo you own.
3. Complete the tasks below and push your changes to that repository.
4. **Share the public GitHub repository URL** with us as your submission.

### Deadline (strict)

- **Due:** **2 July 2026, 2:00 PM IST** (Indian Standard Time, UTC+5:30)
- **Any git commits made after this deadline will disqualify your submission.** We will only consider the repository state as of the deadline; late commits will not be reviewed.
- Make sure your final work is pushed **before** the cutoff.

## AI Usage

You may use any AI tools (Cursor, ChatGPT, Claude, GitHub Copilot, etc.). We are evaluating your final solution and engineering decisions.

## Your Tasks

Complete the following as part of your submission:

1. **Find and fix all bugs and quality issues** — the codebase contains intentional bugs and quality issues. Identify and resolve them.

2. **Completely redesign the UI/UX** — replace the basic layout with a polished, modern interface. Focus on usability, visual hierarchy, and delight.

3. **Replace React Context with Zustand** — when you implement state management for the selected list, use [Zustand](https://github.com/pmndrs/zustand) instead of React Context.

4. **Implement "Select profile & Add to List"** — the disabled "Add to List" button is a stub. Build the full feature:
   - Select / add profiles to a persistent list
   - View and manage the selected list
   - Handle duplicates appropriately

5. **Improve code quality and project structure** — refactor as needed, add proper types, and follow React best practices.

6. **Optimize performance** — apply sensible optimizations where appropriate.

7. **Use any libraries you need** — you are not limited to the current stack. Choose tools that help you deliver a great result (UI kits, state managers, testing libraries, etc.).

## Scripts

| Command        | Description              |
| -------------- | ------------------------ |
| `npm run dev`  | Start development server |
| `npm run build`| Production build         |
| `npm run lint` | Run ESLint               |

## Submission Notes

- Document any assumptions or trade-offs in your README
- Ensure `npm run build` passes before submitting
- Focus on demonstrating your judgment — not every possible feature needs to be built, but the core assignment items should be addressed thoughtfully
- Double-check that your repo is public (or that we have access) and that the link is included in your submission
- Please make meaningful commits throughout your work. We may review your commit history.
- **Bonus:** Deploying the app (e.g. Vercel, Netlify, GitHub Pages) is optional but will be considered a plus — include the live URL in your submission if you do

Good luck!

## Refactoring Notes, Assumptions, and Trade-offs

We have refactored and completed the assignment with the following architectural choices:

### 1. Bug Fixes & Data Normalization
- **Runtime Crash Fixed**: Discovered that multiple accounts in the search results (e.g., `VladandNiki` and `KidsDianaShow` in `youtube.json`) were missing the `username` property, which caused the filter method to crash with a `TypeError`. We normalized this at the data extraction boundary (`src/utils/dataHelpers.ts`) by falling back to `handle` or `custom_name`.
- **Engagement Rate Calculation**: Fixed the engagement rate display math which was incorrectly multiplying by `10,000` (showing ratios like `142.50%` instead of `1.43%`). It is now formatted cleanly using `(rate * 100)`.
- **Metric Mapping**: Corrected the "Engagements" label in the profile details page to render the formatted count of raw engagements (e.g. `1.32M`) rather than duplicate the engagement rate percentage.
- **Search Case Sensitivity**: Modified the search logic to perform case-insensitive username searches.

### 2. State Management (Zustand & Persistent Queue)
- Created a global Zustand store in `src/store/useInfluencerStore.ts` with TypeScript interfaces.
- Stored shortlists in `localStorage` using Zustand's `persist` middleware.
- **Hydration Boundary Safeguard**: Implemented a `hasHydrated` state in our Zustand store to handle edge cases where client-side hydration differs from initial page renders, preventing flashing of stale list states or layout shifts.
- **Separation of Concerns**: Excluded layout configurations (like `sidebarOpen` and `hasHydrated`) from persistence to prevent restoring stale drawer UI states.

### 3. UI/UX Redesign
- Built a modern, sleek dashboard with campaign summary stats ( shortlisting count, total combined reach, average engagement rate).
- Made the interface fully responsive by removing fixed card widths (`w-[700px]`) and using a fluid, grid-based layout.
- Added a floating shortlist badge and sliding campaign sidebar list drawer to manage additions, removals, clear lists, and export functions.
- **Self-contained Brand SVGs**: Since newer versions of `lucide-react` do not package brand icons, we created a modular `BrandIcons.tsx` component with clean inline SVGs for Instagram, YouTube, and TikTok to ensure the application remains dependency-free and renders brand logos properly.

### 4. Build & Export Capabilities
- Shortlisted lists can be exported directly as **CSV** or **JSON** formats.
- Verified that `npm run build` and `npm run lint` pass with 100% clean compilation warnings.
