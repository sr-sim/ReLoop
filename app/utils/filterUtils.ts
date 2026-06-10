import type { InspirationPost } from "../types";

/**
 * Filters an array of InspirationPost items by category.
 *
 * @param posts - The full array of posts (never mutated).
 * @param activeFilter - The category to filter by. Pass "All" to return all items.
 * @returns A new array containing only the matching posts, or all posts when activeFilter is "All".
 */
export function filterPosts(
  posts: InspirationPost[],
  activeFilter: string
): InspirationPost[] {
  if (activeFilter === "All") {
    return posts;
  }
  return posts.filter((post) => post.category === activeFilter);
}
