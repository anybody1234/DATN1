---
description: Required workflow after UI changes — screenshot comparison, user-friendly checklist, and UX requirements
alwaysApply: true
---

# Working Process

## After Every Major UI Change

A **major change** is any of:
- New page or route
- New component section or layout area
- Layout restructure
- Color or typography overhaul
- Any visible change spanning more than one component

### Required Steps

1. Ensure the dev server is running (`npm run dev` on port 5173)
2. Take a screenshot of the affected page or component
3. Compare against the design reference (`resend.com_ (1).png` in project root):
   - Background darkness and contrast match
   - Whitespace and spacing rhythm consistent
   - Typography weight and hierarchy correct
   - Accent color used in one place only, not scattered
   - Overall minimalism — remove anything decorative that isn't purposeful
4. Report any deviations and fix them before moving on

## User-Friendly Requirements

Every UI decision must pass all of these checks before being considered done:

| Check | Requirement |
|---|---|
| **Legibility** | Text is readable at a glance — sufficient contrast, no font sizes below 14px |
| **Affordance** | Buttons, links, and inputs are immediately recognizable as interactive |
| **Feedback** | Every user action has visible feedback: loading state, success message, or error |
| **Empty states** | Never show a blank area — always provide a helpful message when there is no content |
| **Error messages** | Always in Vietnamese, always human-readable — never show raw error codes or stack traces |
| **Navigation** | User always knows where they are — breadcrumb or active nav highlight |
| **Japanese text** | Rendered with correct weight and size — never smaller than 14px |

## Language Rule

All user-facing text — labels, placeholders, error messages, toasts, empty states — must be in **Vietnamese**.

Technical identifiers (API field names, console logs, code comments) stay in English.
