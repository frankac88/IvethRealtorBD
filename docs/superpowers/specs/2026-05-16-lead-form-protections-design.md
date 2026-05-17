# Lead Form Protections Design

## Goal
Add stronger anti-spam protections to the lead form with minimal, production-safe changes.

## Scope
- Keep the existing `LeadCaptureForm` and `submit-lead` flow.
- Harden the existing server-side checks instead of introducing external captcha or a new subsystem.

## Approach
- Preserve the current honeypot and form timing checks.
- Normalize lead payloads consistently before validation, rate limiting, deduplication, storage, and notifications.
- Add short-window deduplication using a submission fingerprint.
- Add server-side rate limiting by both normalized email and hashed source fingerprint.
- Store only hashed source metadata, never raw IPs.

## Data Changes
- Add nullable `submission_fingerprint` and `source_fingerprint` columns to `public.leads`.
- Add indexes for recent deduplication and rate-limit lookups.

## Behavior
- Bots tripping honeypot or timing checks receive an opaque success response.
- Exact duplicate submissions inside the dedupe window are absorbed as success without inserting or notifying.
- Excessive submissions from the same email or source return a rate-limit error.
- Legitimate submissions continue creating leads and sending notifications.

## Testing
- Add frontend regression coverage for normalized form payloads.
- Add server-side unit coverage for lead normalization, fingerprint generation, and source extraction.
- Re-run targeted tests plus full project test/build verification after implementation.
