## The PyPI Blog

The official blog of the Python Package Index, published at
[blog.pypi.org](https://blog.pypi.org).

## About

Features some custom components like:

- GitHub User, Repo
- PyPI Project
- CPython Docs

Utilizes Bun for builds. Uses Astro.js which builds statically at build time.
Pre-commit config, powered by Prek to do CI things and spellchecks.

### From MkDocs

This blog previously lived in `pypi/warehouse` under `docs/blog`, built with
MkDocs Material's `blog`, `tags`, `social` and `rss` plugins. Those plugins have
no equivalent in Zensical, which the rest of the warehouse documentation moved
to, so the blog moved here instead.

Every URL the MkDocs site published is preserved:

| Old URL                     | Now                                              |
| --------------------------- | ------------------------------------------------ |
| `/posts/<slug>/`            | unchanged — see `postUrl()` in `src/lib/utils.ts` |
| `/author/<id>/`             | unchanged                                         |
| `/tags/`                    | unchanged                                         |
| `/pages/N/`                 | redirects to `/blog/N`                            |
| `/archive/YYYY/`            | redirects to `/blog/year/YYYY`                    |
| `/feed_rss_created.xml`     | served as real XML by its own route               |
| the other three feed paths  | redirect to `/rss.xml`                            |

Redirects live in `src/data/redirects.json` and are loaded by `astro.config.ts`.
`/blog/` pages hold 10 posts each to match the old pagination exactly, so
`/pages/N` maps 1:1 onto `/blog/N`.

### Posts

Posts are structured under `content/posts/`.
They have the directory named after the blog entry title.

Inside is the core markdown (index.md) and optionally the images
used in the blog entry.

Post dates are plain `YYYY-MM-DD` and therefore parse as UTC midnight. Anything
that formats or buckets them must do so in UTC, or every post renders a day
early west of UTC.

### Authors

Authors are configured via `content/authors/`.

Posts carry an `authors` list of author ids — the filenames in that directory,
lowercased, because Astro's content loader lowercases collection ids. A post can
have more than one author.

## Contributing

There are `Make` targets to get up and going, assuming you have the
tooling required (Bun, prek, etc.)

### Writing Blog Entries

Write markdown in your editor under `content/posts/<slug>/index.md`, then open
a pull request for review and CI checks. `make dev` runs a local preview.

> [!NOTE]
> You have access to a few custom components that can be used like
> `{% GhUser name="hugovk" /%}`, but PEPs, CPython docs, and GitHub links
> will automatically be picked up if you use standard markdown via the
> URL regex.
