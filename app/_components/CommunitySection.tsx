'use client'
import { motion } from 'motion/react';
import { ChevronRight, Heart } from 'lucide-react';

const posts = [
  { id: '1', username: '@sage.king', image: 'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?q=80&w=600' },
  { id: '2', username: '@weeb_lifestyle', image: 'https://images.unsplash.com/photo-1578632292335-df3abbb0d586?q=80&w=600' },
  { id: '3', username: '@anime_lover_01', image: 'https://images.unsplash.com/photo-1620336655052-b57986f56c82?q=80&w=600' },
  { id: '4', username: '@otaku_vibes', image: 'https://images.unsplash.com/photo-1613373123016-814830ce18ac?q=80&w=600' },
  { id: '5', username: '@kira.cos', image: 'https://images.unsplash.com/photo-1541562232579-512a21360020?q=80&w=600' },
];

export function CommunitySection() {
  return (
    <section className="py-12 bg-background border-y border-white/5">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <h2 className="text-xl md:text-2xl font-display font-black tracking-tighter uppercase italic">
              OTAKU <span className="text-white">COMMUNITY</span>
            </h2>
            <Heart className="w-5 h-5 text-neon-red fill-neon-red" />
          </div>
          <button className="flex items-center gap-1 text-[10px] font-black tracking-[0.2em] text-white/40 hover:text-white transition-colors uppercase italic">
            VIEW ALL POSTS <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {posts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative aspect-[3/4] rounded-sm overflow-hidden group cursor-pointer border border-white/5"
            >
              <img 
                src={post.image} 
                alt={post.username} 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
              
              <div className="absolute top-3 left-3">
                 <div className="bg-black/60 backdrop-blur-md px-2 py-1 rounded-sm border border-white/10 text-[9px] font-bold tracking-widest text-white/90">
                    {post.username}
                 </div>
              </div>
              
              <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <Heart className="w-4 h-4 text-white fill-white" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
