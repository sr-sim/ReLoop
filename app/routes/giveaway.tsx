import { useMemo, useState } from "react";
import { giveawayItems as initialItems } from "../data/giveawayData";
import Card from "../components/Card";
import Badge from "../components/Badge";
import Button from "../components/Button";
import type { BadgeColor, GiveawayItem } from "../types";

function conditionToColor(condition: string): BadgeColor {
  const map: Record<string, BadgeColor> = { New: "new", Good: "good", Fair: "fair" };
  return map[condition] ?? "good";
}

const CATEGORY_OPTIONS = ["Books", "Electronics", "Stationery", "Furniture", "Clothing", "Sports", "Other"];
const CONDITION_OPTIONS = ["New", "Good", "Fair"] as const;
const EMOJI_MAP: Record<string, string> = {
  Books: "📚", Electronics: "💻", Stationery: "✏️",
  Furniture: "🪑", Clothing: "👕", Sports: "⚽", Other: "📦",
};

interface FormState {
  itemName: string;
  description: string;
  condition: "New" | "Good" | "Fair";
  category: string;
  donorName: string;
}
const EMPTY_FORM: FormState = { itemName: "", description: "", condition: "Good", category: "Books", donorName: "" };

type TabView = "browse" | "activity";
type ActivityTab = "donated" | "requested";

