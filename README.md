# BWT-Website — Site Structure

This repository contains a hash-routed static site that loads section pages from `pages/` into `index.html#main-content`. Navigation focuses on six buyer journeys that map to the new Data & AI positioning.

## Top-level

- `index.html` — Bytewise Limited | High-Performance Data & AI Platforms
  - Hash routes (dynamic, loaded into `#main-content`):
    - `#/home` → `pages/home.html`
      - Section id: `home`
      - Conversion-focused hero with proof metrics, pain/outcome grid, certification band, and gated checklist form.
    - `#/solutions` → `pages/services.html`
      - Section id: `solutions`
      - Flagship offerings, timelines, and engagement extras.
    - `#/process` → `pages/approach.html`
      - Section id: `process`
      - 4-step operating model with governance callouts.
    - `#/proof` → `pages/success-stories.html`
      - Section id: `proof`
      - Multi-industry case outcomes, testimonials, and trust stack.
    - `#/insights` → `pages/insights.html`
      - Section id: `insights`
      - Resource hub with gated whitepaper, articles, and newsletter form.
    - `#/engage` → `pages/careers.html`
      - Section id: `engage`
      - Engagement model comparison and discovery form.
    - Supporting hashes kept for legacy links (`#/about`, `#/capabilities`, `#/services`, `#/approach`, `#/success-stories`, `#/careers`, `#/services2`).

## Pages

- `pages/home.html` — Outcome narrative, proof metrics, pain→outcome grid, logo band, and lead magnet form.
- `pages/about.html` — Updated positioning, principles, and leadership promise.
- `pages/capabilities.html` — Capability deep dive with tooling/deliverables/governance.
- `pages/services.html` — Renamed “Solutions”; showcases flagship offers + timeline.
- `pages/Services2.html` — Legacy services layout (kept for reference / experiments).
- `pages/approach.html` — “Process” timeline with governance callouts.
- `pages/success-stories.html` — “Proof” section with case outcomes and trust info.
- `pages/insights.html` — Resource hub + gated download + newsletter form.
- `pages/careers.html` — “Engage” section with engagement models and discovery form.

## Assets

- `css/style.css` — Core visual system + new utility bar, cards, grids, CTA variants, and form styles.
- `css/styles2.css`
- `js/main.js` — Hash router, nav state, mobile menu, modal logic, mock form handling, and CTA helpers.

## Notes

- Hash navigation dynamically fetches `pages/*.html` into `#main-content`; every load rehydrates lead forms and CTA helpers via `enhanceDynamicContent()` in `js/main.js`.
- New helper forms (`asset-download-form`, `insight-form`, `insights-newsletter-form`, `engage-form`) simulate CRM submission with optimistic feedback.
- Contact links continue to point to `#contact` and are intercepted to open the modal overlay; no static `id="contact"` anchor exists by design.
- Legacy hashes remain mapped for bookmarks, but the primary menu only surfaces Overview, Solutions, Process, Proof, Resources, and Engage.
