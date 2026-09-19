# Missing Essential Elements Implementation

This plan outlines the implementation of several key components and features missing from the Starter Kit to reach professional, "ready-to-use" standards for client projects.

## User Review Required

> [!IMPORTANT]
> The implementation will start with the **404 Page** as requested.
> Other features will follow in logical batches.

> [!NOTE]
> We will use **Astro View Transitions** for seamless page transitions across the entire site.

## Proposed Changes

### Phase 0: "default" Template Scaffolding

#### [NEW] [default template directory](file:///d:/Programy/client-projects/starter-kit/src/templates/default/)
- Initialize the third template with its own `Page.astro` and `blocks/` directory.
- This template will serve as a modern, minimal base independent of existing ones.

#### [MODIFY] [site.ts](file:///d:/Programy/client-projects/starter-kit/src/config/site.ts)
- Add `'default'` to the `ACTIVE_TEMPLATE` type options.

#### [MODIFY] [Layout.astro](file:///d:/Programy/client-projects/starter-kit/src/layouts/Layout.astro)
- Update theme detection logic to handle the new `default` template.

---

### Phase 1: Brand-Matching 404 Page (Multi-template)

#### [NEW] [404.astro](file:///d:/Programy/client-projects/starter-kit/src/pages/404.astro)
- Create a dedicated error page that uses `Layout.astro`.
- Implement dynamic styling that automatically matches the active template (`fix-bud`, `gold`, or `default`).
- Include "Go Back Home" and "Contact Us" links.

---

### Phase 2: Global Navigation & Consistency

#### [NEW] [Footer.astro](file:///d:/Programy/client-projects/starter-kit/src/components/ui/molecules/Footer.astro)
- Create a universal footer molecule that pulls data from `src/data/global/company.json` and `src/data/global/navigation.json`.
- Support multiple layouts or a single, highly flexible "grey-box" layout.

#### [NEW] [Breadcrumbs.astro](file:///d:/Programy/client-projects/starter-kit/src/components/ui/molecules/Breadcrumbs.astro)
- Implement an SEO-friendly breadcrumb component using Schema.org BreadcrumbList.

---

### Phase 3: SEO & Technical Security

#### [MODIFY] [Schema.astro](file:///d:/Programy/client-projects/starter-kit/src/components/ui/atoms/Schema.astro)
- Expand the current schema to include **LocalBusiness** details (address, geo, openingHours) from `company.json`.

#### [MODIFY] [ContactForm.astro](file:///d:/Programy/client-projects/starter-kit/src/templates/gold/sections/contact-form/ContactForm.astro)
- Add a hidden "honeypot" field to trap bots.
- Update client-side script to skip submission if the honeypot field is filled.

---

### Phase 4: UX Enhancements & "Premium" Feel

#### [NEW] [Toast.astro](file:///d:/Programy/client-projects/starter-kit/src/components/ui/atoms/Toast.astro)
- Implement a lightweight, accessible toast notification system for form success/error messages.

#### [NEW] [Skeleton.astro](file:///d:/Programy/client-projects/starter-kit/src/components/ui/atoms/Skeleton.astro)
- Create a base skeleton atom for content loading placeholders.

#### [NEW] [BackToTop.astro](file:///d:/Programy/client-projects/starter-kit/src/components/ui/atoms/BackToTop.astro)
- A floating button that appears on scroll to return to the top.

#### [MODIFY] [Layout.astro](file:///d:/Programy/client-projects/starter-kit/src/layouts/Layout.astro)
- Integrate `<ClientRouter />` (Astro View Transitions) for smooth transitions.

## Verification Plan

### Automated Tests
- `npm run build` to ensure no regressions.
- Check 404 page accessibility and responsive layout.
- Verify LocalBusiness schema via Google's Rich Results Test (manual).

### Manual Verification
- Navigate to a non-existent URL to test 404 page.
- Submit a form with the honeypot filled (via dev tools) to verify spam protection.
- Check view transitions between pages.
