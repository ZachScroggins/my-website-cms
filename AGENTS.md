# my-website-cms: Sanity Studio for the site

Standalone Sanity Studio holding the content for zachscroggins.com. Project overview (this repo, the Next.js site next to it, shared assets): [`../AGENTS.md`](../AGENTS.md). Read it first.

- Sanity project `e3qg8tui` ("my-website"), dataset `production` (public), organization `oRFOMOXDU`.
- `npm run dev` runs the Studio at http://localhost:3333. Auto-updates are on.
- Sanity skills live in `.agents/skills/` (symlinked into `.claude/skills/`): `sanity-best-practices` and `content-modeling-best-practices`. Read the matching reference before changing the schema.

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
