export interface ProductForm {
  occasions?: string[];
  age_brackets?: string[];
  time_of_year?: string[];
  recipient_type?: string;
  gender_targeting?: string[];
  primary_category?: string;
  shipping_regions?: string[];
  secondary_categories?: string[];
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  affiliate_url: string;
  category: string | null;
  price: number | null;
  currency: string | null;
  editors_choice: boolean | null;
  partners_offer: boolean | null;
  product_form: ProductForm | null;
  reviews: { good?: number; bad?: number; total?: number } | null;
  created_at: string;
  updated_at: string;
}

export interface PillarPage {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  meta_title: string | null;
  meta_description: string | null;
  hero_image_url: string | null;
  sort_order: number | null;
  updated_at: string;
}

export type BlogSection =
  | { type: "text"; heading?: string; content: { text?: string } | string }
  | { type: "image"; content: { url?: string; caption?: string } }
  | { type: "quote"; content: { text?: string; author?: string } | string }
  | {
      type: "gift_cards";
      heading?: string;
      content: {
        cards?: Array<{
          title?: string;
          image_url?: string;
          affiliate_url?: string;
          price?: string;
          description?: string;
        }>;
      };
    };

export interface Blog {
  id: string;
  slug: string;
  title: string;
  created_at: string;
  updated_at: string;
  featured: boolean;
  content: {
    excerpt?: string;
    hero_image?: string;
    meta_description?: string;
    sections?: BlogSection[];
    tags?: string[];
  };
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  featured_image_url: string | null;
  author: string | null;
  featured: boolean | null;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface Testimonial {
  id: string;
  author_name: string;
  title: string | null;
  body: string;
  rating: number | null;
  location: string | null;
}

/** What the gift finder collects. */
export interface FinderAnswers {
  recipientType: "human" | "pet";
  // people
  relation?: string;
  gender?: string;
  ageRange?: string;
  interests?: string[];
  // pets
  petType?: string;
  petAge?: string;
  // shared
  occasion?: string;
  budget?: string;
  region?: string;
  notes?: string;
}

export interface GiftPick {
  product: Product;
  reason: string;
  score: number;
}

export interface MatchResponse {
  headline: string;
  picks: GiftPick[];
  more: GiftPick[];
  aiUsed: boolean;
}
