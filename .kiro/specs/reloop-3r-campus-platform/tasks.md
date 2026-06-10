# Implementation Plan: ReLoop – 3R Campus Platform

## Overview

Implement the ReLoop frontend application by integrating into the existing React Router v7 + Vite + Tailwind CSS v4 + TypeScript scaffold. Work proceeds in layers: shared types and mock data first, then shared UI components, then the root layout shell, then the five route pages, and finally wiring everything together. All data is static (mock arrays), all interactions are local React state, and all styling uses the ReLoop brand palette (`#DDEB9D`, `#A0C878`, `#27667B`, `#143D60`).

---

## Tasks

- [ ] 1. Define TypeScript types and configure global styles
  - [ ] 1.1 Create `app/types/index.ts` with all shared interfaces
    - Define `InspirationPost`, `GiveawayItem`, `RecyclableMaterial`, `DropOffLocation`, `CampaignPost` interfaces
    - Define `LikeState` UI-state type as `{ [postId: string]: { liked: boolean; count: number } }`
    - Define `NavLink`, `FilterBarProps`, `CardProps`, `ButtonProps` (`ButtonVariant`, `ButtonSize`), `BadgeProps` (`BadgeColor`) interfaces
    - Export all types from the single file
    - _Requirements: 8.1, 8.3_

  - [ ] 1.2 Update `app/app.css` with global styles and CSS custom properties
    - Add Tailwind v4 `@import "tailwindcss"` directive
    - Define CSS custom properties for the brand palette: `--color-primary-light: #DDEB9D`, `--color-primary-green: #A0C878`, `--color-deep-blue: #27667B`, `--color-dark-blue: #143D60`
    - Add base body styles (font, background, color)
    - _Requirements: 1.1, 2.1_

- [ ] 2. Create mock data files
  - [ ] 2.1 Create `app/data/inspirationData.ts` with at least 10 `InspirationPost` entries
    - Cover all three categories: `"Reduce"`, `"Reuse"`, `"Recycle"` (at least 3 each)
    - Each entry must include `id`, `title`, `description`, `category`, `author`, `imageEmoji`, `tags[]`, `createdAt`
    - _Requirements: 8.2, 8.4, 3.1_

  - [ ] 2.2 Create `app/data/giveawayData.ts` with at least 8 `GiveawayItem` entries
    - Cover multiple categories (Books, Electronics, Stationery, Furniture) and all three condition values (`"New"`, `"Good"`, `"Fair"`)
    - Include at least one entry where `isAvailable: false`
    - Each entry must include `id`, `itemName`, `description`, `condition`, `category`, `donorName`, `postedAt`, `emoji`, `isAvailable`
    - _Requirements: 8.2, 8.4, 4.1, 4.7_

  - [ ] 2.3 Create `app/data/recyclingData.ts` with at least 12 `RecyclableMaterial` entries and at least 5 `DropOffLocation` entries
    - Materials must cover all six types: `"Plastic"`, `"Paper"`, `"Glass"`, `"Metal"`, `"Electronics"`, `"Organic"` (at least 2 each)
    - Each location's `acceptedMaterials` should reference material type strings
    - Export both arrays from the same file
    - _Requirements: 8.2, 8.4, 5.1, 5.2_

  - [ ] 2.4 Create `app/data/campaignData.ts` with at least 6 `CampaignPost` entries
    - Each entry must include `id`, `author`, `avatar`, `content`, `imageEmoji`, `hashtags[]`, `likes`, `shares`, `postedAt`
    - _Requirements: 8.2, 8.4, 6.1_

- [ ] 3. Build shared UI components
  - [ ] 3.1 Create `app/components/Badge.tsx`
    - Accept `label: string` and `color: BadgeColor` props
    - Map each `BadgeColor` to a distinct Tailwind background and text class: `reduce` → yellow-green chip, `reuse` → teal chip, `recycle` → green chip, `good` → positive-green chip, `fair` → amber chip, `new` → highlight-blue chip
    - Render a small pill/chip `<span>` with the label text
    - _Requirements: 7.6, 7.7, 4.5_

  - [ ] 3.2 Create `app/components/Button.tsx`
    - Accept `variant` (`"primary"` | `"secondary"` | `"outline"` | `"ghost"`), `size`, `onClick`, `disabled`, `fullWidth`, `type`, `className` props
    - Map each variant to visually distinct Tailwind classes using the brand palette (primary: `#27667B` fill, secondary: `#A0C878` fill, outline: transparent + border, ghost: transparent no border)
    - Apply `w-full` when `fullWidth` is true
    - Apply reduced opacity, `cursor-not-allowed`, and suppress `onClick` when `disabled` is true
    - _Requirements: 7.3, 7.4, 7.5_

  - [ ] 3.3 Create `app/components/Card.tsx`
    - Accept `children`, `className`, `onClick`, `hoverable` props
    - Apply box shadow and rounded corners via Tailwind
    - Apply `hover:-translate-y-1 transition-transform` when `hoverable` is true
    - _Requirements: 7.1, 7.2_

  - [ ] 3.4 Create `app/components/Navbar.tsx`
    - Import `useLocation`, `Link` from `react-router`
    - Define `NAV_LINKS` constant: `[{ label, path, icon }]` for all 5 routes
    - Render ReLoop logo emoji + brand name
    - Use `useLocation()` to compute active link; apply active style only to the matching path
    - Show desktop nav links on `md:` breakpoint and above; hide on mobile
    - Show hamburger icon on mobile (`< 768px`); manage `isMenuOpen` with `useState<boolean>(false)`
    - Toggle mobile menu open/close on hamburger click
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8_

  - [ ] 3.5 Create `app/components/Footer.tsx`
    - Render SDG 12.5 badge (emoji + text), tagline, quick links to all five pages, and copyright notice
    - Apply `grid grid-cols-1 md:grid-cols-3` for responsive layout
    - _Requirements: 1.9, 1.10_

