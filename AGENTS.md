# my-website-cms: Sanity Studio for the site

Standalone Sanity Studio holding the content for zachscroggins.com. Project overview (this repo, the Next.js site next to it, shared assets): [`../AGENTS.md`](../AGENTS.md). Read it first.

- Sanity project `e3qg8tui` ("my-website"), dataset `production` (public), organization `oRFOMOXDU`.
- `npm run dev` runs the Studio at http://localhost:3333 (Presentation previews http://localhost:3000). Auto-updates are on.
- Hosted at https://my-website-cms.sanity.studio. Merging to `main` deploys it (`.github/workflows/deploy-studio.yml`, repo secret `SANITY_AUTH_TOKEN` with the Deploy Studio role); `npm run deploy` still works by hand. Markdown, `functions/` and `sanity.blueprint.ts` changes don't trigger it. `.env.production` points its Presentation Tool at https://zachscroggins.com.
- Sanity skills live in `.agents/skills/` (symlinked into `.claude/skills/`; both gitignored, installed per machine from `skills-lock.json` with `npx skills`): `sanity-best-practices` and `content-modeling-best-practices`. Read the matching reference before changing the schema.

## Revalidation function (`sanity.blueprint.ts`, `functions/invalidate-tags/`)

- A sync tag invalidate Sanity Function. When published content changes, it POSTs the stale sync tags to `https://zachscroggins.com/api/revalidate-tags` (see `../my-website/app/api/revalidate-tags/route.ts`), then calls `done`, which lets the site's `<SanityLive waitFor="function">` refresh open pages. Always call `done`, even on errors.
- Blueprint stack `production` (`ST-8smgi8hsjx`), scoped to `e3qg8tui.production`. `.sanity/` is gitignored; on a new machine run `npx sanity@latest blueprints init . --project-id e3qg8tui --stack-id ST-8smgi8hsjx --blueprint-type ts`.
- Env: `SITE_URL` is set in the blueprint. `SANITY_REVALIDATE_SECRET` is a function env var (`npx sanity functions env add invalidate-tags SANITY_REVALIDATE_SECRET <value>`) and must match the site's Vercel env var.
- Test locally against a running site: `LOCAL_SITE_URL=http://localhost:3000 SANITY_REVALIDATE_SECRET=<value> npx sanity@latest functions test invalidate-tags --data '{"syncTags":["s1:abc"]}'`.
- Deploy: `npx sanity@latest blueprints plan`, then `npx sanity@latest blueprints deploy`. Logs: `npx sanity@latest functions logs invalidate-tags`. Only one sync tag function per dataset.
- The function has its own `package.json` so its bundle doesn't pull in Studio packages. The CLI warns that a blueprint shouldn't sit next to a Studio; the warning is about lockfile placement (pnpm monorepos), and here the npm lockfile sits next to the blueprint.

## Content model (`schemaTypes/documents/`)

| Type | What it is |
|---|---|
| `post` | Blog post. `kind` is `post` or `portfolio-article`. Portfolio articles also have `accomplishment`, the line shown on the home page. Body is Portable Text with images and `code` blocks (`@sanity/code-input`). |
| `tag` | A technology or topic, with its own page at `/tags/<slug>`: description, homepage/repo/docs links, an inline SVG `icon` and a `logo` image (with `source` and `license`). Icons and logos are never shown on the home page. |
| `company` | A company (Lumeris). `roles` is the ordered list shown on the home page. |
| `role` | A job title. `accomplishments` is the ordered list of portfolio articles shown under it. |

The home page Portfolio section is built from `company → roles → accomplishments`; each accomplishment links to its article.

## Changing the schema

1. Edit `schemaTypes/`, then run `npx tsc --noEmit`.
2. `npm run typegen`: extracts `schema.json` and writes types for the site's GROQ queries to `../my-website/sanity/types.ts`.
3. `npx sanity schema deploy` so the MCP server and other tools validate against the new schema.
4. Never delete a field that has data; deprecate it first (see `sanity-best-practices/references/schema.md`).

## Logos and icons

Only use images Zach has the rights to. Icons come from react-icons (`si` = Simple Icons, CC0; `lu` = Lucide, ISC). Logos come from official brand or press pages; record the page in `logo.source` and the terms in `logo.license`. If the terms are unclear, leave the logo out and ask.

## Conventions

- Work on a feature branch and open a PR; Zach reviews and merges.
- Let Sanity generate `_id` values; link documents with references.

## Project notes

Project notes and board live in the Obsidian vault at `/Users/zach/Library/Mobile Documents/iCloud~md~obsidian/Documents/My Vault/01 PROJECTS/My Website/`; read its `INDEX.md` first. Before writing anything in the vault, read `/Users/zach/Library/Mobile Documents/iCloud~md~obsidian/Documents/My Vault/AGENTS.md` and follow it. If you change any vault file (including the board), add a Log entry in `/Users/zach/Library/Mobile Documents/iCloud~md~obsidian/Documents/My Vault/05 LOG/`.
