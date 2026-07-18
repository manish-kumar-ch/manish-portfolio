# Manish Kumar — Portfolio

Personal portfolio site: **computational biology, machine learning and deep learning**.

A fully static site — plain HTML, CSS and JavaScript. No build step, no
dependencies, nothing to install. Push it to GitHub, switch on GitHub Pages,
done.

## Deploy on GitHub Pages (one-time setup, ~3 minutes)

### Option A — no command line (easiest)

1. Go to <https://github.com/new> and create a repository, e.g. `portfolio`
   (choose **Public** — Pages on a free account requires a public repo).
2. On the new repo page, click **uploading an existing file**, then drag in
   **all files and folders from this directory** (`index.html`, `assets/`,
   `.nojekyll`, `README.md`) and click **Commit changes**.
3. In the repo, open **Settings → Pages**. Under *Build and deployment*, set
   **Source: Deploy from a branch**, **Branch: `main`**, **Folder: `/ (root)`**,
   and click **Save**.
4. Wait a minute, refresh the Pages settings page — your site is live at
   `https://<your-username>.github.io/portfolio/`.

> Tip: name the repository `<your-username>.github.io` instead and the site
> will live at `https://<your-username>.github.io/` with no `/portfolio/` suffix.

### Option B — command line

```bash
cd manish-portfolio
git init -b main
git add -A
git commit -m "Portfolio site"
git remote add origin https://github.com/<your-username>/portfolio.git
git push -u origin main
```

Then do step 3 above (Settings → Pages → Deploy from branch → `main` / root).

## Before you publish: replace the placeholder content

The **Research** section contains three cards marked
**"PLACEHOLDER — REPLACE ME"**. Edit `index.html`, search for
`placeholder-flag`, and put in your real projects (title, description, tags),
deleting the `<span class="placeholder-flag">…</span>` line from each card.

Also worth personalising (all in `index.html`, marked with `EDIT ME` comments):

- the **About** paragraph — add your degree, institution and current research
- the **Areas of interest** cards — adjust titles/descriptions to your actual focus

The contact form opens the visitor's email app addressed to
`manish2000chourasiya@gmail.com`. To change the address, edit
`CONTACT_EMAIL` in `assets/js/main.js` (and the fallback link in `index.html`).

## Project structure

```
├── index.html              # the whole site (single page)
├── assets/
│   ├── css/style.css       # styles (design tokens from the original site)
│   ├── js/main.js          # shader background, contact form, scroll reveal
│   ├── fonts/              # Geist + Crimson Pro (self-hosted)
│   └── img/                # photo, favicon
├── .nojekyll               # tells GitHub Pages to serve files as-is
└── README.md
```

## Notes

- The animated background is the original site's WebGL2 shader ("blue"
  variant), recovered from the production bundle. Browsers without WebGL2
  get a static gradient instead; users with reduced-motion enabled get a
  single static frame.
- All asset paths are **relative**, so the site works both at
  `username.github.io/repo/` and at a custom domain.
- This replaces the previous server-rendered Next.js deployment on Netlify;
  the `netlify.toml` from that setup is intentionally not included.
