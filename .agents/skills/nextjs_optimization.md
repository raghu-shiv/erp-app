# Next.js Optimization Skill

This skill focuses on leveraging Next.js 15 features to build a highly performant and secure ERP POS application.

## Server vs. Client Components
- **Default to Server**: All components must be Server Components by default to reduce client JavaScript.
- **Strategic Client Components**: Only add `'use client'` at the lowest possible level in the component tree where interactivity (onClick, useState) or browser APIs (window, localStorage) are strictly required (e.g., the POS barcode scanner input field, or the 'Add to Cart' button).

## Data Fetching & Caching
- **Server Actions**: Use Server Actions for mutations (creating an order, updating stock) to avoid writing manual API routes and to leverage Next.js progressive enhancement.
- **Suspense**: Wrap data-fetching components in `<Suspense>` boundaries with fallback skeletons to keep the POS UI responsive while loading product catalogs or order history.
- **Cache Invalidation**: Use `revalidatePath` or `revalidateTag` after mutations (e.g., after an order completes, revalidate the inventory path to show updated stock).

## Image Optimization
- Always use the Next.js `<Image>` component for product images to ensure they are automatically resized, compressed (WebP/AVIF), and lazy-loaded.
