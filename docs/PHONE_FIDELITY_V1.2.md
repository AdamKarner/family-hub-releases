# Family Hub v1.2 — Phone fidelity implementation specification

Status: **IMPLEMENTATION SPEC — awaiting build and visual approval**  
Branch: `feature/phone-fidelity-v1.2` (do not change public `main`)  
Reference: Four user-supplied screenshots from 2026-10-21. The **first two are the current web demo** (Home, Calendar), **last two are current native Android** (Home, Calendar). Native Android is the visual authority. Images are retained in the conversation, not checked into the public repository.

## 1. Scope and non-negotiable safeguards

- Correct the web demo's **colors**, **bottom navigation**, **Home**, and **Calendar** to closely reproduce the native Android screenshots.
- Preserve five-tab navigation and existing functional interactions. Keep realistic **fictional** calendar/household data in the public demo, never copy names, birthdays, photographs, locations, or personal schedules from screenshots of the real household.
- Keep `index.html` (root landing), `setup.html`, `setup/`, `distribution-config.js`, and APK release workflows unchanged. No merge or deployment without explicit approval.
- The authentic v1.0 import is a snapshot, not a style constraint for v1.2. When intentionally editing demo HTML, replace the unconditional baseline-hash requirement with a separate v1.0 archive check or versioned, reviewed baseline; **do not silently weaken integrity checks**.

## 2. Visual baseline: approximate screenshot samples

Screenshots measure **709 × 1536 physical pixels**, but CSS device pixels depend on DPR. Use these as visual comparisons rather than hard-code physical pixel dimensions. Colors below are approximate direct-image samples and must be confirmed against Android `Tokens.kt` when available:

| Token | Demo sample | Native reference sample | Goal |
|---|---|---|---|
| App background | `#0B0F1A` | `#0D1321` | Native richer navy |
| Typical raised card | `#131B28` | `#172031` | More luminous blue-navy separation |
| Accent | Demo muted/dark emerald | Native brighter mint/emerald | Match Android `FhColor.Roof` exactly |
| Outline | Demo cool blue high contrast | Native subtler blue-gray | Derive from `FhColor.Line`/`Outline` |
| Secondary text | Demo warmer gray | Native blue-gray | Match `FhColor.Muted` |
| Active navigation pill | Demo dark green | Native subtle dark green translucent | Match pill placement, not only hue |

**Source-of-truth order:** native current Kotlin `Tokens.kt` > screenshots > existing demo CSS. The screenshots may show photo compression. Do not declare sampled JPEG colors exact Android values.

## 3. Bottom navigation — highest-priority shared component

Native reference:
- Full-width dedicated dark-navy surface fixed above Android's gesture navigation area; clean top separator, *no card-like surrounding border*.
- Five equally spaced positions, with **Home, Calendar, Meals, Grocery, Daily list**.
- Each tab icon is centered within its segment, **above** its caption. The selected tab has a **soft, wide pill behind the icon only**, not behind the label.
- Active icon is vivid mint; active label is off-white. Inactive icons are muted blue-gray; inactive labels are light slate.
- Icon geometry follows native code-defined `FhIcons` paths, with consistent line weight. Do not substitute generic emoji.
- Account for Android status and gesture navigation bars only within mock device presentation. Do not render an extra duplicate Android system bar in ordinary browsers.
- Use CSS safe-area `env(safe-area-inset-bottom)` where relevant, maintain touch targets, and preserve the click/navigate behavior.
- Confirm at widths 360, 390, and 430 CSS px. Avoid text clipping of `Daily list`.

**Acceptance:** align selected pill width/height/vertical position, icon center and label baseline with native crop at same display scale; zero horizontal overflow.

## 4. Home screen fidelity

Compare source demo screenshot 1 against native screenshot 3.

### Header and weather
- Current demo uses a very large weighty digital clock; native uses **light, elegant, narrower-weight numerals**, with daytime/date/weather typography and spacing different from demo.
- Native shows weather status indicator + sun/cloud glyph + current temperature aligned right, plus a settings gear.
- Header time and weather must align at the same visual baseline. Native's clear conditions include a vivid outlined golden sun.
- Date is a separate understated line, and summary weather is another muted line.

