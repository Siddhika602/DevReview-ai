import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Code2, 
  BookOpen, 
  History, 
  BarChart3, 
  User, 
  Settings, 
  LogOut, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { logout } = useAuth();

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Code Review', path: '/review', icon: Code2 },
    { name: 'Explain Code', path: '/explain-code', icon: BookOpen },
    { name: 'History', path: '/history', icon: History },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside
      className={`fixed top-6 left-6 bottom-6 z-40 transition-all duration-300 glass-sidebar shadow-md rounded-[28px] hidden lg:block overflow-hidden
        ${isOpen ? 'w-64' : 'w-20'}`}
    >
      <div className="flex flex-col h-full justify-between select-none">
        
        {/* Header Logo */}
        <div>
          <div className="flex items-center justify-between h-20 px-4.5 border-b border-gray-100/40">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-[#7C3AED] to-[#3B82F6] text-white shadow-md shadow-[#7C3AED]/20">
                <Sparkles className="h-4.5 w-4.5 text-white" />
              </div>
              {isOpen && (
                <span className="font-extrabold text-sm tracking-tight text-[#111827] select-none">
                  DevReview <span className="accent-gradient-text font-black">AI</span>
                </span>
              )}
            </div>
            
            {/* Toggle Button for Desktop */}
            <button
              onClick={toggleSidebar}
              className="hidden lg:flex p-1.5 rounded-xl border border-white/50 bg-white/60 hover:bg-white text-[#6B7280] transition-all cursor-pointer shadow-sm"
            >
              {isOpen ? <ChevronLeft size={13} /> : <ChevronRight size={13} />}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-2 relative">
            {menuItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 group relative cursor-pointer
                  ${
                    isActive
                      ? 'text-[#111827] font-extrabold'
                      : 'text-[#6B7280] hover:text-[#111827]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {/* Sliding active pill indicator */}
                    {isActive && (
                      <motion.span
                        layoutId="active-pill"
                        className="absolute inset-0 bg-white/70 shadow-[0_2px_10px_rgba(124,58,237,0.03)] border border-[#7C3AED]/10 rounded-2xl z-0"
                        transition={{ type: "spring", stiffness: 360, damping: 28 }}
                      />
                    )}
                    
                    {/* Circular Icon Container */}
                    <div className={`h-8 w-8 rounded-full shrink-0 z-10 flex items-center justify-center transition-all ${
                      isActive 
                        ? 'accent-gradient-bg text-white shadow-md shadow-[#7C3AED]/20' 
                        : 'bg-white/40 border border-white/60 text-[#6B7280] group-hover:bg-white group-hover:text-[#111827]'
                    }`}>
                      <item.icon className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-105" />
                    </div>
                    
                    {isOpen && <span className="truncate z-10 ml-0.5">{item.name}</span>}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Footer Actions (Logout) */}
        <div className="p-3 border-t border-gray-100/40">
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-500/5 hover:text-rose-600 transition-all border border-transparent cursor-pointer"
          >
            <div className="h-8 w-8 rounded-full shrink-0 flex items-center justify-center bg-rose-500/5 text-rose-500">
              <LogOut className="h-4 w-4 shrink-0" />
            </div>
            {isOpen && <span className="ml-0.5">Sign Out</span>}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
