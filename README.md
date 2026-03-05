# 📚 Read for Rewards

A book tracking dashboard where readers earn rewards for completing recommended books.

**Live:** https://willslawrence.github.io/read-for-rewards/

**Google Sheet:** [Read for Rewards](https://docs.google.com/spreadsheets/d/1ZtV8B6NDoSpKEasGwdX9bk13hi4Gj4YIne-6ipyXVe8)

## Features

- 📖 Book recommendation cards with covers, ratings, and reward amounts
- 👥 Reader progress tracking with visual progress bars
- 📝 Update Progress form (readers can update their own reading progress)
- 🏆 Leaderboard showing top readers by rewards earned
- 🔄 Data-driven from Google Sheets — edit the sheet, dashboard updates automatically

## Sheet Structure

### Books Tab
| Column | Description |
|--------|-------------|
| Title | Book title |
| Author | Author name |
| Cover URL | URL to book cover image (use Open Library: `https://covers.openlibrary.org/b/isbn/ISBN-L.jpg`) |
| Reward | Dollar reward for completing the book |
| Summary | Brief book description |
| Goodreads Rating | Rating out of 5.0 |
| Genre | Book category |
| Total Pages | Number of pages |

### Readers Tab
| Column | Description |
|--------|-------------|
| Reader Name | Person's name |
| Book Title | Must match exactly from Books tab |
| Start Date | YYYY-MM-DD format |
| Current Page | Page they're on |
| Total Pages | Total pages in the book |
| Status | `reading` or `completed` |

## Setup: Enable Write-Back (5 min)

To let readers update their progress from the dashboard → Google Sheet:

1. Open the [Google Sheet](https://docs.google.com/spreadsheets/d/1ZtV8B6NDoSpKEasGwdX9bk13hi4Gj4YIne-6ipyXVe8)
2. Go to **Extensions → Apps Script**
3. Delete any existing code and paste the contents of `apps-script.gs`
4. Click **Deploy → New deployment**
5. Type: **Web app**
6. Execute as: **Me**
7. Who has access: **Anyone**
8. Click **Deploy** and authorize
9. Copy the **Web app URL**
10. In `index.html`, replace `YOUR_APPS_SCRIPT_URL_HERE` with the URL
11. Push to GitHub

Without the Apps Script, the dashboard works in read-only mode (reads from sheet, progress updates are local only).
