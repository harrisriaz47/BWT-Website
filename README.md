# BWT-Website — Site Structure

This repository contains a hash-routed static site that loads section pages from `pages/` into `index.html#main-content`.

## Top-level

- `index.html` — Bytewise Limited | High-Performance Data & AI Platforms
  - Hash routes (dynamic, loaded into `#main-content`):
    - `#/home` → `pages/home.html`
      - Section id: `home`
      - Primary heading: “High-Stakes Data & AI Tuned For Velocity & Certainty”
    - `#/about` → `pages/about.html`
      - Section id: `about`
      - H2: “Who We Are”
    - `#/capabilities` → `pages/capabilities.html`
      - Section id: `capabilities`
      - H2: “Core Capabilities”
    - `#/services` → `pages/services.html`
      - Section id: `services`
      - H2: “Services & Consulting”
    - `#/approach` → `pages/approach.html`
      - Section id: `workflow` (note: differs from route name)
      - H2: “Delivery Framework”
    - `#/success-stories` → `pages/success-stories.html`
      - Section id: `success` (note: differs from route name)
      - H2: “Case Outcomes”
    - `#/insights` → `pages/insights.html`
      - Section id: `insights`
      - H2: “Insights & Research”
    - `#/careers` → `pages/careers.html`
      - Section id: `careers`
      - H2: “Build What Moves Industries”
    - `#/services2` → `pages/Services2.html` (alternate services layout)
      - Section id: `services`
      - H2: “Services & Consulting”

## Pages

- `pages/home.html` — Home section and multiple feature blocks (impact stats, tech expertise, services overview, consulting framework, featured engagement)
- `pages/about.html` — About / Who We Are
- `pages/capabilities.html` — Core Capabilities (Data Engineering, BI/Analytics, Applied AI)
- `pages/services.html` — Services & Consulting (detailed)
- `pages/Services2.html` — Services & Consulting (alternate layout/cards)
- `pages/approach.html` — Delivery Framework
- `pages/success-stories.html` — Case Outcomes
- `pages/insights.html` — Insights & Research
- `pages/careers.html` — Careers

## Assets

- `css/style.css`
- `css/styles2.css`
- `js/main.js` — Hash-based routing, mobile menu, contact modal logic, mock form submission

## Notes

- Navigation uses hash routes and dynamically fetches `pages/*.html` into `#main-content` (see `js/main.js`).
- The “Our Approach” and “Success Stories” routes use section IDs `workflow` and `success` respectively; this is fine for routed loads, but for in-page anchor consistency you may want to align IDs and nav labels.
- `Services2.html` is reachable via `#/services2` but isn’t linked in the main nav; consider adding a link if you want to expose the alternate layout.
- Contact links use `href="#contact"` and are intercepted by JavaScript to open the modal. There is intentionally no `id="contact"` element in the DOM.
