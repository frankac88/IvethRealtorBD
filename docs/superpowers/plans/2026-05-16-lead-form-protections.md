# Lead Form Protections Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Harden lead submissions with deduplication, stronger server-side rate limiting, and normalized anti-spam metadata without changing the user-facing flow.

**Architecture:** Keep validation at the form and edge-function layers, move reusable anti-spam normalization/fingerprint logic into a shared helper, and persist only hashed metadata needed for short-window checks. The edge function remains the single write path for leads and notifications.

**Tech Stack:** React, Vitest, Supabase Edge Functions, Postgres migrations, TypeScript

---

### Task 1: Add failing regression tests

**Files:**
- Create: `D:\Work\Web\iveth-coll-realtor\iveth-coll-realtor-main\src\test\leadSubmissionProtection.test.ts`
- Modify: `D:\Work\Web\iveth-coll-realtor\iveth-coll-realtor-main\src\pages\ContactPage.test.ts`

- [ ] Add frontend and helper tests that describe normalized payloads, source extraction, and deterministic fingerprints.
- [ ] Run targeted tests and confirm they fail before implementation.

### Task 2: Implement shared protection helpers and frontend normalization

**Files:**
- Create: `D:\Work\Web\iveth-coll-realtor\iveth-coll-realtor-main\supabase\functions\_shared\leadProtection.ts`
- Modify: `D:\Work\Web\iveth-coll-realtor\iveth-coll-realtor-main\src\components\LeadCaptureForm.tsx`

- [ ] Add shared normalization, fingerprint, and source helper functions.
- [ ] Normalize lead payloads in the form before calling the mutation.
- [ ] Re-run targeted tests and confirm they pass.

### Task 3: Harden submit-lead and persist anti-spam metadata

**Files:**
- Modify: `D:\Work\Web\iveth-coll-realtor\iveth-coll-realtor-main\supabase\functions\submit-lead\index.ts`
- Create: `D:\Work\Web\iveth-coll-realtor\iveth-coll-realtor-main\supabase\migrations\20260516130000_add_lead_submission_protections.sql`
- Modify: `D:\Work\Web\iveth-coll-realtor\iveth-coll-realtor-main\src\integrations\supabase\types.ts`

- [ ] Reuse shared helpers in the edge function.
- [ ] Add deduplication and source rate limiting.
- [ ] Store hashed submission metadata and add supporting indexes.
- [ ] Re-run targeted tests and confirm they pass.

### Task 4: Verify project safety

**Files:**
- No code changes required.

- [ ] Run the full test suite.
- [ ] Run the production build.
- [ ] Review results and report any remaining risks.
