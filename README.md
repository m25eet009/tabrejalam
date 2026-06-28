# Tabrej Alam — Portfolio Website

A static, single-page portfolio built from scratch in plain **HTML / CSS / JavaScript**
(no build step, no framework, no dependencies to install). It's ready to upload to
any static host as-is.

## Files

```
portfolio/
├── index.html     → all page content & structure
├── style.css      → design system (colors, type, layout, animations)
├── script.js      → background network animation, hero diagram, scroll effects
└── README.md      → this file
```

## Run it locally

You don't need Node, npm, or any build tool. Just open `index.html` directly in
a browser, or — better, so relative paths behave exactly like they will in
production — serve it with a tiny local server:

```bash
# Python (already on most systems)
cd portfolio
python3 -m http.server 8080
# then visit http://localhost:8080
```

## Deploy it (pick any one — all are free for a personal site)

### Option A — Netlify (drag & drop, easiest)
1. Go to https://app.netlify.com/drop
2. Drag the whole `portfolio` folder onto the page.
3. Done — you get a live URL instantly. Add a custom domain later from
   Site settings → Domain management if you want `tabrejalam.com` etc.

### Option B — GitHub Pages (free, ties to your GitHub profile)
1. Create a new GitHub repo, e.g. `tabrej-alam.github.io` (using your exact
   GitHub username makes it your root domain) or any repo name.
2. Push these three files to the repo root:
   ```bash
   git init
   git add .
   git commit -m "Initial portfolio"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```
3. In the repo, go to **Settings → Pages → Source**, choose the `main` branch
   and `/ (root)` folder, then save.
4. Your site goes live at `https://<your-username>.github.io/<repo-name>/`
   (or just `https://<your-username>.github.io/` if you used the special repo name).

### Option C — Vercel
1. Go to https://vercel.com/new
2. Import the folder/repo, leave all build settings blank (it's static), deploy.

### Option D — Any traditional web host / VPS (cPanel, shared hosting, etc.)
Just upload `index.html`, `style.css`, and `script.js` into the `public_html`
(or equivalent) folder via FTP/SFTP or your host's file manager. No server-side
code is required — any host that can serve static files works.

## Customizing

- **Colors & fonts**: all defined as CSS variables at the top of `style.css`
  under `:root` — change `--signal`, `--amber`, `--ink-900`, etc. to retheme
  the whole site from one place.
- **Content**: everything is plain text inside `index.html`, organized by
  section (`#about`, `#research`, `#projects`, `#skills`, `#achievements`,
  `#contact`) — edit directly, no templating engine involved.
- **Contact details**: update the `mailto:`, `tel:`, and LinkedIn links inside
  the `#contact` section in `index.html`.
- **Adding a profile photo**: drop an image file into the `portfolio` folder
  and reference it with an `<img>` tag wherever you'd like (e.g. in the hero
  or about section) — none is currently included since one wasn't provided.

## Notes

- Fully responsive (mobile, tablet, desktop) with a collapsible nav menu below
  ~980px width.
- Respects `prefers-reduced-motion` for users who've disabled animations at
  the OS level.
- No external JS libraries — just vanilla JavaScript, so there's nothing to
  install or keep updated.
