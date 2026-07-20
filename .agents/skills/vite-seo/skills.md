---
name: vite-seo
description: Guides the agent through building complete SEO support for React + Vite applications. Use when implementing SEO from scratch, improving existing SEO, or reviewing a Vite project for search engine optimization.
---

# Vite SEO

## Objective

This skill provides a complete workflow for implementing production-ready SEO in React + Vite applications.

Unlike SSR frameworks, Vite renders on the client by default, so SEO must be planned carefully using metadata, prerendering, structured data, and performance optimization.

---

# Workflow

Whenever the user asks about SEO in a Vite project, follow these phases in order.

## Phase 1 — Analyze the Project

Determine:

- Is it a React + Vite project?
- Is it an SPA?
- Is it a static website?
- Is it multilingual?
- Is it an ecommerce website?
- Does it contain blog pages?
- Does it contain dynamic routes?

Choose the SEO strategy based on the project type.

---

## Phase 2 — Install Required Packages

Recommend only packages that are actually needed.

Typical packages include:

- react-helmet-async
- vite-plugin-sitemap
- vite-plugin-compression
- vite-imagetools

Avoid unnecessary dependencies.

---

## Phase 3 — Metadata System

Implement page metadata.

Every page should define:

- title
- description
- canonical
- robots
- keywords (optional)
- Open Graph
- Twitter Card

Prefer reusable SEO components instead of duplicating metadata.

---

## Phase 4 — Structured Data

Identify which Schema.org type should be used.

Examples:

- Organization
- Product
- LocalBusiness
- FAQ
- Article
- BreadcrumbList
- WebSite

Generate valid JSON-LD.

---

## Phase 5 — Sitemap

Generate sitemap.xml.

Include

- all public pages

Exclude

- admin
- dashboard
- authentication
- private routes

Ensure sitemap is regenerated during production builds.

---

## Phase 6 — robots.txt

Create robots.txt.

Allow search engines to crawl public pages.

Block only private sections.

Reference the sitemap.

---

## Phase 7 — Canonical URLs

Prevent duplicate content.

Every indexable page should define a canonical URL.

---

## Phase 8 — Images

Optimize all images.

Prefer

- WebP
- AVIF

Use

- lazy loading
- responsive images
- width & height
- descriptive alt text

---

## Phase 9 — Performance

Improve Core Web Vitals.

Focus on

- Code Splitting
- Lazy Loading
- Dynamic Imports
- Bundle Size
- Font Optimization
- Image Optimization

Target Lighthouse scores above 90.

---

## Phase 10 — Prerender

Determine whether prerendering is needed.

Prerender pages like

- Home
- About
- Pricing
- Contact
- Services

Avoid prerendering

- Dashboard
- Login
- User Profile

---

## Phase 11 — International SEO

If the application supports multiple languages:

Implement

- hreflang
- lang attribute
- localized metadata
- localized sitemap

---

## Phase 12 — Accessibility

Verify

- Semantic HTML
- Heading hierarchy
- Keyboard navigation
- ARIA where appropriate
- Alt text

Accessibility contributes to SEO quality.

---

## Phase 13 — Final SEO Audit

Before deployment review:

✓ Metadata

✓ Structured Data

✓ Sitemap

✓ robots.txt

✓ Canonical URLs

✓ Open Graph

✓ Twitter Cards

✓ Image Optimization

✓ Performance

✓ Accessibility

✓ Mobile responsiveness

✓ Lighthouse

✓ Core Web Vitals

---

# Best Practices

Always

- Build reusable SEO components.
- Generate metadata dynamically.
- Keep page titles unique.
- Write meaningful descriptions.
- Optimize every image.
- Validate structured data.
- Keep URLs clean.
- Measure performance continuously.

Never

- Duplicate metadata.
- Leave pages without titles.
- Use multiple H1 tags.
- Block public pages accidentally.
- Ignore Core Web Vitals.
- Ship unoptimized assets.

---

# Expected Outcome

After following this skill, the Vite application should have:

- Complete metadata
- Search engine friendly pages
- Structured Data
- Optimized images
- Fast loading pages
- Sitemap
- robots.txt
- Canonical URLs
- Open Graph support
- Excellent Lighthouse score
- Strong technical SEO