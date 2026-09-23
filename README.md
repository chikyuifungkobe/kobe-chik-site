# Kobe Chik — Personal website (Vercel)

Static personal site for **Kobe Chik** (CHIK, Yui Fung). No build step.

## Deploy on Vercel (first project)

### Option A — Dashboard (recommended)

1. Go to [vercel.com/new](https://vercel.com/new) and sign in.
2. Prefer **Import Git Repository**:
   - Push this folder to a new GitHub repo (files at the repo root: `index.html`, `styles.css`, `script.js`, `assets/`, `vercel.json`).
   - On Vercel, click **Import**, pick that repo.
3. Leave settings as:
   - **Framework Preset:** Other
   - **Build Command:** (empty / leave default)
   - **Output Directory:** (empty / `.`)
   - **Install Command:** (empty)
4. Click **Deploy**.

### Option B — Drag folder / CLI

From this folder on your Mac:

```bash
npx vercel
```

Follow the prompts (link to your Vercel account, project name, production). Then:

```bash
npx vercel --prod
```

You will get a URL like `https://kobe-chik.vercel.app`.

## After you go live

Update Open Graph URLs in `index.html` to absolute HTTPS paths on your Vercel domain:

- `og:url`
- `og:image` / `twitter:image` → `https://YOUR-PROJECT.vercel.app/assets/og-image.jpg`

## Local preview

```bash
open index.html
# or
python3 -m http.server 8080
```

## Privacy

Phone number is intentionally omitted. Contact via email, LinkedIn, or Instagram only.
