# Requirements Document

## Introduction

ReLoop is a responsive, frontend-only React web application that empowers university students to embrace the 3R principles — Reduce, Reuse, and Recycle. The platform consists of five interconnected modules: a mission-driven Home page, a Waste Reduction Inspiration Hub, a Giveaway Marketplace, a Recycling Guide with Drop-Off Locator, and an Instagram-style Awareness Campaign Feed. Navigation is handled by React Router v7, styling by Tailwind CSS v4, and all dynamic interactions are simulated via mock data and local React state. The application targets alignment with UN SDG 12.5 (Responsible Consumption and Production).

---

## Glossary

- **ReLoop_App**: The ReLoop 3R Campus Platform frontend application.
- **Navbar**: The site-wide navigation component rendered at the top of every page.
- **Footer**: The site-wide footer component rendered at the bottom of every page.
- **InspirationHub**: The `/inspiration` route component responsible for displaying and filtering 3R inspiration posts.
- **GiveawayMarketplace**: The `/giveaway` route component responsible for displaying and requesting giveaway items.
- **RecyclingGuide**: The `/recycling` route component responsible for displaying recyclable materials and drop-off locations.
- **CampaignFeed**: The `/campaign` route component responsible for the awareness campaign post feed with like/share interactions.
- **FilterBar**: A reusable filter component that accepts a list of categories and emits a selected category on change.
- **Card**: A reusable generic card container component.
- **Button**: A reusable button component with theme variants.
- **Badge**: A reusable category/condition label chip component.
- **InspirationPost**: A data object representing a single 3R inspiration post with category, author, tags, and emoji.
- **GiveawayItem**: A data object representing a student-donated item available for pickup.
- **RecyclableMaterial**: A data object representing a type of recyclable material with tips and type classification.
- **DropOffLocation**: A data object representing a campus recycling drop-off location.
- **CampaignPost**: A data object representing an awareness campaign post with like/share counters and hashtags.
- **LikeState**: A React state map keyed by post ID storing the liked status and current like count for each CampaignPost.
- **Mock_Data**: Static TypeScript arrays imported directly into route components to supply all application data.
- **React_Router**: The React Router v7 library used for client-side and SSR route management.
- **activeFilter**: The currently selected category string driving the InspirationHub or GiveawayMarketplace filter.
- **activeType**: The currently selected material type string driving the RecyclingGuide material filter.
- **requestedIds**: A local React state Set tracking IDs of GiveawayItems that have been requested.

---

## Requirements

### Requirement 1: Application Shell and Navigation

**User Story:** As a university student, I want a consistent navigation shell so that I can move between any of the five ReLoop modules from any page.

#### Acceptance Criteria

1. THE Navbar SHALL render the ReLoop logo ("ReLoop ♻️"), brand name, and navigation links to all five routes (`/`, `/inspiration`, `/giveaway`, `/recycling`, `/campaign`).
2. WHEN a user clicks a navigation link, THE React_Router SHALL navigate to the corresponding route and render the correct page component.
3. THE Navbar SHALL apply a visually distinct style (different background, color, or underline) to the link whose `path` matches the current `location.pathname`.
4. THE Navbar SHALL apply no active style to any link whose `path` does not match the current `location.pathname`.
5. WHILE the viewport width is less than 768px, THE Navbar SHALL hide the desktop navigation links and display a hamburger icon.
6. WHILE the viewport width is greater than or equal to 768px, THE Navbar SHALL hide the hamburger icon and display the desktop navigation links.
7. WHEN the hamburger icon is clicked and the mobile menu is closed, THE Navbar SHALL open the mobile menu, making the navigation links visible.
8. WHEN the hamburger icon is clicked and the mobile menu is open, THE Navbar SHALL close the mobile menu, hiding the navigation links.
9. THE Footer SHALL render the SDG 12.5 badge, a tagline, quick links to all five pages, and a copyright notice.
10. THE Footer SHALL render in a single-column layout on viewports less than 768px and a three-column layout on viewports greater than or equal to 768px.
11. IF a user navigates to a route not defined in the application, THEN THE React_Router SHALL render a 404 error page with a "Back to Home" button that navigates to `/`.

