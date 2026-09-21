---
name: 골목 리소 전단지 (Alley Riso Flyer)
description: A two-spot-ink risograph neighborhood flyer on cool newsprint; first style preset, previewed on the fictional client 하루치 베이커리.
colors:
  federal-blue: "#1e4fff"
  fluoro-pink: "#ff3ea5"
  sunflower: "#ffd22a"
  blue-ink-dense: "#1537c9"
  pink-double-hit: "#ff0f6b"
  blue-underlay: "#2b58ff"
  newsprint: "#e4e6e3"
  paper-ink: "#f4f3ee"
typography:
  display:
    fontFamily: "'Black Han Sans', sans-serif"
    fontSize: "clamp(62px, 13vw, 208px)"
    fontWeight: 400
    lineHeight: 0.96
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "'Black Han Sans', sans-serif"
    fontSize: "clamp(44px, 6vw, 88px)"
    fontWeight: 400
    lineHeight: 1
  title:
    fontFamily: "'Black Han Sans', sans-serif"
    fontSize: "30px"
    fontWeight: 400
    lineHeight: 1.15
  body:
    fontFamily: "'Pretendard Variable', Pretendard, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: "'Do Hyeon', sans-serif"
    fontSize: "21px"
    fontWeight: 400
  figure:
    fontFamily: "'Do Hyeon', sans-serif"
    fontSize: "26px"
    fontWeight: 400
    fontFeature: "tnum"
rounded:
  none: "0px"
spacing:
  misreg-x: "5px"
  misreg-y: "3px"
  gutter: "clamp(16px, 4vw, 48px)"
  tag-pad: "22px"
  section-flood: "clamp(80px, 10vw, 140px)"
  section-paper: "clamp(64px, 8vw, 112px)"
  page: "1360px"
components:
  button-primary:
    backgroundColor: "{colors.federal-blue}"
    textColor: "{colors.paper-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0 22px"
    height: "52px"
  button-line:
    backgroundColor: "transparent"
    textColor: "{colors.federal-blue}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0 22px"
    height: "52px"
  button-paper:
    backgroundColor: "{colors.paper-ink}"
    textColor: "{colors.federal-blue}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0 22px"
    height: "52px"
  price-tag:
    backgroundColor: "{colors.paper-ink}"
    textColor: "{colors.blue-ink-dense}"
    rounded: "{rounded.none}"
    padding: "22px 22px 20px"
  price-tag-lead:
    backgroundColor: "{colors.paper-ink}"
    textColor: "{colors.blue-ink-dense}"
    rounded: "{rounded.none}"
    padding: "32px 36px"
  stamp:
    backgroundColor: "transparent"
    textColor: "{colors.pink-double-hit}"
    rounded: "{rounded.none}"
    padding: "2px 14px"
  top-bar:
    backgroundColor: "{colors.newsprint}"
    textColor: "{colors.federal-blue}"
    typography: "{typography.label}"
    padding: "10px {spacing.gutter}"
  flood-blue:
    backgroundColor: "{colors.federal-blue}"
    textColor: "{colors.paper-ink}"
    padding: "{spacing.section-flood} {spacing.gutter}"
  flood-sunflower:
    backgroundColor: "{colors.sunflower}"
    textColor: "{colors.blue-ink-dense}"
    padding: "{spacing.section-flood} {spacing.gutter}"
---

# Design System: 골목 리소 전단지 (Alley Riso Flyer)

## Overview

**Creative North Star: "The Alley Riso Flyer"**

The page is a two-color risograph flyer pasted to a telephone pole in a residential alley. Cool grey newsprint carries two spot inks, fluoro pink and federal blue, printed as separate plates that never quite line up. Where the plates overlap, multiply blending makes a deep violet the way real ink does. Every inked surface is grainy: SVG turbulence filters punch voids into the ink so the paper shows through. A third ink, sunflower, floods one whole section and fills parts of the illustration. It is never used for UI chrome or text.

Density is poster-like. Headlines are huge, compressed Korean gothic set edge to edge. Information sits on small paper price tags pinned to the page at slight angles. There are no photographs by default: illustration is made from flat printed shapes (circles, domes, slabs, halftone dot fields), each on its own plate. The signature behavior is misregistration. The pink plate sits offset by a fixed vector (5px, 3px), slides in on load, shudders once on hover, and snaps to perfect register under reduced motion.

