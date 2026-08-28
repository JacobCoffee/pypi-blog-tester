import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getCollection } from "astro:content";
import { postUrl, withBase } from "../lib/utils";

export const prerender = true;

export async function GET(context: APIContext) {
  const allPosts = await getCollection("posts");
  const authorName = new Map(
    (await getCollection("authors")).map((a) => [a.id, a.data.name]),
  );
  const posts = allPosts
    .filter((p) => p.data.published)
    .sort((a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime())
    .slice(0, 50);

  return rss({
    title: "The Python Package Index Blog",
    description: "The official blog of the Python Package Index.",
    site: context.site!.toString(),
    xmlns: { dc: "http://purl.org/dc/elements/1.1/" },
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.publishDate,
      description: post.data.description ?? "",
      link: withBase(`${postUrl(post.id)}/`),
      customData: `<dc:creator>${post.data.authors.map((id) => authorName.get(id) ?? id).join(", ")}</dc:creator>`,
      categories: post.data.tags,
    })),
  });
}
