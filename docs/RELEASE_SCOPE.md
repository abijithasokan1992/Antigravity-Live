# StreamVista AI Digital Studio — Production Release Scope

## Product
StreamVista AI Digital Studio

## Brand
StreamVista AI Digital Studio
Powered by Crayons Bridge

SV Muse is the intelligence layer, not the product name or a separate command-center UI.

## UX law
Every studio workflow uses one simple pattern:

1. Add — upload/select source media or enter a creative brief.
2. Choose — select the desired output and target options.
3. Create — submit the real backend job.
4. Check — show live status, preview/result, validation and approval.
5. Publish — save/download/deliver the approved final output.

No fake render buttons. No mock completion states. No unnecessary technical controls.

## Core studio capabilities
- AI Dubbing
- AI Subtitles & Translation
- AI Audio Description
- AI Edit & Post
- AI Image & Poster
- AI Video creation
- Voice workflows
- Media/project asset management
- Delivery & Packaging

## Dubbing flow
Upload source audio/video → choose target language and output (audio/video/final dubbed video) → create job → live processing/status → preview/check → approve → publish/deliver.

## Backend contract
Reuse existing production APIs and services. Do not create a mock backend to simulate completion.

The frontend must model a real job lifecycle:
REQUEST → PROCESSING → STATUS → RESULT → PUBLISH

A capability may only be shown as available when its backend/provider configuration is actually available. Missing credentials or unavailable providers must produce an explicit configuration/availability state rather than a fake success.

## Release gate
A release is not complete because Vercel returns HTTP 200. Production release requires:
- build passes
- routes load
- backend health passes
- real request can be submitted for each enabled capability
- status can be observed
- result can be retrieved
- publish/delivery action works where enabled
- no fake completion or mock data in production flows
- mobile and desktop smoke checks pass

Only after all enabled release flows are verified may the product be reported as production-ready.
