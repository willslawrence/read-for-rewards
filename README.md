# 📚 Read for Rewards

Gamified reading tracker for Will's homeschool boys. Kids earn cash rewards for completing books or memorizing scripture. Completion requires a live interview with Will.

## Architecture
- **Frontend:** Single HTML file on GitHub Pages
- **Backend:** Google Sheet (Books + Readers tabs) with Apps Script write-back
- **Fallback:** Embedded placeholder data in HTML (used when sheet fetch fails)

## URLs
- **Live:** https://willslawrence.github.io/read-for-rewards/
- **Google Sheet:** [Read for Rewards](https://docs.google.com/spreadsheets/d/1ZtV8B6NDoSpKEasGwdX9bk13hi4Gj4YIne-6ipyXVe8)

## Features
- 📖 Book cards with covers, ratings, and reward amounts
- 📜 Scripture memorization challenges
- 👥 Reader progress tracking with visual progress bars
- 🏆 Leaderboard ranked by rewards earned
- ⭐ Category filters (Religious, Thinking, Fiction, Scripture, Recommended)

> 📋 Operational reference: see `memory/read-for-rewards.md`

## Deploying the backend

`apps-script.gs` here is a copy for version control — the live file is `Code.js`, bound to the
sheet. Merging a PR does **not** deploy it. Use [`clasp`](https://github.com/google/clasp):

```bash
clasp clone-script "17je0uyn61_LtQ1WEGjN18CC5KUPQ6p0_AKs30PB5OcA8wp9f6AC4u0zQ"
diff Code.js apps-script.gs        # confirm the repo hasn't drifted from what's deployed
cp apps-script.gs Code.js
clasp push --force
clasp create-version "what changed"
clasp redeploy AKfycbxGh5WSuUh1sDxdWf69jW-uRVCxkK4wiheO1znc-oHN3P5MXi3v9TNV0VieAvSvBglj -V <version>
```

> ⚠️ **`redeploy`, never `deploy`.** A fresh `deploy` mints a new `/exec` URL, and `APPS_SCRIPT_URL`
> in `index.html` is hardcoded — the site breaks silently. Redeploy updates the version behind the
> existing URL.

The script ID isn't discoverable — bound scripts are hidden from Drive search and `clasp` has no
list command. Get it from **Extensions → Apps Script** in the sheet.

### Notes

- **Titles are the join key** between the Books and Readers tabs. Renaming a book orphans reader
  progress; duplicates split it. `addBook` rejects duplicate titles for this reason.
- **Testing with curl:** a POST to `/exec` 302s to `script.googleusercontent.com`. `curl -X POST -L`
  forces POST across the redirect and returns a junk HTML page — the endpoint looks broken but isn't.
  Capture `%{redirect_url}` and GET it. Node's `fetch()` handles this correctly.
- The web app is deployed **anonymous access**, so every action is callable by anyone with the URL.
