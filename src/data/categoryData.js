
// ---------------------------------------------------------------------------
// categoryData.js
// Single source of truth for every category listing page.
// CategoryPage.jsx reads one entry from this object based on the
// ":categorySlug" route param.
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Hero banners (two images per category)
// ---------------------------------------------------------------------------

const pantsHero1 =
  "https://d2u1z1lopyfwlx.cloudfront.net/thumbnails/fd837fd6-afc1-570e-9805-5899a1c0fdfa/242bd5d8-7b6d-5d2e-9327-917943122c7c.jpg";

const pantsHero2 =
  "https://d2u1z1lopyfwlx.cloudfront.net/thumbnails/ff2aaa6f-03b0-5b37-b514-0b5c89ac29ec/aec8f940-3469-5597-816f-0dd903b3407c.jpg";

const dressesHero1 =
  "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80";

const dressesHero2 =
  "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80";

const outerwearHero1 =
  "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=800&q=80";

const outerwearHero2 =
  "https://d2u1z1lopyfwlx.cloudfront.net/thumbnails/c28ed8ae-735e-54c6-9e46-33b6ac7f161f/4a008b94-2886-5364-b0da-7c4e8149a749.jpg";

const teesHero1 =
  "https://d2u1z1lopyfwlx.cloudfront.net/thumbnails/042e9b0f-ee98-55b1-98f2-dc8f3e5136b0/19fff8e5-c8d2-5bcc-b34c-43e2ef28b80a.jpg";

const teesHero2 =
  "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80";

const shortsSkirtsHero1 =
  "https://d2u1z1lopyfwlx.cloudfront.net/thumbnails/ec493b07-bfd0-52d9-847a-197517f3f481/78b7eb7a-896e-57ff-b047-c69590dd28e7.jpg";

const shortsSkirtsHero2 =
  "https://d2u1z1lopyfwlx.cloudfront.net/thumbnails/d0754420-dafa-5415-be21-ccff9c67590f/d3397088-bcb5-5c58-b781-68a24c096c6d.jpg";

// Hero images - Blouses & Tops
const blousesTopsHero1 =
  "https://fashionhot.club/uploads/posts/2023-05/1683075014_fashionhot-club-p-belie-bluzki-2024-30.jpg";
const blousesTopsHero2 =
  "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=800&q=80";

// ---------------------------------------------------------------------------
// Shared filter vocabulary
// ---------------------------------------------------------------------------

const PALETTE = [
  { name: "Black", hex: "#1A1A1A" },
  { name: "Olive", hex: "#6B7F68" },
  { name: "Cream", hex: "#E8E2D5" },
  { name: "Navy", hex: "#28344A" },
  { name: "Rust", hex: "#A85632" },
  { name: "Blush", hex: "#D9A79C" },
  { name: "Charcoal", hex: "#3F3F3F" },
];

const SORT_OPTIONS = [
  "Newest",
  "Price: Low to High",
  "Price: High to Low",
  "Best Selling",
];

const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "1X", "2X", "3X"];

const COLLECTION_OPTIONS = [
  "Everyday",
  "Occasion Wear",
  "Modiweek",
  "Sustainable Edit",
];

const FABRIC_OPTIONS = [
  "Cotton",
  "Linen",
  "Ponte",
  "Denim",
  "Silk Blend",
];

const DEFAULT_TAGS = ["Best Seller", "In Stock"];

const baseFilters = () => ({
  sortBy: SORT_OPTIONS,
  size: SIZE_OPTIONS,
  colors: PALETTE,
  collection: COLLECTION_OPTIONS,
  fabric: FABRIC_OPTIONS,
});

// ---------------------------------------------------------------------------
// Category entries
// ---------------------------------------------------------------------------

const categoryData = {
  // -------------------------------------------------------------------------
  // Pants
  // -------------------------------------------------------------------------

  pants: {
    slug: "pants",
    name: "Pants",
    breadcrumb: "Pants",

    heroImages: [
      {
        src: pantsHero1,
        alt: "Model wearing tailored olive trousers",
      },
      {
        src: pantsHero2,
        alt: "Model wearing wide leg trousers",
      },
    ],

    filters: baseFilters(),
    activeTags: DEFAULT_TAGS,
  },

  // -------------------------------------------------------------------------
  // Dresses & Jumpsuits
  // -------------------------------------------------------------------------

  "dresses-jumpsuits": {
    slug: "dresses-jumpsuits",
    name: "Dresses & Jumpsuits",
    breadcrumb: "Dresses & Jumpsuits",

    heroImages: [
      {
        src: dressesHero1,
        alt: "Model wearing an emerald wrap dress",
      },
      {
        src: dressesHero2,
        alt: "Model wearing a black shirt dress",
      },
    ],

    filters: baseFilters(),
    activeTags: DEFAULT_TAGS,
  },

  // -------------------------------------------------------------------------
  // Outerwear & Jackets
  // -------------------------------------------------------------------------

  "outerwear-jackets": {
    slug: "outerwear-jackets",
    name: "Outerwear & Jackets",
    breadcrumb: "Outerwear & Jackets",

    heroImages: [
      {
        src: outerwearHero1,
        alt: "Model wearing a wool blend coat",
      },
      {
        src: outerwearHero2,
        alt: "Model wearing a cropped denim jacket",
      },
    ],

    filters: baseFilters(),
    activeTags: DEFAULT_TAGS,
  },

  // -------------------------------------------------------------------------
  // Tees
  // -------------------------------------------------------------------------

  tees: {
    slug: "tees",
    name: "Tees",
    breadcrumb: "Tees",

    heroImages: [
      {
        src: teesHero1,
        alt: "Model wearing a white crewneck tee",
      },
      {
        src: teesHero2,
        alt: "Model wearing a ribbed tank",
      },
    ],

    filters: baseFilters(),
    activeTags: DEFAULT_TAGS,
  },

  // -------------------------------------------------------------------------
  // Shorts & Skirts
  // -------------------------------------------------------------------------

  "shorts-skirts": {
    slug: "shorts-skirts",
    name: "Shorts & Skirts",
    breadcrumb: "Shorts & Skirts",

    heroImages: [
      {
        src: shortsSkirtsHero1,
        alt: "Model wearing a pleated midi skirt",
      },
      {
        src: shortsSkirtsHero2,
        alt: "Model wearing tailored shorts",
      },
    ],

    filters: baseFilters(),
    activeTags: DEFAULT_TAGS,
  },

  // -------------------------------------------------------------------------
  // Blouses & Tops
  // -------------------------------------------------------------------------

  "blouses-tops": {
    slug: "blouses-tops",
    name: "Blouses & Tops",
    breadcrumb: "Blouses & Tops",

    heroImages: [
      {
        src: blousesTopsHero1,
        alt: "Woman wearing an elegant blouse",
      },
      {
        src: blousesTopsHero2,
        alt: "Woman wearing a stylish neutral top",
      },
    ],

    filters: baseFilters(),
    activeTags: DEFAULT_TAGS,
  },
};

export default categoryData;

