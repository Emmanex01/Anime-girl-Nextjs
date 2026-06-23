import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useShopStore } from '../store/useShopStore';
import { 
  LayoutDashboard, ShoppingBag, Truck, Heart, MapPin, 
  Settings, Bell, LogOut, Plus, Trash2, Edit, Check, 
  MapPinOff, ArrowLeft, Clock, ShoppingCart, User, Phone, Mail, Lock
} from 'lucide-react';
import { Product, CustomerAddress, Order } from '../types';

export function AccountDashboard() {
  const { 
    currentCustomer, logoutCustomer, 
    orders, wishlist, removeFromWishlist, addToCart,
    addresses, addAddress, updateAddress, deleteAddress, setDefaultAddress,
    customerNotifications, markCustomerNotificationRead,
    updateCustomerProfile, setCurrentRoute, showNotification
  } = useShopStore();

  // If no customer logged in (should not happen due to App.tsx auth guard, but safe fallback)
  if (!currentCustomer) {
    return (
      <div className="py-24 text-center">
        <p className="text-white/60 mb-4">Please log in to view your dashboard.</p>
        <button 
          onClick={() => setCurrentRoute('home')} 
          className="px-6 py-2.5 bg-neon-red text-white uppercase text-xs tracking-widest font-black rounded-lg"
        >
          Return Home
        </button>
      </div>
    );
  }

  // Active view state inside layout
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'tracking' | 'wishlist' | 'addresses' | 'settings' | 'notifications'>('dashboard');
  
  // Tracking state helper
  const [selectedTrackingOrder, setSelectedTrackingOrder] = useState<Order | null>(null);

  // Filter orders where customerEmail matches logged in user's email
  const customerOrders = orders.filter(
    (order) => order.customerEmail.toLowerCase() === currentCustomer.email.toLowerCase()
  );

  // Filter notifications belonging to logged in user
  const customerNotifs = customerNotifications.filter(
    (notif) => notif.customerId === currentCustomer.id
  );
  const unreadNotifsCount = customerNotifs.filter(n => !n.isRead).length;

  // Filter addresses belonging to logged in user
  const customerAddresses = addresses.filter(
    (addr) => addr.customerId === currentCustomer.id
  );

  // Address form editing help states
  const [addressFormOpen, setAddressFormOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<CustomerAddress | null>(null);
  
  // Address parameters
  const [addrFullName, setAddrFullName] = useState('');
  const [addrPhone, setAddrPhone] = useState('');
  const [addrCountry, setAddrCountry] = useState('Japan');
  const [addrState, setAddrState] = useState('');
  const [addrCity, setAddrCity] = useState('');
  const [addrStreet, setAddrStreet] = useState('');
  const [addrIsDefault, setAddrIsDefault] = useState(false);

  // Account editing parameters
  const [editName, setEditName] = useState(currentCustomer.name);
  const [editPhone, setEditPhone] = useState(currentCustomer.phone);
  const [editPassword, setEditPassword] = useState(currentCustomer.password || '');
  const [editEmail, setEditEmail] = useState(currentCustomer.email); // Read-only but displayed

  const handleEditProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim() || !editPhone.trim() || !editPassword.trim()) {
      showNotification('Please fill out all settings fields', 'info');
      return;
    }
    const res = updateCustomerProfile({
      name: editName,
      phone: editPhone,
      password: editPassword
    });
    if (res.success) {
      showNotification('Profile updated successfully!', 'success');
    }
  };

  const handleOpenAddAddress = () => {
    setEditingAddress(null);
    setAddrFullName(currentCustomer.name);
    setAddrPhone(currentCustomer.phone);
    setAddrCountry('Japan');
    setAddrState('');
    setAddrCity('');
    setAddrStreet('');
    setAddrIsDefault(customerAddresses.length === 0); // make default if first address
    setAddressFormOpen(true);
  };

  const handleOpenEditAddress = (addr: CustomerAddress) => {
    setEditingAddress(addr);
    setAddrFullName(addr.fullName);
    setAddrPhone(addr.phone);
    setAddrCountry(addr.country);
    setAddrState(addr.state);
    setAddrCity(addr.city);
    setAddrStreet(addr.streetAddress);
    setAddrIsDefault(addr.isDefault);
    setAddressFormOpen(true);
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrFullName.trim() || !addrPhone.trim() || !addrState.trim() || !addrCity.trim() || !addrStreet.trim()) {
      showNotification('Please fill in all address parameters.', 'info');
      return;
    }

    const payload = {
      fullName: addrFullName,
      phone: addrPhone,
      country: addrCountry,
      state: addrState,
      city: addrCity,
      streetAddress: addrStreet,
      isDefault: addrIsDefault
    };

    if (editingAddress) {
      updateAddress(editingAddress.id, payload);
      showNotification('Address updated successfully.', 'success');
    } else {
      addAddress(payload);
      showNotification('Address registered successfully.', 'success');
    }
    setAddressFormOpen(false);
  };

  const handleMarkAllRead = () => {
    customerNotifs.forEach(n => {
      if (!n.isRead) markCustomerNotificationRead(n.id);
    });
    showNotification('All notifications marked as read', 'success');
  };

  const startTrackingOrder = (order: Order) => {
    setSelectedTrackingOrder(order);
    setActiveTab('tracking');
  };

  const TIMELINE_STATES = [
    'Order Received',
    'Awaiting Purchase',
    'Purchased in Japan',
    'Arrived at Japan Facility',
    'Packed for Shipment',
    'Shipped',
    'Delivered'
  ];

  return (
    <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-32 min-h-screen">
      {/* Header Profile Title banner */}
      <div className="mb-10 p-6 md:p-10 rounded-2xl bg-gradient-to-r from-neutral-900 to-black border border-white/5 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-neon-red opacity-[0.05] blur-3xl rounded-full pointer-events-none" />
        
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-neon-red/10 border border-neon-red/20 flex items-center justify-center text-neon-red font-black text-2xl uppercase">
            {currentCustomer.name.slice(0, 2)}
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-neon-red">
              {currentCustomer.role} Tier Member
            </span>
            <h1 className="text-2xl md:text-3xl font-black font-display text-white italic uppercase mt-0.5">
              {currentCustomer.name}
            </h1>
            <p className="text-xs text-white/50">{currentCustomer.email} • Active session</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {unreadNotifsCount > 0 && (
            <button 
              onClick={() => setActiveTab('notifications')}
              className="px-4 py-2 bg-neon-blue/10 border border-neon-blue/20 hover:border-neon-blue/50 text-neon-blue text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center gap-2"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>{unreadNotifsCount} New Updates</span>
            </button>
          )}

          {currentCustomer.role !== 'CUSTOMER' && (
            <button 
              onClick={() => setCurrentRoute('admin')}
              className="px-4 py-2 bg-neon-red text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center gap-2 filter hover:brightness-110 shadow-lg hover:shadow-neon-red/25"
            >
              <User className="w-3.5 h-3.5" />
              <span>Enter Admin Terminal</span>
            </button>
          )}

          <button 
            onClick={logoutCustomer}
            className="px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white/70 hover:text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center gap-2"
          >
            <LogOut className="w-3.5 h-3.5 text-neon-red" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Nav */}
        <div className="lg:col-span-1 space-y-2">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'orders', label: 'My Orders', icon: ShoppingBag, count: customerOrders.length },
            { id: 'tracking', label: 'Order Tracking', icon: Truck },
            { id: 'wishlist', label: 'My Wishlist', icon: Heart, count: wishlist.length },
            { id: 'addresses', label: 'Addresses', icon: MapPin },
            { id: 'settings', label: 'Profile Settings', icon: Settings },
            { id: 'notifications', label: 'Notifications', icon: Bell, count: unreadNotifsCount }
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  if (tab.id !== 'tracking') setSelectedTrackingOrder(null);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all text-left uppercase tracking-wider text-xs font-bold ${
                  isSelected 
                    ? 'bg-neutral-800 text-white border border-white/10 shadow-lg' 
                    : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-neon-red' : 'text-white/40'}`} />
                  <span>{tab.label}</span>
                </div>
                {tab.count !== undefined && tab.count > 0 && (
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${isSelected ? 'bg-neon-red text-white' : 'bg-white/10 text-white/60'}`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Dynamic Display area */}
        <div className="lg:col-span-3 min-h-[500px]">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div
                key="tab-dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                {/* Stats row cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 rounded-2xl bg-neutral-900/60 border border-white/5">
                    <span className="block text-[10px] uppercase font-bold tracking-widest text-white/40">Registered Orders</span>
                    <span className="block text-3xl font-black text-white mt-1 italic">{customerOrders.length}</span>
                    <span className="block text-[10px] text-white/50 mt-1">Headless shop record</span>
                  </div>
                  <div className="p-6 rounded-2xl bg-neutral-900/60 border border-white/5">
                    <span className="block text-[10px] uppercase font-bold tracking-widest text-white/40">Japan Transit List</span>
                    <span className="block text-3xl font-black text-neon-blue mt-1 italic">
                      {customerOrders.filter(o => o.status !== 'Delivered' && o.status !== 'Shipped').length}
                    </span>
                    <span className="block text-[10px] text-neon-blue/60 mt-1">Active fulfillment processes</span>
                  </div>
                  <div className="p-6 rounded-2xl bg-neutral-900/60 border border-white/5">
                    <span className="block text-[10px] uppercase font-bold tracking-widest text-white/40">Saved Items</span>
                    <span className="block text-3xl font-black text-neon-red mt-1 italic">{wishlist.length}</span>
                    <span className="block text-[10px] text-neon-red/60 mt-1">Personal catalog</span>
                  </div>
                </div>

                {/* Dashboard grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Left block of Dashboard - Recent Order */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-black uppercase tracking-widest text-white">Recent Purchases</h3>
                      <button onClick={() => setActiveTab('orders')} className="text-[10px] font-bold text-neon-red uppercase hover:underline">View All</button>
                    </div>

                    {customerOrders.length === 0 ? (
                      <div className="p-8 text-center rounded-2xl border border-dashed border-white/10 bg-neutral-950/20">
                        <ShoppingBag className="w-8 h-8 text-white/20 mx-auto mb-2" />
                        <p className="text-xs text-white/40 font-bold">No registered orders yet</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {customerOrders.slice(0, 2).map((order) => (
                          <div key={order.id} className="p-4 rounded-xl bg-neutral-900/40 border border-white/5 flex items-stretch justify-between gap-4">
                            <div className="space-y-2">
                              <span className="inline-block px-2 py-0.5 rounded bg-white/5 text-[9px] font-mono font-bold tracking-wider text-white">
                                #{order.id}
                              </span>
                              <div className="text-xs font-bold text-white max-w-xs truncate">
                                {order.products.map(p => `${p.name} (x${p.quantity})`).join(', ')}
                              </div>
                              <div className="text-[10px] text-white/40">Placed: {order.dateCreated}</div>
                              <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                                order.status === 'Delivered' 
                                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/20' 
                                  : 'bg-neon-blue/10 text-neon-blue border border-neon-blue/20'
                              }`}>
                                {order.status}
                              </span>
                            </div>
                            <div className="flex flex-col justify-between items-end text-right">
                              <div className="text-sm font-black text-white font-mono">
                                ₦{order.amountPaid.toLocaleString()}
                              </div>
                              <button 
                                onClick={() => startTrackingOrder(order)}
                                className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-[9px] uppercase tracking-widest rounded-lg border border-white/5 transition-all text-center"
                              >
                                Live Track
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right block of Dashboard - Default/Quick Address */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-black uppercase tracking-widest text-white">Shipment destination</h3>
                      <button onClick={() => setActiveTab('addresses')} className="text-[10px] font-bold text-neon-blue uppercase hover:underline">Manage</button>
                    </div>

                    {customerAddresses.length === 0 ? (
                      <div className="p-8 text-center rounded-2xl border border-dashed border-white/10 bg-neutral-950/20">
                        <MapPinOff className="w-8 h-8 text-white/20 mx-auto mb-2" />
                        <p className="text-xs text-white/40 font-bold mb-3">No shipment endpoint registered</p>
                        <button 
                          onClick={handleOpenAddAddress}
                          className="px-4 py-1.5 border border-neon-blue/40 text-neon-blue bg-neon-blue/5 hover:bg-neon-blue/15 text-[10px] font-bold uppercase tracking-widest rounded-lg"
                        >
                          Establish Address
                        </button>
                      </div>
                    ) : (
                      <div className="p-5 rounded-2xl bg-neutral-900/40 border border-white/5 relative">
                        <div className="absolute top-4 right-4 text-[10px] font-black uppercase tracking-widest text-neon-blue bg-neon-blue/10 px-2 py-0.5 border border-neon-blue/20 rounded-md">
                          Default Box
                        </div>
                        
                        {(() => {
                          const defAddr = customerAddresses.find(a => a.isDefault) || customerAddresses[0];
                          return (
                            <div className="space-y-4">
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-neon-blue shrink-0" />
                                <span className="font-bold text-sm text-white">{defAddr.fullName}</span>
                              </div>
                              
                              <div className="space-y-1 pl-6 text-xs text-white/60 font-medium">
                                <p>{defAddr.streetAddress}</p>
                                <p>{defAddr.city}, {defAddr.state}</p>
                                <p>{defAddr.country}</p>
                                <p className="text-white/40 mt-2 font-mono">{defAddr.phone}</p>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'orders' && (
              <motion.div
                key="tab-orders"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h2 className="text-lg font-black uppercase tracking-wider text-white">Purchase Register</h2>
                    <p className="text-xs text-white/50">Simulated database linked via customer email</p>
                  </div>
                </div>

                {customerOrders.length === 0 ? (
                  <div className="p-16 text-center rounded-2xl border border-dashed border-white/15 bg-neutral-950/20">
                    <ShoppingBag className="w-12 h-12 text-white/20 mx-auto mb-3" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1">No Orders Found</h3>
                    <p className="text-xs text-white/40 mb-4">You have not completed any purchases with Keisuke email tier yet.</p>
                    <button 
                      onClick={() => setCurrentRoute('products')}
                      className="px-6 py-2 bg-neon-red text-white uppercase text-[10px] tracking-widest font-black rounded-lg"
                    >
                      Shop Merchandise
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {customerOrders.map((order) => (
                      <div key={order.id} className="p-6 rounded-2xl bg-neutral-900/60 border border-white/5 space-y-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/5 pb-4 gap-4">
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="text-xs font-mono font-bold bg-white/5 border border-white/10 text-white px-2.5 py-1 rounded-md">
                              ORDER ID: #{order.id}
                            </span>
                            <span className="text-xs text-white/40">
                              Placed: {order.dateCreated}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] uppercase font-bold text-white/40">Fulfillment Status:</span>
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              order.status === 'Delivered' 
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/20' 
                                : order.status === 'Shipped'
                                  ? 'bg-blue-950 text-blue-400 border border-blue-500/20'
                                  : 'bg-neon-red/10 text-neon-red border border-neon-red/20'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                        </div>

                        {/* Inventory products details list */}
                        <div className="space-y-4">
                          {order.products.map((item) => (
                            <div key={item.id} className="flex gap-4 items-center">
                              <img 
                                src={item.image} 
                                alt={item.name} 
                                className="w-14 h-14 object-cover rounded-lg border border-white/10 shrink-0"
                                referrerPolicy="no-referrer"
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="text-xs font-bold text-white truncate uppercase">{item.name}</h4>
                                <div className="flex items-center gap-3 text-[10px] text-white/50 mt-1">
                                  <span>Qty: {item.quantity}</span>
                                  {item.size && <span>Size: {item.size}</span>}
                                  {item.color && <span>Color: {item.color}</span>}
                                </div>
                              </div>
                              <div className="text-xs font-bold text-white font-mono">
                                ₦{item.price.toLocaleString()}
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="flex flex-col md:flex-row md:items-center justify-between border-t border-white/5 pt-4 gap-4">
                          <div className="space-y-1">
                            <div className="text-[10px] text-white/40 uppercase">Shipping via {order.shippingMethod}</div>
                            {order.trackingNumber && (
                              <div className="text-[10px] font-mono text-neon-blue">
                                Tracking Ref: {order.trackingNumber}
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-4 justify-between md:justify-end">
                            <div>
                              <div className="text-[10px] text-white/40 uppercase text-right">Total Invoice</div>
                              <div className="text-base font-black text-white font-mono">₦{order.amountPaid.toLocaleString()}</div>
                            </div>

                            <button 
                              onClick={() => startTrackingOrder(order)}
                              className="px-4 py-2 bg-neon-red text-white uppercase text-[10px] tracking-widest font-black rounded-lg filter hover:brightness-110 active:scale-95 transition-all shadow-md hover:shadow-neon-red/10 flex items-center gap-2"
                            >
                              <Truck className="w-3.5 h-3.5" />
                              <span>Track Logistics</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'tracking' && (
              <motion.div
                key="tab-tracking"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {!selectedTrackingOrder ? (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-lg font-black uppercase tracking-wider text-white">Logistics Tracking</h2>
                      <p className="text-xs text-white/50">Select an active order below to inspect tracking timeline</p>
                    </div>

                    {customerOrders.length === 0 ? (
                      <div className="p-16 text-center rounded-2xl border border-dashed border-white/10 bg-neutral-950/20">
                        <Truck className="w-12 h-12 text-white/20 mx-auto mb-3" />
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1">No Traceable Cargo</h3>
                        <p className="text-xs text-white/40">Purchase registers empty.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {customerOrders.map(order => (
                          <div 
                            key={order.id} 
                            onClick={() => setSelectedTrackingOrder(order)}
                            className="p-5 rounded-xl bg-neutral-900/40 border border-white/5 hover:border-neon-red/30 transition-all cursor-pointer flex justify-between items-center gap-4"
                          >
                            <div className="space-y-1 min-w-0">
                              <span className="text-[10px] font-mono text-neon-red block font-bold">#{order.id}</span>
                              <div className="text-xs font-bold text-white truncate max-w-sm uppercase">
                                {order.products.map(p => p.name).join(', ')}
                              </div>
                              <span className="text-[10px] text-white/40 block">Placed: {order.dateCreated}</span>
                            </div>
                            <span className="px-2.5 py-1 text-[9px] uppercase font-black tracking-widest border border-white/10 bg-white/5 rounded-md text-white/80 whitespace-nowrap shrink-0">
                              {order.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-6">
                    <button 
                      onClick={() => setSelectedTrackingOrder(null)}
                      className="flex items-center gap-2 text-xs uppercase tracking-widest font-black text-white/60 hover:text-white transition-colors bg-transparent border-none outline-none mb-4 cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4 text-neon-red" />
                      <span>Back to Register</span>
                    </button>

                    <div className="p-6 rounded-2xl bg-neutral-900/60 border border-white/5 space-y-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/5 pb-4 gap-4">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-neon-red tracking-widest">Global Logistics Trace</span>
                          <h2 className="text-lg font-black text-white mt-1 italic uppercase font-display">
                            Order Tracking — #{selectedTrackingOrder.id}
                          </h2>
                          <p className="text-xs text-white/50">{selectedTrackingOrder.shippingMethod} • Tracking Ref: {selectedTrackingOrder.trackingNumber || 'Awaiting Code Creation'}</p>
                        </div>

                        <div className="text-right">
                          <span className="block text-[10px] uppercase font-bold text-white/40">Current Terminal Point Status</span>
                          <span className="block text-sm font-black text-neon-blue uppercase tracking-wider mt-1">{selectedTrackingOrder.status}</span>
                        </div>
                      </div>

                      {/* Timeline status list directly connected list */}
                      <div className="relative pl-8 md:pl-12 py-4 space-y-8">
                        {/* Timeline wire */}
                        <div className="absolute left-[15px] md:left-[23px] top-4 bottom-4 w-[2px] bg-white/10" />

                        {TIMELINE_STATES.map((stat, idx) => {
                          const currentIdx = TIMELINE_STATES.indexOf(selectedTrackingOrder.status);
                          const isDone = idx <= currentIdx;
                          const isCurrent = idx === currentIdx;

                          // Find order status history logs for details
                          const historyLog = selectedTrackingOrder.statusHistory?.find(
                            h => h.status === stat
                          );

                          return (
                            <div key={stat} className="relative flex items-start gap-4">
                              {/* Timeline indicator node */}
                              <div className={`absolute left-[-25px] md:left-[-33px] top-1 w-[16px] h-[16px] md:w-[22px] md:h-[22px] rounded-full flex items-center justify-center transition-all border ${
                                isDone 
                                  ? 'bg-emerald-500 border-emerald-400 text-black shadow-lg shadow-emerald-500/25' 
                                  : isCurrent
                                    ? 'bg-neon-blue border-neon-blue text-black animate-pulse'
                                    : 'bg-neutral-900 border-white/10 text-white/20'
                              }`}>
                                {isDone ? (
                                  <Check className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 font-bold text-black" />
                                ) : (
                                  <span className="text-[8px] md:text-[10px] font-black">{idx + 1}</span>
                                )}
                              </div>

                              <div className="space-y-1">
                                <h3 className={`text-xs md:text-sm font-bold uppercase tracking-wider ${isDone ? 'text-white' : 'text-white/30'}`}>
                                  {stat}
                                </h3>
                                {historyLog ? (
                                  <div className="space-y-1">
                                    <p className="text-xs text-white/60 leading-relaxed max-w-xl pr-4">
                                      {historyLog.note || `Fulfillment step completed.`}
                                    </p>
                                    <span className="inline-block text-[9px] text-white/30 font-mono">
                                      Timestamp: {historyLog.timestamp} via {historyLog.updatedBy}
                                    </span>
                                  </div>
                                ) : (
                                  isCurrent ? (
                                    <p className="text-xs text-neon-blue/70">Terminal active. Operations updating updates in Tokyo office...</p>
                                  ) : (
                                    <p className="text-[10px] text-white/20">Awaiting status achievement.</p>
                                  )
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'wishlist' && (
              <motion.div
                key="tab-wishlist"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-lg font-black uppercase tracking-wider text-white">My Wishlist</h2>
                  <p className="text-xs text-white/50">Personal catalog saved in system database</p>
                </div>

                {wishlist.length === 0 ? (
                  <div className="p-16 text-center rounded-2xl border border-dashed border-white/10 bg-neutral-950/20">
                    <Heart className="w-12 h-12 text-white/20 mx-auto mb-3" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1 font-display">No Saved Treasures</h3>
                    <p className="text-xs text-white/40 mb-4">Add your catalog items inside products to inspect them here.</p>
                    <button 
                      onClick={() => setCurrentRoute('products')}
                      className="px-6 py-2 border border-neon-red text-neon-red bg-neon-red/5 hover:bg-neon-red/10 uppercase text-xs font-black tracking-widest rounded-lg"
                    >
                      Browse Products
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {wishlist.map((product) => (
                      <div key={product.id} className="group bg-neutral-900/60 border border-white/5 rounded-2xl overflow-hidden relative flex flex-col justify-between">
                        <div className="relative aspect-square overflow-hidden bg-neutral-950">
                          <img 
                            src={product.image} 
                            alt={product.name} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            referrerPolicy="no-referrer"
                          />
                          <button 
                            onClick={() => removeFromWishlist(product.id)}
                            className="absolute top-3 right-3 p-2 bg-black/80 hover:bg-neon-red/20 text-white/80 hover:text-neon-red border border-white/5 rounded-xl transition-all cursor-pointer"
                            title="Remove Saved Item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                          <div className="space-y-1">
                            <span className="text-[9px] uppercase font-bold text-neon-red tracking-widest block">{product.category}</span>
                            <h3 className="text-xs font-bold text-white line-clamp-2 uppercase min-h-[32px]">{product.name}</h3>
                          </div>

                          <div className="space-y-2.5">
                            <div className="flex items-baseline gap-2">
                              <span className="text-sm font-black text-white font-mono">
                                ₦{product.price.toLocaleString()}
                              </span>
                              {product.originalPrice && (
                                <span className="text-[10px] line-through text-white/30 font-mono">
                                  ₦{product.originalPrice.toLocaleString()}
                                </span>
                              )}
                            </div>

                            <button 
                              onClick={() => {
                                addToCart(product);
                              }}
                              className="w-full py-2 bg-neon-blue hover:brightness-110 text-white uppercase text-[9px] tracking-widest font-black rounded-lg transition-all flex items-center justify-center gap-1.5"
                            >
                              <ShoppingCart className="w-3 h-3" />
                              <span>Add To Cart</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'addresses' && (
              <motion.div
                key="tab-addresses"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-black uppercase tracking-wider text-white">Recipient Addresses</h2>
                    <p className="text-xs text-white/50">Manage default shipping endpoints logs securely</p>
                  </div>

                  <button 
                    onClick={handleOpenAddAddress}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4 text-neon-blue" />
                    <span>Register Address</span>
                  </button>
                </div>

                {addressFormOpen && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-6 bg-neutral-900 border border-white/10 rounded-2xl space-y-4"
                  >
                    <h3 className="text-xs font-black uppercase tracking-widest text-neon-blue">
                      {editingAddress ? 'Revise Recipient Coordinate' : 'Establish Shipment Endpoint'}
                    </h3>

                    <form onSubmit={handleAddressSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest text-white/50 mb-1.5 font-bold">Recipient Full Name</label>
                        <input
                          type="text"
                          value={addrFullName}
                          onChange={(e) => setAddrFullName(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-neon-blue transition-all"
                          placeholder="Keisuke Takahashi"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest text-white/50 mb-1.5 font-bold">Recipient Phone</label>
                        <input
                          type="text"
                          value={addrPhone}
                          onChange={(e) => setAddrPhone(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-neon-blue transition-all"
                          placeholder="+234 80 1234 5678"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest text-white/50 mb-1.5 font-bold">Country</label>
                        <input
                          type="text"
                          value={addrCountry}
                          onChange={(e) => setAddrCountry(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-neon-blue transition-all"
                          placeholder="Japan"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest text-white/50 mb-1.5 font-bold">State / Region</label>
                        <input
                          type="text"
                          value={addrState}
                          onChange={(e) => setAddrState(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-neon-blue transition-all"
                          placeholder="Gunma"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest text-white/50 mb-1.5 font-bold">City</label>
                        <input
                          type="text"
                          value={addrCity}
                          onChange={(e) => setAddrCity(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-neon-blue transition-all"
                          placeholder="Shibukawa"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest text-white/50 mb-1.5 font-bold">Street Address</label>
                        <input
                          type="text"
                          value={addrStreet}
                          onChange={(e) => setAddrStreet(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-neon-blue transition-all"
                          placeholder="12-4 Mount Haruna Road"
                          required
                        />
                      </div>

                      <div className="col-span-1 md:col-span-2 flex items-center justify-between pt-2">
                        <label className="flex items-center gap-2 cursor-pointer text-xs text-white/70 select-none">
                          <input
                            type="checkbox"
                            checked={addrIsDefault}
                            onChange={(e) => setAddrIsDefault(e.target.checked)}
                            className="rounded accent-neon-blue border-white/10 bg-white/5 h-4 w-4"
                          />
                          <span>Set check default coordinate</span>
                        </label>

                        <div className="flex gap-2">
                          <button 
                            type="button"
                            onClick={() => setAddressFormOpen(false)}
                            className="px-4 py-2 bg-transparent hover:bg-white/5 border border-transparent text-white/70 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all"
                          >
                            Cancel
                          </button>
                          <button 
                            type="submit"
                            className="px-5 py-2 bg-neon-blue text-white text-[10px] font-bold uppercase tracking-widest rounded-lg"
                          >
                            Proceed
                          </button>
                        </div>
                      </div>
                    </form>
                  </motion.div>
                )}

                {customerAddresses.length === 0 ? (
                  <div className="p-16 text-center rounded-2xl border border-dashed border-white/10 bg-neutral-950/20">
                    <MapPinOff className="w-12 h-12 text-white/20 mx-auto mb-3" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1 font-display">No Shipment Destinations</h3>
                    <p className="text-xs text-white/40">Provide an address to enable one-click headless checkout.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {customerAddresses.map((addr) => (
                      <div key={addr.id} className="p-5 rounded-2xl bg-neutral-900/40 border border-white/5 relative flex flex-col justify-between min-h-[160px]">
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <span className="font-bold text-sm text-white uppercase">{addr.fullName}</span>
                            {addr.isDefault && (
                              <span className="px-1.5 py-0.5 rounded bg-neon-blue/10 border border-neon-blue/20 text-neon-blue text-[8px] font-black uppercase tracking-wider">
                                Default Endpoint
                              </span>
                            )}
                          </div>

                          <div className="space-y-1 text-xs text-white/60 pl-1 font-medium">
                            <p>{addr.streetAddress}</p>
                            <p>{addr.city}, {addr.state}</p>
                            <p>{addr.country}</p>
                            <p className="text-white/40 mt-1.5 font-mono">{addr.phone}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 border-t border-white/5 pt-4 mt-4 justify-between">
                          {!addr.isDefault ? (
                            <button 
                              onClick={() => setDefaultAddress(addr.id)}
                              className="text-[10px] font-bold uppercase tracking-wider text-white/50 hover:text-white"
                            >
                              Make Default
                            </button>
                          ) : (
                            <div className="text-[9px] uppercase font-black tracking-widest text-neon-blue flex items-center gap-1">
                              <Check className="w-3.5 h-3.5" />
                              <span>Active default endpoint</span>
                            </div>
                          )}

                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleOpenEditAddress(addr)}
                              className="p-1.5 border border-white/5 hover:border-white/20 bg-white/[0.02] rounded-lg text-white/60 hover:text-white transition-all"
                              title="Edit Coordinate"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              onClick={() => {
                                deleteAddress(addr.id);
                                showNotification('Address removed.', 'info');
                              }}
                              className="p-1.5 border border-white/5 hover:border-neon-red/30 bg-white/[0.02] hover:bg-neon-red/10 rounded-lg text-white/60 hover:text-neon-red transition-all"
                              title="Delete Coordinate"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div
                key="tab-settings"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-lg font-black uppercase tracking-wider text-white">Profile Config</h2>
                  <p className="text-xs text-white/50">Revise your account master parameters</p>
                </div>

                <div className="p-6 rounded-2xl bg-neutral-900/60 border border-white/5">
                  <form onSubmit={handleEditProfileSubmit} className="space-y-4 max-w-xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest text-white/50 mb-1.5 font-bold">Email Address (Primary)</label>
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                          <input
                            type="text"
                            value={editEmail}
                            className="w-full bg-white/[0.02] border border-white/5 rounded-xl py-3 pl-11 pr-4 text-sm text-white/40 cursor-not-allowed select-none"
                            readOnly
                          />
                        </div>
                        <span className="block text-[9px] text-white/30 font-medium mt-1">Shopify identifiers are locked</span>
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase tracking-widest text-white/50 mb-1.5 font-bold">Name</label>
                        <div className="relative">
                          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-neon-red"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase tracking-widest text-white/50 mb-1.5 font-bold">Phone Number</label>
                        <div className="relative">
                          <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                          <input
                            type="text"
                            value={editPhone}
                            onChange={(e) => setEditPhone(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-neon-red"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase tracking-widest text-white/50 mb-1.5 font-bold">Password Verification</label>
                        <div className="relative">
                          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                          <input
                            type="password"
                            value={editPassword}
                            onChange={(e) => setEditPassword(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-neon-red"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="px-6 py-3 bg-neon-red hover:brightness-110 active:scale-95 text-white font-black uppercase text-xs tracking-widest rounded-xl transition-all shadow-md hover:shadow-neon-red/10 pt-3"
                    >
                      Save Parameters
                    </button>
                  </form>
                </div>
              </motion.div>
            )}

            {activeTab === 'notifications' && (
              <motion.div
                key="tab-notifications"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-black uppercase tracking-wider text-white">Log Updates Log</h2>
                    <p className="text-xs text-white/50">Fulfillment system log direct updates timeline</p>
                  </div>

                  {unreadNotifsCount > 0 && (
                    <button 
                      onClick={handleMarkAllRead}
                      className="text-[10px] uppercase font-black tracking-widest text-neon-blue hover:underline bg-transparent border-none outline-none cursor-pointer"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                {customerNotifs.length === 0 ? (
                  <div className="p-16 text-center rounded-2xl border border-dashed border-white/10 bg-neutral-950/20">
                    <Bell className="w-12 h-12 text-white/20 mx-auto mb-3 animate-[pulse_3s_infinite]" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1">Vault Alerts Empty</h3>
                    <p className="text-xs text-white/40">Log files clean. No recent actions registered.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {customerNotifs.map((notif) => (
                      <div 
                        key={notif.id} 
                        className={`p-4 rounded-xl border transition-all relative flex gap-3 ${
                          notif.isRead 
                            ? 'bg-neutral-950/30 border-white/5 text-white/55' 
                            : 'bg-neutral-900/60 border-white/15 text-white'
                        }`}
                      >
                        {/* Unread indicator bullet */}
                        {!notif.isRead && (
                          <div className="w-2 h-2 rounded-full bg-neon-blue shrink-0 mt-1.5 animate-pulse" />
                        )}
                        
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between gap-4">
                            <h4 className="text-xs font-bold uppercase tracking-wider">{notif.title}</h4>
                            <span className="text-[9px] font-mono text-white/30">{notif.timestamp}</span>
                          </div>
                          
                          <p className="text-xs leading-relaxed max-w-xl pr-4">
                            {notif.message}
                          </p>

                          {!notif.isRead && (
                            <button 
                              onClick={() => {
                                markCustomerNotificationRead(notif.id);
                                showNotification('Notification labeled read', 'success');
                              }}
                              className="text-[8px] font-black uppercase tracking-widest text-neon-blue block hover:underline pt-1.5"
                            >
                              LBL_MARK_READ
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
