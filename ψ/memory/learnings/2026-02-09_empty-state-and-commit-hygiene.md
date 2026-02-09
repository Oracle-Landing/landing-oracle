# Empty State First + Commit Intermediate States

**Date**: 2026-02-09
**Source**: /rrr --dig on landing-oracle full repo history
**Project**: gallery.buildwithoracle.com

## Lesson 1: Design the empty state before the full state

For any data-driven page (gallery, registry, dashboard), the first design question should be: "What does this page show when there's no data?" Not an afterthought — a starting point.

For Oracle gallery: when `liveOracles.length === 0`, show the birth issue (#154). The origin story fills the void. "This Oracle was born here — the gallery is coming."

## Lesson 2: Commit simplifications separately

When you remove a feature (masonry → grid, philosophy section deleted, filter toggle removed), commit that simplification as its own step before adding new things. Don't let 4 modified files sit uncommitted across a session boundary.

Bad: Remove masonry + add dot tooltips + remove philosophy + update nav = 1 uncommitted blob.
Good: `git commit -m "simplify: remove masonry, filter, philosophy section"` → then `git commit -m "feat: dot tooltips with screenshot previews"`.

## Lesson 3: Data dictates layout

4 items don't need masonry columns or filter toggles. Simple 2x2 grid. When there are 20+ items, revisit. "Patterns Over Intentions" — build for what you have, not what you imagine.

## Tags

`empty-state`, `commit-hygiene`, `gallery`, `design`, `layout`
