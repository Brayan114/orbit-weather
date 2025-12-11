import React, { useState } from 'react';
import { CloudRain, Clock, Timer, CheckSquare, Menu, X, Calendar } from 'lucide-react';
import { AppView } from '../types';

interface SidebarProps {
  currentView: AppView;
  onChangeView: (view: AppView) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [logoSpin, setLogoSpin] = useState(false);

  const navItems = [
    { id: AppView.WEATHER, label: 'Weather', icon: CloudRain },
    { id: AppView.CLOCK, label: 'World Clock', icon: Clock },
    { id: AppView.TOOLS, label: 'Chronometer', icon: Timer },
    { id: AppView.REMINDERS, label: 'Reminders', icon: CheckSquare },
    { id: AppView.CALENDAR, label: 'Calendar', icon: Calendar },
  ];

  const handleLogoClick = () => {
    setLogoSpin(true);
    console.log("%cHello fellow dev, stop snooping in my code and hire me.", "color: #6366f1; font-size: 16px; font-weight: bold;");
    setTimeout(() => setLogoSpin(false), 1000);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="md:hidden fixed top-4 right-4 z-50 p-2 bg-orbit-glass rounded-full backdrop-blur-md text-white border border-orbit-glassBorder"
      >
        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar Container */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-orbit-dark/90 backdrop-blur-xl border-r border-orbit-glassBorder transform transition-transform duration-300 ease-in-out
        md:translate-x-0 md:static md:h-screen
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full p-6">
          {/* Brand */}
          <div className="flex items-center gap-3 mb-12 cursor-pointer" onClick={handleLogoClick}>
            <div className={`relative w-10 h-10 ${logoSpin ? 'animate-spin' : ''}`}>
              {/* Simulating the logo from the prompt using CSS/SVG */}
              <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_10px_rgba(99,102,241,0.5)]">
                <circle cx="50" cy="50" r="10" fill="white" />
                <ellipse cx="50" cy="50" rx="40" ry="10" stroke="#6366f1" strokeWidth="2" fill="none" transform="rotate(45 50 50)" />
                <ellipse cx="50" cy="50" rx="40" ry="10" stroke="#06b6d4" strokeWidth="2" fill="none" transform="rotate(-45 50 50)" />
                <ellipse cx="50" cy="50" rx="40" ry="10" stroke="#8b5cf6" strokeWidth="2" fill="none" />
              </svg>
            </div>
            <div>
              <h1 className="font-display font-bold text-xl tracking-wider text-white">ORBIT</h1>
              <p className="text-[10px] tracking-[0.2em] text-cyan-400 uppercase">Studios</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onChangeView(item.id);
                  setIsMobileOpen(false);
                }}
                className={`
                  w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group
                  ${currentView === item.id
                    ? 'bg-gradient-to-r from-indigo-600/20 to-cyan-500/10 text-white border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.15)]'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'}
                `}
              >
                <item.icon
                  size={20}
                  className={`transition-colors ${currentView === item.id ? 'text-cyan-400' : 'group-hover:text-cyan-400'}`}
                />
                <span className="font-medium tracking-wide">{item.label}</span>
                {currentView === item.id && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
                )}
              </button>
            ))}
          </nav>

          {/* Footer Info */}
          <div className="mt-auto pt-6 border-t border-white/5">
            <p className="text-xs text-gray-500 text-center font-mono">v1.0.4 • Build 8402</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;