---

### Requirement 2: Home Page

**User Story:** As a prospective student user, I want a welcoming landing page so that I can understand ReLoop's mission and navigate to the four main feature modules.

#### Acceptance Criteria

1. THE ReLoop_App SHALL render a full-width hero section on the Home page containing a tagline, at least one call-to-action button linking to `/giveaway`, and at least one call-to-action button linking to `/recycling`.
2. THE ReLoop_App SHALL render an SDG 12.5 highlight section on the Home page displaying at least two labeled numeric sustainability statistics (e.g., "1/3 of all food produced globally is wasted").
3. THE ReLoop_App SHALL render a grid of four navigation cards on the Home page, each linking to one of the four module pages (`/inspiration`, `/giveaway`, `/recycling`, `/campaign`).
4. WHEN the Home page mounts, THE ReLoop_App SHALL apply a CSS opacity and/or transform transition of at least 300ms duration to the hero section text.
5. IF a navigation card's target route is defined in the application, THEN THE ReLoop_App SHALL navigate to that route when the card is clicked.

---

### Requirement 3: Inspiration Hub

**User Story:** As a student, I want to browse and filter 3R inspiration posts by category so that I can discover ideas relevant to Reduce, Reuse, or Recycle.

#### Acceptance Criteria

1. WHEN the InspirationHub mounts, THE InspirationHub SHALL initialize `activeFilter` to `"All"` and render all InspirationPost items from Mock_Data.
2. WHEN a category filter is selected, THE InspirationHub SHALL display only InspirationPost items whose `category` field exactly matches `activeFilter`.
3. THE FilterBar SHALL render category buttons for all defined filter values: `"All"`, `"Reduce"`, `"Reuse"`, `"Recycle"`, and SHALL visually distinguish the button whose value matches the current `activeFilter` from the other buttons.
4. WHEN no InspirationPost items match the selected `activeFilter`, THE InspirationHub SHALL render an empty-state message (e.g., "🌱 No posts yet in this category") and a "Clear Filter" button.
5. WHEN the "Clear Filter" button is clicked, THE InspirationHub SHALL reset `activeFilter` to `"All"` and render all InspirationPost items.
6. THE InspirationHub SHALL render each InspirationPost as a card displaying the `imageEmoji` field, title, description, category Badge, author name, and all tags as a list.

---

### Requirement 4: Giveaway Marketplace

**User Story:** As a student, I want to browse available giveaway items and request items I need so that I can reduce waste through reuse.

#### Acceptance Criteria

1. WHEN the GiveawayMarketplace mounts, THE GiveawayMarketplace SHALL initialize `activeCategory` to `"All"` and render all GiveawayItem entries from Mock_Data in a responsive card grid (1 column on mobile, 2–3 columns on desktop).
2. WHEN a user clicks the "Request Item" button for an item, THE GiveawayMarketplace SHALL add that item's ID to `requestedIds`, change the button label to "Requested ✓", and disable the button.
3. WHILE an item's ID is present in `requestedIds`, THE GiveawayMarketplace SHALL keep the corresponding item's button disabled and labeled "Requested ✓".
4. WHEN a category filter is selected in the GiveawayMarketplace, THE GiveawayMarketplace SHALL display only GiveawayItem entries whose `category` field matches the selected filter; WHEN `"All"` is selected, all entries SHALL be shown; WHEN no items match, THE GiveawayMarketplace SHALL render an empty-state message.
5. THE Badge component SHALL render condition values using the defined Badge color map: `"new"` color for `"New"`, `"good"` color for `"Good"`, and `"fair"` color for `"Fair"`.
6. THE GiveawayMarketplace SHALL render each GiveawayItem card displaying the item emoji, name, description, condition Badge, donor name, and posted date.
7. IF a GiveawayItem's `isAvailable` field is `false`, THEN THE GiveawayMarketplace SHALL render its "Request Item" button in a disabled state on initial render.

---

### Requirement 5: Recycling Guide and Drop-Off Locator

**User Story:** As a student, I want a reference guide for recyclable materials and campus drop-off locations so that I can dispose of waste responsibly.

#### Acceptance Criteria

