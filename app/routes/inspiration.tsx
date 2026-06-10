import { useMemo, useState } from "react";
import { inspirationPosts } from "../data/inspirationData";
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

  const filteredPosts = useMemo(
    () => filterPosts(inspirationPosts, activeFilter),
    [activeFilter]
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-[#143D60] to-[#27667B] text-white py-14 px-4 text-center">
        <p className="text-5xl mb-4" aria-hidden="true">💡</p>
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">Inspiration Hub</h1>
        <p className="text-gray-200 max-w-xl mx-auto text-base">
          Discover practical ideas shared by students and staff to Reduce, Reuse, and Recycle on campus.
        </p>
      </section>

      {/* Filter Bar */}
      <section className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="mx-auto max-w-6xl px-4 py-3 flex flex-wrap gap-2 items-center">
          <span className="text-sm font-medium text-gray-500 mr-2">Filter:</span>
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
      </section>

      {/* Content */}
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
    </div>
  );
}
