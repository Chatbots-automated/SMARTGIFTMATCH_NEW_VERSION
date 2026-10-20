export const SITE = {
  name: "SmartGiftMatch",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://smartgiftmatch.com").replace(/\/$/, ""),
  tagline: "Gifts that feel like you really know them",
  description:
    "Answer a few quick questions and SmartGiftMatch finds thoughtful, hand-picked gift ideas for anyone — partners, parents, friends, kids and even pets.",
  email: "support@smartgiftmatch.com",
};

export const absoluteUrl = (path = "/") => `${SITE.url}${path.startsWith("/") ? path : `/${path}`}`;
