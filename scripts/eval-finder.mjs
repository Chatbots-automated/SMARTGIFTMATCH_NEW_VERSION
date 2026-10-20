// Runs realistic shoppers through the gift finder and prints what they'd see.
// Usage: node scripts/eval-finder.mjs [baseUrl]     (server must be running)
const base = process.argv[2] || "http://localhost:3000";

const personas = [
  { name: "Dad, 50s, watches & style, Father's Day", answers: { recipientType: "human", relation: "Parent", gender: "Male", ageRange: "50s", interests: ["Style & accessories"], occasion: "Father's Day", budget: "50-100" } },
  { name: "Girlfriend, 20s, self-care, Valentine's", answers: { recipientType: "human", relation: "Partner", gender: "Female", ageRange: "20s", interests: ["Beauty & self-care"], occasion: "Valentine's Day", budget: "25-50" } },
  { name: "Colleague, 30s, small budget, thank you", answers: { recipientType: "human", relation: "Colleague", ageRange: "30s", occasion: "Thank You", budget: "under-25" } },
  { name: "Kid, child, gaming, birthday", answers: { recipientType: "human", relation: "Child", ageRange: "Child", interests: ["Gaming"], occasion: "Birthday", budget: "25-50" } },
  { name: "Teen, tech, Christmas", answers: { recipientType: "human", relation: "Sibling", ageRange: "Teen", interests: ["Tech & gadgets", "Gaming"], occasion: "Christmas", budget: "50-100" } },
  { name: "Friend with notes (coffee + always cold)", answers: { recipientType: "human", relation: "Friend", ageRange: "30s", occasion: "Birthday", budget: "any", notes: "obsessed with coffee, always cold, works from home" } },
  { name: "Cat, adult, under 25", answers: { recipientType: "pet", petType: "Cat", petAge: "Adult", occasion: "Just Because", budget: "under-25" } },
  { name: "Dog, puppy, new pet", answers: { recipientType: "pet", petType: "Dog", petAge: "Baby / Kitten / Puppy", occasion: "New Pet Arrival", budget: "any" } },
  { name: "Boss, 40s, retirement, premium", answers: { recipientType: "human", relation: "Boss", ageRange: "60+", occasion: "Retirement", budget: "100-plus" } },
];

for (const p of personas) {
  const t = Date.now();
  const res = await fetch(`${base}/api/match`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ answers: p.answers }) });
  const d = await res.json();
  console.log(`\n■ ${p.name}  [${d.aiUsed ? "AI" : "scoring"} · ${Date.now() - t}ms]\n  "${d.headline}"`);
  for (const pick of d.picks ?? []) console.log(`  - ${pick.product.title.trim()} (${pick.product.price} ${pick.product.currency})\n      ${pick.reason}`);
}
