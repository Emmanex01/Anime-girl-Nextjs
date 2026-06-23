import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useShopStore } from '../store/useShopStore';

export function WishlistDrawer() {
  const { 
    wishlist, 
    isWishlistOpen, 
    setWishlistOpen, 
    removeFromWishlist, 
    addToCart 
  } = useShopStore();

  const handleMoveToBag = (product: any) => {
    addToCart(product);
    removeFromWishlist(product.id);
  };

  return (
    <AnimatePresence>
      {isWishlistOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            onClick={() => setWishlistOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200]"
            id="wishlist-overlay"
          />

          {/* Drawer Container */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full xs:max-w-md sm:w-[480px] bg-[#0c0e17] border-l border-white/10 z-[201] flex flex-col shadow-2xl overflow-hidden"
            id="wishlist-drawer-container"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <Heart className="w-5 h-5 text-neon-blue fill-neon-blue/20" />
                 <h2 className="text-lg font-display font-black uppercase tracking-tight italic text-white">
                   MY <span className="text-neon-blue">WISHLIST</span>
                 </h2>
                 <span className="bg-white/5 text-[10px] font-mono px-2 py-0.5 border border-white/10 rounded-sm text-white/60">
                   {wishlist.length} ITEMS
                 </span>
              </div>
              <button 
                onClick={() => setWishlistOpen(false)}
                className="w-10 h-10 rounded-sm border border-white/5 hover:border-white/20 transition-all flex items-center justify-center text-white/50 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Wishlist Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {wishlist.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center gap-4 py-20">
                  <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center opacity-40">
                     <Heart className="w-8 h-8 text-white" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-display font-black text-sm uppercase tracking-wider text-white">WISHLIST IS EMPTY</h3>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">TAG ITEMS WHILE ENROUTE</p>
                  </div>
                  <button 
                    onClick={() => setWishlistOpen(false)}
                    className="mt-4 border border-neon-red text-neon-red hover:bg-neon-red/10 rounded-sm px-6 py-2.5 text-[10px] uppercase font-black tracking-widest italic transition-all"
                  >
                     VIEW ALL COLLAB RELEASES
                  </button>
                </div>
              ) : (
                wishlist.map((product) => (
                  <motion.div
                    key={product.id}
                    layoutId={`wishlist-item-${product.id}`}
                    className="flex gap-4 p-3 bg-[#111422] border border-white/5 hover:border-white/10 rounded-sm transition-all"
                  >
                    {/* Thumbnail */}
                    <div className="w-20 h-20 bg-slate-900 rounded-sm overflow-hidden flex-shrink-0 border border-white/5">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover" 
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    {/* Meta & Actions */}
                    <div className="flex-1 flex flex-col justify-between pt-0.5">
                      <div>
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="text-xs font-display font-bold uppercase text-white/90 tracking-tight leading-tight max-w-[185px]">
                            {product.name}
                          </h4>
                          <button 
                            onClick={() => removeFromWishlist(product.id)}
                            className="text-white/30 hover:text-neon-red p-1 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-[9px] uppercase tracking-widest text-white/30 font-bold mt-1">
                          {product.category}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                        <span className="font-display font-black text-sm italic text-white">
                          N{product.price.toLocaleString()}
                        </span>

                        {/* Move or buy action */}
                        <button
                          onClick={() => handleMoveToBag(product)}
                          className="flex items-center gap-1.5 bg-neon-blue hover:bg-neon-blue/80 text-black px-3 py-1.5 rounded-sm text-[9px] font-black tracking-widest uppercase italic transition-all shadow-[0_0_10px_rgba(0,242,255,0.2)]"
                        >
                          <ShoppingCart className="w-3 h-3" />
                          MOVE TO BAG
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Bottom Actions */}
            {wishlist.length > 0 && (
              <div className="p-6 bg-[#090b12] border-t border-white/10">
                 <button
                   onClick={() => {
                     wishlist.forEach((product) => {
                       addToCart(product);
                     });
                     // Clear wishlist or remove migrated ones
                     wishlist.forEach((p) => removeFromWishlist(p.id));
                     setWishlistOpen(false);
                   }}
                   className="w-full bg-transparent hover:bg-white/5 border border-white/10 hover:border-white/20 text-white font-black h-12 rounded-sm text-[11px] tracking-[0.2em] uppercase italic transition-all flex items-center justify-center gap-2"
                 >
                   MOVE ALL ITEMS TO BAG
                 </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
