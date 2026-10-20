export const RELATIONS = [
  "Partner", "Parent", "Sibling", "Friend", "Child", "Grandparent",
  "Colleague", "Boss", "Date", "Flatmate", "Neighbour", "Someone else",
];

export const GENDERS = ["Male", "Female", "Non-binary", "Rather not say"];

export const AGE_RANGES = ["Infant", "Child", "Teen", "20s", "30s", "40s", "50s", "60+"];

export const INTERESTS: { value: string; emoji: string; keywords: string[] }[] = [
  { value: "Tech & gadgets", emoji: "🔌", keywords: ["tech", "electronic", "gadget", "smart", "wireless", "charger", "usb", "bluetooth", "technology"] },
  { value: "Gaming", emoji: "🎮", keywords: ["game", "gaming", "gamer", "console", "controller", "puzzle"] },
  { value: "Cooking & food", emoji: "🍳", keywords: ["cook", "kitchen", "chef", "food", "recipe", "knife", "bake", "coffee", "tea", "drink"] },
  { value: "Fitness & sport", emoji: "🏋️", keywords: ["fitness", "sport", "gym", "run", "yoga", "workout", "training", "bike"] },
  { value: "Outdoors & travel", emoji: "🏕️", keywords: ["outdoor", "travel", "camp", "hike", "adventure", "trip", "backpack"] },
  { value: "Art & crafts", emoji: "🎨", keywords: ["art", "craft", "paint", "draw", "creative", "diy", "kit"] },
  { value: "Books & learning", emoji: "📚", keywords: ["book", "read", "learn", "journal", "notebook", "educational"] },
  { value: "Music", emoji: "🎧", keywords: ["music", "speaker", "headphone", "audio", "sound", "vinyl", "instrument"] },
  { value: "Home & cosy", emoji: "🛋️", keywords: ["home", "decor", "candle", "blanket", "cosy", "cozy", "lamp", "garden", "plant"] },
  { value: "Beauty & self-care", emoji: "🧴", keywords: ["beauty", "skin", "care", "spa", "relax", "wellness", "massage", "health"] },
  { value: "Style & accessories", emoji: "⌚", keywords: ["fashion", "watch", "jewel", "wallet", "bag", "accessor", "leather", "style"] },
  { value: "Cars & DIY", emoji: "🔧", keywords: ["car", "tool", "auto", "garage", "mechanic", "repair", "tesla"] },
];

export const OCCASIONS = [
  "Birthday", "Christmas", "Anniversary", "Valentine's Day", "Mother's Day", "Father's Day",
  "Wedding", "Housewarming", "Graduation", "New Job / Promotion", "Retirement", "Thank You",
  "New Baby", "Get Well", "Just Because",
];

export const PET_TYPES = [
  { value: "Dog", emoji: "🐶" },
  { value: "Cat", emoji: "🐱" },
  { value: "Other", emoji: "🐾" },
];

export const PET_AGES = ["Baby / Kitten / Puppy", "Young Adult", "Adult", "Senior"];

export const PET_OCCASIONS = ["Pet Birthday", "Adoption Day", "New Pet Arrival", "Christmas", "Just Because"];

export const BUDGETS: { value: string; label: string; hint: string; min: number; max: number }[] = [
  { value: "under-25", label: "Under 25", hint: "Small & sweet", min: 0, max: 25 },
  { value: "25-50", label: "25 – 50", hint: "The sweet spot", min: 25, max: 50 },
  { value: "50-100", label: "50 – 100", hint: "Something special", min: 50, max: 100 },
  { value: "100-plus", label: "100+", hint: "Go all out", min: 100, max: Infinity },
  { value: "any", label: "No limit", hint: "Show me everything", min: 0, max: Infinity },
];

export const REGIONS = ["Europe", "UK", "USA", "Canada", "Australia / NZ", "Asia", "Other"];
