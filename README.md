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

> 📋 Operational reference: see `memory/read-for-rewards-reference.md`
