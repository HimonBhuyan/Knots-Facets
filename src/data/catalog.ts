import { Product, LookbookItem, CurrencyCode, CurrencyConfig } from '../types';

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  USD: { symbol: '$', rate: 1.0, label: 'USD ($)' },
  EUR: { symbol: '€', rate: 0.92, label: 'EUR (€)' },
  GBP: { symbol: '£', rate: 0.79, label: 'GBP (£)' },
  INR: { symbol: '₹', rate: 86.5, label: 'INR (₹)' }
};

export const CATALOG: Product[] = [
  {
    id: 'kf-earrings-01',
    title: 'Celestial Prismatic Drop Earrings',
    category: 'jewellery',
    categoryLabel: 'Glass & Crystal Jewellery',
    priceUSD: 48,
    image: '/images/earrings_crystal.jpg',
    galleryImages: [
      '/images/earrings_crystal.jpg',
      '/images/collection-jewellery.jpg',
      '/images/hero.jpg',
      '/images/packaging_gifting.jpg'
    ],
    badge: 'Bestseller',
    material: '14k Gold-Filled & Faceted Glass',
    description: 'Hand-faceted clear crystal drops suspended from delicate 14k gold-filled spiral wire. Catches soft sunlight to cast subtle rainbow refractions on your skin.',
    inStock: true,
    tags: ['earrings', 'crystal', 'gold', 'light']
  },
  {
    id: 'kf-bag-01',
    title: 'The Atelier Cotton Crochet Tote',
    category: 'crochet',
    categoryLabel: 'Crochet Accessories',
    priceUSD: 85,
    image: '/images/crochet_bag.jpg',
    galleryImages: [
      '/images/crochet_bag.jpg',
      '/images/collection-crochet.jpg',
      '/images/atelier_studio.jpg',
      '/images/packaging_gifting.jpg'
    ],
    badge: 'Artisan Special',
    material: 'Organic Combed Cotton & Bridle Leather',
    description: 'Slow-stitched textured bobble pattern crafted from 100% unbleached natural cotton. Sturdy vegetable-tanned leather straps fastened with solid brass studs.',
    inStock: true,
    tags: ['bag', 'tote', 'cotton', 'slow-fashion']
  },
  {
    id: 'kf-necklace-01',
    title: 'Solstice Faceted Crystal Pendant',
    category: 'jewellery',
    categoryLabel: 'Glass & Crystal Jewellery',
    priceUSD: 54,
    image: '/images/necklace_pendant.jpg',
    galleryImages: [
      '/images/necklace_pendant.jpg',
      '/images/card-jewellery.jpg',
      '/images/atelier_studio.jpg',
      '/images/packaging_gifting.jpg'
    ],
    badge: 'Limited Run',
    material: 'Faceted Glass Crystal & 18k Vermeil Chain',
    description: 'A geometric kite-cut glass crystal pendant that refracts natural light into luminous rainbow halos. Paired with a delicate 18-inch diamond-cut chain.',
    inStock: true,
    tags: ['necklace', 'pendant', 'crystal', 'rainbow']
  },
  {
    id: 'kf-crochet-set-01',
    title: 'Heritage Crochet Scrunchie & Bookmark Set',
    category: 'crochet',
    categoryLabel: 'Crochet Accessories',
    priceUSD: 36,
    image: '/images/crochet_accessories.jpg',
    galleryImages: [
      '/images/crochet_accessories.jpg',
      '/images/card-crochet.jpg',
      '/images/collection-crochet.jpg',
      '/images/packaging_gifting.jpg'
    ],
    badge: 'Gift Favorite',
    material: 'Fine Mercerised Cotton Yarn',
    description: 'Includes two ruffled botanical hair scrunchies and an intricate filigree lace bookmark finished with dual tassels and wooden bead detail.',
    inStock: true,
    tags: ['scrunchie', 'bookmark', 'accessories', 'gifting']
  },
  {
    id: 'kf-hero-set',
    title: 'Dawn Sunlight Glass Bead Collar',
    category: 'jewellery',
    categoryLabel: 'Glass & Crystal Jewellery',
    priceUSD: 72,
    image: '/images/card-jewellery.jpg',
    galleryImages: [
      '/images/card-jewellery.jpg',
      '/images/hero.jpg',
      '/images/collection-jewellery.jpg',
      '/images/packaging_gifting.jpg'
    ],
    badge: 'One-of-a-Kind',
    material: 'Blown Glass Beads & Freshwater Pearls',
    description: 'Translucent amber, smoky rose and opalescent glass beads woven with freshwater seed pearls on supple non-tarnish cord.',
    inStock: true,
    tags: ['necklace', 'collar', 'amber', 'pearls']
  },
  {
    id: 'kf-crochet-hair-02',
    title: 'Botanical Linen Lace Hair Ribbon',
    category: 'crochet',
    categoryLabel: 'Crochet Accessories',
    priceUSD: 28,
    image: '/images/card-crochet.jpg',
    galleryImages: [
      '/images/card-crochet.jpg',
      '/images/crochet_accessories.jpg',
      '/images/collection-crochet.jpg',
      '/images/packaging_gifting.jpg'
    ],
    badge: 'Handmade',
    material: 'Natural Flax Linen & Silk Thread',
    description: 'Delicately knotted hair wrap featuring miniature scalloped leaf edging. Designed for effortless braiding and everyday hair styling.',
    inStock: true,
    tags: ['hair', 'ribbon', 'lace', 'linen']
  },
  {
    id: 'kf-gift-box',
    title: 'The Atelier Curated Keepsake Box',
    category: 'gifting',
    categoryLabel: 'Bespoke Sets',
    priceUSD: 95,
    image: '/images/packaging_gifting.jpg',
    galleryImages: [
      '/images/packaging_gifting.jpg',
      '/images/atelier_studio.jpg',
      '/images/card-jewellery.jpg',
      '/images/card-crochet.jpg'
    ],
    badge: 'Signature Gift',
    material: 'Jewellery, Crochet & Wax-Sealed Note',
    description: 'A bespoke unboxing experience: raw amethyst pendant, handmade leaf bookmark, botanical lavender sprig, and personalized wax-sealed greeting card.',
    inStock: true,
    tags: ['gift', 'box', 'keepsake', 'custom']
  },
  {
    id: 'kf-collection-jewel',
    title: 'Prismatic Rain Glass Drop Suite',
    category: 'jewellery',
    categoryLabel: 'Glass & Crystal Jewellery',
    priceUSD: 68,
    image: '/images/collection-jewellery.jpg',
    galleryImages: [
      '/images/collection-jewellery.jpg',
      '/images/necklace_pendant.jpg',
      '/images/earrings_crystal.jpg',
      '/images/packaging_gifting.jpg'
    ],
    badge: 'Curated Suite',
    material: 'Hand-blown Venetian Glass & 925 Silver',
    description: 'A curated trio of earrings, ring, and layered glass droplet chains designed to catch moving light and reflections from every angle.',
    inStock: true,
    tags: ['suite', 'set', 'silver', 'glass']
  },
  {
    id: 'kf-collection-crochet',
    title: 'The Rituals Handwoven Coaster & Mat Set',
    category: 'crochet',
    categoryLabel: 'Crochet Accessories',
    priceUSD: 42,
    image: '/images/collection-crochet.jpg',
    galleryImages: [
      '/images/collection-crochet.jpg',
      '/images/crochet_bag.jpg',
      '/images/crochet_accessories.jpg',
      '/images/packaging_gifting.jpg'
    ],
    badge: 'Home & Dining',
    material: 'Chunky Twisted Hemp & Organic Cotton',
    description: 'Set of 4 heat-resistant tableware coasters with matching centre table mat. Earthy spiral ribbed stitches that insulate and soften tabletop sound.',
    inStock: true,
    tags: ['tableware', 'coasters', 'home', 'cotton']
  }
];

