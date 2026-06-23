import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Terminal, ShieldCheck, LogOut, LayoutDashboard, ShoppingBag, 
  Tag, Truck, CircleDollarSign, Users, Sliders, ChevronRight, 
  Plus, Search, Edit2, Check, EyeOff, Eye, ToggleLeft, ToggleRight, 
  Trash2, ArrowUpRight, Inbox, HelpCircle, Calculator, Percent, 
  Clock, Package, AlertCircle, Edit, Coins, RefreshCw, Send, Lock
} from 'lucide-react';
import { useShopStore } from '../store/useShopStore';
import { Product, Order, ShippingOption, AdminUser, AdminNotification } from '../types';

export function AdminDashboard() {
  const { 
    products, addProduct, updateProduct,
    orders, updateOrderStatus,
    shippingOptions, updateShippingOption,
    adminUser, loginAdmin, logoutAdmin,
    adminNotifications, markNotificationRead, addAdminNotification,
    setCurrentRoute, currentCustomer
  } = useShopStore();

  const activeAdminSession = adminUser || (currentCustomer && (currentCustomer.role === 'ADMIN' || currentCustomer.role === 'STAFF') ? {
    id: currentCustomer.id,
    username: currentCustomer.email.split('@')[0],
    role: currentCustomer.role === 'ADMIN' ? 'Admin' : 'Staff/Fulfillment Manager' as any,
    name: currentCustomer.name
  } : null);

  // Authentication Fields state
  const [usernameInput, setUsernameInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [roleInput, setRoleInput] = useState<'Admin' | 'Staff/Fulfillment Manager'>('Admin');
  const [authError, setAuthError] = useState('');

  // Sorter / Navigation inside Admin Tab
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'products' | 'preorders' | 'customers' | 'shipping' | 'profit' | 'settings'>('dashboard');

  // Search & Filters state
  const [orderQuery, setOrderQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('ALL');
  const [productQuery, setProductQuery] = useState('');

  // Selected details targets
  const [managingOrderId, setManagingOrderId] = useState<string | null>(null);
  const [customStatusNote, setCustomStatusNote] = useState('');
  const [editingTrackingNum, setEditingTrackingNum] = useState('');
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editingShippingId, setEditingShippingId] = useState<string | null>(null);

  // Profit Interactive Form Calculator variables
  const [calcCostJpy, setCalcCostJpy] = useState(5000);
  const [calcRate, setCalcRate] = useState(1.1); // JPY to Naira multiplier
  const [calcJapanShip, setCalcJapanShip] = useState(1500);
  const [calcIntShip, setCalcIntShip] = useState(8500);
  const [calcFee, setCalcFee] = useState(1800);
  const [calcSellingPrice, setCalcSellingPrice] = useState(30000);

  // New product add form state
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('Figures');
  const [newProdPrice, setNewProdPrice] = useState(15000);
  const [newProdImage, setNewProdImage] = useState('https://images.unsplash.com/photo-1608889476561-6242afdbf622?q=80&w=1000&auto=format&fit=crop');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdSeries, setNewProdSeries] = useState('Demon Slayer');
  const [newProdStore, setNewProdStore] = useState('AmiAmi Akihabara');
  const [newProdUrl, setNewProdUrl] = useState('https://www.amiami.com/eng/');
  const [newProdCostJpy, setNewProdCostJpy] = useState(3000);
  const [newProdWeight, setNewProdWeight] = useState(400);
  const [newProdIsPreorder, setNewProdIsPreorder] = useState(false);
  const [newProdPreorderLimit, setNewProdPreorderLimit] = useState(15);

  // Edit product fields
  const [editFormName, setEditFormName] = useState('');
  const [editFormPrice, setEditFormPrice] = useState(0);
  const [editFormCategory, setEditFormCategory] = useState('');
  const [editFormSeries, setEditFormSeries] = useState('');
  const [editFormCostJpy, setEditFormCostJpy] = useState(0);
  const [editFormWeight, setEditFormWeight] = useState(0);
  const [editFormPreLimit, setEditFormPreLimit] = useState(0);

  // Handle Login submission
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput.trim()) {
      setAuthError('Please enter a username.');
      return;
    }
    const realName = nameInput.trim() || (roleInput === 'Admin' ? 'Supervisor Ryota' : 'Officer Suzuki');
    loginAdmin(usernameInput.trim(), roleInput, realName);
    addAdminNotification(`Admin portal accessed by ${realName} (${roleInput})`, 'inventory');
  };

  const selectDemoProfile = (user: string, name: string, role: typeof roleInput) => {
    loginAdmin(user, role, name);
    addAdminNotification(`Admin portal accessed by demo profile: ${name} (${role})`, 'inventory');
  };

  // Financial Estimates Aggregates
  const statsSummary = useMemo(() => {
    const totalOrders = orders.length;
    const newCount = orders.filter(o => o.status === 'Order Received').length;
    const awaitingPurchase = orders.filter(o => o.status === 'Awaiting Purchase').length;
    const purchasedInJapan = orders.filter(o => o.status === 'Purchased in Japan').length;
    const arrivedAtFacility = orders.filter(o => o.status === 'Arrived at Japan Facility').length;
    const packedShipment = orders.filter(o => o.status === 'Packed for Shipment').length;
    const shipped = orders.filter(o => o.status === 'Shipped').length;
    const delivered = orders.filter(o => o.status === 'Delivered').length;

    const totalRevenue = orders.reduce((acc, o) => acc + o.amountPaid, 0);
    
    // Estimate raw profits (approximate costs in Nippon Import conversions)
    // Dynamic: Profit = SalesPrice - JPY Purchase * 1.5 - LocalShipping (5-8k avg)
    const estimatedProfit = orders.reduce((acc, o) => {
      // Find database sourced purchase price
      const orderCost = o.products.reduce((costSum, item) => {
        const p = products.find(prod => prod.id === item.id);
        const jpyCost = p?.purchasePriceJpy || 3000;
        return costSum + (jpyCost * 1.1) + 4000; // estimated cost in JPY convert + int shipping
      }, 0);
      const orderProfit = o.amountPaid - orderCost;
      return acc + (orderProfit > 0 ? orderProfit : o.amountPaid * 0.35); // fallback to 35% margin
    }, 0);

    return {
      totalOrders,
      newCount,
      awaitingPurchase,
      purchasedInJapan,
      arrivedAtFacility,
      packedShipment,
      shipped,
      delivered,
      totalRevenue,
      estimatedProfit
    };
  }, [orders, products]);

  // Collated Customer Metrics
  const customersList = useMemo(() => {
    const registry: Record<string, { name: string; email: string; orderCount: number; spend: number; orders: string[] }> = {};
    
    orders.forEach(o => {
      const email = o.customerEmail.toLowerCase().trim();
      if (!registry[email]) {
        registry[email] = {
          name: o.customerName,
          email: o.customerEmail,
          orderCount: 0,
          spend: 0,
          orders: []
        };
      }
      registry[email].orderCount += 1;
      registry[email].spend += o.amountPaid;
      registry[email].orders.push(o.id);
    });

    return Object.values(registry);
  }, [orders]);

  // Profit calculation logic sheet (Interactive form metrics)
  const calculatedTotalCost = Math.floor(calcCostJpy * calcRate) + Number(calcJapanShip) + Number(calcIntShip) + Number(calcFee);
  const calculatedProfitAmount = calcSellingPrice - calculatedTotalCost;
  const calculatedProfitPercent = calculatedTotalCost > 0 ? Math.round((calculatedProfitAmount / calculatedTotalCost) * 100) : 0;

  // Add merchandise handler
  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim()) return;

    const id = (products.length + 1).toString();
    const cleanProduct: Product = {
      id,
      name: newProdName,
      category: newProdCategory,
      price: newProdPrice,
      rating: 4.8,
      reviewCount: 0,
      image: newProdImage,
      label: newProdIsPreorder ? 'LIMITED' : 'NEW',
      tags: [newProdName.toLowerCase(), newProdCategory.toLowerCase(), newProdSeries.toLowerCase()],
      description: newProdDesc || 'Premium curated collectible imported directly from Shibuya, Tokyo.',
      animeSeries: newProdSeries,
      enabled: true,
      hide: false,
      soldOut: false,
      sourceStore: newProdStore,
      sourceUrl: newProdUrl,
      purchasePriceJpy: newProdCostJpy,
      productWeight: newProdWeight,
      isPreorder: newProdIsPreorder,
      preorderLimit: newProdIsPreorder ? newProdPreorderLimit : undefined,
      preorderCount: newProdIsPreorder ? 0 : undefined
    };

    addProduct(cleanProduct);
    setIsAddingProduct(false);

    // Reset fields
    setNewProdName('');
    setNewProdPrice(15000);
    setNewProdDesc('');
  };

  // Open edit modal pre-fills
  const openEditProductModal = (p: Product) => {
    setEditingProductId(p.id);
    setEditFormName(p.name);
    setEditFormPrice(p.price);
    setEditFormCategory(p.category);
    setEditFormSeries(p.animeSeries || p.category);
    setEditFormCostJpy(p.purchasePriceJpy || 0);
    setEditFormWeight(p.productWeight || 0);
    setEditFormPreLimit(p.preorderLimit || 0);
  };

  const handleUpdateProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProductId) return;

    updateProduct(editingProductId, {
      name: editFormName,
      price: editFormPrice,
      category: editFormCategory,
      animeSeries: editFormSeries,
      purchasePriceJpy: editFormCostJpy,
      productWeight: editFormWeight,
      preorderLimit: editFormPreLimit || undefined
    });

    setEditingProductId(null);
  };

  // Filter Orders using Search / Status
  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchQuery = o.customerName.toLowerCase().includes(orderQuery.toLowerCase()) || 
                          o.id.toLowerCase().includes(orderQuery.toLowerCase()) ||
                          o.customerEmail.toLowerCase().includes(orderQuery.toLowerCase());
      const matchStatus = orderStatusFilter === 'ALL' || o.status === orderStatusFilter;
      return matchQuery && matchStatus;
    });
  }, [orders, orderQuery, orderStatusFilter]);

  if (!activeAdminSession) {
    /* SECURE LOGIN SCREEN */
    return (
      <div className="pt-32 pb-24 min-h-screen bg-[#060812] flex items-center justify-center px-4 relative">
        <div className="w-full max-w-md bg-[#0a0d1a] border border-white/10 p-8 rounded-sm shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative z-10">
          
          <div className="text-center mb-8 border-b border-white/5 pb-6">
            <div className="w-12 h-12 bg-neon-red/10 rounded-full flex items-center justify-center text-neon-red mx-auto mb-3 shadow-[0_0_15px_rgba(255,0,60,0.2)]">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="font-display font-black text-xl text-white uppercase tracking-tight">ADMINISTRATION CONTROL</h2>
            <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] mt-1">SECURITY ACCESS REQUIRED</p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="text-[10px] text-white/50 tracking-widest uppercase block mb-1 font-bold">STAFF USERNAME</label>
              <input 
                type="text"
                required
                placeholder="e.g. ryota_t"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                className="w-full h-11 px-4 bg-white/5 border border-white/10 rounded-sm text-xs text-white focus:border-neon-blue outline-none transition-all font-mono uppercase"
              />
            </div>

            <div>
              <label className="text-[10px] text-white/50 tracking-widest uppercase block mb-1 font-bold">FULL NAME</label>
              <input 
                type="text"
                placeholder="e.g. Ryota Takahashi"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full h-11 px-4 bg-white/5 border border-white/10 rounded-sm text-xs text-white focus:border-neon-blue outline-none transition-all"
              />
            </div>

            <div>
              <label className="text-[10px] text-white/50 tracking-widest uppercase block mb-1 font-bold">ROLE PRIVILEGE</label>
              <select
                value={roleInput}
                onChange={(e) => setRoleInput(e.target.value as any)}
                className="w-full h-11 px-4 bg-[#0d101d] border border-white/10 rounded-sm text-xs text-white outline-none focus:border-neon-blue transition-all uppercase"
              >
                <option value="Admin">Admin (Full Control)</option>
                <option value="Staff/Fulfillment Manager">Staff/Fulfillment Manager</option>
              </select>
            </div>

            {authError && (
              <p className="text-[10px] text-neon-red font-mono font-black uppercase tracking-wildest">{authError}</p>
            )}

            <button
              type="submit"
              className="w-full h-12 bg-neon-red hover:bg-neon-red/90 text-white font-black text-xs tracking-[0.2em] uppercase italic transition-transform hover:-translate-y-0.5 rounded-sm shadow-[0_0_15px_rgba(255,0,60,0.3)] cursor-pointer"
            >
              INITIALIZE GATEWAY
            </button>
          </form>

          {/* Quick Sandbox Profiles */}
          <div className="mt-8 pt-6 border-t border-white/5">
            <span className="text-[9px] font-black text-white/30 tracking-widest uppercase block text-center mb-3">DEMO GATEWAY PROFILE LOGINS</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => selectDemoProfile('ryota_admin', 'Ryota Takahashi', 'Admin')}
                className="p-2.5 bg-white/5 border border-white/10 hover:border-neon-blue text-left rounded-sm cursor-pointer transition-all group"
              >
                <p className="text-[10px] font-black text-neon-blue uppercase">RYOTA TAKAHASHI</p>
                <p className="text-[8px] text-white/45 uppercase mt-0.5">Admin Role</p>
              </button>
              <button
                onClick={() => selectDemoProfile('koji_sourcing', 'Koji Suzuki', 'Staff/Fulfillment Manager')}
                className="p-2.5 bg-white/5 border border-white/10 hover:border-neon-red text-left rounded-sm cursor-pointer transition-all group"
              >
                <p className="text-[10px] font-black text-neon-red uppercase">KOJI SUZUKI</p>
                <p className="text-[8px] text-white/45 uppercase mt-0.5">Fulfillment Staff</p>
              </button>
            </div>
          </div>

        </div>

        {/* Diagonal Layout FX */}
        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none overflow-hidden">
          <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-neon-red blur-[150px] rounded-full animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 min-h-screen bg-[#04060c] text-white selection:bg-neon-red/40 relative font-sans leading-relaxed">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 relative z-10">
        
        {/* Interactive Ribbon banner */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border border-white/5 bg-[#0a0d1a]/80 backdrop-blur-md rounded-sm">
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 bg-emerald-500 rounded-full animate-ping" />
            <div className="flex items-baseline gap-2">
              <span className="text-xs text-white/50 uppercase font-mono tracking-wide">AUTHENTICATED CONSOLE:</span>
              <strong className="text-xs text-neon-blue uppercase tracking-widest">{activeAdminSession.name}</strong>
              <span className="text-[9px] bg-neon-red/10 border border-neon-red/20 text-neon-red px-1.5 py-0.5 rounded-sm font-black uppercase tracking-wide">
                {activeAdminSession.role}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-mono text-white/30 hidden lg:block uppercase tracking-widest">
              SECURE DEPLOYMENT PROTOCOL v2.0
            </span>
            <button 
              onClick={logoutAdmin}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 hover:bg-neon-red/15 hover:border-neon-red hover:text-white transition-all text-[9px] font-black tracking-widest uppercase cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>TERMINATE SESSION</span>
            </button>
          </div>
        </div>

        {/* Sidebar + Tabbed layouts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* 1. Admin Sidebar Section */}
          <div className="lg:col-span-3 space-y-4">
            <div className="p-4 bg-[#070912] border border-white/5 rounded-sm">
              <span className="text-[10px] font-black tracking-[0.3em] text-white/35 uppercase block px-3 mb-4">NAVIGATION RADAR</span>
              
              <div className="space-y-1">
                {[
                  { id: 'dashboard', label: 'DASHBOARD SUMMARY', icon: LayoutDashboard },
                  { id: 'orders', label: 'ORDER OPERATIONS', icon: ShoppingBag, count: orders.filter(o => o.status === 'Order Received').length },
                  { id: 'products', label: 'MERCHANDISE CATALOG', icon: Tag },
                  { id: 'preorders', label: 'PRE-ORDER VAULTS', icon: Clock, count: products.filter(p => p.isPreorder).length },
                  { id: 'customers', label: 'BUYERS LEDGER', icon: Users },
                  { id: 'shipping', label: 'SHIPMENT METHODS', icon: Truck },
                  { id: 'profit', label: 'PROFIT CALCULATOR', icon: Calculator },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id as any);
                        setManagingOrderId(null);
                        setEditingProductId(null);
                      }}
                      className={`w-full text-left py-2.5 px-3.5 rounded-sm transition-all text-[10px] font-black tracking-widest uppercase flex items-center justify-between cursor-pointer group ${
                        isSelected 
                          ? 'bg-neon-blue/15 border-l-[3px] border-neon-blue text-neon-blue shadow-[0_0_15px_rgba(0,242,255,0.05)]'
                          : 'text-white/60 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-3 truncate">
                        <Icon className={`w-4 h-4 group-hover:scale-105 transition-transform ${isSelected ? 'text-neon-blue' : 'text-white/40'}`} />
                        <span className="truncate group-hover:translate-x-0.5 transition-all text-ellipsis">{item.label}</span>
                      </div>
                      {item.count ? (
                        <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded-sm leading-none ${isSelected ? 'bg-neon-blue text-black' : 'bg-neon-red/10 text-neon-red border border-neon-red/20'}`}>
                          {item.count}
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick system activity trace widget */}
            <div className="p-4 bg-[#070912]/50 border border-white/5 rounded-sm">
              <div className="flex items-center gap-2 mb-3 px-1 border-b border-white/5 pb-2">
                <Terminal className="w-3.5 h-3.5 text-neon-blue" />
                <span className="text-[9px] font-black tracking-wider text-white uppercase block">REAL-TIME SYSTEM NOTIFICATIONS</span>
              </div>
              <div className="space-y-3 max-h-56 overflow-y-auto scrollbar-thin">
                {adminNotifications.slice(0, 5).map((notif) => (
                  <div key={notif.id} className="text-[9px] leading-relaxed border-b border-white/[0.02] pb-2 last:border-0 hover:bg-white/[0.01] p-1.5 rounded transition-all">
                    <div className="flex justify-between font-mono text-white/30 text-[8px] mb-1">
                      <span>{notif.timestamp}</span>
                      <span className="uppercase text-neon-blue">{notif.type}</span>
                    </div>
                    <p className="text-white/70 font-semibold">{notif.message}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 2. Primary Admin Dashboard Panels Layout */}
          <div className="lg:col-span-9">
            
            {/* TAB: DASHBOARD OVERVIEW */}
            {activeTab === 'dashboard' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl md:text-3xl font-display font-black uppercase italic tracking-tight mb-2">
                    COMMAND <span className="text-neon-red">OVERVIEW</span>
                  </h2>
                  <p className="text-white/40 text-xs">Dynamic status matrices, financials metrics and fulfillment tracking overview.</p>
                </div>

                {/* Status Badges Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'TOTAL ORDERS', count: statsSummary.totalOrders, subtitle: 'All time registrations', color: 'border-white/15 text-white bg-white/5' },
                    { label: 'NEW ORDERS', count: statsSummary.newCount, subtitle: 'Ordered Received', color: 'border-neon-blue/30 text-neon-blue bg-neon-blue/5 shadow-[0_0_15px_rgba(0,242,255,0.05)]' },
                    { label: 'AWAITING JAPAN BUY', count: statsSummary.awaitingPurchase, subtitle: 'Ready for purchase', color: 'border-yellow-500/20 text-yellow-500 bg-yellow-500/5' },
                    { label: 'DELIVERED CARGO', count: statsSummary.delivered, subtitle: 'Completed order cycles', color: 'border-emerald-500/20 text-emerald-500 bg-[#10b981]/5 animate-pulse' },
                  ].map((card, idx) => (
                    <div key={idx} className={`p-4 border rounded-sm ${card.color} flex flex-col justify-between`}>
                      <span className="text-[9px] font-black tracking-widest uppercase block opacity-70 truncate">{card.label}</span>
                      <strong className="text-3xl md:text-4xl font-display font-black block mt-2 mb-1">{card.count}</strong>
                      <span className="text-[8px] opacity-40 font-mono block uppercase">{card.subtitle}</span>
                    </div>
                  ))}
                </div>

                {/* Sub status details panels */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {[
                    { label: 'Purchased in Japan', count: statsSummary.purchasedInJapan },
                    { label: 'Arrived at Japan Facility', count: statsSummary.arrivedAtFacility },
                    { label: 'Packed for Shipment', count: statsSummary.packedShipment },
                    { label: 'Shipped', count: statsSummary.shipped },
                    { label: 'Delivered', count: statsSummary.delivered },
                  ].map((sub, idx) => (
                    <div key={idx} className="p-3 border border-white/5 bg-[#0a0d1a] hover:border-white/15 transition-all rounded-sm flex justify-between items-center text-left">
                      <div>
                        <span className="text-[8px] font-black tracking-wider text-white/40 block uppercase truncate">{sub.label}</span>
                        <strong className="text-base text-white font-mono">{sub.count} orders</strong>
                      </div>
                      <ChevronRight className="w-4 h-4 text-white/20" />
                    </div>
                  ))}
                </div>

                {/* Financial overview row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Financial Rev */}
                  <div className="p-6 border border-white/5 bg-[#0a0d1a] rounded-sm flex justify-between items-center bg-gradient-to-r from-neon-blue/5 to-transparent relative overflow-hidden">
                    <div>
                      <span className="text-[10px] font-black tracking-widest text-[#00f2ff] block uppercase">CUMULATIVE STATED REVENUE</span>
                      <strong className="text-3xl font-display font-black tracking-tight text-white block mt-3 italic">
                        N{statsSummary.totalRevenue.toLocaleString()}
                      </strong>
                      <p className="text-[9px] text-white/30 uppercase mt-1 tracking-wider leading-none">Net processing values</p>
                    </div>
                    <CircleDollarSign className="w-12 h-12 text-[#00f2ff] opacity-10 absolute right-4 bottom-4" />
                  </div>

                  {/* Profit rev estimate */}
                  <div className="p-6 border border-[#ff003c]/20 bg-[#0a0d1a] rounded-sm flex justify-between items-center bg-gradient-to-r from-neon-red/5 to-transparent relative overflow-hidden">
                    <div>
                      <span className="text-[10px] font-black tracking-widest text-neon-red block uppercase">ESTIMATED EXPORT PROFITS</span>
                      <strong className="text-3xl font-display font-black tracking-tight text-white block mt-3 italic">
                        N{statsSummary.estimatedProfit.toLocaleString()}
                      </strong>
                      <p className="text-[9px] text-white/30 uppercase mt-1 tracking-wider leading-none">Averaging 48% markup margins</p>
                    </div>
                    <ArrowUpRight className="w-12 h-12 text-neon-red opacity-10 absolute right-4 bottom-4" />
                  </div>
                </div>

                {/* Tables summary list */}
                <div className="border border-white/5 bg-[#070912] p-5 rounded-sm">
                  <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
                    <span className="text-[10px] font-black tracking-widest text-white uppercase block">AWAITING FULFILLMENT PROTOCOLS</span>
                    <button 
                      onClick={() => setActiveTab('orders')} 
                      className="text-[9px] font-black text-neon-blue hover:underline uppercase tracking-widest"
                    >
                      VIEW ALL ORDERS LIST
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-white/70">
                      <thead>
                        <tr className="border-b border-white/5 text-[9px] font-mono uppercase text-white/35">
                          <th className="py-2.5">ID</th>
                          <th className="py-2.5">BUYER</th>
                          <th className="py-2.5">METHOD</th>
                          <th className="py-2.5">STATUS</th>
                          <th className="py-2.5 text-right">TOTAL</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.02]">
                        {orders.slice(0, 3).map((o) => (
                          <tr key={o.id} className="hover:bg-white/[0.01]">
                            <td className="py-3 font-mono text-neon-blue font-black">{o.id}</td>
                            <td className="py-3 font-semibold text-white">{o.customerName}</td>
                            <td className="py-3 text-[10px]">{o.shippingMethod}</td>
                            <td className="py-3">
                              <span className={`px-2 py-0.5 rounded-sm text-[8px] uppercase tracking-wider font-extrabold ${
                                o.status === 'Order Received' ? 'bg-neon-blue/15 text-neon-blue border border-neon-blue/20' :
                                o.status === 'Delivered' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-white/5 text-white/50'
                              }`}>
                                {o.status}
                              </span>
                            </td>
                            <td className="py-3 text-right font-mono font-black italic text-white">N{o.amountPaid.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            {/* TAB: ORDERS OPERATIONS */}
            {activeTab === 'orders' && (
              <div className="space-y-8 animate-fade-in">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-6">
                  <div>
                    <h2 className="text-2xl font-display font-black uppercase italic tracking-tight">
                      ORDER <span className="text-neon-red">FULFILLMENT</span> DISPATCH
                    </h2>
                    <p className="text-white/45 text-xs">Verify invoices, source packages from Akihabara stores, and assign trans-shipping cargo codes.</p>
                  </div>

                  {/* Status Filters & Query Inputs */}
                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      value={orderStatusFilter}
                      onChange={(e) => setOrderStatusFilter(e.target.value)}
                      className="h-10 px-3 bg-[#0a0d1a] border border-white/10 rounded-sm text-[10px] font-black tracking-widest text-white uppercase block outline-none focus:border-neon-blue"
                    >
                      <option value="ALL">ALL STATUSES • 全て</option>
                      <option value="Order Received">Order Received</option>
                      <option value="Awaiting Purchase">Awaiting Purchase</option>
                      <option value="Purchased in Japan">Purchased in Japan</option>
                      <option value="Arrived at Japan Facility">Arrived at Japan Facility</option>
                      <option value="Packed for Shipment">Packed for Shipment</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                    </select>

                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                      <input 
                        type="text"
                        placeholder="SEARCH BUYER / ORDER ID..."
                        value={orderQuery}
                        onChange={(e) => setOrderQuery(e.target.value)}
                        className="h-10 pl-9 pr-4 bg-white/5 border border-white/10 rounded-sm text-xs text-white placeholder-white/20 focus:border-neon-blue outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* If actively managing a single selected order status timeline */}
                {managingOrderId && (
                  <div className="p-6 border border-neon-blue/20 bg-[#090c17] rounded-sm relative">
                    <button 
                      onClick={() => setManagingOrderId(null)} 
                      className="absolute top-4 right-4 text-[9px] font-black tracking-widest text-white/40 hover:text-white uppercase"
                    >
                      [ CLOSE PANEL ]
                    </button>
                    
                    {(() => {
                      const tgt = orders.find(o => o.id === managingOrderId);
                      if (!tgt) return null;
                      return (
                        <div className="space-y-6">
                          <span className="text-[10px] font-black tracking-[0.3em] text-[#00f2ff] block uppercase">FULFILLMENT DISPATCH CARD: {tgt.id}</span>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left border-y border-white/5 py-4">
                            <div>
                              <p className="text-[9px] font-mono text-white/40 uppercase">BUYER ADDRESS</p>
                              <strong className="text-white text-xs block truncate uppercase mt-0.5">{tgt.customerName}</strong>
                              <span className="text-[10px] text-white/40 font-mono block truncate">{tgt.customerEmail}</span>
                            </div>
                            <div>
                              <p className="text-[9px] font-mono text-white/40 uppercase">SHIELD METHOD</p>
                              <strong className="text-white text-xs block uppercase mt-0.5">{tgt.shippingMethod}</strong>
                            </div>
                            <div>
                              <p className="text-[9px] font-mono text-white/40 uppercase">TRACKING STICKER</p>
                              {editingTrackingNum !== null ? (
                                <div className="flex gap-1.5 mt-1.5">
                                  <input 
                                    type="text"
                                    placeholder="Enter sticker code..."
                                    value={editingTrackingNum}
                                    onChange={(e) => setEditingTrackingNum(e.target.value)}
                                    className="h-8 px-2 bg-white/5 border border-white/10 rounded-sm text-xs font-mono text-neon-blue outline-none w-44 uppercase"
                                  />
                                  <button
                                    onClick={() => {
                                      updateProduct(tgt.id, {}); // dummy refresh
                                      tgt.trackingNumber = editingTrackingNum.toUpperCase();
                                      addAdminNotification(`Asigned cargo tracking sticker: ${editingTrackingNum} to order ${tgt.id}`, 'order');
                                    }}
                                    className="h-8 px-2 bg-neon-blue text-black font-black text-[9px] rounded-sm uppercase cursor-pointer"
                                  >
                                    Assign
                                  </button>
                                </div>
                              ) : (
                                <strong className="text-white text-xs block mt-0.5">{tgt.trackingNumber || 'Awaiting assignment...'}</strong>
                              )}
                            </div>
                          </div>

                          {/* Order Status triggers */}
                          <div className="space-y-4 pt-2">
                            <span className="text-[9px] font-black text-white/50 tracking-widest uppercase block">UPDATE SECURE STATUS CHECKPOINT:</span>
                            
                            <div className="flex flex-wrap gap-2">
                              {[
                                'Order Received', 'Awaiting Purchase', 'Purchased in Japan', 
                                'Arrived at Japan Facility', 'Packed for Shipment', 'Shipped', 'Delivered'
                              ].map((step) => {
                                const isActive = tgt.status === step;
                                return (
                                  <button
                                    key={step}
                                    onClick={() => {
                                      updateOrderStatus(tgt.id, step as any, activeAdminSession.name, customStatusNote.trim() || undefined);
                                      setCustomStatusNote('');
                                      // prefill tracking if status becomes shipped
                                      if (step === 'Shipped' && !tgt.trackingNumber) {
                                        setEditingTrackingNum('OTK-TRK-' + Math.floor(10000 + Math.random() * 90000));
                                      }
                                    }}
                                    className={`px-3 py-2 text-[9px] tracking-widest font-black uppercase rounded-sm border transition-all cursor-pointer ${
                                      isActive 
                                        ? 'bg-neon-red border-neon-red text-white shadow-[0_0_15px_rgba(255,0,60,0.3)]'
                                        : 'bg-white/5 border-white/5 text-white/60 hover:border-white/20 hover:text-white'
                                    }`}
                                  >
                                    {isActive ? '● ' : ''} {step}
                                  </button>
                                );
                              })}
                            </div>

                            {/* Custom fulfillment notes comment */}
                            <div className="space-y-2 mt-4 pt-4 border-t border-white/5">
                              <label className="text-[9px] text-white/50 tracking-widest uppercase block font-bold">OPTIONAL TIMELINE STATUS MEMO (CUSTOMER VISIBLE):</label>
                              <input 
                                type="text"
                                placeholder="e.g. Purchase authorized at AmiAmi Akihabara. Package being brought to facilities."
                                value={customStatusNote}
                                onChange={(e) => setCustomStatusNote(e.target.value)}
                                className="w-full h-11 px-4 bg-white/5 border border-white/10 rounded-sm text-xs text-white outline-none focus:border-neon-blue"
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* Main Orders Table */}
                <div className="border border-white/5 bg-[#070912] rounded-sm p-6">
                  {filteredOrders.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-white/10 text-[9px] font-mono uppercase text-white/35">
                            <th className="py-3">ORDER ID</th>
                            <th className="py-3">BUYER DETAILS</th>
                            <th className="py-3">MANIFEST</th>
                            <th className="py-3 text-right">TOTAL NET</th>
                            <th className="py-3">TRANSPORTATE</th>
                            <th className="py-3">LOGISTICS CHECKS</th>
                            <th className="py-3 text-right">ACTION</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.02]">
                          {filteredOrders.map((o) => (
                            <tr key={o.id} className="hover:bg-white/[0.01] transition-all">
                              <td className="py-4 font-mono text-neon-blue font-black">{o.id}</td>
                              <td className="py-4">
                                <span className="font-bold text-white uppercase block leading-tight">{o.customerName}</span>
                                <span className="text-[9px] text-white/35 font-mono">{o.customerEmail}</span>
                              </td>
                              <td className="py-4 max-w-[200px] truncate leading-tight">
                                {o.products.map(p => `${p.name} (x${p.quantity})`).join(', ')}
                              </td>
                              <td className="py-4 text-right font-mono font-black italic text-white pr-2">N{o.amountPaid.toLocaleString()}</td>
                              <td className="py-4">
                                <span className="text-[10px] text-white/60 uppercase block font-medium max-w-[120px] truncate">
                                  {o.shippingMethod}
                                </span>
                              </td>
                              <td className="py-4">
                                <span className={`px-2 py-0.5 rounded-sm text-[8px] uppercase tracking-wider font-extrabold block w-max ${
                                  o.status === 'Order Received' ? 'bg-neon-blue/15 text-neon-blue border border-neon-blue/20' :
                                  o.status === 'Awaiting Purchase' ? 'bg-yellow-500/10 text-yellow-500' :
                                  o.status === 'Purchased in Japan' ? 'bg-[#ff003c]/15 text-neon-red' :
                                  o.status === 'Delivered' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-white/5 text-white/50'
                                }`}>
                                  {o.status}
                                </span>
                              </td>
                              <td className="py-4 text-right">
                                <button
                                  onClick={() => {
                                    setManagingOrderId(o.id);
                                    setEditingTrackingNum(o.trackingNumber || '');
                                  }}
                                  className="px-2.5 py-1.5 bg-white/5 hover:bg-neon-blue hover:text-black border border-white/5 rounded-sm text-[9px] font-black uppercase tracking-wider cursor-pointer transition-colors"
                                >
                                  Manage Fulfill
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="py-12 text-center text-white/30 space-y-2">
                      <Inbox className="w-10 h-10 mx-auto" />
                      <p className="text-xs uppercase tracking-widest font-mono">No matching fulfill documents located.</p>
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* TAB: PRODUCTS MANAGEMENT */}
            {activeTab === 'products' && (
              <div className="space-y-8 animate-fade-in">
                
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-6">
                  <div>
                    <h2 className="text-2xl font-display font-black uppercase italic tracking-tight">
                      CATALOG <span className="text-neon-red">MERCHANDISE</span> EDITOR
                    </h2>
                    <p className="text-white/45 text-xs">Add dynamic Japanese imports, alter prices, configure pre-order details, weight or hide catalog rows.</p>
                  </div>

                  {/* Add action */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsAddingProduct(!isAddingProduct)}
                      className="px-4 h-10 bg-neon-blue hover:bg-neon-blue/90 text-black font-black text-[10px] tracking-widest uppercase flex items-center gap-2 rounded-sm cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      ADD ANIME PRODUCT
                    </button>

                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                      <input 
                        type="text"
                        placeholder="SEARCH MERCHANDISE..."
                        value={productQuery}
                        onChange={(e) => setProductQuery(e.target.value)}
                        className="h-10 pl-9 pr-4 bg-white/5 border border-white/10 rounded-sm text-xs text-white placeholder-white/20 focus:border-neon-blue outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Wizard: ADD PRODUCT FORM */}
                {isAddingProduct && (
                  <form onSubmit={handleAddProductSubmit} className="p-6 border border-neon-blue/20 bg-[#090c17] rounded-sm space-y-6">
                    <div className="flex justify-between items-center border-b border-white/5 pb-3">
                      <span className="text-[10px] font-black text-[#00f2ff] tracking-widest uppercase">REGISTRATION WIZARD: IMPORT DOCK</span>
                      <button type="button" onClick={() => setIsAddingProduct(false)} className="text-[9px] text-[#ff003c] tracking-widest uppercase font-black">X CANCEL</button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="text-[9px] text-white/50 tracking-widest uppercase block mb-1">PRODUCT NAME</label>
                          <input 
                            type="text" required placeholder="e.g. Gojo Satoru Plush Doll"
                            value={newProdName} onChange={(e) => setNewProdName(e.target.value)}
                            className="w-full h-10 px-3 bg-white/5 border border-white/10 rounded-sm text-xs text-white placeholder-white/20 outline-none"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[9px] text-white/50 tracking-widest uppercase block mb-1">NIRE PRICE (₦)</label>
                            <input 
                              type="number" required placeholder="₦"
                              value={newProdPrice} onChange={(e) => setNewProdPrice(Number(e.target.value))}
                              className="w-full h-10 px-3 bg-white/5 border border-white/10 rounded-sm text-xs text-white outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] text-white/50 tracking-widest uppercase block mb-1">CATEGORY</label>
                            <input 
                              type="text" required placeholder="Figures / Apparel"
                              value={newProdCategory} onChange={(e) => setNewProdCategory(e.target.value)}
                              className="w-full h-10 px-3 bg-white/5 border border-white/10 rounded-sm text-xs text-white outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[9px] text-white/50 tracking-widest uppercase block mb-1">IMAGE SOURCE URL</label>
                          <input 
                            type="url" required
                            value={newProdImage} onChange={(e) => setNewProdImage(e.target.value)}
                            className="w-full h-10 px-3 bg-white/5 border border-white/10 rounded-sm text-xs text-white outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-[9px] text-white/50 tracking-widest uppercase block mb-1">ANIME SERIES</label>
                          <input 
                            type="text" required placeholder="e.g. Jujutsu Kaisen"
                            value={newProdSeries} onChange={(e) => setNewProdSeries(e.target.value)}
                            className="w-full h-10 px-3 bg-white/5 border border-white/10 rounded-sm text-xs text-white outline-none"
                          />
                        </div>
                      </div>

                      {/* Admin Private fields */}
                      <div className="space-y-4 bg-black/30 p-4 border border-white/5 rounded-sm">
                        <span className="text-[9px] font-black text-neon-red tracking-widest uppercase block border-b border-white/5 pb-2">ADMIN-ONLY ENCRYPT DATA (HIDDEN FROM BUYERS)</span>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[9px] text-white/50 tracking-widest uppercase block mb-1">SOURCE SUPPLIER</label>
                            <input 
                              type="text" placeholder="AmiAmi / Surugaya"
                              value={newProdStore} onChange={(e) => setNewProdStore(e.target.value)}
                              className="w-full h-10 px-3 bg-white/5 border border-white/10 rounded-sm text-xs text-white outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] text-white/50 tracking-widest uppercase block mb-1">JPY NET COST (¥)</label>
                            <input 
                              type="number" placeholder="JPY cost"
                              value={newProdCostJpy} onChange={(e) => setNewProdCostJpy(Number(e.target.value))}
                              className="w-full h-10 px-3 bg-white/5 border border-white/10 rounded-sm text-xs text-white outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[9px] text-white/50 tracking-widest uppercase block mb-1">ORIGINAL SUPPLIER LINK URL</label>
                          <input 
                            type="url" placeholder="https://"
                            value={newProdUrl} onChange={(e) => setNewProdUrl(e.target.value)}
                            className="w-full h-10 px-3 bg-white/5 border border-white/10 rounded-sm text-xs text-white outline-none"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[9px] text-white/50 tracking-widest uppercase block mb-1">WEIGHT (GRAMS)</label>
                            <input 
                              type="number" placeholder="450g"
                              value={newProdWeight} onChange={(e) => setNewProdWeight(Number(e.target.value))}
                              className="w-full h-10 px-3 bg-white/5 border border-white/10 rounded-sm text-xs text-white outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] text-white/50 tracking-widest uppercase block mb-1">PRE-ORDER VAULT</label>
                            <div className="flex items-center gap-3 h-10">
                              <input 
                                type="checkbox"
                                checked={newProdIsPreorder} onChange={(e) => setNewProdIsPreorder(e.target.checked)}
                                className="accent-neon-blue h-4 w-4"
                              />
                              <span className="text-[10px] text-white font-black">ENABLE PRE-ORDER</span>
                            </div>
                          </div>
                        </div>

                        {newProdIsPreorder && (
                          <div>
                            <label className="text-[9px] text-amber-500 tracking-widest uppercase block mb-1 font-bold">PREORDER TOTAL QUANTITY LIMIT</label>
                            <input 
                              type="number"
                              value={newProdPreorderLimit} onChange={(e) => setNewProdPreorderLimit(Number(e.target.value))}
                              className="w-full h-10 px-3 bg-white/5 border border-amber-500/20 rounded-sm text-xs text-amber-500 outline-none"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/5 flex gap-2">
                      <button 
                        type="submit"
                        className="flex-1 h-12 bg-neon-blue hover:bg-neon-blue/95 text-black font-black text-xs tracking-widest uppercase transition-transform hover:-translate-y-0.5"
                      >
                        PUBLISH AND EXPORT TO STOREFRONT
                      </button>
                    </div>
                  </form>
                )}

                {/* Wizard: EDIT PRODUCT DIALOG */}
                {editingProductId && (
                  <form onSubmit={handleUpdateProductSubmit} className="p-6 border border-yellow-500/20 bg-[#090c17] rounded-sm space-y-4">
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                      <span className="text-[10px] font-black text-yellow-500 tracking-widest uppercase">CATALOG AMENDMENT LOG SHEETS</span>
                      <button type="button" onClick={() => setEditingProductId(null)} className="text-[9px] text-white/40 uppercase">X CANCEL</button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-[9px] text-white/40 block mb-1">NAME</label>
                        <input type="text" required value={editFormName} onChange={e => setEditFormName(e.target.value)} className="w-full h-9 px-3 bg-white/5 border border-white/10 rounded-sm text-xs"/>
                      </div>
                      <div>
                        <label className="text-[9px] text-white/40 block mb-1">PRICE (₦)</label>
                        <input type="number" required value={editFormPrice} onChange={e => setEditFormPrice(Number(e.target.value))} className="w-full h-9 px-3 bg-white/5 border border-white/10 rounded-sm text-xs"/>
                      </div>
                      <div>
                        <label className="text-[9px] text-white/40 block mb-1">ANIME UNIVERSE</label>
                        <input type="text" required value={editFormSeries} onChange={e => setEditFormSeries(e.target.value)} className="w-full h-9 px-3 bg-white/5 border border-white/10 rounded-sm text-xs"/>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                      <div>
                        <label className="text-[9px] text-white/40 block mb-1">BUY PRICE IN JPY (¥)</label>
                        <input type="number" required value={editFormCostJpy} onChange={e => setEditFormCostJpy(Number(e.target.value))} className="w-full h-9 bg-white/5 border border-white/10 rounded-sm text-xs text-yellow-500"/>
                      </div>
                      <div>
                        <label className="text-[9px] text-white/40 block mb-1">WEIGHT (GRAMS)</label>
                        <input type="number" required value={editFormWeight} onChange={e => setEditFormWeight(Number(e.target.value))} className="w-full h-9 bg-white/5 border border-white/10 rounded-sm text-xs"/>
                      </div>
                      <div>
                        <label className="text-[9px] text-amber-500 block mb-1 font-bold">PREORDER QUANTITY LIMIT</label>
                        <input type="number" value={editFormPreLimit} onChange={e => setEditFormPreLimit(Number(e.target.value))} className="w-full h-9 bg-white/5 border border-white/10 rounded-sm text-xs text-amber-500"/>
                      </div>
                    </div>

                    <div className="flex gap-2 justify-end pt-3">
                      <button type="submit" className="px-5 py-2.5 bg-yellow-500 text-black font-black text-[9px] tracking-widest uppercase rounded-sm cursor-pointer">SAVE UPDATED DATA</button>
                    </div>
                  </form>
                )}

                {/* Products Table */}
                <div className="border border-white/5 bg-[#070912] rounded-sm p-6">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-white/10 text-[9px] font-mono uppercase text-white/35">
                          <th className="py-2.5">IMAGE</th>
                          <th className="py-2.5">NAME & UNIVERSE</th>
                          <th className="py-2.5 text-right">₦ SELL</th>
                          <th className="py-2.5 text-right">JPY COST</th>
                          <th className="py-2.5">SOURCE TARGET</th>
                          <th className="py-2.5">VAULT STATUS</th>
                          <th className="py-2.5 text-right">CATALOG CONTROLS</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.02]">
                        {products.filter(p => p.name.toLowerCase().includes(productQuery.toLowerCase())).map((p) => {
                          const isPre = p.isPreorder;
                          return (
                            <tr key={p.id} className="hover:bg-white/[0.01]">
                              <td className="py-3.5">
                                <div className="w-10 h-10 rounded-sm overflow-hidden bg-slate-900 border border-white/5">
                                  <img src={p.image} className="w-full h-full object-cover" />
                                </div>
                              </td>
                              <td className="py-3.5 pr-4">
                                <span className="font-bold text-white block uppercase max-w-sm truncate leading-tight">{p.name}</span>
                                <span className="text-[9px] text-[#00f2ff] tracking-wider uppercase font-extrabold mt-0.5 block">{p.animeSeries}</span>
                              </td>
                              <td className="py-3.5 text-right font-mono font-black italic text-white pr-2">N{p.price.toLocaleString()}</td>
                              <td className="py-3.5 text-right font-mono text-yellow-500 pr-2">¥{p.purchasePriceJpy?.toLocaleString() || '-'}</td>
                              <td className="py-3.5">
                                <span className="text-[10px] text-white/40 block capitalize truncate max-w-[120px]">
                                  {p.sourceStore || '-'}
                                </span>
                                {p.sourceUrl && (
                                  <a href={p.sourceUrl} target="_blank" rel="noreferrer" className="text-[8px] text-neon-blue hover:underline font-mono uppercase">Go supplier</a>
                                )}
                              </td>
                              <td className="py-3.5">
                                <div className="space-y-1">
                                  {/* Badges */}
                                  <div className="flex flex-wrap gap-1">
                                    <span className={`px-1 rounded-sm text-[8px] uppercase tracking-wider font-extrabold block ${
                                      p.enabled !== false ? 'bg-emerald-500/10 text-emerald-500' : 'bg-white/5 text-white/30'
                                    }`}>
                                      {p.enabled !== false ? 'Active' : 'Disabled'}
                                    </span>
                                    <span className={`px-1 rounded-sm text-[8px] uppercase tracking-wider font-extrabold block ${
                                      p.soldOut ? 'bg-neon-red/10 text-neon-red' : 'bg-[#00f2ff]/10 text-neon-blue'
                                    }`}>
                                      {p.soldOut ? 'SOLD OUT' : 'AVAILABLE'}
                                    </span>
                                  </div>
                                  {isPre && (
                                    <span className="text-[8px] leading-none bg-amber-500/10 text-amber-500 font-black px-1 rounded-sm uppercase tracking-widest border border-amber-500/20 block w-max">
                                      PRE-ORDER
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="py-3.5 text-right">
                                <div className="flex items-center justify-end gap-1">
                                  {/* Toggle enable / disable */}
                                  <button
                                    onClick={() => {
                                      updateProduct(p.id, { enabled: p.enabled !== false ? false : true });
                                    }}
                                    className="p-1 px-1.5 bg-white/5 hover:bg-white/10 text-white/70 rounded border border-white/5 text-[8px] font-bold uppercase tracking-widest cursor-pointer"
                                    title="Toggle Enable Status"
                                  >
                                    {p.enabled !== false ? 'PAUSE' : 'ACTIVATE'}
                                  </button>

                                  {/* Toggle sold out */}
                                  <button
                                    onClick={() => {
                                      updateProduct(p.id, { soldOut: !p.soldOut });
                                    }}
                                    className="p-1 px-1.5 bg-white/5 hover:bg-white/10 text-white/70 rounded border border-white/5 text-[8px] font-bold uppercase tracking-widest cursor-pointer"
                                  >
                                    {p.soldOut ? 'RESTOCK' : 'MARK OUT'}
                                  </button>

                                  {/* Show/Hide */}
                                  <button
                                    onClick={() => {
                                      updateProduct(p.id, { hide: !p.hide });
                                    }}
                                    className="p-1 px-1.5 bg-white/5 hover:bg-white/10 text-white/70 rounded border border-white/5 text-[8px] font-bold uppercase tracking-widest cursor-pointer"
                                  >
                                    {p.hide ? 'SHOW' : 'HIDE'}
                                  </button>

                                  {/* Edit metrics */}
                                  <button
                                    onClick={() => openEditProductModal(p)}
                                    className="p-1 bg-yellow-500/10 hover:bg-yellow-500 hover:text-black text-yellow-500 rounded border border-yellow-500/20 cursor-pointer"
                                  >
                                    <Edit className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            {/* TAB: PRE-POST VAULTS */}
            {activeTab === 'preorders' && (
              <div className="space-y-8 animate-fade-in">
                <div>
                  <h2 className="text-2xl font-display font-black uppercase italic tracking-tight">
                    PRE-ORDER <span className="text-neon-red">SLOT</span> RESERVES
                  </h2>
                  <p className="text-white/45 text-xs">Verify quantity bounds for hot-ticket items. Reaching 0 slots automatically marks product sold out on storefront.</p>
                </div>

                {/* Preorder status list */}
                <div className="border border-white/5 bg-[#070912] p-6 rounded-sm">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-white/10 text-[9px] font-mono uppercase text-white/35">
                        <th className="py-3">PRODUCT</th>
                        <th className="py-3">ANIME SERIES</th>
                        <th className="py-3 text-right">QUANTITY LIMIT CAP</th>
                        <th className="py-3 text-right">CLIENTS RESERVED</th>
                        <th className="py-3 text-right">SLOTS REMAINING</th>
                        <th className="py-3 text-right">AUTO STATUS</th>
                        <th className="py-3 text-right">ACTION ADJUST LIMIT</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.02]">
                      {products.filter(p => p.isPreorder).map(p => {
                        const limit = p.preorderLimit || 10;
                        const count = p.preorderCount || 0;
                        const remaining = Math.max(0, limit - count);
                        const isMaxed = remaining === 0;

                        return (
                          <tr key={p.id} className="hover:bg-white/[0.01]">
                            <td className="py-4">
                              <span className="font-bold text-white uppercase block leading-tight">{p.name}</span>
                              <span className="text-[10px] text-white/30 italic">ID: {p.id}</span>
                            </td>
                            <td className="py-4 font-mono text-neon-blue uppercase text-[10px]">{p.animeSeries}</td>
                            <td className="py-4 text-right font-mono font-black text-white">{limit}</td>
                            <td className="py-4 text-right font-mono text-yellow-400">{count} joined</td>
                            <td className="py-4 text-right font-mono text-emerald-400 pr-2">
                              {isMaxed ? <span className="text-neon-red font-bold">0 SLOTS (MAXED)</span> : `${remaining} slots`}
                            </td>
                            <td className="py-4 text-right">
                              <span className={`px-2 py-0.5 rounded-sm text-[8px] uppercase tracking-wider font-extrabold ${
                                isMaxed ? 'bg-neon-red/10 text-neon-red border border-neon-red/20' : 'bg-emerald-500/10 text-emerald-500'
                              }`}>
                                {isMaxed ? 'SOLD OUT GATED' : 'ACTIVE LISTING'}
                              </span>
                            </td>
                            <td className="py-4 text-right">
                              <button
                                onClick={() => {
                                  openEditProductModal(p);
                                }}
                                className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] uppercase font-black tracking-widest rounded-sm cursor-pointer"
                              >
                                Alter Cap
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

              </div>
            )}

            {/* TAB: CUSTOMERS VAULT */}
            {activeTab === 'customers' && (
              <div className="space-y-8 animate-fade-in">
                <div>
                  <h2 className="text-2xl font-display font-black uppercase italic tracking-tight">
                    BUYERS <span className="text-neon-red">LEDGER</span> HISTORY
                  </h2>
                  <p className="text-white/45 text-xs">Verify total spend counters and orders count on a per-user billing basis.</p>
                </div>

                <div className="border border-white/5 bg-[#070912] p-6 rounded-sm">
                  {customersList.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-white/10 text-[9px] font-mono uppercase text-white/35">
                            <th className="py-3">BUYER NAME</th>
                            <th className="py-3">BILLING EMAIL</th>
                            <th className="py-3 text-right">TOTAL ORDERS SECTOR</th>
                            <th className="py-3">REGISTERED TRACES</th>
                            <th className="py-3 text-right">TOTAL SPENT VALUE</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.02]">
                          {customersList.map((c, idx) => (
                            <tr key={idx} className="hover:bg-white/[0.01]">
                              <td className="py-4 font-bold text-white uppercase">{c.name}</td>
                              <td className="py-4 font-mono text-[#00f2ff]">{c.email}</td>
                              <td className="py-4 text-right font-mono text-white pr-4">{c.orderCount} purchases</td>
                              <td className="py-4 text-[10px] font-mono text-white/45 truncate max-w-[200px]">{c.orders.join(', ')}</td>
                              <td className="py-4 text-right font-mono font-black italic text-neon-red">N{c.spend.toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="py-12 text-center text-white/30">
                      <p className="text-xs uppercase font-mono tracking-widest">No customer profiles populated in database.</p>
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* TAB: SHIPPING CHANNELS EDITOR */}
            {activeTab === 'shipping' && (
              <div className="space-y-8 animate-fade-in">
                <div>
                  <h2 className="text-2xl font-display font-black uppercase italic tracking-tight">
                    SHIPPING <span className="text-neon-red">CHANNELS</span> RATES
                  </h2>
                  <p className="text-white/45 text-xs">Configure the names, base pricing weights, and estimates of shipment routes dynamically. Updates immediately sync to checkout drawer.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {shippingOptions.map(opt => {
                    const isEditing = editingShippingId === opt.id;
                    return (
                      <div key={opt.id} className="p-6 border border-white/5 bg-[#0a0d1a] hover:border-white/15 transition-all text-left rounded-sm relative flex flex-col justify-between">
                        
                        <div className="space-y-3">
                          <span className="text-[#00f2ff] font-mono text-[9px] font-black uppercase tracking-wider">CHANNEL PROTOCOL</span>
                          
                          {isEditing ? (
                            <div className="space-y-3">
                              <input 
                                type="text"
                                value={opt.name}
                                onChange={(e) => updateShippingOption(opt.id, { name: e.target.value })}
                                className="w-full h-8 px-2 bg-white/5 border border-white/10 rounded-sm text-xs font-bold text-white uppercase"
                              />
                              <input 
                                type="number"
                                value={opt.price}
                                onChange={(e) => updateShippingOption(opt.id, { price: Number(e.target.value) })}
                                className="w-full h-8 px-2 bg-white/5 border border-white/10 rounded-sm text-xs font-mono text-white"
                              />
                              <input 
                                type="text"
                                value={opt.deliveryEstimate}
                                onChange={(e) => updateShippingOption(opt.id, { deliveryEstimate: e.target.value })}
                                className="w-full h-8 px-2 bg-white/5 border border-white/10 rounded-sm text-xs text-white"
                              />
                            </div>
                          ) : (
                            <div>
                              <strong className="text-sm font-display font-black text-white block uppercase leading-none mb-1">{opt.name}</strong>
                              <span className="font-display font-black italic text-xl text-neon-red">N{opt.price.toLocaleString()}</span>
                              <p className="text-[10px] text-white/40 uppercase tracking-wider font-mono mt-1">Estimates: {opt.deliveryEstimate}</p>
                            </div>
                          )}
                        </div>

                        <div className="pt-6 mt-6 border-t border-white/5">
                          <button
                            onClick={() => setEditingShippingId(isEditing ? null : opt.id)}
                            className="w-full py-2 bg-white/5 hover:bg-neon-blue hover:text-black border border-white/10 hover:border-none text-[9px] font-black tracking-widest rounded-sm uppercase cursor-pointer transition-colors"
                          >
                            {isEditing ? 'COMMIT EDITS' : 'EDIT SHIPPING METHODS'}
                          </button>
                        </div>

                      </div>
                    );
                  })}
                </div>

              </div>
            )}

            {/* TAB: ROI / PROFIT CALCULATOR */}
            {activeTab === 'profit' && (
              <div className="space-y-8 animate-fade-in">
                <div>
                  <h2 className="text-2xl font-display font-black uppercase italic tracking-tight">
                    IMPORT <span className="text-neon-red">PRICE</span> MARGINS SHEET
                  </h2>
                  <p className="text-white/45 text-xs">Perform pricing ROI simulations. Enter purchase and logistics parameters to calculate exact returns margins without editing files.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                  
                  {/* Left input panel */}
                  <form onSubmit={e => e.preventDefault()} className="grid md:col-span-8 p-6 bg-[#0a0d1a] border border-white/5 rounded-sm gap-4">
                    <span className="text-[9px] font-black tracking-widest text-[#00f2ff] block mb-2 uppercase">MARGINE REGISTRY LOG FORM</span>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[9px] text-white/40 uppercase block mb-1">JP MERCHANDISE BUY ¥ (JPY)</label>
                        <input 
                          type="number"
                          value={calcCostJpy}
                          onChange={(e) => setCalcCostJpy(Number(e.target.value))}
                          className="w-full h-11 px-3 bg-white/5 border border-white/10 rounded-sm text-xs font-mono text-white text-yellow-500"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-white/40 uppercase block mb-1">JPY TO ₦ CONVERSION FACTOR</label>
                        <input 
                          type="number" step="0.1"
                          value={calcRate}
                          onChange={(e) => setCalcRate(Number(e.target.value))}
                          className="w-full h-11 px-3 bg-white/5 border border-white/10 rounded-sm text-xs font-mono text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="text-[9px] text-white/40 uppercase block mb-1">DOMESTIC TOKYO DOCK ₦</label>
                        <input 
                          type="number"
                          value={calcJapanShip}
                          onChange={(e) => setCalcJapanShip(Number(e.target.value))}
                          className="w-full h-10 px-3 bg-white/5 border border-white/10 rounded-sm text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-white/40 uppercase block mb-1">AIR CARGO INT SHIPPING ₦</label>
                        <input 
                          type="number"
                          value={calcIntShip}
                          onChange={(e) => setCalcIntShip(Number(e.target.value))}
                          className="w-full h-10 px-3 bg-white/5 border border-white/10 rounded-sm text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-white/40 uppercase block mb-1">PAYMENT GATEWAY FEES ₦</label>
                        <input 
                          type="number"
                          value={calcFee}
                          onChange={(e) => setCalcFee(Number(e.target.value))}
                          className="w-full h-10 px-3 bg-white/5 border border-white/10 rounded-sm text-xs font-mono"
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <label className="text-[10px] text-neon-blue uppercase block mb-1 font-bold">PROPOSED CUSTOMER SELLING PRICE ₦</label>
                      <input 
                        type="number"
                        value={calcSellingPrice}
                        onChange={(e) => setCalcSellingPrice(Number(e.target.value))}
                        className="w-full h-11 px-3 bg-white/5 border border-[#00f2ff]/20 rounded-sm text-xs font-mono text-white focus:border-neon-blue text-display italic font-black"
                      />
                    </div>
                  </form>

                  {/* Right ROI Results card */}
                  <div className="md:col-span-4 p-6 bg-[#070912] border border-white/5 rounded-sm space-y-6">
                    <span className="text-[9px] font-mono text-white/45 block border-b border-white/5 pb-2 uppercase text-center">ROI STATISTICAL AUDIT</span>
                    
                    <div className="space-y-4">
                      
                      <div className="text-center">
                        <span className="text-[9px] text-white/30 tracking-widest uppercase block">ROI PERCENTAGE MARGINS</span>
                        <strong className={`text-4xl font-display font-black block mt-2 ${
                          calculatedProfitPercent > 30 ? 'text-emerald-500' : 'text-yellow-500'
                        }`}>
                          {calculatedProfitPercent}%
                        </strong>
                      </div>

                      <div className="h-[1px] bg-white/5" />

                      <div className="space-y-2 text-[11px]">
                        <div className="flex justify-between uppercase">
                          <span className="text-white/40">LANDED COST TOTAL:</span>
                          <span className="font-mono text-white">N{calculatedTotalCost.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between uppercase font-black text-neon-red">
                          <span>PROPOSED PROFIT AMOUNT:</span>
                          <span className="font-mono">N{calculatedProfitAmount.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="bg-white/[0.02] border border-white/5 p-3 rounded-sm">
                        <span className="text-[9px] text-amber-500 uppercase font-black tracking-widest block mb-1">AUDIT VERDICT</span>
                        <p className="text-[10px] text-white/60 leading-relaxed">
                          {calculatedProfitPercent >= 50 
                            ? '✅ HIGH PROFITABILITY MARGIN. Safe to export items to index storefront catalogues.' 
                            : calculatedProfitPercent >= 15 
                            ? '⚠️ AVERAGE Margins. Ensure international transport metrics are bundled to keep shipping optimal.' 
                            : '❌ CRITICAL LOSS ZONE. Adjust propsal or source JPY pricing logs.'
                          }
                        </p>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Pre-fill quick loading from database products list */}
                <div className="p-6 bg-[#070912] border border-white/5 rounded-sm">
                  <span className="text-[10px] font-black text-white/40 block mb-4 uppercase">PRE-FILL REGISTERED MERCHANDISE VALUES FOR MARGIN CALCULATION</span>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-h-72 overflow-y-auto scrollbar-thin">
                    {products.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          setCalcCostJpy(p.purchasePriceJpy || 3000);
                          setCalcSellingPrice(p.price);
                          setCalcJapanShip(1200); // estimation prefill
                          setCalcIntShip(7000);
                          setCalcFee(Math.floor(p.price * 0.03)); // 3% estimation
                        }}
                        className="p-3 bg-white/5 hover:bg-neon-blue/10 border border-white/5 hover:border-neon-blue rounded-sm text-left transition-all cursor-pointer truncate"
                      >
                        <span className="text-[9px] text-white/40 block uppercase">LOAD STATS</span>
                        <strong className="text-[10px] text-white uppercase font-bold block truncate mt-1">{p.name}</strong>
                        <span className="text-[9px] font-mono text-neon-red italic">₦{p.price.toLocaleString()}</span>
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* TAB: PRESET SETTINGS */}
            {activeTab === 'settings' && (
              <div className="space-y-8 animate-fade-in p-6 bg-[#0a0d1a] border border-white/5 rounded-sm text-left">
                <div>
                  <h2 className="text-xl font-display font-black uppercase italic tracking-tight mb-2">
                    GATEWAY SYSTEM <span className="text-neon-red">SETTINGS</span>
                  </h2>
                  <p className="text-white/45 text-xs">Verify API configurations, webhook triggers, and administrative user listings.</p>
                </div>
                <div className="h-[1px] bg-white/10" />
                <p className="text-sm text-white/65">
                  Secure administration access protocols active. Under system-wide operations, no credentials or hidden developer parameters (such as original Surugaya JPY procurement values ¥) are ever leaked in client network traces.
                </p>
                <div className="p-4 bg-white/[0.02] border border-white/5 rounded">
                  <span className="font-mono text-neon-blue text-xs block mb-1">API SERVICE STATUS</span>
                  <div className="grid grid-cols-2 gap-3 text-xs text-white/40 mt-3 font-mono">
                    <div className="flex justify-between border-b border-white/5 pb-1">
                      <span>STREAMS LIST WEBHOOK:</span>
                      <strong className="text-emerald-500">CONNECTED</strong>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-1">
                      <span>MAIL DISPATCH SYSTEM:</span>
                      <strong className="text-emerald-500">ACTIVE LOGS</strong>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
