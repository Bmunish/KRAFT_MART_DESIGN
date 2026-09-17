update the hovering cards background with this animations as each card hsould be adding this - import { cn } from "@/lib/utils";
import { NoiseBackground } from "@/components/ui/noise-background";

export function NoiseBackgroundDemoSecond() {
  return (
    <div className="mx-auto max-w-sm">
      <NoiseBackground
        gradientColors={[
          "rgb(255, 100, 150)",
          "rgb(100, 150, 255)",
          "rgb(255, 200, 100)",
        ]}>
        <Card>
          <img
            src="https://assets.aceternity.com/blog/how-to-create-a-bento-grid.png"
            alt="Task Complete"
            className="h-60 w-full rounded-lg object-cover" />
          <div className="px-4 py-2">
            <h3
              className="text-left text-lg font-semibold text-balance text-neutral-800 dark:text-neutral-200">
              How to create a bento grid with Tailwind
            </h3>
            <p className="mt-2 text-left text-sm text-neutral-600 dark:text-neutral-400">
              Learn how to create a bento grid with Tailwind CSS, Next.js and
              Framer Motion.
            </p>
          </div>
        </Card>
      </NoiseBackground>
    </div>
  );
}

const Card = ({
  className,
  children
}) => {
  return (
    <div
      className={cn(
        "flex h-full min-h-80 flex-col overflow-hidden rounded-lg bg-white text-center dark:bg-neutral-800",
        className
      )}>
      {children}
    </div>
  );
};



2.the chovering and the scrolling effect should be smooth and more kind of like teh - # Calendly.com — Style Reference
> Navy ink on cool marble.

**Theme:** light