export const LOOKBOOK_ITEMS: LookbookItem[] = [
  {
    id: 'lb-1',
    title: 'Celestial Prismatic Drop',
    desc: '14k gold-filled wire wrapped around precision-cut glass drops on linen.',
    image: '/images/earrings_crystal.jpg',
    mood: 'crystal',
    moodLabel: 'Prismatic Sunlight'
  },
  {
    id: 'lb-2',
    title: 'The Atelier Cotton Tote',
    desc: 'Slow-stitched textured bobble pattern in unbleached cotton with bridle leather handles.',
    image: '/images/crochet_bag.jpg',
    mood: 'fibre',
    moodLabel: 'Fibre & Cotton'
  },
  {
    id: 'lb-3',
    title: 'Solstice Facet Pendant',
    desc: 'Geometric glass crystal pendant refracting soft rainbow spectrum on sand-toned silk.',
    image: '/images/necklace_pendant.jpg',
    mood: 'crystal',
    moodLabel: 'Prismatic Sunlight'
  },
  {
    id: 'lb-4',
    title: "The Maker's Workbench",
    desc: 'Spools of cotton thread, wood crochet hooks, crystal prisms, and design sketches.',
    image: '/images/atelier_studio.jpg',
    mood: 'atelier',
    moodLabel: 'Atelier & Craft'
  },
  {
    id: 'lb-5',
    title: 'Botanical Rituals & Accessories',
    desc: 'Floral crochet scrunchies, delicate lace bookmarks, and morning coffee coasters.',
    image: '/images/crochet_accessories.jpg',
    mood: 'fibre',
    moodLabel: 'Fibre & Cotton'
  },
  {
    id: 'lb-6',
    title: 'The Wax-Sealed Keepsake Box',
    desc: 'Artisanal gift box with raw crystal necklace, leaf bookmark, dried lavender, and wax stamp.',
    image: '/images/packaging_gifting.jpg',
    mood: 'gifting',
    moodLabel: 'Keepsake Unboxing'
  },
  {
    id: 'lb-7',
    title: 'Dawn Beads & Facets',
    desc: 'Glass and crystal necklaces capturing the morning horizon.',
    image: '/images/card-jewellery.jpg',
    mood: 'crystal',
    moodLabel: 'Prismatic Sunlight'
  },
  {
    id: 'lb-8',
    title: 'The Slow Stitch Craft',
    desc: 'Handcrafted crochet hair accessory with fine detailed stitches.',
    image: '/images/card-crochet.jpg',
    mood: 'fibre',
    moodLabel: 'Fibre & Cotton'
  },
  {
    id: 'lb-9',
    title: 'Prismatic Harmony Suite',
    desc: 'Glass and crystal earrings, necklaces and bracelets arranged on natural fabric.',
    image: '/images/collection-jewellery.jpg',
    mood: 'crystal',
    moodLabel: 'Prismatic Sunlight'
  },
  {
    id: 'lb-10',
    title: 'Natural Fibre Living',
    desc: 'Handmade bags, bookmarks and mats for slow living.',
    image: '/images/collection-crochet.jpg',
    mood: 'fibre',
    moodLabel: 'Fibre & Cotton'
  }
];
