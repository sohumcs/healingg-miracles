
export interface Product {
  id: string;
  name: string;
  category: 'bath' | 'gemstone' | 'tealight';
  description: string;
  shortDescription: string;
  price: number;
  image: string;
  featured: boolean;
  benefits: string[];
  ingredients?: string[];
  size?: string;
  color?: string;
  stock: number;
  rating: number;
  reviews: number;
}

export const products: Product[] = [
  {
    id: "bath-salt-lavender-1",
    name: "Calming Lavender Bath Salt",
    category: "bath",
    description: "Our Calming Lavender Bath Salt is a rejuvenating blend of pure Himalayan salt infused with organic lavender essential oil. This luxurious bath salt helps to relieve stress, promote relaxation, and soothe tired muscles while nourishing your skin with rich minerals. For the ultimate self-care experience, dissolve a generous handful in warm bath water and immerse yourself in tranquility.",
    shortDescription: "Organic lavender-infused Himalayan salt for deep relaxation",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1614806687902-ag416800791a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8YmF0aCUyMHNhbHR8ZW58MHx8MHx8fDA%3D",
    featured: true,
    benefits: ["Stress relief", "Muscle relaxation", "Skin nourishment", "Improved sleep quality"],
    ingredients: ["Himalayan Pink Salt", "Organic Lavender Essential Oil", "Dead Sea Minerals", "Dried Lavender Buds"],
    size: "16 oz / 450g jar",
    stock: 35,
    rating: 4.8,
    reviews: 124
  },
  {
    id: "gemstone-amethyst-1",
    name: "Amethyst Healing Crystal",
    category: "gemstone",
    description: "Our premium Amethyst crystal is thoughtfully sourced and carefully selected for its vibrant purple hue and natural energy. Known as a powerful protective stone, Amethyst helps purify the mind and clear negative thoughts. Place in your home for balanced energy or carry with you for continuous protection and mindfulness throughout your day.",
    shortDescription: "Premium grade amethyst for protection and spiritual awareness",
    price: 32.50,
    image: "https://images.unsplash.com/photo-1596554847864-e4e334678bd1?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    featured: true,
    benefits: ["Enhances intuition", "Reduces anxiety", "Balances energies", "Promotes calm"],
    size: "Medium (1.5-2 inches)",
    color: "Deep purple",
    stock: 18,
    rating: 4.9,
    reviews: 87
  },
  {
    id: "tealight-ceramic-1",
    name: "Serenity Ceramic Tealight Holder",
    category: "tealight",
    description: "Handcrafted by artisan potters, our Serenity Ceramic Tealight Holder features an intricate sacred geometry pattern that creates mesmerizing light patterns when lit. Each piece is unique with subtle variations in the glaze, making it not just a holder but a piece of functional art. The holder accommodates any standard tealight candle and provides a perfect focal point for meditation or a stunning accent to any room.",
    shortDescription: "Artisan-crafted ceramic holder with sacred geometry patterns",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1602523961358-f9f03dd557db?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    featured: true,
    benefits: ["Ambient lighting", "Meditation focus", "Home decoration", "Energy centering"],
    size: "3.5\" diameter x 2.5\" height",
    color: "Moonstone white with blue accents",
    stock: 22,
    rating: 4.7,
    reviews: 59
  },
  {
    id: "bath-salt-rose-1",
    name: "Rose Quartz Bath Salt",
    category: "bath",
    description: "Indulge in the divine essence of love with our Rose Quartz Bath Salt. This luxurious blend combines premium Dead Sea salt with crushed rose quartz crystal infused with Bulgarian rose essential oil. The delicate pink hue and subtle floral scent transform your bath into a sanctuary of self-love and nurturing energy.",
    shortDescription: "Rose-infused bath salt with actual crushed rose quartz",
    price: 27.99,
    image: "https://images.unsplash.com/photo-1571926422302-d82809d6f383?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YmF0aCUyMHNhbHR8ZW58MHx8MHx8fDA%3D",
    featured: false,
    benefits: ["Heart chakra opening", "Self-love promotion", "Skin softening", "Emotional balance"],
    ingredients: ["Dead Sea Salt", "Crushed Rose Quartz", "Bulgarian Rose Essential Oil", "Pink Himalayan Salt"],
    size: "16 oz / 450g jar",
    stock: 28,
    rating: 4.6,
    reviews: 93
  },
  {
    id: "gemstone-clear-quartz-1",
    name: "Clear Quartz Point",
    category: "gemstone",
    description: "Our Clear Quartz Points are premium grade, hand-selected for clarity and perfect structure. Known as the 'master healer', clear quartz amplifies energy and thought, as well as the effect of other crystals. It absorbs, stores, releases, and regulates energy. This versatile stone brings clarity of mind and helps with concentration and memory retention.",
    shortDescription: "Premium clear quartz crystal point for energy amplification",
    price: 18.75,
    image: "https://images.unsplash.com/photo-1591977363863-33a5c31d5bd3?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    featured: false,
    benefits: ["Energy amplification", "Mental clarity", "Spiritual growth", "Healing enhancement"],
    size: "Medium (2-3 inches)",
    color: "Clear/Transparent",
    stock: 25,
    rating: 4.8,
    reviews: 68
  },
  {
    id: "tealight-crystal-1",
    name: "Crystal Prism Tealight Holder",
    category: "tealight",
    description: "Our Crystal Prism Tealight Holder captures and refracts light in spectacular rainbow patterns across your space. Crafted from premium optical crystal glass, this contemporary holder transforms any standard tealight into a mesmerizing light display. The geometric prism design adds modern elegance to any room while creating an atmosphere of enchantment and wonder.",
    shortDescription: "Optical crystal tealight holder that creates rainbow light patterns",
    price: 34.50,
    image: "https://images.unsplash.com/photo-1631567473314-e0b5702f422f?q=80&w=1372&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    featured: false,
    benefits: ["Light refraction", "Mood enhancement", "Energy cleansing", "Home decoration"],
    size: "3\" x 3\" x 3\"",
    color: "Clear crystal",
    stock: 15,
    rating: 4.9,
    reviews: 42
  },
  {
    id: "bath-salt-eucalyptus-1",
    name: "Eucalyptus Mint Detox Bath Salt",
    category: "bath",
    description: "Revitalize your body and clear your mind with our Eucalyptus Mint Detox Bath Salt. This powerful blend combines purifying sea salts with invigorating eucalyptus and refreshing mint essential oils. Perfect for clearing respiratory passages and reinvigorating tired muscles after exercise. The natural detoxifying properties help draw impurities from the body while the uplifting aroma clears mental fog.",
    shortDescription: "Refreshing eucalyptus and mint bath salt for purification",
    price: 23.99,
    image: "https://images.unsplash.com/photo-1624454002302-36cd5a809ebf?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmF0aCUyMHNhbHR8ZW58MHx8MHx8fDA%3D",
    featured: false,
    benefits: ["Respiratory clearing", "Mental refreshment", "Toxin removal", "Muscle recovery"],
    ingredients: ["Sea Salt", "Epsom Salt", "Eucalyptus Essential Oil", "Peppermint Essential Oil"],
    size: "16 oz / 450g jar",
    stock: 32,
    rating: 4.7,
    reviews: 76
  },
  {
    id: "gemstone-rose-quartz-1",
    name: "Rose Quartz Heart",
    category: "gemstone",
    description: "This beautifully carved Rose Quartz Heart symbolizes love in its purest form. Rose Quartz, the stone of universal love, restores trust and harmony in relationships, encouraging unconditional love and deep inner healing. Each heart is hand-polished to a smooth finish, making it perfect for holding during meditation or placing in your home to promote an atmosphere of compassion and peace.",
    shortDescription: "Polished rose quartz heart crystal for love and compassion",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1617692855027-33b14f061079?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    featured: false,
    benefits: ["Love attraction", "Emotional healing", "Self-forgiveness", "Heart chakra activation"],
    size: "2\" x 2\"",
    color: "Soft pink",
    stock: 20,
    rating: 4.8,
    reviews: 112
  },
  {
    id: "tealight-himalayan-1",
    name: "Himalayan Salt Tealight Holder",
    category: "tealight",
    description: "Our Himalayan Salt Tealight Holder is hand-carved from pure Himalayan salt crystal, formed over 250 million years ago. When lit, it emits a warm amber glow and releases negative ions that purify the air. Each piece is unique with natural variations in color and pattern. Beyond its beauty, this holder provides the healing benefits of salt therapy, creating a purified and calming atmosphere.",
    shortDescription: "Natural Himalayan salt candle holder for air purification",
    price: 21.99,
    image: "https://images.unsplash.com/photo-1548925081-d5087ef8f683?q=80&w=1376&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    featured: false,
    benefits: ["Air purification", "Negative ion production", "Stress reduction", "Ambient lighting"],
    size: "3\" diameter x 2.5\" height",
    color: "Pink/Orange (natural salt color)",
    stock: 30,
    rating: 4.6,
    reviews: 89
  },
  {
    id: "bath-salt-detox-1",
    name: "Deep Sea Detox Bath Salt",
    category: "bath",
    description: "Our Deep Sea Detox Bath Salt harnesses the purifying powers of activated charcoal and mineral-rich sea salts to draw out impurities and rejuvenate your skin. This therapeutic blend is enhanced with detoxifying essential oils that stimulate circulation and promote cellular renewal. Perfect for a weekly detox ritual or after exposure to environmental stressors.",
    shortDescription: "Activated charcoal and sea salt blend for deep detoxification",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1613089547037-1a7a63246e78?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGJhdGglMjBzYWx0fGVufDB8fDB8fHww",
    featured: false,
    benefits: ["Deep detoxification", "Skin purification", "Circulation enhancement", "Environmental protection"],
    ingredients: ["Dead Sea Salt", "Activated Charcoal", "Juniper Berry Oil", "Cypress Essential Oil"],
    size: "16 oz / 450g jar",
    stock: 25,
    rating: 4.7,
    reviews: 63
  },
  {
    id: "gemstone-selenite-1",
    name: "Selenite Cleansing Wand",
    category: "gemstone",
    description: "Our Selenite Cleansing Wand is a powerful tool for energy purification. Selenite, named after the Greek goddess of the moon, has one of the finest vibrations among crystals. It quickly unblocks stagnant energy, cleanses negative influences, and creates a serene environment. This wand can be used to cleanse other crystals, clear spaces of negative energy, or as a meditation tool for accessing higher consciousness.",
    shortDescription: "Pure selenite crystal wand for energy cleansing and purification",
    price: 19.99,
    image: "https://images.unsplash.com/photo-1634228554296-31077b8134d1?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    featured: false,
    benefits: ["Energy cleansing", "Crystal purification", "Space clearing", "Higher consciousness connection"],
    size: "6-7 inches",
    color: "White/Clear",
    stock: 22,
    rating: 4.9,
    reviews: 53
  },
  {
    id: "tealight-geode-1",
    name: "Agate Geode Tealight Holder",
    category: "tealight",
    description: "Our Agate Geode Tealight Holder showcases nature's artistry with stunning crystal formations in vibrant colors. Each piece is a unique natural geode slice, polished on one side and raw on the other, creating a fascinating contrast of textures. The natural cavity perfectly holds a standard tealight candle, illuminating the crystal structures and creating a magical atmosphere. Every holder comes with a non-scratch protective base to safeguard your surfaces.",
    shortDescription: "Natural agate geode slice with crystal formation for tealight candles",
    price: 42.50,
    image: "https://images.unsplash.com/photo-1530968033775-2c92736b131e?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    featured: false,
    benefits: ["Natural art display", "Energy stabilization", "Unique lighting effect", "Grounding energy"],
    size: "3-4\" diameter",
    color: "Varies (purple, blue, natural tones)",
    stock: 15,
    rating: 4.8,
    reviews: 47
  }
];

export const categories = [
  {
    id: "bath",
    name: "Bath Salts",
    description: "Luxurious mineral bath salts for relaxation and rejuvenation"
  },
  {
    id: "gemstone",
    name: "Gemstones",
    description: "Healing crystals and gemstones for energy and balance"
  },
  {
    id: "tealight",
    name: "Tealight Holders",
    description: "Beautiful holders for ambient lighting and meditation"
  }
];
