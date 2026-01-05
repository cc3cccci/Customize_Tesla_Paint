
import React from 'react';
import { Languages } from 'lucide-react';
import { Language } from '../types';

interface HeaderProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  appTitle: string;
}

const Header: React.FC<HeaderProps> = ({ language, setLanguage, appTitle }) => {
  return (
    <header className="sticky top-0 w-full z-30 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-lg border-b border-slate-200 dark:border-border-dark px-4 py-3 flex items-center justify-between">
      <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
        {appTitle}
      </h1>
      <div className="flex items-center gap-2">
        <button 
          onClick={() => setLanguage(language === 'en' ? 'zh' : 'en')}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-card-dark border border-slate-200 dark:border-border-dark hover:bg-slate-200 dark:hover:bg-slate-800 transition-all text-sm font-bold"
        >
          <Languages size={16} />
          <span>{language === 'en' ? '中文' : 'English'}</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
