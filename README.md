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

## Personal images

Add the following files:

- `assets/images/profile-main.jpg` — main portrait, ideally 1600 × 2000 px.
- `assets/images/profile-secondary.jpg` — laboratory, fieldwork or robot image, ideally square or portrait.

The page displays designed placeholders until those files are added.

## Project links and content

- Edit the three featured project links directly in `index.html`.
- The bottom carousel automatically loads public, non-fork GitHub repositories from the `GitM3` account.
- Change `GITHUB_USERNAME`, `REPO_LIMIT` or `HIDDEN_REPOSITORIES` at the top of `script.js`.
- If the GitHub API is unavailable, the carousel uses local fallback cards defined in `script.js`.

## Custom domain

Add a file named `CNAME` containing only your domain, then configure the same domain in GitHub Pages settings.

## Files

- `index.html` — semantic page structure and CV content.
- `styles.css` — Nord theme, responsive layout and animations.
- `script.js` — navigation, theme toggle, reveal effects and GitHub repository carousel.
- `assets/images/*.svg` — custom project illustrations.
- `.nojekyll` — prevents Jekyll processing.