Calendly reads as a quiet, confident scheduling workspace: a near-white canvas with generous breathing room, crisp white product cards floating on cool stone-gray, and all typography rendered in deep navy ink rather than pure black. The defining move is the navy (#0b3558) used everywhere text appears — headings, buttons, icons, links — which softens the entire interface into something warmer and more editorial than a typical SaaS landing page. A single vivid blue (#006bff) carries every primary action, while decorative pink and cyan blobs bleed from behind product mockups to add warmth without clutter. Components stay restrained: thin 1px hairline borders, subtle blue-tinted shadows, generous 24px card radii, and 8px button corners that feel intentional rather than pill-soft.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink Navy | `#0b3558` | `--color-ink-navy` | Primary text, headings, icons, dark CTA backgrounds, nav links |
| Signal Blue | `#006bff` | `--color-signal-blue` | Primary CTA fill, active nav, link accents, selected states |
| Slate Gray | `#476788` | `--color-slate-gray` | Secondary body copy, helper text, muted labels |
| Mist Gray | `#a6bbd1` | `--color-mist-gray` | Disabled text, inactive feature labels, light icon strokes |
| Cloud | `#f8f9fb` | `--color-cloud` | Page canvas, footer background, secondary surface |
| Paper | `#ffffff` | `--color-paper` | Card surfaces, elevated panels, button text on dark fills |
| Pebble | `#f0f3f8` | `--color-pebble` | Badge backgrounds, input fills, subtle dividers, hover washes |
| Hairline | `#d4e0ed` | `--color-hairline` | Card and input borders, dividers, link underline defaults |
| Carbon | `#0a0a0a` | `--color-carbon` | Pure-black text fallback, logo glyph, icon fill |
| Coral Magenta | `#e55cff` | `--color-coral-magenta` | Decorative accent blob behind product cards — adds warmth without UI function |
| Sky Cyan | `#0099ff` | `--color-sky-cyan` | Decorative accent blob behind product cards — pairs with magenta for gradient washes |
| Deep Cobalt | `#004eba` | `--color-deep-cobalt` | Badge text on Pebble fills, info labels |

## Tokens — Typography

### Gilroy — All interface text. Gilroy is a geometric humanist sans with wide apertures and even stroke contrast; its bold weights (700) carry the display headlines, while 500–600 handles buttons and subheads. Substitute with Manrope or Inter. · `--font-gilroy`
- **Substitute:** Manrope
- **Weights:** 400, 500, 600, 700
- **Sizes:** 12, 14, 16, 18, 20, 24, 28, 38, 50, 68, 80
- **Line height:** 1.0–1.71 by step
- **Letter spacing:** normal across all sizes
- **Role:** All interface text. Gilroy is a geometric humanist sans with wide apertures and even stroke contrast; its bold weights (700) carry the display headlines, while 500–600 handles buttons and subheads. Substitute with Manrope or Inter.

### Gilroy — Body text and universal UI labels — weight 400 keeps long copy readable without feeling heavy · `--font-gilroy`
- **Weights:** 400
- **Sizes:** 16
- **Line height:** 1.0
- **Role:** Body text and universal UI labels — weight 400 keeps long copy readable without feeling heavy

### Gilroy — Secondary headings and emphasized body — the 14/500 is the workhorse for card titles and inline labels · `--font-gilroy`
- **Weights:** 500
- **Sizes:** 14, 20
- **Line height:** 1.4
- **Role:** Secondary headings and emphasized body — the 14/500 is the workhorse for card titles and inline labels

### Gilroy — Button labels and subheadings — 18/600 is the canonical button weight, 24–28/600 for section subheads · `--font-gilroy`
- **Weights:** 600
- **Sizes:** 18, 24, 28
- **Line height:** 1.4–1.6
- **Role:** Button labels and subheadings — 18/600 is the canonical button weight, 24–28/600 for section subheads

### Gilroy — Display and hero headlines — the 80px and 68px sizes are unusually large for a SaaS hero, giving the page editorial weight · `--font-gilroy`
- **Weights:** 700
- **Sizes:** 38, 50, 68, 80
- **Line height:** 1.2–1.21
- **Role:** Display and hero headlines — the 80px and 68px sizes are unusually large for a SaaS hero, giving the page editorial weight

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | — | `--text-caption` |
| body-sm | 14px | 1.4 | — | `--text-body-sm` |
| body | 16px | 1 | — | `--text-body` |
| button | 18px | 1.6 | — | `--text-button` |
| body-lg | 20px | 1.4 | — | `--text-body-lg` |
| subheading | 28px | 1.4 | — | `--text-subheading` |
| heading-sm | 38px | 1.21 | — | `--text-heading-sm` |
| heading | 50px | 1.2 | — | `--text-heading` |
| heading-lg | 68px | 1.2 | — | `--text-heading-lg` |
| display | 80px | 1.2 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 8px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |
| 16 | 16px | `--spacing-16` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 56 | 56px | `--spacing-56` |
| 64 | 64px | `--spacing-64` |
| 72 | 72px | `--spacing-72` |
| 96 | 96px | `--spacing-96` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 24px |
| small | 4px |
| badges | 9999px |
| inputs | 8px |
| buttons | 8px |
| productCards | 16px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| sm | `rgba(71, 103, 136, 0.04) 0px 4px 5px 0px, rgba(71, 103, 1...` | `--shadow-sm` |
| sm-2 | `rgba(71, 103, 136, 0.04) 0px 4px 5px 0px, rgba(71, 103, 1...` | `--shadow-sm-2` |
| sm-3 | `rgba(71, 103, 136, 0.04) 0px 4px 5px 0px, rgba(71, 103, 1...` | `--shadow-sm-3` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 48-64px
- **Card padding:** 24px
- **Element gap:** 8-16px

## Components

### Primary CTA Button
**Role:** Filled button for the main action on a screen

Background #006bff, text #ffffff at 18px weight 600, border-radius 8px, padding 6px 16px (compact) or 10px 16px (comfortable). No border. Used for "Sign up for free", "Get started", "Sign up with Google".

### Dark CTA Button
**Role:** Secondary filled action, often paired with primary for contrast

Background #0b3558, text #ffffff at 18px weight 600, border-radius 8px. Used for "Sign up with Microsoft" and "Get started" in the header.

### Ghost Text Link
**Role:** In-flow text link with no background

Color #0b3558 at 14–18px weight 500–600, no background, no border, no padding. Underline optional on hover. Used for inline body links like "View all integrations", "Learn more".

### Outlined White Button
**Role:** Ghost button on dark or image backgrounds

Color #ffffff, border 1px solid #ffffff, border-radius 4px, no background fill. Used over hero imagery or dark sections.

### Social Sign-In Button
**Role:** OAuth entry point

Full-width pill with provider logo left, text right. Two variants: Google (white bg, #0b3558 text, 1px Hairline border) and Microsoft (Ink Navy bg, white text, no border). Padding 12px 16px, border-radius 8px.

### Elevated Product Card
**Role:** Showcases a product mockup or UI screenshot

Background #ffffff, border-radius 16px, padding 0px (image fills card). Three-layer blue-tinted shadow: rgba(71,103,136,0.04) 0 4px 5px, rgba(71,103,136,0.03) 0 8px 15px, rgba(71,103,136,0.08) 0 30px 50px. Often sits in front of a Coral Magenta or Sky Cyan decorative blob.

### Feature Accordion Item
**Role:** Expandable or highlighted feature row

Active item: heading #0b3558 at 18–20px weight 600 with #006bff icon; inactive items: heading #a6bbd1 at 16px weight 400. Left-aligned icon, right-aligned chevron. 1px Hairline divider below.

### Pill Badge
**Role:** Inline label for promotions, status, or tags

Background #e6f0ff (Pebble-tinted), text #004eba at 12px weight 500, border-radius 50px, padding 4px 8px. Examples: "Save 16%", "We're hiring!".

### Trust Logo Strip
**Role:** Social proof band below hero

Single row of monochrome partner logos (Compass, L'Oréal, Zendesk, Dropbox, Gong, Carnival, Indiana University) in #a6bbd1, evenly spaced, centered. No card, no border — logos float on the canvas.

### Booking Widget Card
**Role:** Embedded preview of Calendly's scheduling UI

Background #ffffff, border-radius 16px, internal padding 0px. Three columns: organizer info (avatar + name), date grid (calendar with selected date highlighted #006bff), time slots (pill buttons with active state in #006bff). Mimics the actual product.

### Section Header Block
**Role:** Centered intro for content sections

H2 heading at 50–68px weight 700 in #0b3558, centered. Subtext at 16px weight 400 in #476788, centered, max-width ~640px. Optional CTA button below.

### Footer
**Role:** Site-wide footer with link columns

Background #f8f9fb, padding 40px horizontal. Link columns in #0b3558 at 14px weight 500, headings at 12px weight 600 uppercase in #476788.

## Do's and Don'ts

### Do
- Use Ink Navy #0b3558 for all text — never pure #000000, which breaks the system's warmth
- Use Signal Blue #006bff exclusively for filled primary CTAs; reserve Ink Navy for secondary dark buttons
- Set all card border-radius to 16px for product cards and 24px for feature panels
- Apply the three-layer blue-tinted shadow stack to any elevated surface above the canvas
- Use Gilroy weight 700 at 50–80px for hero and section headlines — undersized headings lose the page's editorial confidence
- Place every product visual in front of a Coral Magenta or Sky Cyan decorative blob offset by 20–40px
- Set buttons at 8px border-radius — not 4px (too sharp) and not pill (too soft) for this system

### Don't
- Don't use #000000 as a text color — always reach for Ink Navy #0b3558 or Slate Gray #476788
- Don't apply shadows with neutral black (rgba(0,0,0,...)) — all elevation must use the blue-tinted shadow base
- Don't use the decorative magenta/cyan blobs as fills for UI elements — they are atmosphere only, not functional color
- Don't create buttons with border-radius above 12px or below 4px — 8px is the system's sharp-but-soft sweet spot
- Don't set heading sizes below 38px for H2 or below 24px for H3 — the type scale skips small headings on purpose
- Don't use the badge color #004eba for CTAs — it reads as informational, not actionable
- Don't add gradients to backgrounds — the system is flat surfaces with shadow-based elevation only
- Don't pair the Signal Blue and Ink Navy CTAs on the same surface without enough spacing — they compete at close range

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#f8f9fb` | Page background, footer surface |
| 1 | Card | `#ffffff` | Elevated product cards, booking widget, feature panels |
| 2 | Input Fill | `#f0f3f8` | Form inputs, badge backgrounds, subtle hover washes |
| 3 | Dark Surface | `#0b3558` | Dark CTA buttons, inverse sections |
| 4 | Accent Surface | `#006bff` | Primary action fills, selected/active states |

## Elevation

- **Elevated Product Card:** `rgba(71, 103, 136, 0.04) 0px 4px 5px 0px, rgba(71, 103, 136, 0.03) 0px 8px 15px 0px, rgba(71, 103, 136, 0.08) 0px 30px 50px 0px`
- **Link card with icon:** `rgba(71, 103, 136, 0.04) 0px 4px 5px 0px, rgba(71, 103, 136, 0.03) 0px 4px 10px 0px, rgba(71, 103, 136, 0.05) 0px 10px 20px 0px`
- **Button:** `rgba(71, 103, 136, 0.04) 0px 4px 5px 0px, rgba(71, 103, 136, 0.03) 0px 8px 15px 0px, rgba(71, 103, 136, 0.06) 0px 15px 30px 0px`

## Imagery

Product screenshots are the primary visual — clean UI mockups of the booking calendar rendered on pure white cards with generous rounded corners. Decorative treatment: each product card is backed by a soft blob shape in Coral Magenta (#e55cff) or Sky Cyan (#0099ff), slightly offset and blurred, creating an editorial collage effect rather than a flat screenshot. No photography, no lifestyle imagery — all visuals are product UI, abstract accent shapes, or monochrome partner logos in the trust strip. Icons are line-style with 1.5–2px stroke weight, mono-tone in Ink Navy or Signal Blue.

## Layout

Max-width 1200px centered, generous outer margins on desktop. Hero is a two-column split: left column holds the 80px headline + body copy + stacked sign-in buttons, right column holds the booking widget card backed by decorative blob shapes. Below the hero sits the trust logo strip as a single full-width band. Subsequent sections alternate between centered header blocks (H2 + subtext + optional CTA) followed by two-column feature blocks (text-left/product-right or product-left/text-right) with decorative accent blobs behind every product visual. Card grids are rare — the layout prefers side-by-side paired sections over multi-column grids. Section gaps are 48–64px. Navigation is a 64px sticky top bar with logo left, centered menu, and CTA cluster right.

## Agent Prompt Guide

**Quick Color Reference**
- Text (primary): #0b3558
- Text (secondary): #476788
- Background (canvas): #f8f9fb
- Surface (card): #ffffff
- Border (hairline): #d4e0ed
- Accent (decorative): #e55cff / #0099ff
- primary action: #006bff (filled action)

**Example Component Prompts**

1. Create a Primary Action Button: #006bff background, #ffffff text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

2. *Feature block (text-left)*: Section gap 64px. H2 at 50px Gilroy weight 700, color #0b3558, centered above. Left column: feature list with Ink Navy icons (#006bff for active item, #a6bbd1 for inactive). Right column: 16px-radius white card with booking widget UI, backed by a #0099ff blob.

3. *Pill badge*: Background #e6f0ff, text #004eba at 12px Gilroy weight 500, border-radius 50px, padding 4px 8px.

4. *Footer*: Background #f8f9fb, padding 40px horizontal. Column headings at 12px Gilroy weight 600 uppercase, color #476788. Links at 14px Gilroy weight 500, color #0b3558.

5. *Social sign-in button*: Full-width, 12px 16px padding, 8px radius. Google variant: white bg, #0b3558 text, 1px #d4e0ed border. Microsoft variant: #0b3558 bg, white text, no border.

## Similar Brands

- **Linear** — Same Ink Navy text on near-white canvas, blue-tinted shadows, and single vivid blue primary action — both treat restraint as a feature
- **Notion** — Similar white-card-on-cool-gray layout, generous 16–24px radii, and navy/blue text palette that avoids pure black
- **Loom** — Same editorial heading sizes (50–80px bold), product-screenshot-in-front-of-colorful-blob hero treatment, and clean light-mode SaaS language
- **Webflow** — Shares the white canvas + navy text + single electric blue accent, with decorative gradient shapes behind product visuals

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink-navy: #0b3558;
  --color-signal-blue: #006bff;
  --color-slate-gray: #476788;
  --color-mist-gray: #a6bbd1;
  --color-cloud: #f8f9fb;
  --color-paper: #ffffff;
  --color-pebble: #f0f3f8;
  --color-hairline: #d4e0ed;
  --color-carbon: #0a0a0a;
  --color-coral-magenta: #e55cff;
  --color-sky-cyan: #0099ff;
  --color-deep-cobalt: #004eba;

  /* Typography — Font Families */
  --font-gilroy: 'Gilroy', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --text-body-sm: 14px;
  --leading-body-sm: 1.4;
  --text-body: 16px;
  --leading-body: 1;
  --text-button: 18px;
  --leading-button: 1.6;
  --text-body-lg: 20px;
  --leading-body-lg: 1.4;
  --text-subheading: 28px;
  --leading-subheading: 1.4;
  --text-heading-sm: 38px;
  --leading-heading-sm: 1.21;
  --text-heading: 50px;
  --leading-heading: 1.2;
  --text-heading-lg: 68px;
  --leading-heading-lg: 1.2;
  --text-display: 80px;
  --leading-display: 1.2;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-72: 72px;
  --spacing-96: 96px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 48-64px;
  --card-padding: 24px;
  --element-gap: 8-16px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-full: 50px;
  --radius-full-2: 9999px;

  /* Named Radii */
  --radius-cards: 24px;
  --radius-small: 4px;
  --radius-badges: 9999px;
  --radius-inputs: 8px;
  --radius-buttons: 8px;
  --radius-productcards: 16px;

  /* Shadows */
  --shadow-sm: rgba(71, 103, 136, 0.04) 0px 4px 5px 0px, rgba(71, 103, 136, 0.03) 0px 4px 10px 0px, rgba(71, 103, 136, 0.05) 0px 10px 20px 0px;
  --shadow-sm-2: rgba(71, 103, 136, 0.04) 0px 4px 5px 0px, rgba(71, 103, 136, 0.03) 0px 8px 15px 0px, rgba(71, 103, 136, 0.08) 0px 30px 50px 0px;
  --shadow-sm-3: rgba(71, 103, 136, 0.04) 0px 4px 5px 0px, rgba(71, 103, 136, 0.03) 0px 8px 15px 0px, rgba(71, 103, 136, 0.06) 0px 15px 30px 0px;

  /* Surfaces */
  --surface-canvas: #f8f9fb;
  --surface-card: #ffffff;
  --surface-input-fill: #f0f3f8;
  --surface-dark-surface: #0b3558;
  --surface-accent-surface: #006bff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink-navy: #0b3558;
  --color-signal-blue: #006bff;
  --color-slate-gray: #476788;
  --color-mist-gray: #a6bbd1;
  --color-cloud: #f8f9fb;
  --color-paper: #ffffff;
  --color-pebble: #f0f3f8;
  --color-hairline: #d4e0ed;
  --color-carbon: #0a0a0a;
  --color-coral-magenta: #e55cff;
  --color-sky-cyan: #0099ff;
  --color-deep-cobalt: #004eba;

  /* Typography */
  --font-gilroy: 'Gilroy', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --text-body-sm: 14px;
  --leading-body-sm: 1.4;
  --text-body: 16px;
  --leading-body: 1;
  --text-button: 18px;
  --leading-button: 1.6;
  --text-body-lg: 20px;
  --leading-body-lg: 1.4;
  --text-subheading: 28px;
  --leading-subheading: 1.4;
  --text-heading-sm: 38px;
  --leading-heading-sm: 1.21;
  --text-heading: 50px;
  --leading-heading: 1.2;
  --text-heading-lg: 68px;
  --leading-heading-lg: 1.2;
  --text-display: 80px;
  --leading-display: 1.2;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-72: 72px;
  --spacing-96: 96px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-full: 50px;
  --radius-full-2: 9999px;

  /* Shadows */
  --shadow-sm: rgba(71, 103, 136, 0.04) 0px 4px 5px 0px, rgba(71, 103, 136, 0.03) 0px 4px 10px 0px, rgba(71, 103, 136, 0.05) 0px 10px 20px 0px;
  --shadow-sm-2: rgba(71, 103, 136, 0.04) 0px 4px 5px 0px, rgba(71, 103, 136, 0.03) 0px 8px 15px 0px, rgba(71, 103, 136, 0.08) 0px 30px 50px 0px;
  --shadow-sm-3: rgba(71, 103, 136, 0.04) 0px 4px 5px 0px, rgba(71, 103, 136, 0.03) 0px 8px 15px 0px, rgba(71, 103, 136, 0.06) 0px 15px 30px 0px;
}
```
these are the specific codes i am providing you to create the desig and the imporvemnts (it doesnot mean copying the whole setiup.)
"

3.for the porducts page - # LaunchDarkly — Style Reference
> Neon control room — a dark cockpit where violet signals pulse through charcoal panels.

**Theme:** dark

LaunchDarkly is a midnight control room: deep charcoal canvas, cool violet-blue as the only chromatic voice, and white type that cuts through like console output. The interface is dense and technical without feeling cluttered — it borrows the visual language of developer tools (monospace code, panel grids, pill-shaped inputs) and wraps it in a confident marketing skin. The violet→blue gradient (#405bff → #7084ff) acts as the brand's electronic pulse, appearing in glows, hero text, active states, and decorative washes rather than flat fills. Components are pill-soft (30-60px radii dominate), borders are hairline-white on near-black, and elevation is communicated through glow rather than shadow.

## Colors

| Name | Value | Role |
|------|-------|------|
| Signal Violet | `linear-gradient(179deg, #405bff 1.06%, #7084ff 123.42%)` | Hero text accent, link underlines, icon glows, decorative gradient endpoint — the brand's chromatic signature; used as paint, not fill; Hero ambient washes, card glow halos, decorative background floods |
| Voltage Blue | `#405bff` | Violet outline accent for tags, dividers, and focused UI edges. Do not promote it to the primary CTA color |
| Midnight Ink | `#0e0e0e` | Page canvas, deepest background layer |
| Carbon | `#191919` | Surface level 1 — nav pill, card backgrounds, button fills, footer |
| Graphite | `#414042` | Surface level 2 — elevated panels, card borders, secondary surfaces |
| Steel | `#58595b` | Input borders, inactive form fields |
| Slate | `#6d6e71` | Muted helper text, disabled labels |
| Fog | `#a7a9ac` | Secondary text, subtle borders, placeholder copy |
| Ash | `#d1d3d4` | Tertiary text, icon strokes, list dividers |
| Paper | `#ffffff` | Primary text, heading fills, icon strokes, card backgrounds in product-screenshot panels |
| Smoke | `#2c2c2c` | List dividers, row separators in dense tables |
| Plasma Cyan | `#3dd6f5` | Secondary gradient endpoint — used sparingly in radial glows for atmospheric warmth |

## Typography

### bodyFont — bodyFont — detected in extracted data but not described by AI
- **Weights:** 400, 500, 600, 700
- **Sizes:** 12px, 13px, 14px, 15px, 16px, 18px, 20px, 22px, 24px, 26px, 28px, 32px, 36px, 40px, 66px, 84px, 85px, 100px, 125px
- **Line height:** 1, 1.09, 1.2, 1.3, 1.4, 1.5, 1.6, 1.71
- **Letter spacing:** 0.129, 0.167

### Sohne / custom grotesk — Primary interface and display typeface. Weight 500 dominates headings — heavier than typical marketing sites (400-600) but lighter than editorial displays (700-800), landing in a confident middle register. The largest sizes (84-125px) carry very tight line-height (1.0-1.09), letting headlines stack as a solid block of type. Letter-spacing opens up to 0.129-0.167em on small uppercase labels (eyebrows, tags) but stays normal on body and display.
- **Substitute:** Inter, Geist, Söhne (if licensed), or Space Grotesk
- **Weights:** 400, 500, 600, 700
- **Sizes:** 12, 13, 14, 15, 16, 18, 20, 22, 24, 26, 28, 32, 36, 40, 66, 84, 85, 100, 125
- **Line height:** 1.20, 1.30, 1.40, 1.50, 1.60

### Sohne Mono / JetBrains Mono — Code snippets, SDK names, technical labels. Normal letter-spacing, 1.50-1.65 line-height for readability. Appears in the hero email input and the 'Copy, paste, go.' code block.
- **Substitute:** JetBrains Mono, IBM Plex Mono, Geist Mono
- **Weights:** 400
- **Sizes:** 14, 16, 20, 22
- **Line height:** 1.50, 1.65

### monoFont — monoFont — detected in extracted data but not described by AI
- **Weights:** 400
- **Sizes:** 16px, 20px, 22px
- **Line height:** 1.09, 1.5, 1.65

### Arial — Arial — detected in extracted data but not described by AI
- **Weights:** 400
- **Sizes:** 13px
- **Line height:** 1.2

### Helvetica — Helvetica — detected in extracted data but not described by AI
- **Weights:** 400
- **Sizes:** 15px
- **Line height:** 1.5
- **Letter spacing:** 0.007

### headingFont1 — headingFont1 — detected in extracted data but not described by AI
- **Weights:** 500
- **Sizes:** 125px
- **Line height:** 1

### Type Scale

| Role | Size | Line Height | Letter Spacing |
|------|------|-------------|----------------|
| caption | 12px | 1.5 | — |
| body-sm | 14px | 1.5 | — |
| body | 16px | 1.5 | — |
| subheading | 20px | 1.4 | — |
| heading-sm | 24px | 1.3 | — |
| heading | 36px | 1.2 | — |
| heading-lg | 66px | 1.09 | — |
| display | 100px | 1 | — |

## Spacing & Layout

**Base unit:** 8px

**Density:** comfortable

- **Page max-width:** 1200px
- **Section gap:** 80-120px
- **Card padding:** 32-48px
- **Element gap:** 16-24px

### Border Radius

- **tags:** 30px
- **cards:** 30px
- **inputs:** 10px
- **buttons:** 30px
- **navPill:** 60px

## Components

### Floating Nav Pill
**Role:** Primary site navigation

Centered floating pill at top of viewport, 60px radius, Carbon (#191919) fill, 1px white-alpha border. Contains: logo with arrow icon, nav links (Platform, Solutions, Resources, Developers, Pricing) with chevron dropdowns, Sign In text link, Sandbox text link, and Voltage Blue (#405bff) 'Get a demo' button. Sits 16-24px from viewport top with horizontal margin. No traditional header bar — the pill IS the header.

### Primary Action Button
**Role:** Main CTA

Voltage Blue (#405bff) fill, white text, 30px radius, 16px vertical × 24px horizontal padding. Used for 'Get a demo' in nav and 'Get started' in hero form. No border, no shadow — the saturated blue is enough presence.

### Hero Form Input
**Role:** Email capture

Large dark input with Carbon (#191919) fill, 10px radius, 1px subtle border. Internal layout: email field (white text, #58595b placeholder) fills left, Voltage Blue 'Get started' button fills right. The whole composite has a soft blue glow halo (rgba(64,91,255,0.25) box-shadow) making it feel like a glowing console. Approximately 600px wide, centered, with generous vertical padding (~16-20px).

### Segmented Tab Control
**Role:** Section navigation

Three-tab pill control (Release / Observe / Iterate) with 30px radius, Carbon fill, 1px border. Active tab indicated by a small Voltage Blue dot to the left of the label and brighter white text. Inactive tabs use Ash (#d1d3d4) text. Centered above a two-column section.

### Feature Checklist Item
**Role:** Section bullet list

Checkmark icon in Voltage Blue or white, followed by white text at ~16-18px. No background, no card. Vertical stack with 12-16px gap between items.

### Sub-feature Card
**Role:** Linked feature callout

Semi-transparent dark card with subtle violet/blue glow at edges, rounded 16-20px radius. Contains: small icon (blue or violet), white label text, right-arrow icon. Sits inside a larger section as a navigational sub-element.

### Product Screenshot Panel
**Role:** Embedded UI demonstration

Pure white (#ffffff) card with 12-20px radius and soft shadow, containing the actual LaunchDarkly product interface (pipeline configuration). Contrasts sharply with the dark page — the product UI is always shown as 'light' even on the dark marketing page, signaling that the real tool has its own bright workspace.

### Code Snippet Block
**Role:** SDK code example

Dark Carbon (#191919) panel with 12-16px radius, containing syntax-highlighted code. Language tabs (JavaScript / Python / iOS / React) at top in Ash text with active language in white. Code uses mono font at 14-16px with Dracula-inspired syntax colors (green strings, cyan keywords, pink literals). Copy button in top-right corner.

### SDK/Resource Card
**Role:** Linkable resource tile

Dark card (Carbon fill) with 1px white-alpha border, 20-30px radius, 32-40px padding. Contains: small icon top-left, white heading text (~18-20px weight 500), white subtext at 14-15px weight 400. Used in grids of 3 columns to link to Docs, Demo Project, Discord, etc.

### Logo Strip
**Role:** Social proof

Horizontal row of grayscale partner/customer logos (SpaceX, Tricentis, GoPro, Volvo, Ally, Priceline) at ~70% opacity, Ash or Fog tone. Logos are rendered in white-alpha on the dark background — no boxes, no borders, just quiet type marks.

### Hero Headline
**Role:** Primary page heading

Two-line display headline at 84-100px, weight 500, line-height 1.0-1.09. First line in white ('Move at AI speed.'), second line in Signal Violet ('Stay in control.'). The violet second line is the signature — the brand literally colorizes its differentiator. Letter-spacing tight (normal or slight negative).

### Ghost / Outlined Action
**Role:** Secondary CTA

Transparent fill with 1px Signal Violet (#7084ff) border, Signal Violet text, 30px radius. Used for secondary actions where the primary blue button already exists. The violet outline echoes the hero accent — secondary actions share the brand's signature hue rather than fading to neutral.

## Do's and Don'ts

### Do
- Use 30px radius for all buttons, tags, and cards — the pill-softness is non-negotiable for this brand
- Use 60px radius for the top navigation pill and any full-width pill containers
- Use Signal Violet (#7084ff) for the second half of hero headlines to split the message into 'what' (white) and 'why it matters' (violet)
- Render embedded product screenshots as pure white panels on the dark canvas — the contrast signals 'this is the real workspace'
- Use the #405bff → #7084ff linear gradient at 179deg for ambient glows behind cards and hero text
- Set body text at 16-18px weight 400, white on Carbon — never below 14px for readability on dark
- Use mono font for SDK names, code, and technical identifiers — the monospace voice is part of the developer-tool identity

### Don't
- Don't use square corners or small radii (4-8px) on user-facing components — they break the pill language
- Don't use drop shadows for elevation — use glow (rgba(64,91,255,0.25) or rgba(112,132,255,0.19)) instead to stay on-brand
- Don't introduce additional accent colors — the entire system is monochromatic-plus-violet; adding green, red, or yellow dilutes the signal
- Don't use white or gray for primary action buttons — Voltage Blue (#405bff) is the only correct fill for a main CTA
- Don't center-align body copy or feature lists — only headlines and hero blocks center; everything else is left-aligned
- Don't use 1.5+ line-height on display headlines — keep it tight (1.0-1.09) so the type stacks as a solid block
- Don't put dark product screenshots on the page — the real product UI is always bright/white, creating the page's key visual tension

## Elevation

- **Floating Nav Pill:** `0 4px 20px rgba(0, 0, 0, 0.45)`
- **Hero Form Input:** `0 0 40px rgba(64, 91, 255, 0.25)`

## Surfaces

- **Midnight Canvas** (`#0e0e0`) — Page background — the void beneath everything
- **Carbon Panel** (`#191919`) — Nav pill, footer, primary card surface
- **Graphite Edge** (`#414042`) — Card borders, elevated panel outlines, subtle separation on dark
- **Product White** (`#ffffff`) — Embedded product screenshots — the LaunchDarkly pipeline UI appears as a bright white card floating on the dark canvas

## Imagery

Imagery is sparse and functional. The primary visual content is embedded product UI screenshots — bright white panels showing the LaunchDarkly pipeline interface floating on the dark page. The hero has no photography or illustration; it relies on type, glow, and a large form input. Customer logos appear as a grayscale strip. The code-snippet section uses syntax-highlighted mono text as a visual element. There is no lifestyle photography, no abstract 3D, no decorative illustration — the brand's visual language is the product itself, the code, and the type.

## Layout

Full-bleed dark canvas with max-width 1200px content containers centered inside. The hero is a tall vertical block (80-100vh) with centered headline + subtext + form input stacked vertically with generous breathing room. Below the hero, sections alternate between two-column layouts (text-left / product-screenshot-right) and three-column card grids. The floating nav pill sits fixed at top center. Section gaps are large (80-120px) to let the dark canvas breathe between content blocks. Content rhythm: hero → logo strip → tabbed feature section (2-col) → code integration section (2-col) → resource card grid (3-col).

## Similar Brands

- **Linear** — Same dark-canvas + single-accent-glow approach; both treat the product UI itself as the hero visual, and both use pill-shaped inputs and tight type stacks.
- **Vercel** — Shares the monochrome dark palette with one chromatic accent, gradient-driven glow effects, and the practice of rendering product interfaces as bright white cards on a dark page.
- **Datadog** — Both use deep charcoal surfaces with violet/purple brand accents, and both embed real product dashboards (not mockups) as the primary visual proof.
- **Stripe** — Similar typographic confidence — large weight-500 display headlines, tight line-height, and the strategy of using color selectively on a subset of words in a headline for emphasis.

take the idea from these as the hoveing and the showcasing ofthe design should be like that . 

make the plan and divide it into short parts and then make the each page workabel and the check the flow of the website. make it smotther and desing it more properly . i am als providing the logo of the kraftmart in te folder.