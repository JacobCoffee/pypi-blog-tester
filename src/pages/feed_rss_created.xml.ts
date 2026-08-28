// blog.pypi.org published its RSS feed at this path while it was built with
// MkDocs Material + mkdocs-rss-plugin. Serve the real feed here rather than
// redirecting, so existing subscribers get XML instead of an HTML redirect.
import type { APIContext } from "astro";
import { GET as rssGet } from "./rss.xml";

export const prerender = true;

export const GET = (context: APIContext) => rssGet(context);
