# Admin Secondary Photo Tags Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Allow admin users to edit, add, and remove the visible tags/labels assigned to secondary project photos.

**Architecture:** Keep gallery tags stored in the existing `gallery_images` JSON shape using `labelEs` and `labelEn`. The admin form will manage a local `galleryImageTags` state for existing saved photos and pass it through the existing project update payload; API update will merge those labels with existing `url`/`path` and preserve newly uploaded gallery images with generated sequential default tags.

**Tech Stack:** React, TypeScript, Supabase, TanStack Query, Vitest/Testing Library.

---

### Task 1: Extend project save payload for editable gallery metadata

**Files:**
- Modify: `src/features/projects/api.ts`
- Modify: `src/pages/AdminPage.tsx`
- Test: `src/pages/AdminPage.test.tsx`

- [ ] Add `galleryImages?: ProjectGalleryImage[]` to `SaveProjectPayload`.
- [ ] In `updateProject`, use `galleryImages` when provided to update labels for existing saved secondary photos.
- [ ] Generate default labels for new uploads after the current gallery length so labels remain uniform (`Foto 8`, `Photo 8`, etc.).
- [ ] In `AdminPage`, keep local gallery tag state based on `editingProject.galleryImages`.
- [ ] Render existing secondary photos with image preview, editable Tag ES/Tag EN inputs, quick-add buttons for existing uniform tags, and a remove action that clears the tag text.
- [ ] On submit, pass sanitized `galleryImages` metadata with edited labels.
- [ ] Add a regression test proving edited gallery tags are submitted in the update payload.
- [ ] Run `npm run test -- AdminPage.test.tsx` and `npm run build`.
