# AGENTS.md

## Running the app
- Entry point: `node app.js` (port 3000)
- `package.json` `"main"` field incorrectly points to `index.js` — ignore it

## Stack
- Express 5.x, EJS templates, express-session
- CommonJS (`"type": "commonjs"`)
- No build, lint, typecheck, or test tooling configured

## Configuration
- `bank-config.json` controls all client-specific branding (bank name, colors, services, products, footer)
- To switch clients: replace `bank-config.json` with client-specific version — no code changes needed
- Config is loaded via `require('./bank-config.json')` and exposed to all EJS templates via `app.locals.bankConfig`
- EJS templates use `<%= bankConfig.bankName %>` and CSS variables for dynamic branding

## Routes
- `/` — Homepage (configurable landing page with services/products)
- `/login` — Login page (moved from `/`)
- `/dashboard` — User dashboard (requires auth)
- `/apply-loan` — Loan application POST
- `/logout` — Session destroy + redirect

## Quirks
- User data (with cards, FDs, investments, loans) hardcoded in `app.js` `USERS` array
- Session secret hardcoded in `app.js`
- No test suite exists (test script echoes error and exits 1)
- `views/` contains EJS templates; `public/` has static assets