This world is a style preset, and its first site is a fictional bakery. The palette, plates, grain, tag, stamp, flood sections, type stack and motion are reusable system. The loaf illustration, the bake-time schedule, the headline copy, the hero art coordinates, and the 3-column board with a 2×2 lead tag belong to 하루치 alone (see Components > Site-specific).

**Key Characteristics:**
- Two spot inks (pink, blue) on cool newsprint, plus one flood ink (sunflower).
- Every ink plate carries grain voids, and plates overlap with multiply.
- A fixed misregistration vector (5px, 3px) is the system's single offset.
- Square corners everywhere except printed circles.
- Compressed display gothic, a rounded label face for numbers and actions, and a neutral sans for body text.
- Depth comes only from overprint and plate offset, never from light and shadow.

## Colors

A risograph drum set: two fluorescent-leaning spot inks, one flood yellow, and the paper they print on. Denser tones of the same inks carry text.

### Primary
- **Federal Blue** (federal-blue): The workhorse plate. Used for headline base plates, display type, nav, button faces and outlines, tag borders, and the blue flood section.
- **Dense Blue Ink** (blue-ink-dense): Blue printed heavily. Used for body text and prices on paper (the page's default `color`). It reads darker than the plate so long text holds up.
- **Blue Underlay** (blue-underlay): A slightly lighter blue set as the solid background under grain-filtered blue surfaces (primary button, blue flood), so paper-ink text keeps 4.8:1 where the grain opens voids.

### Secondary
- **Fluoro Pink** (fluoro-pink): The second plate. Used for misregistered offsets of headlines, button and tag outlines, and shapes. It is also used for 1px hairlines under the top bar and hero, the divider between visit cells, the 3px hover underline on nav, the underline on visit labels, and the open-status dot. It reaches only about 2.6:1 on newsprint and never carries readable text.
- **Pink Double-Hit** (pink-double-hit): The same pink printed twice. Reserved for the stamp (border and lettering) at display size (34px), where its 3.4:1 clears the large-text threshold.

### Tertiary
- **Sunflower** (sunflower): The flood ink. It fills one full section (the story flood) and appears inside illustration (the sun disc, the crumb of the score). It is never used for text, borders, buttons, or on top of the blue flood.

### Neutral
- **Cool Newsprint** (newsprint): The page stock, the top bar, and the underlay beneath paper notes. It is deliberately cooler than the contracted #e6e6df, which read as warm cream. Blue text on it measures 4.6:1.
- **Paper Ink** (paper-ink): Brighter paper. Used for tag and note faces, the paper button, text knocked out of blue floods, and selection text. Translucent paper-ink (55%) draws the hairlines inside the blue flood.

### Named Rules
**The Two Plates Rule.** Anything inked is either a blue plate or a pink plate (sunflower only as flood or illustration fill). Overlaps are made with `mix-blend-mode: multiply`. Violet is never picked as a color. It only ever comes from overprint.

**The Pink Never Speaks Rule.** Fluoro pink is for shapes, offsets, hairlines, and underlines. Readable pink text uses only the double-hit pink, and only at stamp size or larger.

**The Underlay Rule.** Every grain-filtered surface that carries text sits on a solid underlay color (blue-underlay under blue, newsprint or paper-ink under paper). The voids then reveal a legible ground instead of dropping contrast.

## Typography

**Display Font:** Black Han Sans (with sans-serif)
**Label Font:** Do Hyeon (with sans-serif)
**Body Font:** Pretendard Variable (with Pretendard, sans-serif)

**Character:** The display face is a heavy, compressed Korean gothic that fills a flyer from edge to edge. Do Hyeon's rounded, hand-lettered geometry carries numbers, prices and actions, like a marker on a price card. Pretendard stays quiet for reading.

### Hierarchy
- **Display** (400, clamp(62px, 13vw, 208px), 0.96, -0.025em): The hero headline, one short phrase per line, each line its own overprinted plate.
- **Headline** (400, clamp(44px, 6vw, 88px), 1): Section titles, also overprinted. A flood section may run larger (story title clamp(48px, 7vw, 112px), 1.02).
- **Title** (400, 30px, 1.15): Item names on price tags. The lead tag scales to clamp(40px, 5vw, 72px). Brand marks use the same face (28px in the bar, 26px in the footer).
- **Body** (Pretendard 400, 17px, 1.7): Running text. Ledes run clamp(17px, 1.4vw, 20px) at 1.75, capped at 30–32em. Tag notes are 15px/1.5 and footer meta 14px. Korean text uses `word-break: keep-all`.
- **Label** (Do Hyeon 400, 19–22px): Nav (19px), buttons (21px), tag titles (20px), and visit labels (22px, pink 3px underline). Never uppercase-tracked, and never a small caption line above a heading.
- **Figure** (Do Hyeon 400, 26px, tabular numerals): Prices, times, and hours. The lead tag's bake times scale up to clamp(44px, 5vw, 72px) at line-height 1.

### Named Rules
**The Marker Numerals Rule.** Every price, clock time, and hour is set in Do Hyeon with tabular figures, never in the body face.

**The One Weight Rule.** All three faces run at weight 400. Hierarchy comes from size and face, not from bolding.

## Layout

Content sections are capped at 1360px and centered, with a fluid gutter (clamp(16px, 4vw, 48px)). Flood sections (sunflower, blue) run full-bleed and keep the gutter as inner padding. Paper sections breathe at clamp(64px, 8vw, 112px) vertically, and flood sections at clamp(80px, 10vw, 140px).

The top bar is sticky. It holds the mark, the nav, and the live status pushed right, and sits above a 1px pink hairline. Sections on paper are separated by 1px pink hairlines, not by background changes. The item board is a CSS grid with `grid-auto-flow: dense` and gaps of 36px × 32px. Tags on the board are hand-pinned: they tilt by -1°, 0.8° and -0.5° in a repeating 3-cycle. A floating tag can tilt up to -3°. A flood section uses a two-column grid (1.25fr / 1fr, aligned to the end), with oversized overprint shapes bleeding off the top-right corner, clipped by the section.

Breakpoints are 1080px (the board goes to 2 columns and the hero stacks: type, then art, then floating tag), 900px (flood grids and the visit grid go to a single column, and the pink cell dividers drop), and 640px (the board goes to 1 column, tags stop tilting, and the bar wraps with the status on its own line). Overflowing plates are clipped per section with `overflow-x: clip`.

## Elevation & Depth

The system has no light-based shadows. Depth is print depth: a second ink plate offset by the misregistration vector, multiply overprint where plates cross, and paper notes laid over ink floods. A fixed body overlay adds faint paper fibre (turbulence noise, multiply, 10% opacity) across the whole page. Ink grain lives on each inked surface through three SVG filters: `riso-a` and `riso-b` (different seeds, one per drum) for type and objects, and a finer `riso-flood` for full-section floods.

### Named Rules
**The Misregistration Rule.** The only offset in the system is the pink plate shifted by (5px, 3px). It is drawn as an outline or a type duplicate, never as a filled or blurred shadow. Hover pulls it to (1px, 1px) on buttons or shudders it once on tags. Under `prefers-reduced-motion` the vector becomes (0, 0) and the plates print in perfect register.

## Shapes

Corners are square (0px) on every container, button, tag, stamp and bar. Round forms appear only as printed shapes: sun discs, big pink circles, the halftone dots, the dough dome, and the 10px status dot. Rules are 1px hairlines (pink between sections and cells, dashed blue inside tags). Tag outlines are 2px, the stamp border 4px, and the underline accents 3px. Illustration is built from flat geometric plates (domes, slabs rotated a few degrees, halftone dot fields at 22° or -18°) and clipped to each other, never outlined or shaded.

## Components

### Buttons
Printed tickets with a stray second plate.
- **Shape:** Square (0px), min-height 52px, padding 0 22px, Do Hyeon 21px, and a 12px gap before an 18px SVG arrow (square linecaps).
- **Primary:** A grain-filtered federal-blue face on a blue-underlay ground, with paper-ink text.
- **Line:** A grain-filtered 2px blue outline and blue text on transparent.
- **Paper:** A paper-ink face with blue text, for use on the blue flood.
- **All variants:** A 2px pink outline plate sits behind the face at the misregistration offset.
- **Hover / Active:** On hover the pink plate slides to (1px, 1px) (0.25s, ease-out cubic-bezier(0.16, 1, 0.3, 1)). On press the whole button moves (2px, 2px). Focus is a 3px dense-blue outline at 3px offset, switching to paper-ink on the blue flood.

### Price Tags (signature)
A paper price card pinned to a board.
- **Face:** Paper-ink with a 2px blue border and grain, and a punched hole top-right (a paper circle ringed in blue).
- **Offset:** A 2px pink outline plate at the misregistration offset.
- **Content:** Title-face name (with 28px right padding for the hole), a Figure-face price, and a 15px body note. Internal rules are dashed blue 1px.
- **Motion:** The pink plate shudders once on hover (0.32s).
- **Lead variant:** Padding 32px 36px, and a larger name, price and bake-time figures.
- **Floating variant:** Rotated -3° and positioned over a hero.

### Stamp (signature)
An ink stamp slammed onto a tag to mark unavailability.
- **Style:** Pink double-hit, a 4px border, display face 34px, rotated -12°, multiply, grain `riso-a`, and centered over the tag.
- **State:** Hidden until script adds `.is-off` to its tag. The tag's name and price then drop to 50% opacity, and the price is struck through (2px). The tag gets an `aria-label` that states the reason, while the stamp itself is `aria-hidden`.

### Navigation (top bar)
- **Style:** Sticky, newsprint, with a 1px pink bottom hairline. The display-face mark is blue at 28px, and nav links are Do Hyeon 19px in blue with 12px vertical hit padding.
- **Hover:** A 3px pink underline.
- **Status:** The live open or closed status sits on the right in label face with tabular numerals. A filled pink dot means open, and a 2px blue ring means closed.
- **Mobile (≤640px):** The status wraps to its own line at 15px, and the nav shifts to 17px.

### Overprint Headline
Each line is a blue plate with a pink duplicate (from `data-text`) offset by the misregistration vector and multiplied, all grain-filtered. On paper the plate multiplies into the art behind it. On sunflower it blends normally. On the blue flood it becomes a knockout: paper-ink letters with the pink plate printed behind them. On load the pink plates slide in from (24px, -16px) with a 0.08s stagger.

### Flood Sections
Full-bleed ink floods (`riso-flood` grain) on a solid underlay. The sunflower flood pairs blue display type with a paper-ink note that has its own grain on a newsprint underlay. The blue flood carries paper-ink text, a knockout headline, and a 3-column info grid with translucent paper hairlines and pink vertical dividers. Each flood carries one oversized overprint shape cluster bleeding off its top-right corner.

### Site-specific (하루치 only; do not reuse as system)
- The loaf illustration (dome, crust ring, halftone flour, score, and base line) and its load animation (the `drop` keyframe).
- The hero art coordinates (left clamp(380px, 34.5vw, 500px)) and the floating tag position (top clamp(400px, 33vw, 470px)), which are tuned to this headline's line lengths.
- The six-item board with a 2×2 lead item that fills 9 cells, and the lead tag's corner loaf mark.
- The store hours, bake times, and sold-out rules in `script.js`, and the stamp wording (품절 / 오늘 없음).

## Do's and Don'ts

### Do:
- **Do** print every inked surface through a riso grain filter, and give text-bearing ink a solid underlay (The Underlay Rule).
- **Do** make every overlap with multiply between the pink and blue plates, and let violet appear only there.
- **Do** use the single (5px, 3px) misregistration vector for every offset plate, and zero it under reduced motion.
- **Do** set prices, times, and hours in Do Hyeon with tabular figures.
- **Do** keep containers square, and let roundness live in printed shapes only.
- **Do** divide sections and cells with 1px hairlines (pink on paper, translucent paper-ink inside the blue flood).

### Don't:
- **Don't** set readable text in fluoro pink (#ff3ea5, about 2.6:1 on newsprint), and don't use the double-hit pink below stamp size.
- **Don't** use sunflower for text, borders, or buttons, or place it on the blue flood.
- **Don't** add blurred or light-based `box-shadow` elevation. Depth is only overprint and plate offset.
- **Don't** warm the paper toward cream (#e6e6df was rejected for exactly this).
- **Don't** introduce extra offset values or rotations beyond the tag tilts (-1°, 0.8°, -0.5°, -3° floating) and the stamp (-12°).
- **Don't** bold any face. Everything is weight 400.