- [ ] 4. Update root layout and route configuration
  - [ ] 4.1 Update `app/root.tsx` to render the site-wide layout shell
    - Import and render `<Navbar />` above `<Outlet />` and `<Footer />` below `<Outlet />` inside the `App` default export
    - Preserve existing `Layout`, `links`, and `ErrorBoundary` exports
    - Update `ErrorBoundary` to show a styled 404 page with a "Back to Home" `<Link to="/">` button
    - _Requirements: 1.1, 1.9, 1.11_

  - [ ] 4.2 Update `app/routes.ts` to register all five routes
    - Add routes for `/inspiration` → `routes/inspiration.tsx`, `/giveaway` → `routes/giveaway.tsx`, `/recycling` → `routes/recycling.tsx`, `/campaign` → `routes/campaign.tsx`
    - Keep the existing `index("routes/home.tsx")` entry
    - _Requirements: 1.2_

- [ ] 5. Implement the Home page (`app/routes/home.tsx`)
  - [ ] 5.1 Replace default content with the ReLoop Home page
    - Render a full-width hero section with tagline, at least one CTA `<Link>` to `/giveaway`, and at least one CTA `<Link>` to `/recycling`
    - Apply CSS opacity/transform transition on mount (≥ 300ms) to hero text using a `useEffect` + `useState` visibility flag and Tailwind `transition-all duration-500`
    - Render an SDG 12.5 highlight section with at least 2 labeled numeric sustainability statistics
    - Render a grid of 4 `NavCard` components linking to `/inspiration`, `/giveaway`, `/recycling`, `/campaign`; each card is clickable and uses `<Link>`
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [ ] 6. Implement pure utility functions and the Inspiration Hub page
  - [ ] 6.1 Create `app/utils/filterUtils.ts` with the `filterPosts` pure function
    - Implement `filterPosts(posts: InspirationPost[], activeFilter: string): InspirationPost[]`
    - Return full array when `activeFilter === "All"`, otherwise filter by `post.category === activeFilter`
    - Must NOT mutate the input array
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6_

  - [ ]* 6.2 Write property tests for `filterPosts` using fast-check
    - **Property 1: Filter Completeness** — `filterPosts(posts, "All")` returns all items
    - **Property 2: Filter Correctness** — every item in result has `category === activeFilter`
    - **Property 10: Filter Purity (No Mutation)** — original array unchanged after call
    - **Validates: Requirements 9.1, 9.2, 9.3**

  - [ ] 6.3 Create `app/routes/inspiration.tsx` as the InspirationHub page
    - Import `inspirationPosts` from `app/data/inspirationData.ts` and `filterPosts` from utils
    - Manage `activeFilter` state (default: `"All"`)
    - Render a `FilterBar`-style category button group for `"All"`, `"Reduce"`, `"Reuse"`, `"Recycle"` with active-style on the selected button
    - Derive `filteredPosts` using `filterPosts`; wrap in `useMemo`
    - Render a grid of `InspirationCard` components (using `<Card>`) each showing emoji, title, description, category `<Badge>`, author, tags
    - Render empty-state message and "Clear Filter" button when `filteredPosts.length === 0`; clicking resets `activeFilter` to `"All"`
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

- [ ] 7. Implement the Giveaway Marketplace page (`app/routes/giveaway.tsx`)
  - [ ] 7.1 Create `app/routes/giveaway.tsx` with full marketplace logic
    - Import `giveawayItems` from `app/data/giveawayData.ts`
    - Manage `requestedIds: Set<string>` state (default: `new Set()`) and `activeCategory: string` state (default: `"All"`)
    - Derive filtered items from `activeCategory`; show empty-state when no items match
    - Render category filter buttons for all distinct categories plus `"All"`
    - Render a responsive card grid (1 col mobile, 2–3 col desktop) of `GiveawayCard` components
    - Each card shows: emoji, item name, description, condition `<Badge>`, donor name, posted date
    - "Request Item" button: on click → add id to `requestedIds`, change label to `"Requested ✓"`, disable the button
    - Items where `isAvailable === false` render with button disabled on initial render
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7_

