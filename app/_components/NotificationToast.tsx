import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Info, X } from 'lucide-react';
import { useShopStore } from '../store/useShopStore';

export function NotificationToast() {
  const { notification, clearNotification } = useShopStore();

  return (
    <div className="fixed bottom-6 left-6 z-[300] max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className="pointer-events-auto flex items-center justify-between gap-3 p-4 bg-[#0a0c14]/95 backdrop-blur-md rounded-sm border border-white/10 shadow-2xl shadow-black/80"
          >
            <div className="flex items-center gap-3">
              {notification.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-neon-blue flex-shrink-0" />
              ) : (
                <Info className="w-5 h-5 text-neon-red flex-shrink-0" />
              )}
              <div className="flex flex-col">
                <span className="text-[10px] font-mono tracking-widest text-[#00f2ff] uppercase leading-tight font-black">
                  SYSTEM MESSAGE
                </span>
                <p className="text-[11px] font-bold text-white uppercase tracking-tight mt-1 leading-snug">
                  {notification.message}
                </p>
              </div>
            </div>
            
            <button 
              onClick={clearNotification}
              className="text-white/30 hover:text-white p-1 transition-colors flex-shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
