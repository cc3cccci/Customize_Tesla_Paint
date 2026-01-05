
import React from 'react';
import { Home, Lightbulb, ShieldCheck } from 'lucide-react';
import { Tab } from '../types';

interface BottomNavProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'designs', label: 'Designs', icon: Lightbulb },
    { id: 'admin', label: 'Admin', icon: ShieldCheck },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white dark:bg-[#0d101d] border-t border-slate-200 dark:border-border-dark px-4 pb-6 pt-3 flex justify-around items-center max-w-lg mx-auto md:rounded-t-2xl shadow-2xl">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex flex-col items-center gap-1 transition-all ${
            activeTab === tab.id 
              ? 'text-primary scale-110' 
              : 'text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <tab.icon size={22} fill={activeTab === tab.id ? 'currentColor' : 'none'} strokeWidth={activeTab === tab.id ? 2.5 : 2} />
          <span className="text-[10px] font-bold uppercase tracking-widest">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default BottomNav;
