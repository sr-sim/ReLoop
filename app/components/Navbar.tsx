import { useState } from "react";
import { Link, useLocation } from "react-router";
import type { NavLink } from "../types";

const NAV_LINKS: NavLink[] = [
  { label: "Home", path: "/" },
  { label: "Inspiration", path: "/inspiration" },
  { label: "Giveaway", path: "/giveaway" },
  { label: "Recycling", path: "/recycling" },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-[#143D60] text-white shadow-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-tight">
            <span aria-hidden="true">♻️</span>
            <span>ReLoop</span>
          </Link>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={`flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive(link.path)
                      ? "bg-[#27667B] text-[#DDEB9D] underline"
                      : "text-gray-200 hover:bg-[#27667B]/60 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Hamburger */}
          <button
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="md:hidden rounded-md p-2 text-gray-200 hover:bg-[#27667B] transition-colors"
          >
            {isMenuOpen ? (
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-[#27667B] bg-[#143D60]">
          <ul className="flex flex-col py-2">
            {NAV_LINKS.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center px-4 py-3 text-sm font-medium transition-colors ${
                    isActive(link.path)
                      ? "bg-[#27667B] text-[#DDEB9D] underline"
                      : "text-gray-200 hover:bg-[#27667B]/60 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}