export default function GiveawayMarketplacePage() {
  const [items, setItems] = useState<GiveawayItem[]>(initialItems);
  const [requestedIds, setRequestedIds] = useState<Set<string>>(new Set());
  // Track donated item IDs (added in this session)
  const [donatedIds, setDonatedIds] = useState<Set<string>>(new Set());
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [tabView, setTabView] = useState<TabView>("browse");
  const [activityTab, setActivityTab] = useState<ActivityTab>("donated");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [successMsg, setSuccessMsg] = useState(false);
  const [requestedItem, setRequestedItem] = useState<string | null>(null);
  // Contact / chat demo state
  const [contactOpen, setContactOpen] = useState(false);
  const [contactFor, setContactFor] = useState<{
    itemId: string;
    name: string;
    email: string;
    phone: string;
    role: "donor" | "requester";
  } | null>(null);
  type Message = { from: "me" | "them"; text: string; time: string };
  const [threads, setThreads] = useState<Record<string, Message[]>>({});
  const [msgInput, setMsgInput] = useState("");

  const allCategories = useMemo(
    () => ["All", ...Array.from(new Set(items.map((i) => i.category))).sort()],
    [items]
  );

  const filteredItems = useMemo(() => {
    if (activeCategory === "All") return items;
    return items.filter((item) => item.category === activeCategory);
  }, [activeCategory, items]);

  const donatedItems = useMemo(
    () => items.filter((i) => donatedIds.has(i.id)),
    [items, donatedIds]
  );

  const requestedItems = useMemo(
    () => items.filter((i) => requestedIds.has(i.id)),
    [items, requestedIds]
  );

  const handleRequest = (id: string) => {
    const item = items.find((i) => i.id === id);
    setRequestedIds((prev) => new Set([...prev, id]));
    if (item) {
      setRequestedItem(item.itemName);
    }
  };

  function openContact(itemId: string, person: { itemId: string; name: string; email: string; phone: string; role: "donor" | "requester" }) {
    setContactFor(person);
    setContactOpen(true);
    // seed a demo thread if missing
    setThreads((t) => {
      if (t[itemId]) return t;
      const seed: Message[] = [
        { from: "them", text: `Hi — I'm ${person.name}. Happy to coordinate pickup for this item.`, time: "Just now" },
      ];
      return { ...t, [itemId]: seed };
    });
  }

  function sendMessage() {
    if (!contactFor || !msgInput.trim()) return;
    const itemId = contactFor.itemId;
    const text = msgInput.trim();
    const now = new Date().toLocaleTimeString();
    setThreads((t) => ({ ...t, [itemId]: [...(t[itemId] || []), { from: "me", text, time: now }] }));
    setMsgInput("");
    // demo auto-reply
    setTimeout(() => {
      setThreads((t) => ({ ...t, [itemId]: [...(t[itemId] || []), { from: "them", text: "Thanks — I'll confirm a pickup time shortly.", time: new Date().toLocaleTimeString() }] }));
    }, 800);
  }

  const validate = (): boolean => {
    const e: Partial<FormState> = {};
    if (!form.itemName.trim()) e.itemName = "Item name is required.";
    if (!form.description.trim()) e.description = "Description is required.";
    if (!form.donorName.trim()) e.donorName = "Your name is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const newId = `gw-${Date.now()}`;
    const newItem: GiveawayItem = {
      id: newId,
      itemName: form.itemName.trim(),
      description: form.description.trim(),
      condition: form.condition,
      category: form.category,
      donorName: form.donorName.trim(),
      postedAt: new Date().toISOString().split("T")[0],
      emoji: EMOJI_MAP[form.category] ?? "📦",
      isAvailable: true,
    };
    setItems((prev) => [newItem, ...prev]);
    setDonatedIds((prev) => new Set([...prev, newId]));
    setForm(EMPTY_FORM);
    setErrors({});
    setShowForm(false);
    setSuccessMsg(true);
  };

  const field = (label: string, name: keyof FormState, element: React.ReactNode) => (
    <div>
      <label className="block text-sm font-medium text-[#143D60] mb-1">
        {label} <span className="text-red-400">*</span>
      </label>
      {element}
      {errors[name] && <p className="mt-1 text-xs text-red-500">{errors[name]}</p>}
    </div>
  );

  // ── Reusable item card ──
  const ItemCard = ({ item, showRequestBtn = true }: { item: GiveawayItem; showRequestBtn?: boolean }) => {
    const isRequested = requestedIds.has(item.id);
    const isDonated = donatedIds.has(item.id);
    const isDisabled = isRequested || !item.isAvailable;
    return (
      <Card hoverable={!isDisabled}>
        <div className="p-5">
          <div className="text-5xl mb-4 text-center bg-gray-50 rounded-xl py-6">{item.emoji}</div>
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge label={item.condition} color={conditionToColor(item.condition)} />
            <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
              {item.category}
            </span>
            {isDonated && (
              <span className="inline-flex items-center rounded-full bg-[#DDEB9D] px-2.5 py-0.5 text-xs font-semibold text-[#143D60]">
                Your Listing
              </span>
            )}
          </div>
          <h2 className="text-base font-bold text-[#143D60] mb-1 leading-snug">{item.itemName}</h2>
          <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-3">{item.description}</p>
          <p className="text-xs text-gray-400 mb-4">
            Donated by <span className="font-medium text-gray-500">{item.donorName}</span> · {item.postedAt}
          </p>
          {showRequestBtn && (
            <Button
              fullWidth
              variant={isDisabled ? "secondary" : "primary"}
              disabled={isDisabled || isDonated}
              onClick={() => handleRequest(item.id)}
            >
              {isRequested ? "Requested ✓" : !item.isAvailable ? "Unavailable" : isDonated ? "Your Item" : "Request Item"}
            </Button>
          )}
          {!showRequestBtn && isRequested && (
            <div className="text-center text-sm text-[#27667B] font-semibold bg-[#27667B]/10 rounded-lg py-2">
              Requested ✓
            </div>
          )}
        </div>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-[#143D60] to-[#A0C878] text-white py-14 px-4 text-center">
        <p className="text-5xl mb-4" aria-hidden="true">🎁</p>
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">Giveaway Marketplace</h1>
        <p className="text-gray-100 max-w-xl mx-auto text-base">
          Give items a second life. Browse what students are offering and request what you need.
        </p>
        <button
          onClick={() => setShowForm(true)}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white text-[#143D60] font-semibold px-6 py-3 hover:bg-[#DDEB9D] transition-colors shadow"
        >
          + Donate an Item
        </button>
      </section>

      {/* Success toast */}
      {successMsg && (
        <div role="status" className="mx-auto max-w-6xl px-4 mt-4">
          <div className="flex items-center gap-3 bg-[#A0C878]/20 border border-[#A0C878] text-[#143D60] rounded-xl px-4 py-3 text-sm font-medium">
            <span aria-hidden="true">✅</span>
            <div className="flex-1">Your item has been listed — thanks for contributing! View it in <button onClick={() => { setTabView("activity"); setActivityTab("donated"); }} className="underline font-semibold">My Activity</button>.</div>
            <button aria-label="Dismiss" onClick={() => setSuccessMsg(false)} className="text-gray-500 hover:text-gray-700 ml-3">×</button>
          </div>
        </div>
      )}

      {/* Donate Item Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-8 overflow-y-auto" role="dialog" aria-modal="true" aria-label="Donate an item">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg my-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-[#143D60]">Donate an Item</h2>
              <button onClick={() => { setShowForm(false); setErrors({}); setForm(EMPTY_FORM); }} className="text-gray-400 hover:text-gray-600 text-2xl leading-none" aria-label="Close form">×</button>
            </div>
            <form onSubmit={handleSubmit} noValidate className="px-6 py-5 space-y-4">
              {field("Item Name", "itemName",
                <input type="text" value={form.itemName} onChange={(e) => setForm((f) => ({ ...f, itemName: e.target.value }))} placeholder="e.g. Engineering Textbook Year 2"
                  className={`w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#27667B] ${errors.itemName ? "border-red-400" : "border-gray-300"}`} />
              )}
              {field("Description", "description",
                <textarea rows={3} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Briefly describe the item..."
                  className={`w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#27667B] resize-none ${errors.description ? "border-red-400" : "border-gray-300"}`} />
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#143D60] mb-1">Category</label>
                  <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#27667B] bg-white">
                    {CATEGORY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#143D60] mb-1">Condition</label>
                  <select value={form.condition} onChange={(e) => setForm((f) => ({ ...f, condition: e.target.value as "New" | "Good" | "Fair" }))} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#27667B] bg-white">
                    {CONDITION_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              {field("Your Name", "donorName",
                <input type="text" value={form.donorName} onChange={(e) => setForm((f) => ({ ...f, donorName: e.target.value }))} placeholder="e.g. Sarah Lim"
                  className={`w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#27667B] ${errors.donorName ? "border-red-400" : "border-gray-300"}`} />
              )}
              <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
                <span aria-hidden="true">{EMOJI_MAP[form.category] ?? "📦"}</span>
                <span>Will be listed under</span>
                <span className="font-semibold text-[#143D60]">{form.category}</span>
                <span>·</span>
                <Badge label={form.condition} color={conditionToColor(form.condition)} />
              </div>
              <div className="flex gap-3 pt-1">
                <Button type="button" variant="outline" fullWidth onClick={() => { setShowForm(false); setErrors({}); setForm(EMPTY_FORM); }}>Cancel</Button>
                <Button type="submit" variant="primary" fullWidth>List Item</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Request success popup */}
      {requestedItem && (
        <div role="dialog" aria-modal="true" aria-label="Request successful" className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/40" onClick={() => setRequestedItem(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8 text-center animate-[fadeInScale_0.2s_ease-out]" onClick={(e) => e.stopPropagation()}>
            <div className="w-16 h-16 bg-[#A0C878]/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl" aria-hidden="true">✅</span>
            </div>
            <h2 className="text-xl font-bold text-[#143D60] mb-2">Request Sent!</h2>
            <p className="text-gray-500 text-sm mb-1">You have successfully requested:</p>
            <p className="text-[#27667B] font-semibold text-base mb-5 leading-snug">{requestedItem}</p>
            <p className="text-xs text-gray-400 mb-6">The donor will be notified. Please collect the item at the agreed location.</p>
            <button onClick={() => setRequestedItem(null)} className="w-full rounded-xl bg-[#27667B] text-white py-2.5 font-medium hover:bg-[#1e5265] transition-colors">Done</button>
          </div>
        </div>
      )}

      {/* Contact / Chat Modal (demo) */}
      {contactOpen && contactFor && (
        <div className="fixed inset-0 z-60 flex items-center justify-center px-4 bg-black/40" role="dialog" aria-modal="true" aria-label="Contact">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md my-auto overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
              <div>
                <div className="text-sm font-semibold text-[#143D60]">Contact: {contactFor.name}</div>
                <div className="text-xs text-gray-500">{contactFor.email} · {contactFor.phone}</div>
              </div>
              <button onClick={() => setContactOpen(false)} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
            </div>
            <div className="px-4 py-3 max-h-80 overflow-y-auto space-y-3 bg-gray-50">
              {(threads[contactFor.itemId] || []).map((m, i) => (
                <div key={i} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
                  <div className={`${m.from === "me" ? "bg-[#27667B] text-white" : "bg-white text-gray-800"} rounded-lg px-3 py-2 shadow-sm max-w-[80%]`}>{m.text}<div className="text-[10px] opacity-60 mt-1 text-right">{m.time}</div></div>
                </div>
              ))}
            </div>
            <div className="px-4 py-3 border-t border-gray-100 bg-white flex gap-2">
              <input value={msgInput} onChange={(e) => setMsgInput(e.target.value)} placeholder="Write a message..." className="flex-1 rounded-lg border px-3 py-2 text-sm outline-none" />
              <button onClick={sendMessage} className="rounded-lg bg-[#143D60] text-white px-4 py-2 text-sm">Send</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Top-level tab switcher ── */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="mx-auto max-w-6xl px-4 flex items-center gap-1 py-2">
          <button
            onClick={() => setTabView("browse")}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors ${tabView === "browse" ? "bg-[#143D60] text-white" : "text-gray-500 hover:bg-gray-100"}`}
          >
            Browse Items
          </button>
          <button
            onClick={() => setTabView("activity")}
            className={`relative px-5 py-2 rounded-lg text-sm font-semibold transition-colors ${tabView === "activity" ? "bg-[#143D60] text-white" : "text-gray-500 hover:bg-gray-100"}`}
          >
            My Activity
            {(donatedIds.size > 0 || requestedIds.size > 0) && (
              <span className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#A0C878] text-[#143D60] text-[10px] font-bold">
                {donatedIds.size + requestedIds.size}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ── Browse view ── */}
      {tabView === "browse" && (
        <>
          {/* Category filter */}
          <div className="bg-white border-b border-gray-100">
            <div className="mx-auto max-w-6xl px-4 py-2.5 flex flex-wrap gap-2 items-center">
              <span className="text-sm font-medium text-gray-500 mr-1">Category:</span>
              {allCategories.map((cat) => (
                <button key={cat} onClick={() => setActiveCategory(cat)}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${activeCategory === cat ? "bg-[#A0C878] text-[#143D60]" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <section className="mx-auto max-w-6xl px-4 py-10">
            {filteredItems.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-5xl mb-4" aria-hidden="true">📭</p>
                <p className="text-xl font-semibold text-gray-600 mb-2">No items in this category</p>
                <p className="text-gray-400 mb-6">Try a different category or browse all items.</p>
                <Button onClick={() => setActiveCategory("All")} variant="outline">Show All Items</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item) => <ItemCard key={item.id} item={item} />)}
              </div>
            )}
          </section>
        </>
      )}

      {/* ── My Activity view ── */}
      {tabView === "activity" && (
        <section className="mx-auto max-w-6xl px-4 py-8">
          {/* Activity sub-tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActivityTab("donated")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border transition-colors ${
                activityTab === "donated"
                  ? "bg-[#DDEB9D] text-[#143D60] border-[#A0C878]"
                  : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
              }`}
            >
              <span aria-hidden="true">📤</span>
              Items I Donated
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#143D60]/10 text-[#143D60] text-xs font-bold">
                {donatedItems.length}
              </span>
            </button>
            <button
              onClick={() => setActivityTab("requested")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border transition-colors ${
                activityTab === "requested"
                  ? "bg-[#27667B]/10 text-[#143D60] border-[#27667B]/30"
                  : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
              }`}
            >
              <span aria-hidden="true">📥</span>
              Items I Requested
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#143D60]/10 text-[#143D60] text-xs font-bold">
                {requestedItems.length}
              </span>
            </button>
          </div>

          {/* Donated tab */}
          {activityTab === "donated" && (
            donatedItems.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
                <p className="text-5xl mb-4" aria-hidden="true">📤</p>
                <p className="text-lg font-semibold text-gray-600 mb-2">No donations yet</p>
                <p className="text-gray-400 mb-6 text-sm">Items you donate will appear here.</p>
                <Button onClick={() => setShowForm(true)} variant="primary">+ Donate an Item</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {donatedItems.map((item) => (
                  <div key={item.id}>
                    <ItemCard item={item} showRequestBtn={false} />
                    {/* If someone requested this item, show demo requester(s) and contact button */}
                    {Array.from(requestedIds).includes(item.id) && (
                      <div className="mt-3 px-4">
                        <div className="text-sm text-gray-600 mb-2">Requests for this item</div>
                        {/* Dummy requester list (one or two entries) */}
                        {[{ name: "Alex Lim", email: "alex.lim@example.edu", phone: "555-0110" }, { name: "Maya Chen", email: "maya.chen@example.edu", phone: "555-0123" }].map((r, idx) => (
                          <div key={idx} className="flex items-center justify-between gap-3 mb-2 bg-white border rounded-lg px-3 py-2">
                            <div>
                              <div className="text-sm font-medium text-gray-700">{r.name}</div>
                              <div className="text-xs text-gray-500">{r.email}</div>
                            </div>
                            <div className="flex gap-2">
                              <button onClick={() => openContact(item.id, { itemId: item.id, name: r.name, email: r.email, phone: r.phone, role: "requester" })} className="rounded-lg bg-[#27667B] text-white px-3 py-1 text-sm">Contact</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )
          )}

          {/* Requested tab */}
          {activityTab === "requested" && (
            requestedItems.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
                <p className="text-5xl mb-4" aria-hidden="true">📥</p>
                <p className="text-lg font-semibold text-gray-600 mb-2">No requests yet</p>
                <p className="text-gray-400 mb-6 text-sm">Items you request will appear here.</p>
                <Button onClick={() => setTabView("browse")} variant="primary">Browse Items</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {requestedItems.map((item) => (
                  <div key={item.id}>
                    <ItemCard item={item} showRequestBtn={false} />
                    <div className="mt-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            const donor = item.donorName || "Donor";
                            const email = `${donor.toLowerCase().replace(/\s+/g, "")}@example.edu`;
                            const phone = "555-0102";
                            openContact(item.id, { itemId: item.id, name: donor, email, phone, role: "donor" });
                          }}
                          className="rounded-lg bg-[#27667B] text-white px-3 py-1 text-sm"
                        >
                          Chat with donor
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </section>
      )}
    </div>
  );
}
