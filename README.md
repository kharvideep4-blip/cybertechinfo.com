# The CyberTech – React + Tailwind redesign

    npm install
    npm run dev       # http://localhost:5173
    npm run build     # output in dist/

- All page text lives in `src/content.json` (taken from the original site); contact/office details are in `src/App.jsx`.
- Images: all photo slots show an "Add image" placeholder. Drop files in `public/img/` and set the path in `src/images.js`.
- Deploying: `public/.htaccess` (cPanel/Apache), `public/_redirects` (Netlify) and `vercel.json` make deep links like `/about` work.
- Colors/fonts/animations: `tailwind.config.js`.
