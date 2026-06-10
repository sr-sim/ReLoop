// ─── Data Model Interfaces ────────────────────────────────────────────────────

export interface InspirationPost {
  id: string;
  title: string;
  description: string;
  category: "Reduce" | "Reuse" | "Recycle";
  author: string;
  imageEmoji: string;
  tags: string[];
  createdAt: string;
}

export interface GiveawayItem {
  id: string;
  itemName: string;
  description: string;
  condition: "New" | "Good" | "Fair";
  category: string;
  donorName: string;
  postedAt: string;
  emoji: string;
  isAvailable: boolean;
}

export interface RecyclableMaterial {
  id: string;
  name: string;
  type: "Plastic" | "Paper" | "Glass" | "Metal" | "Electronics" | "Organic";
  description: string;
  tips: string[];
  emoji: string;
}

export interface DropOffLocation {
  id: string;
  name: string;
  building: string;
  acceptedMaterials: string[];
  hours: string;
  emoji: string;
}

export interface CampaignPost {
  id: string;
  author: string;
  avatar: string;
  content: string;
  imageEmoji: string;
  hashtags: string[];
  likes: number;
  shares: number;
  postedAt: string;
}

// ─── UI State Types ────────────────────────────────────────────────────────────

export interface LikeState {
  [postId: string]: { liked: boolean; count: number };
}

// ─── Navigation ───────────────────────────────────────────────────────────────

export interface NavLink {
  label: string;
  path: string;
  icon?: string;
}

// ─── Component Props ──────────────────────────────────────────────────────────

export interface FilterBarProps {
  categories: string[];
  activeFilter: string;
  onFilterChange: (category: string) => void;
}

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  onClick?: () => void;
  disabled?: boolean;
  fullWidth?: boolean;
  type?: "button" | "submit";
  className?: string;
}

export type BadgeColor = "reduce" | "reuse" | "recycle" | "good" | "fair" | "new";

export interface BadgeProps {
  label: string;
  color: BadgeColor;
}
