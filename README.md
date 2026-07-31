# Zander Polson Portfolio — GitHub Pages

A responsive, dependency-free portfolio site based on the supplied CV. It uses the Nord colour palette and can be deployed directly to GitHub Pages without a build step.

## Preview locally

From this folder, run:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Deploy to GitHub Pages

### Option A: User site

1. Create or use the repository `GitM3.github.io`.
2. Copy all files from this folder to the repository root.
3. Push to the `main` branch.
4. Open **Repository Settings → Pages**.
5. Choose **Deploy from a branch**, select `main` and `/ (root)`.

The site will be available at `https://gitm3.github.io/` after GitHub finishes deployment.

### Option B: Project site

The same files may be placed in any public repository. In **Settings → Pages**, deploy the `main` branch root. All asset links are relative, so the site also works under a project subpath.

## Images and project content

The page currently uses the local images and video under `figures/`. Edit the
project and CV content directly in `index.html`.

## Custom domain

Add a file named `CNAME` containing only your domain, then configure the same domain in GitHub Pages settings.

## Files

- `index.html` — semantic page structure and CV content.
- `styles.css` — Nord theme, responsive layout and animations.
- `script.js` — navigation, theme toggle, reveal effects and video behavior.
- `figures/*` — project, portrait and video media used by the page.

