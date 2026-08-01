import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Sidebar from './Sidebar';
import { Menu, LogOut, Search, Bell, Sparkles, ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Auto-collapse sidebar on small screens on mount
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const mockNotifications = [
    { id: 1, text: "Gemini completed review on 'authController.js'", time: "5m ago", type: "success" },
    { id: 2, text: "Critical issue detected in 'InventoryManager.java'", time: "1h ago", type: "error" },
    { id: 3, text: "Avg code quality score increased by 4.2%", time: "1d ago", type: "info" }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#111827] relative transition-colors duration-300 flex overflow-x-hidden font-sans">
      
      {/* Background Soft Grid + Layered blurred gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 bg-grid-pattern">
        {/* Layered Blobs */}
        {/* Top Left Blob (Purple/Indigo) */}
        <div className="absolute top-[-15%] left-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-tr from-purple-400/12 via-indigo-400/6 to-transparent blur-[140px] animate-pulse-soft"></div>
        {/* Middle Right Blob (Cyan/Blue) */}
        <div className="absolute top-[20%] right-[-15%] w-[55%] h-[55%] rounded-full bg-gradient-to-bl from-blue-400/12 via-cyan-400/6 to-transparent blur-[140px] animate-pulse-soft" style={{ animationDelay: '3s' }}></div>
        {/* Bottom Left Blob (Pink/Orange) */}
        <div className="absolute bottom-[-15%] left-[10%] w-[50%] h-[50%] rounded-full bg-gradient-to-tr from-pink-400/12 via-rose-300/6 to-transparent blur-[140px] animate-pulse-soft" style={{ animationDelay: '1.5s' }}></div>
        {/* Center/Top Blob (Soft White Glow) */}
        <div className="absolute top-[10%] left-[30%] w-[40%] h-[40%] rounded-full bg-white/60 blur-[110px] pointer-events-none"></div>

        {/* Tiny Glowing Particles */}
        <div className="absolute top-[12%] left-[18%] w-2 h-2 rounded-full bg-purple-400/40 animate-ping" style={{ animationDuration: '4s' }}></div>
        <div className="absolute top-[68%] left-[72%] w-1.5 h-1.5 rounded-full bg-blue-400/50 animate-pulse" style={{ animationDuration: '6s' }}></div>
        <div className="absolute top-[48%] left-[82%] w-2.5 h-2.5 rounded-full bg-pink-400/40 animate-ping" style={{ animationDuration: '5s' }}></div>
        <div className="absolute bottom-[22%] left-[8%] w-1.5 h-1.5 rounded-full bg-indigo-400/50 animate-pulse" style={{ animationDuration: '7s' }}></div>
      </div>

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main Content Area */}
      <div 
        className={`flex-1 transition-all duration-300 min-h-screen flex flex-col z-10 
          ${sidebarOpen ? 'lg:pl-[18.5rem]' : 'lg:pl-[7.5rem]'} pl-0`}
      >
        
        {/* Top Navbar Container (Floating appearance) */}
        <div className="px-6 pt-6 sticky top-0 z-30">
          <header className="h-16 flex items-center justify-between px-6 rounded-2xl glass-nav border border-white/35 shadow-sm select-none">
            
            {/* Left: Mobile menu toggle + Page title */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-xl text-[#6B7280] hover:bg-white/60 hover:text-[#111827] transition-all cursor-pointer"
              >
                <Menu size={18} />
              </button>
              
              {/* Search Bar - Minimal, Vercel/Linear style */}
              <div className="relative max-w-sm w-72 hidden md:block">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
                <input
                  type="text"
                  placeholder="Search audits, files..."
                  className="w-full pl-9 pr-4 py-1.5 bg-white/40 text-xs rounded-xl border border-white/45 focus:bg-white/95 focus:outline-none focus:border-[#7C3AED]/40 transition-all font-semibold text-[#111827] placeholder-[#6B7280]/50"
                />
              </div>
            </div>

            {/* Right: Actions (Theme, Notifications, Profile) */}
            <div className="flex items-center gap-3">
              
              {/* Theme switch - Toggles between warm presets: Aurora Lavender vs Sunset Pearl */}
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-xl border border-white/50 bg-white/60 hover:bg-white text-[#6B7280] hover:text-[#111827] transition-all duration-300 shadow-sm cursor-pointer relative group flex items-center justify-center"
                title={theme === 'dark' ? "Switch to Aurora Lavender Theme" : "Switch to Sunset Pearl Theme"}
              >
                {theme === 'dark' ? (
                  <Sparkles size={16} className="text-pink-500 animate-pulse" />
                ) : (
                  <Sparkles size={16} className="text-violet-600" />
                )}
                {/* Tooltip */}
                <span className="absolute top-12 left-1/2 -translate-x-1/2 scale-0 transition-all rounded-lg bg-gray-900/90 backdrop-blur-md px-2 py-1 text-[9px] font-bold text-white group-hover:scale-100 whitespace-nowrap z-50 shadow-md">
                  {theme === 'dark' ? 'Theme: Sunset Pearl' : 'Theme: Aurora Lavender'}
                </span>
              </button>

              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2.5 rounded-xl border border-white/50 bg-white/60 hover:bg-white text-[#6B7280] hover:text-[#111827] transition-all cursor-pointer relative"
                >
                  <Bell size={16} />
                  <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-primary ring-2 ring-white"></span>
                </button>

                <AnimatePresence>
                  {showNotifications && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowNotifications(false)}></div>
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-80 rounded-2xl border border-white/35 bg-white/90 backdrop-blur-xl p-2.5 shadow-xl z-20"
                      >
                        <div className="px-3 py-2 border-b border-gray-100/50 mb-1 flex items-center justify-between">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#6B7280]">Inbox</span>
                          <span className="text-[9px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">3 New</span>
                        </div>
                        <div className="space-y-1">
                          {mockNotifications.map((n) => (
                            <div key={n.id} className="p-2.5 rounded-xl hover:bg-white/80 transition-all text-left cursor-pointer border border-transparent hover:border-white/40">
                              <p className="text-xs font-bold text-[#111827]">{n.text}</p>
                              <span className="text-[9px] text-[#6B7280] mt-1 block font-medium">{n.time}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border border-white/50 bg-white/60 hover:bg-white transition-all cursor-pointer"
                >
                  <div className="h-6.5 w-6.5 rounded-full bg-gradient-to-tr from-[#7C3AED] to-[#3B82F6] flex items-center justify-center font-extrabold text-white text-[10px] select-none shadow-sm">
                    {user?.username?.substring(0, 2).toUpperCase() || 'US'}
                  </div>
                  <span className="hidden sm:inline text-xs font-bold text-[#6B7280] group-hover:text-[#111827]">
                    {user?.username || 'User'}
                  </span>
                  <ChevronDown size={12} className="text-[#6B7280]" />
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setDropdownOpen(false)}
                      ></div>
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-56 rounded-2xl border border-white/35 bg-white/90 backdrop-blur-xl shadow-xl p-1 z-20"
                      >
                        <div className="px-3.5 py-3 border-b border-gray-100/50 text-left">
                          <p className="text-[9px] text-[#6B7280] font-extrabold uppercase tracking-wider">Session email</p>
                          <p className="text-xs font-bold truncate text-[#111827] mt-0.5">{user?.email}</p>
                        </div>
                        <div className="p-1">
                          <button
                            onClick={logout}
                            className="w-full flex items-center gap-2 px-3.5 py-2.5 text-xs font-bold text-rose-500 rounded-xl hover:bg-rose-500/5 hover:text-rose-600 transition-colors text-left cursor-pointer"
                          >
                            <LogOut size={14} />
                            Sign Out
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </header>
        </div>

        {/* Dynamic page content */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto relative z-10">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
