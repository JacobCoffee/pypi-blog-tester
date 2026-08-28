export const prerender = true;

import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { postUrl } from "../lib/utils";

export const GET: APIRoute = async () => {
  const posts = await getCollection("posts");
  const names = new Map(
    (await getCollection("authors")).map((a) => [a.id, a.data.name]),
  );
  const index = posts
    .filter((p) => p.data.published)
    .sort(
      (a, b) =>
        b.data.publishDate.getTime() - a.data.publishDate.getTime(),
    )
    .map((p) => ({
      id: p.id,
      url: postUrl(p.id),
      title: p.data.title,
      description: p.data.description || "",
      author: p.data.authors.map((id) => names.get(id) ?? id).join(", "),
      date: p.data.publishDate.toISOString(),
      tags: p.data.tags,
    }));

  return new Response(JSON.stringify(index), {
    headers: { "Content-Type": "application/json" },
  });
};
