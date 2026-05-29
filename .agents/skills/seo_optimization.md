# SEO Optimization Skill

Although an ERP POS system is typically an internal tool, public-facing parts (like digital receipts, e-commerce sync, or login portals) require SEO best practices.

## Guidelines
1.  **Next.js Metadata API**: Use the App Router's `Metadata` object to define title, description, and Open Graph tags for public pages.
2.  **Semantic HTML**: Ensure the POS UI uses semantic tags (`<header>`, `<main>`, `<footer>`, `<section>`, `<article>`) for better accessibility and machine readability.
3.  **Title Hierarchy**: Maintain a strict `H1` -> `H2` -> `H3` hierarchy without skipping levels.
4.  **Lighthouse Scores**: Ensure the login page and any public pages score >90 on Core Web Vitals (LCP, INP, CLS) to guarantee a fast, accessible experience.
5.  **Dynamic Routing Metadata**: Implement `generateMetadata` for dynamic pages like `receipt/[id]` so that digital receipts shared via links have proper previews.
