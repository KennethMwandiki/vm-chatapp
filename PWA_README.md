PWA basics for VM CHAT INTENG

Files added:
- `public/manifest.json` — web manifest used by browsers and installers
- `public/icons/*.svg` — editable SVG icons used by the manifest
- `public/sw.js` — minimal service worker (caching app shell)
- `public/register-sw.js` — helper to register the service worker from your app
- `scripts/validate-manifest.js` — Node script used by CI to validate manifest presence

Quick usage

1. Ensure `public/manifest.json` is referenced in your site's `<head>`:

   <link rel="manifest" href="/manifest.json">

2. Include the service worker registration in your app entry (for example in `index.html` or main JS):

   <script src="/register-sw.js"></script>

3. Run the manifest validator locally:

   node ./scripts/validate-manifest.js

Notes
- Icons are SVG so you can edit them quickly. For app stores or strict PWA checks you may want PNG fallbacks at multiple sizes. The manifest currently references PNG paths as a fallback; browsers accept SVG too, but some tools prefer PNG.
- If your app is hosted under a subpath, update `start_url` and `scope` accordingly.

Generating PNGs from the SVG icons

If you want PNG fallbacks (recommended for some validators and app stores), you can generate them from the SVGs with the included script. This uses `sharp`.

On Windows (PowerShell):

```powershell
npm install --save-dev sharp
node ./scripts/generate-png-from-svg.js
```

On Linux/macOS:

```bash
npm install --save-dev sharp
node ./scripts/generate-png-from-svg.js
```

If `sharp` installation fails on Windows, install the appropriate build tools (Windows Build Tools or use the prebuilt binaries) or run the script inside WSL where libvips is available.

