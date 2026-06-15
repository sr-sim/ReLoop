import { useMemo, useState } from "react";
import { recyclableMaterials, dropOffLocations } from "../data/recyclingData";
import Card from "../components/Card";
import Button from "../components/Button";

// Fixed x/y positions for each location on the SVG map (out of 800×500 viewBox)
const locationCoords: Record<string, { x: number; y: number }> = {
  "loc-001": { x: 390, y: 130 }, // Central Library — centre-north
  "loc-002": { x: 620, y: 200 }, // Science Block — east
  "loc-003": { x: 200, y: 240 }, // Student Union — west-centre
  "loc-004": { x: 160, y: 390 }, // Residence Hall — south-west
  "loc-005": { x: 560, y: 390 }, // Sports Complex — south-east
};

const MATERIAL_TYPES = [
  "All",
  "Plastic",
  "Paper",
  "Glass",
  "Metal",
  "Electronics",
  "Organic",
] as const;

const typeColorMap: Record<string, string> = {
  Plastic: "bg-blue-100 text-blue-800",
  Paper: "bg-yellow-100 text-yellow-800",
  Glass: "bg-cyan-100 text-cyan-800",
  Metal: "bg-gray-200 text-gray-800",
  Electronics: "bg-purple-100 text-purple-800",
  Organic: "bg-green-100 text-green-800",
};

