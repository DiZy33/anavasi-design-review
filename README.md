# Anavasi Stage 2 — design review

Public, self-contained static copy of the interactive HTML prototype for reviewing proposed Stage 2 states.

Live site: https://dizy33.github.io/anavasi-design-review/

## Stage 3 — proposed revision 1 (2026-11-03)

Review: https://dizy33.github.io/anavasi-design-review/stage-3/index.html

74 directly addressable states, selected by URL hash: C01–C10 courses, G01–G10 introductory guide, L01–L08 lecture/player, A01–A08 answers/progress, E01–E11 personal events, T01–T10 shared timeline, D01–D07 chats/drafts, P01–P06 profile, H01–H04 Home/menu. The on-page navigation names every state and its review intent. Existing Stage 2 pages remain at the root.

**Approval pending.** No Stage 3 states have been accepted by the owner. Publication enables review, not implementation approval. Existing Figma Design remains authoritative for established pages; only accepted missing states become additional implementation references.

This HTML/CSS/JavaScript prototype keeps synthetic edits in memory until reload/reset. Save/error/player states illustrate intended Android behavior; no durable storage, actual video playback, transmission, OS-picker reproduction or backend is claimed. Native picker and keyboard behavior require later Android checks. Anonymous initials replace Figma identities. All runtime assets are local, with no analytics or remote runtime requests.

Design sources: Figma Design file `gO7czKDJEPs8z3aG2YPlAE`; Home `1:7859`, month `1:454`, day `27:11655` / `27:9700`, lecture `1:225` + header `27:11699`, chats `1:338`, Profile `1:602` / `27:9657`. Local font/art/icons reuse the app's original exported Design assets; lecture-cover is the central `imgImage49` asset in `1:225`, chat-art is `imgImage106` in `1:338`. These are visual references, not cleared teaching video/PDF content for future bundling. Review text is synthetic Anavasi copy.

Adaptive proposals include wrapping lecture tabs, vertical chat cards, growing/scrolling forms and two-column navigation under extreme text growth. They remain subject to owner approval and Android verification.

This prototype contains synthetic examples, not verified event data or implemented Android screens. Existing screens shown in Figma must be implemented from the Figma Design page. This site is a reference for the additional states approved by the owner. No backend, analytics, remote runtime dependencies, or persistent data are used.

To preview locally, open `index.html` or run `python -m http.server 8765` from this folder.
