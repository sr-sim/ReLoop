import { Link } from "react-router";

const QUICK_LINKS = [
  { label: "Home", path: "/" },
  { label: "Inspiration Hub", path: "/inspiration" },
  { label: "Giveaway Marketplace", path: "/giveaway" },
  { label: "Recycling Guide", path: "/recycling" },
];

export default function Footer() {
  return (
    <footer className="bg-[#143D60] text-gray-200 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand & SDG */}
          <div>
            <div className="flex items-center gap-2 text-xl font-bold text-white mb-2">
              <span aria-hidden="true">♻️</span>
              <span>ReLoop</span>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">
              Empowering university students to embrace the 3R principles — Reduce, Reuse, Recycle.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#DDEB9D] mb-3">
              Quick Links
            </h3>
            <ul className="space-y-1.5">
              {QUICK_LINKS.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-300 hover:text-[#A0C878] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* SDG Badge */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#DDEB9D] mb-3">
              Our Commitment
            </h3>
            <div className="flex items-start gap-3">
              <span className="text-3xl" aria-hidden="true">🌍</span>
              <div>
                <p className="text-sm font-semibold text-white">SDG 12.5</p>
                <p className="text-xs text-gray-300 mt-0.5">
                  Responsible Consumption &amp; Production — substantially reduce waste generation by 2030.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-[#27667B] pt-6 text-center text-xs text-gray-400">
          &copy; {new Date().getFullYear()} ReLoop Campus Platform. Built for a sustainable future.
        </div>
      </div>
    </footer>
  );
}
