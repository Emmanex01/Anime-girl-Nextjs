import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, CheckCircle, MapPin, Truck, ShieldCheck, Mail } from 'lucide-react';
import { useShopStore } from '../store/useShopStore';
import { Order, OrderItem } from '../types';

export function CartDrawer() {
  const { 
    cart, 
    cartSubtotal, 
    isCartOpen, 
    setCartOpen, 
    updateCartQuantity, 
    removeFromCart,
    clearCart,
    shippingOptions,
    addOrder,
    products,
    updateProduct,
    setCurrentRoute
  } = useShopStore();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [selectedShippingId, setSelectedShippingId] = useState(shippingOptions[0]?.id || 'ship-1');
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  const selectedShipping = shippingOptions.find(opt => opt.id === selectedShippingId) || shippingOptions[0];
  const shippingCost = selectedShipping ? selectedShipping.price : 0;
  const transactionFee = cartSubtotal > 0 ? 1200 : 0;
  const cartTotal = cartSubtotal + shippingCost + transactionFee;

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerEmail.trim()) return;

    // Create unique Order ID
    const orderId = 'OD-' + Math.floor(1000 + Math.random() * 9000);

    // Map cart items to order items structure
    const orderItems: OrderItem[] = cart.map(item => ({
      id: item.product.id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      size: item.size,
      color: item.color,
      image: item.product.image
    }));

    // Trigger Pre-order increment logic
    cart.forEach(item => {
      const dbProduct = products.find(p => p.id === item.product.id);
      if (dbProduct && dbProduct.isPreorder) {
        const currentCount = dbProduct.preorderCount || 0;
        const limit = dbProduct.preorderLimit || 10;
        const nextCount = currentCount + item.quantity;
        
        let shouldMarkSoldOut = false;
        if (nextCount >= limit) {
          shouldMarkSoldOut = true;
        }

        updateProduct(dbProduct.id, {
          preorderCount: nextCount,
          soldOut: shouldMarkSoldOut || dbProduct.soldOut,
          enabled: !shouldMarkSoldOut
        });
      }
    });

    // Construct the new order in state DB (Order Status History seeded)
    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 16);
    const newOrder: Order = {
      id: orderId,
      customerName,
      customerEmail,
      products: orderItems,
      amountPaid: cartTotal,
      shippingMethod: selectedShipping ? `${selectedShipping.name} (${selectedShipping.deliveryEstimate})` : 'Standard Shipping',
      status: 'Order Received',
      trackingNumber: 'OTK-TRK-' + Math.floor(10000 + Math.random() * 90000),
      dateCreated: new Date().toISOString().split('T')[0],
      statusHistory: [
        {
          id: 'sh-' + Math.random().toString(36).substring(2, 9),
          status: 'Order Received',
          timestamp,
          updatedBy: 'System',
          note: 'Customer completed checkout successfully.'
        }
      ]
    };

    addOrder(newOrder);
    setPlacedOrder(newOrder);
    clearCart();
  };

  const handleClose = () => {
    setCartOpen(false);
    // Reset local wizard states
    setTimeout(() => {
      setIsCheckingOut(false);
      setCustomerName('');
      setCustomerEmail('');
      setPlacedOrder(null);
    }, 400);
  };

  const handleGoToTracking = (orderId: string) => {
    handleClose();
    setCurrentRoute('track-order');
    // Set cookie/hash or simply let them search it in track-order view
    window.location.hash = `/track-order?id=${orderId}`;
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200]"
            id="cart-overlay"
          />

          {/* Drawer Container */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full xs:max-w-md sm:w-[500px] bg-[#0c0e17] border-l border-white/10 z-[201] flex flex-col shadow-2xl overflow-hidden"
            id="cart-drawer-container"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                 <ShoppingBag className="w-5 h-5 text-neon-red" />
                 <h2 className="text-lg font-display font-black uppercase tracking-tight italic text-white">
                   {placedOrder ? 'CONFIRMATION' : isCheckingOut ? 'SECURE CHECKOUT' : 'YOUR BAG'}
                 </h2>
                 {!placedOrder && !isCheckingOut && (
                   <span className="bg-white/5 text-[10px] font-mono px-2 py-0.5 border border-white/10 rounded-sm text-white/60">
                     {cart.length} ITEMS
                   </span>
                 )}
              </div>
              <button 
                onClick={handleClose}
                className="w-10 h-10 rounded-sm border border-white/5 hover:border-white/20 transition-all flex items-center justify-center text-white/50 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Body depends on state */}
            <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
              {placedOrder ? (
                /* Success confirmation stage */
                <div className="h-full flex flex-col items-center justify-center text-center py-8 space-y-6">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                    <CheckCircle className="w-8 h-8 text-emerald-500" />
                  </div>
                  
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-emerald-500 tracking-widest font-black uppercase block">TRANSACTION AUTHORIZED</span>
                    <h3 className="font-display font-black text-xl uppercase tracking-tight text-white leading-none">ORDER PLACED SUCCESSFULLY</h3>
                    <p className="text-[10px] text-white/40 tracking-[0.2em] uppercase font-bold">Secure Japanese import protocol initiated</p>
                  </div>

                  <div className="w-full bg-[#111422] border border-white/5 rounded-sm p-4 space-y-3 text-left">
                    <div className="flex justify-between text-xs text-white/60">
                      <span>ORDER ID:</span>
                      <strong className="font-mono text-neon-blue">{placedOrder.id}</strong>
                    </div>
                    <div className="flex justify-between text-xs text-white/60">
                      <span>CLIENT:</span>
                      <strong className="uppercase">{placedOrder.customerName}</strong>
                    </div>
                    <div className="flex justify-between text-xs text-white/60 font-mono">
                      <span>AMOUNT PAID:</span>
                      <strong className="text-neon-red font-display italic">N{placedOrder.amountPaid.toLocaleString()}</strong>
                    </div>
                    <div className="flex justify-between text-xs text-white/60">
                      <span>SHIPPING RATE:</span>
                      <strong>{placedOrder.shippingMethod}</strong>
                    </div>
                  </div>

                  <div className="p-4 bg-neon-blue/5 border border-neon-blue/10 rounded-sm text-left text-[10px] text-white/60">
                    <p className="leading-relaxed">
                      💡 <strong>EMAIL SIMULATION TRIGGERED:</strong> A secure tracking mail has been dispatched to <strong>{placedOrder.customerEmail}</strong>. You can follow active updates from Japanese supplier purchases up to local transit in real-time.
                    </p>
                  </div>

                  <div className="pt-4 flex flex-col gap-2 w-full">
                    <button
                      onClick={() => handleGoToTracking(placedOrder.id)}
                      className="w-full h-12 bg-neon-blue text-black font-black text-xs tracking-widest uppercase transition-transform hover:-translate-y-0.5 cursor-pointer"
                    >
                      LIVE TRACK ORDER
                    </button>
                    <button
                      onClick={handleClose}
                      className="w-full h-11 border border-white/10 hover:border-white/20 text-white font-black text-[10px] tracking-widest uppercase cursor-pointer"
                    >
                      RETURN TO CATALOG
                    </button>
                  </div>
                </div>
              ) : isCheckingOut ? (
                /* Checkout Form wizard stage */
                <form onSubmit={handleCreateOrder} className="space-y-6">
                  
                  {/* Delivery Location Header */}
                  <div className="space-y-1 border-b border-white/5 pb-4">
                    <div className="flex items-center gap-2 text-white/70">
                      <MapPin className="w-4 h-4 text-neon-red" />
                      <span className="text-[10px] tracking-widest uppercase font-black">1. SHIPPING ADDRESS</span>
                    </div>
                    <p className="text-[9px] text-white/30 uppercase">Enter client data corresponding to neural destination</p>
                  </div>

                  {/* Name field */}
                  <div className="space-y-2">
                    <label className="text-[10px] text-white/50 tracking-widest uppercase block font-bold">CUSTOMER FULL NAME</label>
                    <input 
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full h-11 px-4 bg-white/5 border border-white/10 rounded-sm text-xs text-white outline-none focus:border-neon-blue transition-all"
                    />
                  </div>

                  {/* Email field */}
                  <div className="space-y-2">
                    <label className="text-[10px] text-white/50 tracking-widest uppercase block font-bold">EMAIL ADDRESS (FOR TRACKING DISPATCH)</label>
                    <input 
                      type="email"
                      required
                      placeholder="e.g. buyer@neuralnet.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full h-11 px-4 bg-white/5 border border-white/10 rounded-sm text-xs text-white outline-none focus:border-neon-blue transition-all"
                    />
                  </div>

                  {/* Shipping option field */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-white/70 border-b border-white/5 pb-2 mt-4">
                      <Truck className="w-4 h-4 text-neon-blue" />
                      <span className="text-[10px] tracking-widest uppercase font-black">2. SHIELD TRANSPORT RATES</span>
                    </div>

                    <div className="space-y-2">
                      {shippingOptions.map((opt) => (
                        <label 
                          key={opt.id}
                          className={`flex items-center justify-between p-3 border rounded-sm cursor-pointer transition-colors ${
                            selectedShippingId === opt.id 
                              ? 'bg-neon-blue/10 border-neon-blue'
                              : 'bg-white/5 border-white/5 hover:border-white/10'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input 
                              type="radio" 
                              name="shippingMethod" 
                              checked={selectedShippingId === opt.id}
                              onChange={() => setSelectedShippingId(opt.id)}
                              className="accent-neon-blue"
                            />
                            <div>
                              <p className="text-xs font-bold text-white uppercase">{opt.name}</p>
                              <p className="text-[10px] text-white/40 font-mono mt-0.5">Est Delivery: {opt.deliveryEstimate}</p>
                            </div>
                          </div>
                          <span className="font-display font-black text-xs text-white italic">
                            N{opt.price.toLocaleString()}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Order Summary Items Block */}
                  <div className="space-y-3 mt-4 pt-4 border-t border-white/5">
                    <div className="flex justify-between text-xs text-white/60">
                      <span>MERCHANDISE TOTAL:</span>
                      <span className="font-mono">N{cartSubtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs text-white/60">
                      <span>SHIPPING COST:</span>
                      <span className="font-mono">N{shippingCost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs text-white/60">
                      <span>NEURAL TRANSACTION FEE:</span>
                      <span className="font-mono">N{transactionFee.toLocaleString()}</span>
                    </div>
                    <div className="h-[1px] bg-white/5 my-2" />
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs font-black uppercase text-neon-blue">SUBTOTAL AMOUNT</span>
                      <span className="font-display font-black text-xl italic text-neon-red">
                        N{cartTotal.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-2 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsCheckingOut(false)}
                      className="flex-1 h-12 bg-white/5 border border-white/10 text-white font-black text-[10px] tracking-widest uppercase transition-colors hover:bg-white/10 cursor-pointer"
                    >
                      BACK TO BAG
                    </button>
                    <button
                      type="submit"
                      className="flex-1 h-12 bg-neon-red text-white font-black text-xs tracking-widest uppercase transition-transform hover:-translate-y-0.5 cursor-pointer shadow-[0_0_15px_rgba(255,0,60,0.3)]"
                    >
                      PLACE SECURE ORDER
                    </button>
                  </div>
                </form>
              ) : (
                /* Primary shopping cart items list */
                <div className="space-y-4">
                  {cart.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center gap-4 py-20">
                      <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center opacity-40">
                         <ShoppingBag className="w-8 h-8 text-white" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-display font-black text-sm uppercase tracking-wider text-white">YOUR BAG IS EMPTY</h3>
                        <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">REPLENISH YOUR VANGUARD STOCK</p>
                      </div>
                      <button 
                        onClick={handleClose}
                        className="mt-4 border border-neon-blue text-neon-blue hover:bg-neon-blue/10 rounded-sm px-6 py-2.5 text-[10px] uppercase font-black tracking-widest italic transition-all cursor-pointer"
                      >
                         CONTINUE SHOPPING
                      </button>
                    </div>
                  ) : (
                    cart.map((item) => {
                      const itemKey = `${item.product.id}-${item.size || 'std'}-${item.color || 'std'}`;
                      
                      // Preorder tags calculations
                      const dbProduct = products.find(p => p.id === item.product.id);
                      const isPre = dbProduct?.isPreorder;
                      const limit = dbProduct?.preorderLimit || 10;
                      const purchased = dbProduct?.preorderCount || 0;
                      const remaining = Math.max(0, limit - purchased);

                      return (
                        <motion.div
                          key={itemKey}
                          layoutId={`cart-item-${itemKey}`}
                          className="flex gap-4 p-3 bg-[#111422] border border-white/5 hover:border-white/10 rounded-sm transition-all relative"
                        >
                          {/* Thumbnail */}
                          <div className="w-20 h-20 bg-slate-900 rounded-sm overflow-hidden flex-shrink-0 border border-white/5">
                            <img 
                              src={item.product.image} 
                              alt={item.product.name} 
                              className="w-full h-full object-cover" 
                              referrerPolicy="no-referrer"
                            />
                          </div>

                          {/* Meta & Info */}
                          <div className="flex-1 flex flex-col justify-between pt-0.5">
                            <div>
                              <div className="flex items-start justify-between gap-1">
                                <h4 className="text-xs font-display font-bold uppercase text-white/90 tracking-tight leading-tight max-w-[180px]">
                                  {item.product.name}
                                </h4>
                                <button 
                                  onClick={() => removeFromCart(item.product.id, item.size, item.color)}
                                  className="text-white/30 hover:text-neon-red p-1 transition-colors cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                              <div className="flex flex-wrap items-center gap-2 mt-1">
                                <span className="text-[9px] uppercase tracking-widest text-[#00f2ff] font-bold">
                                  {item.product.category}
                                </span>
                                {(item.size || item.color) && (
                                  <span className="text-white/20 text-[9px] font-bold">|</span>
                                )}
                                {item.size && (
                                  <span className="bg-white/5 border border-white/10 text-[8px] font-mono px-1.5 py-0.5 rounded-sm text-neon-blue font-black tracking-widest">
                                    {item.size}
                                  </span>
                                )}
                                {item.color && (
                                  <span className="bg-white/5 border border-white/10 text-[8px] font-mono px-1.5 py-0.5 rounded-sm text-neon-red font-black tracking-widest">
                                    {item.color.toUpperCase()}
                                  </span>
                                )}
                              </div>
                              
                              {/* If Preorder display remaining slots */}
                              {isPre && (
                                <div className="mt-1 flex items-center gap-1.5">
                                  <span className="bg-amber-500/10 text-amber-500 text-[8px] px-1 rounded-sm uppercase tracking-wider font-extrabold border border-amber-500/20">PRE-ORDER</span>
                                  <span className="text-[9px] text-[#00f2ff] font-mono">{remaining} / {limit} SLOTS REMAINING</span>
                                </div>
                              )}
                            </div>

                            <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                              {/* Quantity controls */}
                              <div className="flex items-center gap-1 border border-white/5 bg-black/30 rounded-sm p-0.5">
                                <button
                                  onClick={() => updateCartQuantity(item.product.id, item.quantity - 1, item.size, item.color)}
                                  className="w-5 h-5 rounded-sm hover:bg-white/5 flex items-center justify-center text-white/50 hover:text-white cursor-pointer"
                                >
                                  <Minus className="w-2.5 h-2.5" />
                                </button>
                                <span className="w-8 text-center text-[10px] font-mono font-bold text-white leading-none">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => {
                                    // Limit checks for preorders
                                    if (isPre && item.quantity >= remaining) {
                                      useShopStore.getState().showNotification(`Cannot exceed preorder slot remaining limit (${remaining}).`, 'info');
                                      return;
                                    }
                                    updateCartQuantity(item.product.id, item.quantity + 1, item.size, item.color);
                                  }}
                                  className="w-5 h-5 rounded-sm hover:bg-white/5 flex items-center justify-center text-white/50 hover:text-white cursor-pointer"
                                >
                                  <Plus className="w-2.5 h-2.5" />
                                </button>
                              </div>
                            
                              {/* Price item total */}
                              <span className="font-display font-black text-sm italic text-white">
                                N{(item.product.price * item.quantity).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                </div>
              )}
            </div>

            {/* Footer Summary is ONLY visible during active cart step */}
            {!placedOrder && !isCheckingOut && cart.length > 0 && (
              <div className="p-6 bg-[#090b12] border-t border-white/10 space-y-4 flex-shrink-0">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-black tracking-wider uppercase text-white/40">
                     <span>SUBTOTAL</span>
                     <span className="font-mono text-white">N{cartSubtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-black tracking-wider uppercase text-white/40">
                     <span>SHIPPING ESTIMATES</span>
                     <span className="font-mono text-white">Calculated at checkout step</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-black tracking-wider uppercase text-white/40">
                     <span>NEURAL TRANSACTION FEE</span>
                     <span className="font-mono text-white">N{transactionFee.toLocaleString()}</span>
                  </div>
                  
                  <div className="h-[1px] bg-white/5 my-3" />
                  
                  <div className="flex justify-between items-baseline">
                     <span className="text-xs font-display font-black italic uppercase tracking-wider text-white">ESTIMATED TOTAL</span>
                     <span className="font-display font-black text-2xl italic tracking-tighter text-neon-red">
                       N{(cartSubtotal + transactionFee).toLocaleString()}
                     </span>
                  </div>
                </div>

                <button
                  onClick={() => setIsCheckingOut(true)}
                  className="w-full bg-neon-red hover:bg-neon-red/90 text-white font-black h-12 rounded-sm text-[11px] tracking-[0.2em] uppercase italic transition-all flex items-center justify-center gap-2 group shadow-[0_0_20px_rgba(255,0,60,0.4)] cursor-pointer"
                >
                  SECURE CHECKOUT 
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
                
                <div className="flex items-center justify-center gap-4 text-[9px] uppercase tracking-widest text-[#00f2ff]/60 text-center font-bold">
                  <span>● SECURE CRYPT LINK</span>
                  <span>● Tokyo Direct Sourcing</span>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