### Today strip / timeline
- On native screenshot, the narrow strip displays a temperature trend line with highlighted current-time dot and labels. Existing demo shows event pill blocks. Implement a deterministic *fictional* weather timeline matching the reference shape and hierarchy; weather/event mode should be supported according to the native Home ribbon rules, not a hard-coded picture.
- Match outer radius, card fill, corner shape, left/right padding, vertical footprint, and label placements.

### Cards
- **Up next:** label in tracked small capitals, lighter outline, native card height/padding; text wraps naturally rather than overflowing.
- **Dinner:** native heading `TONIGHT` for same-day meal, with plate image/emoji, a one-line truncated title when needed, prep badge, and small secondary next-day line. Use fictional dishes.
- **Countdown:** large golden days number, smaller `days`, title and muted event metadata. Keep fictional event names.
- Two cards are equal-width with consistent gap; native corners, borders, and typography are subtler.
- **Next hours:** the native screen shows a richly spaced hourly weather row, sun icons/temperatures, a divider, and next-seven-days section. Reproduce the layout with synthetic weather data.

### Layout
- Preserve independent vertical scroll behind sticky bottom navigation.
- On 390 CSS px, use native-relative margins, card widths, gaps, and density. Do not reproduce the screenshot's personally identifiable content.

## 5. Calendar screen fidelity

Compare source demo screenshot 2 against native screenshot 4.

- Native header `Calendar` uses Figtree with a large but not excessive weight, aligned to the same left margin as controls.
- Agenda / Week / Month chips are large with native emerald fill for the selected view, near-black text; unselected are outlined navy with blue-gray strokes. Demo selected chip is darker and has off-white text: **change both fill and label contrast**.
- Button row: `+ Add event` native mint/green, circular refresh outline, `Manage` outline, and partially scrollable right-side controls as designed. Keep horizontal scrolling, not a broken wrap.
- The `Updated...` helper line is muted, concise, and wraps without collision.
- Group headings use distinct mint `TODAY` then muted date. Later group headings show uppercased day abbreviation and normal date.
- Event cards: raised navy fill, cool muted outline, softly rounded corners, colored **left vertical edge**, event title/time hierarchy and person badge or fictitious portrait.
- Native event rows use a side-by-side time column and details when time is present, but all-day rows can prioritize event title; do not force a single rigid grid pattern.
- Provide at least one empty-today scenario, plus realistic next-day events. Fictional names only.
- Clicking tabs, events, add controls, and manager must preserve real demo behavior (no inert buttons).

## 6. Implementation guidance

1. Inspect the **private Kotlin app** `Tokens.kt`, `Icons.kt`, `Home.kt`, `CalendarViews.kt` (or their current equivalents) for exact dimensions/colors/path geometry where access is authorized. Do not copy private source into the public repository; transcribe only necessary visual design values.
2. Create an isolated `demo` design token block before screen-level CSS. Avoid broad find/replace that alters all backgrounds indiscriminately.
3. Implement the shared nav first; then Home and Calendar; recheck Meals, Grocery and Daily list for regressions.
4. Keep data in a clearly identified demo/mock model, no Firebase/API calls, real household metadata, or third-party telemetry.
5. Version label: distinguish original v1.0 baseline from active v1.2 branch instead of retaining misleading `v0.7` document title.
6. Add responsive and interaction checks at 360×740, 390×844, 430×932 and desktop 1100×900; capture Home/Calendar across all sizes. Make CI screenshot artifacts accessible for reviewer comparison.

## 7. Acceptance gates

- [ ] Reviewer sees side-by-side same-scale native/reference crops vs latest HTML renders for Home and Calendar.
- [ ] Native accent, surfaces, outlines and typography visually match within screenshot-compression tolerance.
- [ ] Bottom nav matches native icon artwork, pill proportions, and label/icon vertical placement.
- [ ] Home header, ribbon, cards and forecast section visually match native screen hierarchy.
- [ ] Calendar chips, actions, group headings and event cards match native style and behavior.
- [ ] Five tabs, alternate Calendar views, reset, at least one event interaction, small-screen scroll, and browser console checks pass.
- [ ] All public demo content is confirmed fictional; there are no private keys, API integrations, or real family data.
- [ ] Root site and distribution files unchanged; no inadvertent APK release changes.
- [ ] User explicitly approves merge after visual review.

## 8. Out of scope

This v1.2 phone milestone does not claim that portrait wall/tablet are complete. Those belong to the later planned v1.3/v1.4 tracks, followed by unification and a separately approved public-site integration.
