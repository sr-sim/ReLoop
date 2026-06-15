import { useMemo, useState } from "react";
import { inspirationPosts as initialPosts } from "../data/inspirationData";
import { filterPosts } from "../utils/filterUtils";
import Card from "../components/Card";
import Badge from "../components/Badge";
import Button from "../components/Button";
import type { BadgeColor } from "../types";

const FILTER_OPTIONS = ["All", "Reduce", "Reuse", "Recycle"] as const;

function categoryToBadgeColor(category: string): BadgeColor {
  const map: Record<string, BadgeColor> = {
    Reduce: "reduce",
    Reuse: "reuse",
    Recycle: "recycle",
  };
  return map[category] ?? "recycle";
}

export default function InspirationHubPage() {
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [tabView, setTabView] = useState<"browse" | "activity">("browse");
  const [myPostIds, setMyPostIds] = useState<Set<string>>(new Set());

  const [posts, setPosts] = useState(initialPosts);
  const [showForm, setShowForm] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const filteredPosts = useMemo(
    () => filterPosts(posts, activeFilter),
    [activeFilter, posts]
  );

  const EMPTY_FORM = { title: "", description: "", category: "Reuse", author: "", imageEmoji: "💡", tags: "" };
  const [form, setForm] = useState(EMPTY_FORM);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = "Title is required.";
    if (!form.description.trim()) e.description = "Description is required.";
    if (!form.author.trim()) e.author = "Your name is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const newPost = {
      id: `ip-${Date.now()}`,
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category,
      author: form.author.trim(),
      imageEmoji: form.imageEmoji || "💡",
      tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      createdAt: new Date().toISOString().split("T")[0],
    };
    setPosts((p) => [newPost, ...p]);
    setMyPostIds((s) => new Set([...Array.from(s), newPost.id]));
    setForm(EMPTY_FORM);
    setErrors({});
    setShowForm(false);
    setSuccessMsg(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-[#143D60] to-[#A0C878] text-white py-14 px-4 text-center">
        <p className="text-5xl mb-4" aria-hidden="true">💡</p>
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">Inspiration Hub</h1>
        <p className="text-gray-200 max-w-xl mx-auto text-base">
          Discover practical ideas shared by students and staff to Reduce, Reuse, and Recycle on campus.
        </p>
        <button
          onClick={() => setShowForm(true)}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white text-[#143D60] font-semibold px-6 py-3 hover:bg-[#DDEB9D] transition-colors shadow"
        >
          + Share an Idea
        </button>
      </section>

      {/* Top-level tab switcher + Filter Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="mx-auto max-w-6xl px-4 py-2 flex items-center gap-3">
          <button
            onClick={() => setTabView("browse")}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors ${tabView === "browse" ? "bg-[#143D60] text-white" : "text-gray-500 hover:bg-gray-100"}`}
          >
            Browse Ideas
          </button>
          <button
            onClick={() => setTabView("activity")}
            className={`relative px-5 py-2 rounded-lg text-sm font-semibold transition-colors ${tabView === "activity" ? "bg-[#143D60] text-white" : "text-gray-500 hover:bg-gray-100"}`}
          >
            My Activity
            {myPostIds.size > 0 && (
              <span className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#A0C878] text-[#143D60] text-[10px] font-bold">
                {myPostIds.size}
              </span>
            )}
          </button>

          <div className="ml-auto flex items-center gap-3">
            <span className="text-sm font-medium text-gray-500 mr-2 hidden sm:inline">Filter:</span>
            <div className="flex flex-wrap gap-2 items-center">
              {FILTER_OPTIONS.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                    activeFilter === filter
                      ? "bg-[#27667B] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Success toast */}
      {successMsg && (
        <div role="status" className="mx-auto max-w-6xl px-4 mt-4">
          <div className="flex items-center gap-3 bg-[#DDEB9D]/20 border border-[#A0C878] text-[#143D60] rounded-xl px-4 py-3 text-sm font-medium">
            <span aria-hidden="true">✅</span>
            <div className="flex-1">Your idea has been shared — thanks for contributing! View it in <button onClick={() => setTabView("activity")} className="underline font-semibold">My Activity</button>.</div>
            <button aria-label="Dismiss" onClick={() => setSuccessMsg(false)} className="text-gray-500 hover:text-gray-700 ml-3">×</button>
          </div>
        </div>
      )}

      {/* Content */}
      {/* Browse view */}
      {tabView === "browse" && (
        <section className="mx-auto max-w-6xl px-4 py-10">
          {filteredPosts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4" aria-hidden="true">🌱</p>
            <p className="text-xl font-semibold text-gray-600 mb-2">
              No posts yet in this category
            </p>
            <p className="text-gray-400 mb-6">Try a different filter or clear to see all posts.</p>
            <Button onClick={() => setActiveFilter("All")} variant="outline">
              Clear Filter
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <Card key={post.id} hoverable>
                <div className="p-5">
                  {/* Emoji image */}
                  <div className="text-5xl mb-4 text-center bg-gray-50 rounded-xl py-6">
                    {post.imageEmoji}
                  </div>

                  {/* Category badge */}
                  <div className="mb-2">
                    <Badge label={post.category} color={categoryToBadgeColor(post.category)} />
                  </div>

                  {/* Title */}
                  <h2 className="text-lg font-bold text-[#143D60] mb-2 leading-snug">
                    {post.title}
                  </h2>

                  {/* Description */}
                  <p className="text-sm text-gray-600 leading-relaxed mb-4">
                    {post.description}
                  </p>

                  {/* Author */}
                  <p className="text-xs text-gray-400 mb-3">
                    By <span className="font-medium text-gray-500">{post.author}</span> · {post.createdAt}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-[#DDEB9D]/60 text-[#143D60] rounded-full px-2.5 py-0.5 text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
        </section>
      )}

      {/* My Activity view */}
      {tabView === "activity" && (
        <section className="mx-auto max-w-6xl px-4 py-8">
          <div className="text-sm text-gray-600 mb-6">Ideas you shared in this session appear here.</div>
          {myPostIds.size === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
              <p className="text-5xl mb-4" aria-hidden="true">📤</p>
              <p className="text-lg font-semibold text-gray-600 mb-2">No ideas shared yet</p>
              <p className="text-gray-400 mb-6 text-sm">Share an idea to see it listed here.</p>
              <Button onClick={() => setShowForm(true)} variant="primary">+ Share an Idea</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.filter((p) => myPostIds.has(p.id)).map((post) => (
                <Card key={post.id} hoverable>
                  <div className="p-5">
                    <div className="text-5xl mb-4 text-center bg-gray-50 rounded-xl py-6">{post.imageEmoji}</div>
                    <div className="mb-2">
                      <Badge label={post.category} color={categoryToBadgeColor(post.category)} />
                    </div>
                    <h2 className="text-lg font-bold text-[#143D60] mb-2 leading-snug">{post.title}</h2>
                    <p className="text-sm text-gray-600 leading-relaxed mb-4">{post.description}</p>
                    <p className="text-xs text-gray-400 mb-3">By <span className="font-medium text-gray-500">{post.author}</span> · {post.createdAt}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {post.tags.map((tag) => (
                        <span key={tag} className="bg-[#DDEB9D]/60 text-[#143D60] rounded-full px-2.5 py-0.5 text-xs font-medium">{tag}</span>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Share Idea Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-8 overflow-y-auto" role="dialog" aria-modal="true" aria-label="Share an idea">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg my-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-[#143D60]">Share an Idea</h2>
              <button onClick={() => { setShowForm(false); setErrors({}); setForm(EMPTY_FORM); }} className="text-gray-400 hover:text-gray-600 text-2xl leading-none" aria-label="Close form">×</button>
            </div>
            <form onSubmit={handleSubmit} noValidate className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#143D60] mb-1">Title <span className="text-red-400">*</span></label>
                <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} type="text" placeholder="Short, descriptive title"
                  className={`w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#27667B] ${errors.title ? "border-red-400" : "border-gray-300"}`} />
                {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#143D60] mb-1">Description <span className="text-red-400">*</span></label>
                <textarea rows={4} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Explain your idea..."
                  className={`w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#27667B] resize-none ${errors.description ? "border-red-400" : "border-gray-300"}`} />
                {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#143D60] mb-1">Category</label>
                  <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#27667B] bg-white">
                    {FILTER_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#143D60] mb-1">Your Name <span className="text-red-400">*</span></label>
                  <input value={form.author} onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))} type="text" placeholder="e.g. Alex Tan"
                    className={`w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#27667B] ${errors.author ? "border-red-400" : "border-gray-300"}`} />
                  {errors.author && <p className="mt-1 text-xs text-red-500">{errors.author}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#143D60] mb-1">Emoji (optional)</label>
                <input value={form.imageEmoji} onChange={(e) => setForm((f) => ({ ...f, imageEmoji: e.target.value }))} type="text" placeholder="e.g. 🪴"
                  className={`w-24 rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#27667B] border-gray-300`} />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#143D60] mb-1">Tags (comma separated)</label>
                <input value={form.tags} onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))} type="text" placeholder="e.g. DIY, Plants"
                  className={`w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#27667B] border-gray-300`} />
              </div>

              <div className="flex gap-3 pt-1">
                <Button type="button" variant="outline" fullWidth onClick={() => { setShowForm(false); setErrors({}); setForm(EMPTY_FORM); }}>Cancel</Button>
                <Button type="submit" variant="primary" fullWidth>Share Idea</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