export default function RecyclingGuidePage() {
  const [activeType, setActiveType] = useState<string>("All");
  const [selectedPin, setSelectedPin] = useState<string | null>(null);
  const [guideOpen, setGuideOpen] = useState(false);

  const selectedLocation = dropOffLocations.find((l) => l.id === selectedPin) ?? null;

  const filteredMaterials = useMemo(() => {
    if (activeType === "All") return recyclableMaterials;
    return recyclableMaterials.filter((m) => m.type === activeType);
  }, [activeType]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-[#143D60] to-[#A0C878] text-white py-14 px-4 text-center">
        <p className="text-5xl mb-4" aria-hidden="true">♻️</p>
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">Recycling Guide</h1>
        <p className="text-gray-200 max-w-xl mx-auto text-base">
          Find drop-off locations across campus, then explore what each material type needs.
        </p>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-10 space-y-12">

        {/* ── 1. Campus Map (default / first) ── */}
        <section>
          <h2 className="text-2xl font-bold text-[#143D60] mb-1">Campus Drop-Off Map</h2>
          <p className="text-sm text-gray-500 mb-4">Click a pin to see location details.</p>

          <div className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-md bg-white">
            <svg
              viewBox="0 0 800 500"
              className="w-full"
              style={{ minHeight: 280 }}
              aria-label="Campus map showing recycling drop-off locations"
              role="img"
            >
              {/* Ground */}
              <rect width="800" height="500" fill="#e8f5e9" />

              {/* Roads */}
              <rect x="0" y="220" width="800" height="28" fill="#cfd8dc" />
              <rect x="350" y="0" width="28" height="500" fill="#cfd8dc" />
              <rect x="0" y="430" width="800" height="20" fill="#cfd8dc" rx="2" />
              <rect x="490" y="220" width="20" height="280" fill="#cfd8dc" />

              {/* Lawns */}
              <ellipse cx="275" cy="145" rx="80" ry="50" fill="#c8e6c9" opacity="0.7" />
              <ellipse cx="600" cy="320" rx="60" ry="40" fill="#c8e6c9" opacity="0.7" />
              <ellipse cx="400" cy="400" rx="50" ry="30" fill="#c8e6c9" opacity="0.6" />

              {/* Buildings */}
              <rect x="310" y="60" width="160" height="100" rx="6" fill="#B0BEC5" stroke="#78909C" strokeWidth="1.5" />
              <text x="390" y="105" textAnchor="middle" fontSize="11" fill="#37474F" fontWeight="600">Central Library</text>
              <text x="390" y="120" textAnchor="middle" fontSize="9" fill="#546E7A">Block A</text>

              <rect x="560" y="80" width="150" height="110" rx="6" fill="#B0BEC5" stroke="#78909C" strokeWidth="1.5" />
              <text x="635" y="130" textAnchor="middle" fontSize="11" fill="#37474F" fontWeight="600">Science &amp;</text>
              <text x="635" y="144" textAnchor="middle" fontSize="11" fill="#37474F" fontWeight="600">Engineering</text>

              <rect x="80" y="170" width="130" height="90" rx="6" fill="#B0BEC5" stroke="#78909C" strokeWidth="1.5" />
              <text x="145" y="210" textAnchor="middle" fontSize="11" fill="#37474F" fontWeight="600">Student</text>
              <text x="145" y="224" textAnchor="middle" fontSize="11" fill="#37474F" fontWeight="600">Union</text>

              <rect x="60" y="320" width="80" height="70" rx="6" fill="#B0BEC5" stroke="#78909C" strokeWidth="1.5" />
              <rect x="155" y="320" width="80" height="70" rx="6" fill="#B0BEC5" stroke="#78909C" strokeWidth="1.5" />
              <text x="147" y="362" textAnchor="middle" fontSize="10" fill="#37474F" fontWeight="600">Residences</text>
              <text x="147" y="374" textAnchor="middle" fontSize="9" fill="#546E7A">A · B · C</text>

              <rect x="510" y="310" width="140" height="100" rx="6" fill="#B0BEC5" stroke="#78909C" strokeWidth="1.5" />
              <rect x="520" y="318" width="120" height="84" rx="4" fill="#A5D6A7" opacity="0.5" />
              <text x="580" y="358" textAnchor="middle" fontSize="11" fill="#37474F" fontWeight="600">Sports</text>
              <text x="580" y="372" textAnchor="middle" fontSize="11" fill="#37474F" fontWeight="600">Complex</text>

              <rect x="390" y="280" width="90" height="65" rx="6" fill="#B0BEC5" stroke="#78909C" strokeWidth="1.5" />
              <text x="435" y="316" textAnchor="middle" fontSize="10" fill="#37474F" fontWeight="600">Admin</text>

              {/* Pins */}
              {dropOffLocations.map((loc) => {
                const pos = locationCoords[loc.id];
                if (!pos) return null;
                const isSelected = selectedPin === loc.id;
                return (
                  <g
                    key={loc.id}
                    transform={`translate(${pos.x}, ${pos.y})`}
                    onClick={() => setSelectedPin(isSelected ? null : loc.id)}
                    style={{ cursor: "pointer" }}
                    role="button"
                    aria-label={loc.name}
                    aria-pressed={isSelected}
                  >
                    <ellipse cx="0" cy="22" rx="7" ry="3" fill="rgba(0,0,0,0.18)" />
                    <path
                      d="M0,-24 C-10,-24 -16,-16 -16,-8 C-16,4 0,22 0,22 C0,22 16,4 16,-8 C16,-16 10,-24 0,-24 Z"
                      fill={isSelected ? "#143D60" : "#27667B"}
                      stroke="white"
                      strokeWidth="2"
                    />
                    <text y="-4" textAnchor="middle" fontSize="12" dominantBaseline="middle">
                      {loc.emoji}
                    </text>
                    {isSelected && (
                      <circle cx="0" cy="-8" r="20" fill="none" stroke="#143D60" strokeWidth="2" opacity="0.4" />
                    )}
                  </g>
                );
              })}

              {/* Legend */}
              <rect x="12" y="456" width="130" height="34" rx="6" fill="white" opacity="0.85" />
              <circle cx="26" cy="473" r="6" fill="#27667B" />
              <text x="37" y="477" fontSize="10" fill="#37474F">Recycling Drop-Off</text>
            </svg>

            {/* Pin popup */}
            {selectedLocation && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[min(340px,90%)] bg-white rounded-2xl shadow-xl border border-gray-100 p-4 z-10">
                <div className="flex items-start gap-3">
                  <span className="text-3xl leading-none">{selectedLocation.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[#143D60] text-sm leading-snug">{selectedLocation.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">📍 {selectedLocation.building}</p>
                    <p className="text-xs text-gray-500 mt-0.5">🕐 {selectedLocation.hours}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {selectedLocation.acceptedMaterials.map((mat) => (
                        <span
                          key={mat}
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                            typeColorMap[mat] ?? "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {mat}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedPin(null)}
                    className="text-gray-400 hover:text-gray-600 text-lg leading-none flex-shrink-0"
                    aria-label="Close popup"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ── 2. Drop-Off Location Cards ── */}
        <section>
          <h2 className="text-2xl font-bold text-[#143D60] mb-6">Drop-Off Locations</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {dropOffLocations.map((location) => (
              <Card
                key={location.id}
                hoverable
                onClick={() => setSelectedPin(location.id)}
              >
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl" aria-hidden="true">{location.emoji}</span>
                    <h3 className="text-base font-bold text-[#143D60] leading-snug">
                      {location.name}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">📍 {location.building}</p>
                  <p className="text-sm text-gray-500 mb-4">🕐 {location.hours}</p>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                      Accepts
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {location.acceptedMaterials.map((mat) => (
                        <span
                          key={mat}
                          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            typeColorMap[mat] ?? "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {mat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* ── 3. Recyclable Materials Guide (collapsible) ── */}
        <section>
          <button
            onClick={() => setGuideOpen((o) => !o)}
            className="w-full flex items-center justify-between bg-white rounded-2xl border border-gray-200 shadow-sm px-6 py-4 hover:bg-gray-50 transition-colors group"
            aria-expanded={guideOpen}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl" aria-hidden="true">📋</span>
              <div className="text-left">
                <p className="text-lg font-bold text-[#143D60]">Recyclable Materials Guide</p>
                <p className="text-sm text-gray-500">What to recycle, how to prepare it, and tips</p>
              </div>
            </div>
            <span
              className={`text-[#27667B] text-xl font-bold transition-transform duration-200 ${
                guideOpen ? "rotate-180" : "rotate-0"
              }`}
              aria-hidden="true"
            >
              ▾
            </span>
          </button>

          {guideOpen && (
            <div className="mt-4 space-y-4">
              {/* Material filter bar */}
              <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 flex flex-wrap gap-2 items-center">
                <span className="text-sm font-medium text-gray-500 mr-1">Filter:</span>
                {MATERIAL_TYPES.map((type) => (
                  <button
                    key={type}
                    onClick={() => setActiveType(type)}
                    className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                      activeType === type
                        ? "bg-[#27667B] text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              {/* Material cards */}
              {filteredMaterials.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
                  <p className="text-4xl mb-3" aria-hidden="true">🔍</p>
                  <p className="text-lg font-semibold text-gray-600 mb-4">
                    No materials found for "{activeType}"
                  </p>
                  <Button onClick={() => setActiveType("All")} variant="outline">
                    Show All Materials
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredMaterials.map((material) => (
                    <Card key={material.id} hoverable>
                      <div className="p-5">
                        <div className="text-4xl mb-3 text-center bg-gray-50 rounded-xl py-5">
                          {material.emoji}
                        </div>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold mb-3 ${
                            typeColorMap[material.type] ?? "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {material.type}
                        </span>
                        <h3 className="text-base font-bold text-[#143D60] mb-2">{material.name}</h3>
                        <p className="text-sm text-gray-600 mb-3 leading-relaxed">{material.description}</p>
                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                          Tips
                        </p>
                        <ul className="space-y-1">
                          {material.tips.map((tip, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-xs text-gray-600">
                              <span className="text-[#A0C878] mt-0.5" aria-hidden="true">✓</span>
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
