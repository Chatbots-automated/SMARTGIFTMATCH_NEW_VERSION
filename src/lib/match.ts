import type { FinderAnswers, GiftPick, Product } from "./types";
import { BUDGETS, INTERESTS } from "./options";
import { approval, isPetProduct } from "./product";

/**
 * Deterministic gift scoring. It is the whole engine when no AI key is set,
 * and the pre-filter that gives the AI a short, relevant candidate list when one is.
 */

const NEUTRAL_GENDERS = ["Any", "Unisex"];

function season(date = new Date()) {
  const m = date.getUTCMonth();
  return m < 2 || m === 11 ? "Winter" : m < 5 ? "Spring" : m < 8 ? "Summer" : "Autumn";
}

function textOf(p: Product) {
  const f = p.product_form;
  return [p.title, p.description, p.category, f?.primary_category, ...(f?.secondary_categories ?? [])]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function inBudget(p: Product, budget: string | undefined, slack = 0.15) {
  const b = BUDGETS.find((x) => x.value === budget);
  if (!b || b.value === "any" || p.price == null) return true;
  return p.price >= b.min * (1 - slack) && p.price <= b.max * (1 + slack);
}

function shipsTo(p: Product, region: string | undefined) {
  const regions = p.product_form?.shipping_regions;
  if (!region || !regions?.length) return true;
  return regions.includes(region) || regions.includes("Worldwide");
}

const SPECIES: Record<string, RegExp> = { Dog: /\b(dog|puppy|puppies|canine)s?\b/i, Cat: /\b(cat|kitten|feline)s?\b/i };

/** Don't show a dog bed to a cat owner, even when the catalogue data is loose. */
function rightSpecies(p: Product, a: FinderAnswers) {
  if (a.recipientType !== "pet" || !a.petType || !SPECIES[a.petType]) return true;
  const other = Object.entries(SPECIES).find(([k]) => k !== a.petType)?.[1];
  const title = p.title;
  return !(other?.test(title) && !SPECIES[a.petType].test(title));
}

interface Scored extends GiftPick {
  reasons: string[];
}

function score(p: Product, a: FinderAnswers): Scored {
  const f = p.product_form ?? {};
  const reasons: string[] = [];
  let s = 0;

  if (a.recipientType === "pet") {
    const targets = f.gender_targeting ?? [];
    if (a.petType && a.petType !== "Other" && targets.includes(a.petType)) {
      s += 4;
      reasons.push(`made for ${a.petType.toLowerCase()}s`);
    }
    if (a.petAge && f.age_brackets?.includes(a.petAge)) s += 2;
  } else {
    const genders = f.gender_targeting ?? [];
    if (a.gender && genders.includes(a.gender)) s += 2;
    else if (genders.some((g) => NEUTRAL_GENDERS.includes(g))) s += 1;

    if (a.ageRange && f.age_brackets?.includes(a.ageRange)) {
      s += 3;
      const young = ["Infant", "Child", "Teen"].includes(a.ageRange);
      reasons.push(young ? `just right for a ${a.ageRange === "Infant" ? "little one" : a.ageRange.toLowerCase()}` : `right for someone in their ${a.ageRange}`);
    }

    const text = textOf(p);
    for (const interest of a.interests ?? []) {
      const def = INTERESTS.find((i) => i.value === interest);
      if (def?.keywords.some((k) => text.includes(k))) {
        s += 3;
        reasons.push(`fits their love of ${interest.toLowerCase()}`);
      }
    }
  }

  if (a.occasion && f.occasions?.includes(a.occasion)) {
    s += 3;
    reasons.push(`a great ${a.occasion} pick`);
  }
  if (f.time_of_year?.includes(season())) s += 0.5;
  if (inBudget(p, a.budget, 0)) s += 2;
  if (p.editors_choice) s += 1;

  const ap = approval(p);
  if (ap != null) s += ap * Math.min(1, (p.reviews?.total ?? 0) / 5);

  return { product: p, score: s, reasons, reason: "" };
}

function fallbackReason(r: Scored) {
  if (r.reasons.length) {
    const [first, ...rest] = r.reasons;
    const sentence = rest.length ? `${first} and ${rest[0]}` : first;
    return sentence.charAt(0).toUpperCase() + sentence.slice(1) + ".";
  }
  if (r.product.editors_choice) return "One of our editors' favourite all-rounders.";
  return "A crowd-pleaser that works for almost anyone.";
}

export function rankGifts(products: Product[], a: FinderAnswers, exclude: string[] = []) {
  const wantPet = a.recipientType === "pet";
  const pool = products.filter((p) => isPetProduct(p) === wantPet && !exclude.includes(p.id) && rightSpecies(p, a));

  // Hard filters, relaxed step by step so the user never sees an empty page.
  const passes = [
    (p: Product) => inBudget(p, a.budget) && shipsTo(p, a.region),
    (p: Product) => inBudget(p, a.budget, 0.5) && shipsTo(p, a.region),
    (p: Product) => shipsTo(p, a.region),
    () => true,
  ];
  let candidates = pool;
  for (const pass of passes) {
    candidates = pool.filter(pass);
    if (candidates.length >= 3) break;
  }

  return candidates
    .map((p) => score(p, a))
    .sort((x, y) => y.score - x.score)
    .map((r) => ({ product: r.product, score: r.score, reason: fallbackReason(r) }));
}

export function describeAnswers(a: FinderAnswers) {
  if (a.recipientType === "pet") {
    return [
      a.petType && a.petType !== "Other" ? `a ${a.petType.toLowerCase()}` : "a pet",
      a.petAge && `age: ${a.petAge}`,
      a.occasion && `occasion: ${a.occasion}`,
    ].filter(Boolean).join(", ");
  }
  return [
    a.relation && `relationship: ${a.relation}`,
    a.gender && a.gender !== "Rather not say" && `gender: ${a.gender}`,
    a.ageRange && `age: ${a.ageRange}`,
    a.interests?.length && `interests: ${a.interests.join(", ")}`,
    a.occasion && `occasion: ${a.occasion}`,
  ].filter(Boolean).join("; ");
}

export function defaultHeadline(a: FinderAnswers) {
  if (a.recipientType === "pet") return `Treats for your ${a.petType && a.petType !== "Other" ? a.petType.toLowerCase() : "furry friend"}`;
  const who = a.relation && a.relation !== "Someone else" ? `your ${a.relation.toLowerCase()}` : "them";
  return a.occasion ? `${a.occasion} ideas for ${who}` : `Gift ideas for ${who}`;
}
