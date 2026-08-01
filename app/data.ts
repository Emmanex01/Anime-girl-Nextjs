import { Product, Collection, CommunityPost } from './types';

// src/data/initialProducts.ts

export interface LegacyProductInput {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  reviewCount: number;
  image: string;
  label?: 'NEW' | 'TRENDING' | 'LIMITED' | 'SALE';
  originalPrice?: number;
  tags?: string[];
  description?: string;
}

export const initialProductsData: LegacyProductInput[] = [
  {
    id: '1',
    name: 'Gojo Satoru Figure',
    category: 'Jujutsu Kaisen',
    price: 45000,
    rating: 4.9,
    reviewCount: 42,
    image: 'https://images.unsplash.com/photo-1608889476561-6242afdbf622?q=80&w=1000&auto=format&fit=crop',
    label: 'LIMITED',
    tags: ['LIMITED', 'Figure', 'Jujutsu Kaisen', 'Preorder'],
    description: 'Highly detailed 1/7 scale figure of Satoru Gojo activating his Domain Expansion: Infinite Void. Crafted with translucent material to replicate curse energy effects.'
  },
  {
    id: '2',
    name: 'Akatsuki Cloud Hoodie',
    category: 'Naruto',
    price: 28000,
    rating: 4.7,
    reviewCount: 128,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1000&auto=format&fit=crop',
    label: 'TRENDING',
    tags: ['TRENDING', 'Apparel', 'Hoodie', 'Naruto'],
    description: 'Premium heavyweight cotton hoodie featuring the embroidered iconic red Akatsuki cloud. Styled for comfort and durable streetwear aesthetic.'
  },
  {
    id: '3',
    name: 'Demon Slayer Tanjiro Haori',
    category: 'Demon Slayer',
    price: 24000,
    rating: 4.6,
    reviewCount: 56,
    image: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?q=80&w=1000&auto=format&fit=crop',
    label: 'NEW',
    tags: ['NEW', 'Apparel', 'Haori', 'Demon Slayer'],
    description: 'Authentic green-and-black checkered haori robe as worn by Tanjiro Kamado. Light, breathable, and suitable for both casual wear and conventions.'
  },
  {
    id: '4',
    name: 'Shinigami Notebook Replica',
    category: 'Death Note',
    price: 15000,
    rating: 4.8,
    reviewCount: 84,
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1000&auto=format&fit=crop',
    label: 'SALE',
    originalPrice: 18000,
    tags: ['SALE', 'Replica', 'Notebook', 'Death Note'],
    description: 'High-quality leather-bound notebook replica with silver foil stamping, containing the rules of the Death Note on the inside cover.'
  },
  {
    id: '5',
    name: 'Lunar Rod Wand Replica',
    category: 'Sailor Moon',
    price: 32000,
    rating: 4.5,
    reviewCount: 31,
    image: 'https://images.unsplash.com/photo-1594744803329-e58b31de215f?q=80&w=1000&auto=format&fit=crop',
    tags: ['Replica', 'Prop', 'Sailor Moon'],
    description: 'Replica prop wand from the timeless magical girl classic, featuring dynamic LED light integration and original sound effect chips.'
  },
  {
    id: '6',
    name: 'Roronoa Zoro Katana Set',
    category: 'One Piece',
    price: 65000,
    rating: 4.9,
    reviewCount: 67,
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1000&auto=format&fit=crop',
    label: 'LIMITED',
    tags: ['LIMITED', 'Replica', 'Swords', 'One Piece'],
    description: 'A matching display set of Zoro’s signature three swords: Wado Ichimonji, Sandai Kitetsu, and Shusui. Comes with display stand and custom scabbards.'
  },
  {
    id: '7',
    name: 'Hatsune Miku Nendoroid',
    category: 'Vocaloid',
    price: 18000,
    rating: 4.8,
    reviewCount: 94,
    image: 'https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=1000&auto=format&fit=crop',
    label: 'NEW',
    tags: ['NEW', 'Figure', 'Nendoroid', 'Vocaloid'],
    description: 'An adorable chibi-styled articulated figure of the cyber pop sensation Hatsune Miku, featuring multiple swappable faceplates, hand parts, and her trademark spring onion.'
  },
  {
    id: '8',
    name: 'Survey Corps Green Cloak',
    category: 'Attack on Titan',
    price: 22000,
    rating: 4.7,
    reviewCount: 110,
    image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1000&auto=format&fit=crop',
    label: 'SALE',
    originalPrice: 25000,
    tags: ['SALE', 'Apparel', 'Cloak', 'Attack on Titan'],
    description: 'The green hooded cloak of the Scout Regiment featuring the highly detailed, high-density embroidered Wings of Freedom logo on the back.'
  },
  {
    id: '9',
    name: 'EVA-01 Test Type Mech Toy',
    category: 'Neon Genesis Evangelion',
    price: 78000,
    rating: 4.9,
    reviewCount: 52,
    image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?q=80&w=1000&auto=format&fit=crop',
    label: 'LIMITED',
    tags: ['LIMITED', 'Figure', 'Evangelion', 'Preorder'],
    description: 'An ultra-posable action figure of Evangelion Unit-01. Packaged with optional progressive knives, pallet rifle, umbilical cable, and an interchangeable berserk-mode head.'
  },
  {
    id: '10',
    name: 'Cyberpunk Neo-Tokyo Bomber',
    category: 'Cyberpunk',
    price: 48000,
    rating: 4.8,
    reviewCount: 73,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1000&auto=format&fit=crop',
    label: 'TRENDING',
    tags: ['TRENDING', 'Apparel', 'Jacket', 'Cyberpunk'],
    description: 'Street-ready padded bomber jacket finished with Kanji detailing, neon reflective linings, and weatherproof zippers built for the Neo-Tokyo urban explorer.'
  }
];

export const collections: Collection[] = [
  {
    id: 'c1',
    title: 'STREETWEAR COLLECTION',
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1000&auto=format&fit=crop',
    cta: 'EXPLORE NOW',
  },
  {
    id: 'c2',
    title: 'TOKYO ARRIVALS',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1000&auto=format&fit=crop',
    cta: 'BROWSE NEW',
  },
  {
    id: 'c3',
    title: 'MYSTERY BOXES',
    image: 'https://images.unsplash.com/photo-1607083206968-13611e3d76db?q=80&w=1000&auto=format&fit=crop',
    cta: 'CLAIM YOURS',
  },
];

export const communityPosts: CommunityPost[] = [
  {
    id: 'p1',
    username: '@KentoGaming',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1000&auto=format&fit=crop',
    likes: 1240,
    type: 'gaming',
  },
  {
    id: 'p2',
    username: '@SoraFashion',
    image: 'https://images.unsplash.com/photo-1624206112918-f140f087f9b5?q=80&w=1000&auto=format&fit=crop',
    likes: 890,
    type: 'fashion',
  },
  {
    id: 'p3',
    username: '@Mei_Cos',
    image: 'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?q=80&w=1000&auto=format&fit=crop',
    likes: 2100,
    type: 'cosplay',
  },
  {
    id: 'p4',
    username: '@TokyoSetup',
    image: 'https://images.unsplash.com/photo-1614013414127-48f492ab3d20?q=80&w=1000&auto=format&fit=crop',
    likes: 3400,
    type: 'setup',
  },
];
