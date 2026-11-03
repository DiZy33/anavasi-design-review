# Anavasi — design review

Existing accepted Stage 2 review: https://dizy33.github.io/anavasi-design-review/

## Stage 3 — proposed revision 2 (2026-11-03)

Review: https://dizy33.github.io/anavasi-design-review/stage-3/index.html#C01

Revision 1 was returned with ten owner corrections; its historical source is commit `1655153`. **Revision 2 awaits owner approval.** Publication and browser checks are not design acceptance.

50 directly addressable review states: C01/C03/C04/C06–C10 owned courses; G01–G10 guide; L01–L05/L09 lesson/player/future availability; A01–A07 answers; E01–E04 personal-event overlays; D01–D07 provisional chats; P01–P06 profile; H01/H02 Home addition. The sidebar names every state and review intent. Old C02 redirects to C01; standalone progress A08 redirects to C03. Removed fullscreen/material/calendar/drawer routes are not implementation references.

Owner corrections implemented:

- Bottom Lessons contains only owned guide/thematic courses, without All/My tabs. The drawer's commercial catalog is deferred. Existing drawer and Stage 2 root pages are preserved.
- Course overview shows progress and opens its curator/teacher thread. Continue course opens L01 at the last lesson; no separate progress page.
- L01 uses a bounded lesson carousel and four in-place lesson-bound tabs. L02 uses controls over video and the same local tabs. Fullscreen is a horizontal mode of the same L02 state, with no route/tab change. Top activity banner removed on both pages.
- All Stage 3 demo lessons remain open, explicitly confirmed by the owner. L09 opening-date state is a future-only mockup.
- Personal create/edit actions use one overlay over the existing day/month, retaining selected date/month and scroll. Validation, write retry and cancel/delete confirmation stay inside that dialog.
- Existing calendar/event designs are reused; the former new-calendar commission is withdrawn. Course dates are data integration, not a calendar redesign.
- Chat list must be implemented strictly from Figma. The minimal curator/support thread is technical scaffolding pending a designer's refinement; separate local drafts and entry-aware Back work without transmission.
- Only a last-course continuation card is added to Home. No added nearest-demo banner or standalone progress screen. H01 review scrolls to this new card; H02 omits it.

Navigation checked: owned list→overview→lesson→player→fullscreen→same lesson; per-lesson tabs/answers/checkpoints; course→curator→Back to course versus list→curator→Back to list; day/month→event overlay→cancel/retry/delete→same calendar; failed answer/draft save→stay/retry/discard; guide→practical action→originating step. The existing private project DESIGN_HANDOFF contains the full M01–M14 transition/dependency matrix and acceptance record.

Browser QA: 50 states × 18 width/app/system combinations = 900 renders, 50 mobile-viewport checks and 94 interaction assertions. Inspected normal/extreme-font screenshots. Browser checks cannot certify Android lifecycle, native accessibility, keyboard or persistent writes.

This prototype stores synthetic edits only in memory until reload/reset. Video controls simulate states without real playback. No backend, actual sending, durable storage, analytics or remote runtime asset dependency is introduced. Native pickers are handoffs. Anonymous initials replace real Figma identities.

Design sources: Figma Design file `gO7czKDJEPs8z3aG2YPlAE`; lecture `1:225`, Home `1:7859`, chats `1:338`, Profile `1:602`/`27:9657`; existing calendar sources remain authoritative. Font/art/icons reuse app exports. Lecture central/side images are original Figma assets; these visual references do not establish teaching-video/PDF reuse rights for later bundling. All learning copy is synthetic.

To preview, open `index.html` (Stage 2) or `stage-3/index.html` (Stage 3), or serve this directory with a static HTTP server.
