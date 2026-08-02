# Reading Guides

One-page, print-ready reading guides for the books in Read for Rewards — a memory aid for **Will** before a completion interview, not a worksheet for the kid.

## Where these live

**The source of truth is the vault**, not this repo:

```
<Personal vault>/Personal Life/Books/Reading Guides/
```

That folder holds the editable HTML source (`<book>.html`) **and** the rendered PDFs, plus a `Reading Guides.md` index note that backlinks to the per-book notes and the [[Read for Rewards]] brain note.

**This `guides/` folder is a PDF mirror** — a copy of each rendered `… - Reading Guide.pdf` checked into git as a backup and so the repo has a reference. Don't edit here; edit the HTML in the vault, re-render, then copy the new PDF over the mirror.

## The format (what goes in each guide)

Kept deliberately theme-heavy and question-light:

1. **Story in a paragraph** — the whole plot, tight.
2. **Who's who** — only the characters that carry a theme.
3. **Themes at a glance** — 4–6 one-liners in a gold-bordered box. The skim-before-the-interview block.
4. **The themes in depth** — a paragraph on each of those same themes.
5. **Passages to slow down on** — a few scenes worth rereading.
6. **One key quote** — short, attributed.
7. **3 questions to ask** — that's the cap. Three, not ten.

## Make a new one

In the vault's `Reading Guides/` folder, copy an existing guide as the template, swap the content, re-render:

```bash
cp prince-caspian.html <new-book>.html
# edit <new-book>.html — title, story, characters, themes, 3 questions
weasyprint <new-book>.html "<Book Title> - Reading Guide.pdf"
# then copy the PDF into this repo mirror:
cp "<Book Title> - Reading Guide.pdf" <repo>/guides/
```

Rendered with [WeasyPrint](https://weasyprint.org/). Letter size, self-contained — fonts are system serif (Georgia) so it renders offline with no web fonts. The `reading-guide` skill in the vault automates this whole flow.

## Done so far

- **Prince Caspian** (C.S. Lewis) — the Aslan-is-absent / believe-before-you-see book.
- **The Psychology of Money** (Morgan Housel) — behavior beats brains; "enough," patience, and wealth you don't see.
- **Animal Farm** (George Orwell) — power corrupts; propaganda, blind obedience, and the danger of staying silent.
