# Kodeflux

Build a modern dark-mode landing page for **Kodeflux** — a Micro-SaaS Lab offering a suite of business tools for solo entrepreneurs.

## DESIGN DIRECTION
Reference the aesthetic of localcan.com and unkey.com — modern developer-tool landing pages:
- Dark background (near-black, around #08080A with subtle warm tint)
- Bold, tight sans-serif headlines (Inter, weight 800, negative letter-spacing)
- Monospace accents (DM Mono or JetBrains Mono) for labels, small caps, badges
- Subtle radial gradient glows behind hero and section headers
- Fine 1px borders (#1C1C22) on cards, generous whitespace
- Grid/dot pattern texture in hero background at low opacity
- Smooth hover states — cards lift slightly, borders brighten
- Fully responsive, mobile-first

Accent color: electric teal-cyan (#3DD8C4) as primary, with warm orange (#E8915A) as secondary highlight.

## PAGE STRUCTURE (in order)

### 1. NAV
Sticky, transparent-to-solid on scroll. Logo "Kodeflux" (bold, with a teal dot after it). Links: Tools, Learn, Community. CTA button right: "Try the tools".

### 2. HERO
- Small monospace eyebrow label: "MICRO-SAAS LAB"
- Massive headline: "A pack of tools for self-made entrepreneurs, solo founders and side-hustlers — one hub."
- Sub-line: "Built on real experience across hospitality, creative agencies, rentals, and trading. Not theory — systems that actually run businesses."
- Two CTAs: primary "Explore the tools" (scrolls to tools), ghost secondary "Join the community"
- Below: small trust row in monospace — "6 tools live · Free to try · No signup required"

### 3. TOOLS SHOWCASE (main priority section)
Section header: eyebrow "THE TOOLKIT", headline "Six tools. One ecosystem."
Grid of 6 cards (3 columns desktop, 2 tablet, 1 mobile). Each card:
- Tool name (bold, large)
- One-line description
- A placeholder screenshot area (16:10 ratio, rounded, with subtle border and inner glow — use a gradient placeholder div; I will replace with real screenshots)
- Below screenshot: "Try it free →" link button

The 6 tools:
1. **Kapsule Tools** — "For agencies, freelancers, and content creators who manage multiple clients." → https://social-io.netlify.app/
2. **Kashflow Tools** — "For multi-income earners who want to know where the money actually goes." → https://budget-tools.netlify.app/
3. **Kluster Tools** — "For rental owners and side hustlers turning assets into steady income." → https://rental-io.netlify.app/
4. **Konsole Tools** — "For active traders in forex or crypto who want discipline over noise." → https://trader-tools.netlify.app/
5. **Kubicle Tools** — "For coaches, trainers and mentors running structured programs." → https://mentor-io.netlify.app/
6. **Kruiser Tools** — "For travelers, guides and tour operators planning trips, itineraries and experiences." → https://travel-tools.netlify.app/

All links open in new tab.

### 4. LEARN SECTION — 3 CARDS
Section header: eyebrow "LEVEL UP", headline "Learn the systems behind the tools."
Three cards side by side, each with an icon, title, description, small "Coming soon" badge in monospace:
1. **E-Mini Course** — "Short, focused video lessons on running each business type. Practical, no fluff."
2. **E-Playbook** — "Industry-specific written guides — pricing, operations, and growth frameworks you can apply today."
3. **Membership** — "Private community access, monthly live sessions, and early access to every new tool."

Make the Membership card visually elevated (brighter border, subtle teal glow) as the flagship offer.

### 5. MORE PROGRAMS — smaller row
Section header: eyebrow "ALSO COMING", headline "Go deeper, one-on-one."
Three compact horizontal cards (icon left, text right):
1. **Webinar Mastery** — "Live group sessions on specific business challenges."
2. **Private 1-on-1** — "Direct mentoring for your specific business situation."
3. **Affiliate Program** — "Earn by sharing tools you actually use."

### 6. FLUXMAN — subtle strip (low emphasis)
A single slim horizontal band, muted styling, not loud:
- Small monospace label "SERIES"
- "Fluxman — a faceless content series on building businesses solo."
- Small link "Follow on Instagram →" pointing to https://www.instagram.com/kode.flux

### 7. FOOTER / COMMUNITY CTA
Centered block with subtle gradient glow:
- Headline: "Join the community!"
- Sub: "Tutorials, e-courses & industry playbooks — coming soon!"
- Three icon links in a row: Instagram (https://www.instagram.com/kode.flux), WhatsApp (https://wa.me/6282299988720), Email (mailto:hello@kodeflux.com)
- Bottom bar: "© Kodeflux 2026. All rights reserved." in muted monospace, left. Right: small text "Made in Bali".

## TECHNICAL NOTES
- Use Tailwind + shadcn/ui components
- Use lucide-react for all icons
- Smooth scroll behavior for anchor links
- Add subtle fade-in-on-scroll animations (intersection observer or framer-motion if available)
- Screenshot placeholders should be clearly styled containers I can swap images into later — give each an obvious className like `tool-screenshot`
- No backend needed, static marketing page only
- All copy in English

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://kodeflux.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/5b4d4d81-2d54-4c04-8604-211f8729ab9e).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