1. WHEN the RecyclingGuide mounts, THE RecyclingGuide SHALL initialize `activeType` to `"All"` and render all RecyclableMaterial entries from Mock_Data.
2. WHEN a material type filter is selected, THE RecyclingGuide SHALL display only RecyclableMaterial entries whose `type` field matches `activeType`; valid filter values are `"All"`, `"Plastic"`, `"Paper"`, `"Glass"`, `"Metal"`, `"Electronics"`, and `"Organic"`.
3. THE RecyclingGuide SHALL render the complete list of DropOffLocation entries regardless of the current `activeType` filter value.
4. WHEN a material tag on a DropOffLocation card is clicked, THE RecyclingGuide SHALL update `activeType` to the string value of that tag.
5. THE RecyclingGuide SHALL render a placeholder element that is visually styled as a map area, contains a non-empty descriptive text label identifying it as a campus map, and has a minimum height of 150px.
6. THE RecyclingGuide SHALL render each RecyclableMaterial card displaying the emoji, name, type, description, and all items in the `tips` array as a list.
7. THE RecyclingGuide SHALL render each DropOffLocation card displaying the emoji, name, building, all `acceptedMaterials` entries as individually clickable tags, and operating hours.
8. WHEN no RecyclableMaterial entries match the selected `activeType`, THE RecyclingGuide SHALL render an empty-state message and a button to reset `activeType` to `"All"`.

---

### Requirement 6: Awareness Campaign Feed

**User Story:** As a student, I want to browse and interact with SDG 12.5 awareness posts so that I can engage with the campus sustainability community.

#### Acceptance Criteria

1. WHEN the CampaignFeed mounts, THE CampaignFeed SHALL initialize `LikeState` such that for every CampaignPost in Mock_Data, the entry is `{ liked: false, count: post.likes }`.
2. WHEN a user clicks the like button on a CampaignPost, THE CampaignFeed SHALL toggle `LikeState[postId].liked` and increment or decrement `LikeState[postId].count` by 1 accordingly.
3. WHILE `LikeState[postId].liked` is `true`, THE CampaignFeed SHALL display a filled heart icon for that post.
4. WHILE `LikeState[postId].liked` is `false`, THE CampaignFeed SHALL display an outline heart icon for that post.
5. THE CampaignFeed SHALL ensure that `LikeState[postId].count` is never less than 0 for any postId at any point.
6. WHEN a user clicks the share button on a CampaignPost, THE CampaignFeed SHALL write the post's hashtags joined by a single space to the clipboard using `navigator.clipboard.writeText` and SHALL increment the displayed share count by 1.
7. IF `navigator.clipboard` is unavailable, THEN THE CampaignFeed SHALL display a modal or tooltip element containing the space-joined hashtag string so the user can copy it manually.
8. THE CampaignFeed SHALL render each CampaignPost displaying the avatar emoji, author name, content, image emoji, hashtags, current like count from `LikeState`, and current share count.
9. THE CampaignFeed SHALL apply a CSS scale transform animation to the like button when it is clicked.
10. IF `navigator.clipboard.writeText` rejects (throws or returns a rejected Promise), THEN THE CampaignFeed SHALL fall back to displaying the hashtag string in a tooltip or modal without crashing.

---

### Requirement 7: Shared Component Library

**User Story:** As a developer, I want a set of reusable UI components so that the application maintains a consistent visual language across all pages.

#### Acceptance Criteria

1. THE Card component SHALL render its `children` prop inside a container styled with a box shadow and rounded corners.
2. IF the `hoverable` prop is `true`, THEN THE Card component SHALL apply an upward translate-y CSS transform on hover to produce a lift effect.
3. THE Button component SHALL render each `variant` with a visually distinct appearance: `"primary"` as a filled high-contrast button, `"secondary"` as a filled lower-contrast button, `"outline"` as a transparent button with a visible border, and `"ghost"` as a transparent button with no border.
4. THE Button component SHALL render at full width when the `fullWidth` prop is `true`.
5. IF the `disabled` prop is `true`, THEN THE Button component SHALL render with reduced opacity, a not-allowed cursor, and SHALL suppress all `onClick` interactions.
6. THE Badge component SHALL render its `label` prop as visible text inside a chip element.
7. THE Badge component SHALL apply a visually distinct background color and a legible contrasting text color for each `color` value: `"reduce"`, `"reuse"`, and `"recycle"` each map to a unique color distinct from one another, while `"good"` maps to a positive-sentiment color, `"fair"` maps to a neutral-sentiment color, and `"new"` maps to a highlight-sentiment color.

