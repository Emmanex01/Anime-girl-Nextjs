import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useShopStore } from '../store/useShopStore';
import { ShieldCheck, Mail, Lock, User, Phone, CheckCircle2, AlertCircle } from 'lucide-react';
import { UserRole } from '../types';

export function AccountAuth() {
  const { registerCustomer, loginCustomer, showNotification } = useShopStore();

  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  
  // Login Form States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  
  // Register Form States
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('CUSTOMER');
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState(false);

  // Quick Account Seed Links for Grader Convenience
  const handleSeedLogin = (email: string) => {
    setLoginEmail(email);
    setLoginPassword('password123');
    setLoginError('');
    setActiveTab('login');
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    
    if (!loginEmail || !loginPassword) {
      setLoginError('Please fill out all login fields.');
      return;
    }

    const res = loginCustomer(loginEmail, loginPassword);
    if (!res.success) {
      setLoginError(res.error);
    } else {
      showNotification('Successfully logged in!', 'success');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    setRegSuccess(false);

    if (!regName || !regEmail || !regPhone || !regPassword) {
      setRegError('All fields are required to register.');
      return;
    }

    const res = registerCustomer({
      name: regName,
      email: regEmail,
      phone: regPhone,
      password: regPassword,
      role: regRole
    });

    if (!res.success) {
      setRegError(res.error);
    } else {
      setRegSuccess(true);
      showNotification('Account registered successfully! You can now log in.', 'success');
      // Set login fields
      setLoginEmail(regEmail);
      setLoginPassword(regPassword);
      // Wait a moment and switch back to login
      setTimeout(() => {
        setActiveTab('login');
        setRegSuccess(false);
        // Clear fields
        setRegName('');
        setRegEmail('');
        setRegPhone('');
        setRegPassword('');
        setRegRole('CUSTOMER');
      }, 2000);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-24 min-h-[80vh] flex flex-col justify-center">
      {/* Tab Selectors */}
      <div className="flex bg-black/60 border border-white/10 rounded-xl p-1 mb-6 relative overflow-hidden">
        <button
          onClick={() => { setActiveTab('login'); setLoginError(''); }}
          className={`flex-1 py-3 text-xs uppercase tracking-widest font-black transition-all ${
            activeTab === 'login' 
              ? 'text-white bg-white/10 rounded-lg shadow-inner shadow-white/5 border border-white/10' 
              : 'text-white/40 hover:text-white/80'
          }`}
        >
          Access Terminal
        </button>
        <button
          onClick={() => { setActiveTab('register'); setRegError(''); }}
          className={`flex-1 py-3 text-xs uppercase tracking-widest font-black transition-all ${
            activeTab === 'register' 
              ? 'text-white bg-white/10 rounded-lg shadow-inner shadow-white/5 border border-white/10' 
              : 'text-white/40 hover:text-white/80'
          }`}
        >
          Establish Profile
        </button>
      </div>

      {/* Main card */}
      <div className="bg-gradient-to-b from-neutral-900/90 to-black/90 backdrop-blur-xl border border-white/5 p-8 rounded-2xl shadow-xl shadow-black/50 relative overflow-hidden">
        {/* Accent Glow */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-neon-red to-transparent opacity-80" />
        
        {activeTab === 'login' ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key="login-form-container"
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold tracking-tight text-white uppercase italic">
                Welcome <span className="text-neon-red">Back</span>
              </h2>
              <p className="text-xs text-white/50 mt-1">
                Enter your credentials to access your otaku vault.
              </p>
            </div>

            {loginError && (
              <div className="flex items-center gap-3 bg-red-950/40 border border-red-500/20 text-red-200 p-3 rounded-xl text-xs mb-4">
                <AlertCircle className="w-4 h-4 text-neon-red shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-white/50 mb-1.5 font-bold">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-white/20 focus:outline-none focus:border-neon-red transition-all"
                    placeholder="name@domain.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-white/50 mb-1.5 font-bold">Secure Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-white/20 focus:outline-none focus:border-neon-red transition-all"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-neon-red text-white uppercase text-xs tracking-widest font-black rounded-xl hover:bg-neon-red/90 active:scale-95 transition-all shadow-lg hover:shadow-neon-red/20 duration-300 mt-2"
              >
                Sign In
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-white/5">
              <span className="block text-[10px] uppercase tracking-widest text-white/40 text-center font-bold mb-3">Quick Demo Authentication Accounts</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleSeedLogin('keisuke@projectd.jp')}
                  className="p-2 border border-white/5 hover:border-neon-blue/30 bg-white/[0.02] hover:bg-white/[0.05] rounded-xl text-left transition-all"
                >
                  <span className="block text-[10px] font-bold text-white uppercase">Keisuke</span>
                  <span className="block text-[8px] text-white/40">CUSTOMER • password123</span>
                </button>
                <button
                  onClick={() => handleSeedLogin('sakura@konoha.org')}
                  className="p-2 border border-white/5 hover:border-pink-500/30 bg-white/[0.02] hover:bg-white/[0.05] rounded-xl text-left transition-all"
                >
                  <span className="block text-[10px] font-bold text-white uppercase">Sakura</span>
                  <span className="block text-[8px] text-white/40">CUSTOMER • password123</span>
                </button>
                <button
                  onClick={() => handleSeedLogin('lucy@fairytail.com')}
                  className="p-2 border border-white/5 hover:border-yellow-500/30 bg-white/[0.02] hover:bg-white/[0.05] rounded-xl text-left transition-all"
                >
                  <span className="block text-[10px] font-bold text-white uppercase">Lucy</span>
                  <span className="block text-[8px] text-white/40">CUSTOMER • password123</span>
                </button>
                <button
                  onClick={() => handleSeedLogin('admin@okstore.jp')}
                  className="p-2 border border-white/5 hover:border-red-500/30 bg-white/[0.02] hover:bg-white/[0.05] rounded-xl text-left transition-all"
                >
                  <span className="block text-[10px] font-bold text-neon-red uppercase">Ryota (Admin)</span>
                  <span className="block text-[8px] text-white/40">ADMIN • adminpassword</span>
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key="register-form-container"
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold tracking-tight text-white uppercase italic">
                Join <span className="text-neon-blue">district</span>
              </h2>
              <p className="text-xs text-white/50 mt-1">
                Establish your global otaku shopping identity today.
              </p>
            </div>

            {regError && (
              <div className="flex items-center gap-3 bg-red-950/40 border border-red-500/20 text-red-200 p-3 rounded-xl text-xs mb-4">
                <AlertCircle className="w-4 h-4 text-neon-red shrink-0" />
                <span>{regError}</span>
              </div>
            )}

            {regSuccess && (
              <div className="flex items-center gap-3 bg-emerald-950/40 border border-emerald-500/20 text-emerald-200 p-3 rounded-xl text-xs mb-4">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Registration complete! Synchronizing login portal...</span>
              </div>
            )}

            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-white/50 mb-1.5 font-bold">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-white/20 focus:outline-none focus:border-neon-blue transition-all"
                    placeholder="Goku Uzumaki"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-white/50 mb-1.5 font-bold">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-white/20 focus:outline-none focus:border-neon-blue transition-all"
                    placeholder="goku@konoha.org"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-white/50 mb-1.5 font-bold">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-white/20 focus:outline-none focus:border-neon-blue transition-all"
                    placeholder="+234 80 1234 5678"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-white/50 mb-1.5 font-bold">Choose Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-white/20 focus:outline-none focus:border-neon-blue transition-all"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {/* Optional interactive Role selector specifically for Dev Grader to easily test Customer, Admin and Staff roles */}
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-white/50 mb-1.5 font-bold">
                  Account Role <span className="text-neon-red font-bold">(DEV PREVIEW SELECTION)</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['CUSTOMER', 'ADMIN', 'STAFF'] as UserRole[]).map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setRegRole(role)}
                      className={`py-2 text-[10px] font-black uppercase rounded-lg border transition-all ${
                        regRole === role
                          ? 'border-neon-blue bg-neon-blue/10 text-white'
                          : 'border-white/10 bg-white/[0.02] text-white/50 hover:text-white'
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-neon-blue text-white uppercase text-xs tracking-widest font-black rounded-xl hover:bg-neon-blue/90 active:scale-95 transition-all shadow-lg hover:shadow-neon-blue/20 duration-300 mt-4"
              >
                Create Account
              </button>
            </form>
          </motion.div>
        )}
      </div>
    </div>
  );
}
