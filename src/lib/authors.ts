import { getCollection } from "astro:content";

export interface ResolvedAuthor {
  id: string;
  name: string;
  avatar: string;
}

/**
 * Posts store author ids (the filenames under content/authors). Everything that
 * displays an author needs the name and avatar, so resolve them once here
 * rather than teaching every component about the authors collection.
 */
export async function resolveAuthors(ids: readonly string[]): Promise<ResolvedAuthor[]> {
  const all = await getCollection("authors");
  const byId = new Map(all.map((a) => [a.id, a.data]));

  return ids.map((id) => {
    const data = byId.get(id);
    return {
      id,
      name: data?.name ?? id,
      avatar: data?.avatar || (data?.github ? `https://github.com/${data.github}.png` : ""),
    };
  });
}

/** Comma-separated author names, for bylines and feed metadata. */
export function authorNames(authors: readonly ResolvedAuthor[]): string {
  return authors.map((a) => a.name).join(", ");
}

/**
 * Resolves authors for a list of posts in one pass, keyed by post id. Listing
 * pages render inside a synchronous `.map()`, so they need this precomputed.
 */
export async function authorsByPost(
  posts: readonly { id: string; data: { authors: string[] } }[],
): Promise<Map<string, ResolvedAuthor[]>> {
  const all = await getCollection("authors");
  const byId = new Map(all.map((a) => [a.id, a.data]));

  const resolve = (id: string): ResolvedAuthor => {
    const data = byId.get(id);
    return {
      id,
      name: data?.name ?? id,
      avatar: data?.avatar || (data?.github ? `https://github.com/${data.github}.png` : ""),
    };
  };

  return new Map(posts.map((p) => [p.id, p.data.authors.map(resolve)]));
}