---

### Requirement 8: Mock Data and TypeScript Type Safety

**User Story:** As a developer, I want all data and component interfaces defined in TypeScript so that the application is type-safe and maintainable.

#### Acceptance Criteria

1. THE ReLoop_App SHALL define TypeScript interfaces for all data models: `InspirationPost`, `GiveawayItem`, `RecyclableMaterial`, `DropOffLocation`, and `CampaignPost`. The `LikeState` interface SHALL also be defined as a UI-state type (not a data array model).
2. THE ReLoop_App SHALL provide Mock_Data arrays with the following minimum record counts: `inspirationPosts` — at least 10 items; `giveawayItems` — at least 8 items; `recyclableMaterials` — at least 12 items; `dropOffLocations` — at least 5 items; `campaignPosts` — at least 6 items.
3. THE ReLoop_App SHALL import all TypeScript interfaces and the `LikeState` type from a single shared `app/types/index.ts` file.
4. THE ReLoop_App SHALL import mock data from dedicated files: `inspirationData.ts`, `giveawayData.ts`, `recyclingData.ts`, and `campaignData.ts`, each located under the `app/data/` directory, with one data model array per file (except `recyclingData.ts` which MAY export both `recyclableMaterials` and `dropOffLocations`).

---

### Requirement 9: Filtering Algorithm Correctness

**User Story:** As a developer, I want the filtering logic to be correct and pure so that the UI always reflects the user's selected filter with no side effects.

#### Acceptance Criteria

1. WHEN `filterPosts` is called with `activeFilter === "All"`, THE InspirationHub SHALL return the complete unmodified array of InspirationPost items.
2. WHEN `filterPosts` is called with a specific category value (`"Reduce"`, `"Reuse"`, or `"Recycle"`), THE InspirationHub SHALL return only posts where `post.category === activeFilter`.
3. THE `filterPosts` function SHALL NOT mutate the original input array; the original array's length and element references SHALL be identical before and after the call.
4. WHEN `filterPosts` is called with the same input array and the same `activeFilter` value, THE InspirationHub SHALL return a result array that is deeply equal in value and in the same order on every invocation.
5. WHEN `filterPosts` is called with a category value that matches zero posts, THE InspirationHub SHALL return an empty array (length 0).
6. WHEN `filterPosts` is called with an `activeFilter` value that is not `"All"` and is not one of the known category values, THE InspirationHub SHALL return an empty array (length 0).

---

### Requirement 10: Like State Management Correctness

**User Story:** As a developer, I want the like/unlike toggle logic to be correct and immutable so that the UI always reflects the true engagement state.

#### Acceptance Criteria

1. WHEN `toggleLike` is called for a post, THE CampaignFeed SHALL return a new `LikeState` object such that no property of the original `LikeState` object is modified (full-map immutability).
2. WHEN `toggleLike` is called twice in succession for the same `postId`, THE CampaignFeed SHALL produce a `LikeState` where `likeState[postId].count` is equal to its value before either call.
3. THE `initLikeState` function SHALL produce a `LikeState` map where every post ID from the input array is present as a key; IF the input array contains duplicate IDs, THEN only the last occurrence SHALL be used.
4. THE `initLikeState` function SHALL set `liked` to `false` for every entry in the initialized `LikeState`.
5. WHEN `toggleLike` is called on a post whose `liked` is `false`, THE CampaignFeed SHALL set `liked` to `true` and increment `count` by 1.
6. WHEN `toggleLike` is called on a post whose `liked` is `true`, THE CampaignFeed SHALL set `liked` to `false` and decrement `count` by 1, with the resulting `count` being no less than 0.
7. IF `toggleLike` is called with a `postId` that does not exist in `LikeState`, THEN THE CampaignFeed SHALL return the original `LikeState` unchanged without throwing an error.
