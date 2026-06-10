import { useState } from "react";
import { campaignPosts } from "../data/campaignData";
import { initLikeState, toggleLike } from "../utils/likeUtils";
import Card from "../components/Card";
import type { LikeState } from "../types";

function initShareCounts(posts: typeof campaignPosts): Record<string, number> {
  const map: Record<string, number> = {};
  for (const post of posts) {
    map[post.id] = post.shares;
  }
  return map;
}

export default function AwarenessCampaignPage() {
  const [likeState, setLikeState] = useState<LikeState>(() =>
    initLikeState(campaignPosts)
  );
  const [shareCounts, setShareCounts] = useState<Record<string, number>>(() =>
    initShareCounts(campaignPosts)
  );
  const [likeAnimating, setLikeAnimating] = useState<Record<string, boolean>>({});
  const [clipboardModal, setClipboardModal] = useState<{
    visible: boolean;
    text: string;
  }>({ visible: false, text: "" });

  const handleLike = (id: string) => {
    setLikeState((prev) => toggleLike(prev, id));
    setLikeAnimating((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setLikeAnimating((prev) => ({ ...prev, [id]: false }));
    }, 300);
  };

  const handleShare = async (id: string, hashtags: string[]) => {
    const text = hashtags.join(" ");
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(text);
        setShareCounts((prev) => ({ ...prev, [id]: prev[id] + 1 }));
      } catch {
        setClipboardModal({ visible: true, text });
      }
    } else {
      setClipboardModal({ visible: true, text });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-[#143D60] to-[#27667B] text-white py-14 px-4 text-center">
        <p className="text-5xl mb-4" aria-hidden="true">📣</p>
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">Awareness Campaign Feed</h1>
        <p className="text-gray-200 max-w-xl mx-auto text-base">
          Join the conversation. Like and share sustainability posts from students and organisations.
        </p>
      </section>

      {/* Posts Grid */}
      <section className="mx-auto max-w-5xl px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaignPosts.map((post) => {
            const ls = likeState[post.id];
            const isLiked = ls?.liked ?? false;
            const likeCount = ls?.count ?? post.likes;
            const shareCount = shareCounts[post.id] ?? post.shares;
            const animating = likeAnimating[post.id] ?? false;

            return (
              <Card key={post.id} className="flex flex-col">
                <div className="p-5 flex flex-col flex-1">
                  {/* Author */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl" aria-hidden="true">{post.avatar}</span>
                    <div>
                      <p className="text-sm font-semibold text-[#143D60]">{post.author}</p>
                      <p className="text-xs text-gray-400">{post.postedAt}</p>
                    </div>
                  </div>

                  {/* Image Emoji */}
                  <div className="text-6xl text-center bg-gradient-to-br from-[#DDEB9D]/40 to-[#A0C878]/20 rounded-xl py-8 mb-4">
                    {post.imageEmoji}
                  </div>

                  {/* Content */}
                  <p className="text-sm text-gray-700 leading-relaxed mb-4 flex-1">
                    {post.content}
                  </p>

                  {/* Hashtags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {post.hashtags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs font-medium text-[#27667B] bg-[#27667B]/10 rounded-full px-2 py-0.5"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-4 border-t border-gray-100 pt-4">
                    <button
                      onClick={() => handleLike(post.id)}
                      aria-label={isLiked ? "Unlike post" : "Like post"}
                      className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                        isLiked ? "text-rose-500" : "text-gray-500 hover:text-rose-400"
                      }`}
                    >
                      <span
                        className={`text-lg transition-transform duration-300 ${
                          animating ? "scale-125" : "scale-100"
                        }`}
                        aria-hidden="true"
                      >
                        {isLiked ? "❤️" : "🤍"}
                      </span>
                      {likeCount}
                    </button>

                    <button
                      onClick={() => handleShare(post.id, post.hashtags)}
                      aria-label="Share post hashtags"
                      className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-[#27667B] transition-colors ml-auto"
                    >
                      <span aria-hidden="true">🔗</span>
                      {shareCount}
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Clipboard Fallback Modal */}
      {clipboardModal.visible && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          role="dialog"
          aria-modal="true"
          aria-label="Copy hashtags"
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6">
            <h2 className="text-lg font-bold text-[#143D60] mb-2">Copy Hashtags</h2>
            <p className="text-sm text-gray-500 mb-4">
              Your browser doesn't support automatic copying. Copy the text below manually:
            </p>
            <div className="bg-gray-100 rounded-lg p-3 text-sm font-mono text-gray-700 break-all mb-4 select-all">
              {clipboardModal.text}
            </div>
            <button
              onClick={() => setClipboardModal({ visible: false, text: "" })}
              className="w-full rounded-lg bg-[#27667B] text-white py-2 font-medium hover:bg-[#1e5265] transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
