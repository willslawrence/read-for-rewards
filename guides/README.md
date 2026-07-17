# Reading Guides

One-page, print-ready reading guides for the books in Read for Rewards — a memory aid for **Will** before a completion interview, not a worksheet for the kid.

Each book has two files with the same base name:
- `<book>.html` — the source (edit this)
- `<Book Title> - Reading Guide.pdf` — the rendered output (what you print / hand out)

## The format (what goes in each guide)

Kept deliberately theme-heavy and question-light:

1. **Story in a paragraph** — the whole plot, tight.
2. **Who's who** — only the characters that carry a theme.
3. **Themes at a glance** — 4–6 one-liners in a gold-bordered box. This is the skim-before-the-interview block.
4. **The themes in depth** — a paragraph on each of those same themes.
5. **Passages to slow down on** — a few scenes worth rereading.
6. **One key quote** — short, attributed.
7. **3 questions to ask** — that's the cap. Three, not ten.

## Make a new one

Copy an existing guide as the template, swap the content, re-render:

```bash
cp prince-caspian.html <new-book>.html
# edit <new-book>.html — title, story, characters, themes, 3 questions
weasyprint <new-book>.html "<Book Title> - Reading Guide.pdf"
```

Rendered with [WeasyPrint](https://weasyprint.org/) (`weasyprint in.html out.pdf`). Letter size, self-contained — fonts are system serif (Georgia) so it renders offline with no web fonts.

## Done so far

- **Prince Caspian** (C.S. Lewis) — the Aslan-is-absent / believe-before-you-see book.
