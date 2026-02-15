# Yahia Portfolio (Refactor)

A cleaned + upgraded version of your single-file portfolio:
- Split into **index.html / css/style.css / js/main.js**
- Fixed duplicates (modal / CSS repetition / invalid form close tags)
- Better performance for the binary canvas (DPR scaling + requestAnimationFrame)
- Cleaner reveal animations + skill bars fill on scroll
- Works perfectly with **Live Server**, **http-server**, or **GitHub Pages**

## Run locally

### Option A: VS Code Live Server
1. Open the folder in VS Code
2. Right click `index.html` → **Open with Live Server**

### Option B: Python
```bash
python -m http.server 8080
```
Then open:
`http://localhost:8080`

### Option C: Node (http-server)
```bash
npx http-server -p 8080
```

## Deploy to GitHub Pages
1. Create a repo (example: `portfolio`)
2. Upload the folder contents (keep `index.html` in the repo root)
3. Repo → Settings → Pages → Deploy from Branch → `main` / root
4. After it builds, your site is live.

## Optional: Contact form (real sending)
Currently the form is **demo-only** (toast + reset).
You can connect it to:
- Formspree (simple)
- EmailJS (client-side)
- Your own backend (best for control)

## Optional: Fiverr button
Search in `js/main.js` for:
`FIVERR_URL`
and put your link there.

---

Made for: Yahia Saad