- [ ] 8. Implement like/unlike utilities and the Awareness Campaign Feed page
  - [ ] 8.1 Create `app/utils/likeUtils.ts` with `initLikeState` and `toggleLike` pure functions
    - Implement `initLikeState(posts: CampaignPost[]): LikeState` — map each `post.id` to `{ liked: false, count: post.likes }`; last-write-wins for duplicate IDs
    - Implement `toggleLike(likeState: LikeState, postId: string): LikeState` — return new immutable object; toggle `liked`, adjust `count` by ±1 clamped to ≥ 0; return original state unchanged if `postId` not found
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7_

  - [ ]* 8.2 Write property tests for `toggleLike` and `initLikeState` using fast-check
    - **Property 3: Like Toggle Idempotency** — double `toggleLike` restores original count
    - **Property 4: Like Count Non-Negativity** — count never goes below 0 after any sequence of toggles
    - **Property 9: Like State Initialization** — all post IDs present with `liked: false` and `count === post.likes`
    - **Validates: Requirements 10.2, 6.5, 10.6, 6.1, 10.3, 10.4**

  - [ ] 8.3 Create `app/routes/campaign.tsx` as the AwarenessCampaignFeed page
    - Import `campaignPosts` from `app/data/campaignData.ts` and utils from `likeUtils.ts`
    - Initialize `likeState` with `useState(() => initLikeState(campaignPosts))`
    - Manage `shareCount` map in state (initialized from `post.shares`)
    - Render posts in a 1–3 column responsive grid
    - Each `CampaignPost` card shows: avatar emoji, author, content, image emoji, hashtags, current like count, current share count
    - Like button: calls `toggleLike`, shows filled heart (`❤️`) when liked / outline heart (`🤍`) when not; applies CSS `scale` transform animation on click using a transient state flag
    - Share button: calls `navigator.clipboard.writeText(post.hashtags.join(" "))`; increments displayed share count by 1; falls back to showing hashtag string in a modal/tooltip when clipboard is unavailable or rejects
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8, 6.9, 6.10_

- [ ] 9. Implement the Recycling Guide and Drop-Off Locator page (`app/routes/recycling.tsx`)
  - [ ] 9.1 Create `app/routes/recycling.tsx` with full guide and locator logic
    - Import `recyclableMaterials` and `dropOffLocations` from `app/data/recyclingData.ts`
    - Manage `activeType: string` state (default: `"All"`)
    - Derive `filteredMaterials` from `activeType` using filter logic similar to `filterPosts`; wrap in `useMemo`
    - Render material type filter buttons for `"All"`, `"Plastic"`, `"Paper"`, `"Glass"`, `"Metal"`, `"Electronics"`, `"Organic"` with active style
    - Render a grid of `MaterialCard` components (using `<Card>`) each showing emoji, name, type, description, and `tips` as a `<ul>` list
    - Render empty-state message and reset button when `filteredMaterials.length === 0`
    - Render all `DropOffLocation` cards unconditionally below the materials section, each showing: emoji, name, building, `acceptedMaterials` as individually clickable tags (on click → `setActiveType(tag)`), operating hours
    - Render a campus map placeholder `<div>` with minimum height 150px, visually styled as a map area, containing a descriptive text label
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8_

- [ ] 10. Final integration checkpoint
  - Ensure all route files are correctly referenced in `app/routes.ts`
  - Verify Navbar active-link highlighting works across all five routes
  - Verify Footer renders on all pages
  - Verify the 404 ErrorBoundary "Back to Home" link works
  - Ensure all tests pass, ask the user if questions arise.

---

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP delivery
- Property tests require installing `fast-check` as a dev dependency: `npm install -D fast-check vitest @vitest/coverage-v8` (no test runner is currently configured)
- Each task references specific requirements for full traceability
- All styling uses Tailwind v4 utility classes with the brand CSS custom properties defined in `app.css`
- `useMemo` is recommended for `filteredPosts` (InspirationHub) and `filteredMaterials` (RecyclingGuide) to avoid unnecessary recomputation
- The design document uses TypeScript throughout; no language selection is needed

---

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2"] },
    { "id": 1, "tasks": ["2.1", "2.2", "2.3", "2.4"] },
    { "id": 2, "tasks": ["3.1", "3.2", "3.3", "6.1", "8.1"] },
    { "id": 3, "tasks": ["3.4", "3.5", "6.2", "8.2"] },
    { "id": 4, "tasks": ["4.1", "4.2", "5.1"] },
    { "id": 5, "tasks": ["6.3", "7.1", "8.3", "9.1"] }
  ]
}
```
