import type { CampaignPost, LikeState } from "../types";

/**
 * Builds the initial LikeState from an array of CampaignPosts.
 * Every entry is initialized with liked: false and count taken from post.likes.
 * If duplicate IDs exist, last-write-wins.
 *
 * @param posts - Array of CampaignPost items.
 * @returns A LikeState map keyed by post.id.
 */
export function initLikeState(posts: CampaignPost[]): LikeState {
  const state: LikeState = {};
  for (const post of posts) {
    state[post.id] = { liked: false, count: post.likes };
  }
  return state;
}

/**
 * Immutably toggles the liked status of a post and adjusts its count by ±1.
 * If postId is not found in likeState, returns the original state unchanged.
 * Count is clamped to a minimum of 0.
 *
 * @param likeState - Current LikeState map.
 * @param postId - The ID of the post to toggle.
 * @returns A new LikeState object with the post's liked/count updated.
 */
export function toggleLike(likeState: LikeState, postId: string): LikeState {
  if (!(postId in likeState)) {
    return likeState;
  }
  const current = likeState[postId];
  const newLiked = !current.liked;
  const newCount = newLiked
    ? current.count + 1
    : Math.max(0, current.count - 1);
  return {
    ...likeState,
    [postId]: { liked: newLiked, count: newCount },
  };
}
