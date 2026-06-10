import { useEffect, useState } from "react";
import { Link } from "react-router";

interface NavCardData {
  title: string;
  description: string;
  icon: string;
  path: string;
  gradient: string;
}

const NAV_CARDS: NavCardData[] = [
  {
    title: "Inspiration Hub",
    description: "Discover creative ideas to Reduce, Reuse, and Recycle in your daily campus life.",
    icon: "💡",
    path: "/inspiration",
    gradient: "from-yellow-100 to-[#DDEB9D]",
  },
  {
    title: "Giveaway Marketplace",
    description: "Give and receive items you no longer need — keep useful things out of the bin.",
    icon: "🎁",
    path: "/giveaway",
    gradient: "from-green-100 to-[#A0C878]",
  },
  {
    title: "Recycling Guide",
    description: "Learn what to recycle, how to sort it, and where to drop it off on campus.",
    icon: "♻️",
    path: "/recycling",
    gradient: "from-teal-100 to-[#27667B]/30",
  },
];

const STATS = [
  {
    value: "1/3",
    label: "of all food produced globally is wasted every year",
    emoji: "🍎",
  },
  {
    value: "300M",
    label: "tonnes of plastic waste generated globally each year",
    emoji: "🌊",
  },
  {
    value: "80%",
    label: "of items in landfills could have been recycled",
    emoji: "♻️",
  },
  {
    value: "SDG 12.5",
    label: "calls for substantially reducing waste generation by 2030",
    emoji: "🌍",
  },
];

export default function HomePage() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger entrance animation on mount after a brief delay
    const timer = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#143D60] via-[#27667B] to-[#143D60] text-white py-24 px-4">
        <div className="mx-auto max-w-4xl text-center">
          <div
            className={`transition-all duration-500 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <img
              src="/whatsapp-icon.jpeg"
              alt="WhatsApp icon"
              className="mx-auto mb-6 h-20 w-20 rounded-full border border-white/30 bg-white"
            />
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Reduce. Reuse. Recycle.
              <br />
              <span className="text-[#DDEB9D]">Start on Campus.</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-200 mb-10 max-w-2xl mx-auto leading-relaxed">
              ReLoop empowers university students to embrace sustainable habits aligned with
              UN SDG 12.5 — one small action at a time.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                to="/giveaway"
                className="rounded-xl bg-[#A0C878] text-[#143D60] px-8 py-3.5 font-semibold text-base hover:bg-[#8fb566] transition-colors shadow-lg"
              >
                🎁 Browse Giveaways
              </Link>
              <Link
                to="/recycling"
                className="rounded-xl bg-transparent border-2 border-[#DDEB9D] text-[#DDEB9D] px-8 py-3.5 font-semibold text-base hover:bg-[#DDEB9D]/10 transition-colors shadow-lg"
              >
                ♻️ Recycling Guide
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SDG 12.5 Stats */}
      <section className="bg-[#DDEB9D]/30 py-16 px-4">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-10">
            <span className="text-3xl" aria-hidden="true">🌍</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#143D60] mt-2 mb-2">
              Why It Matters: SDG 12.5
            </h2>
            <p className="text-[#27667B] text-base max-w-xl mx-auto">
              Responsible Consumption &amp; Production — the numbers tell the story.
            </p>
          </div>
          <div className="space-y-4 max-w-3xl mx-auto">
            {STATS.map((stat) => (
              <div
                key={stat.value}
                className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#DDEB9D] text-3xl">
                  {stat.emoji}
                </div>
                <div className="text-left">
                  <p className="text-3xl font-bold text-[#27667B]">{stat.value}</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Navigation Cards */}
      <section className="py-16 px-4 bg-white">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#143D60] mb-2">
              Explore ReLoop
            </h2>
            <p className="text-gray-600 text-base max-w-lg mx-auto">
              Four modules designed to make sustainable living easy and rewarding on campus.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {NAV_CARDS.map((card) => (
              <Link
                key={card.path}
                to={card.path}
                className={`group rounded-2xl bg-gradient-to-br ${card.gradient} p-6 shadow-md border border-white/50 hover:-translate-y-1 transition-transform duration-200 block`}
              >
                <p className="text-4xl mb-4" aria-hidden="true">{card.icon}</p>
                <h3 className="text-lg font-bold text-[#143D60] mb-2 group-hover:text-[#27667B] transition-colors">
                  {card.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">{card.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-[#27667B] py-14 px-4 text-center text-white">
        <p className="text-4xl mb-4" aria-hidden="true">🌱</p>
        <h2 className="text-2xl sm:text-3xl font-bold mb-3">
          Ready to make an impact?
        </h2>
        <p className="text-gray-200 mb-6 max-w-md mx-auto text-base">
          Join thousands of students already reducing their campus footprint.
        </p>
        <Link
          to="/inspiration"
          className="inline-block rounded-xl bg-[#DDEB9D] text-[#143D60] px-8 py-3 font-semibold hover:bg-[#c8d98a] transition-colors"
        >
          💡 Get Inspired
        </Link>
      </section>
    </div>
  );
}
