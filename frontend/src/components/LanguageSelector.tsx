import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useShoppingStore } from '../hooks/useShoppingStore';
import { SupportedLanguage } from '../types';

interface LangOption {
  code: SupportedLanguage;
  label: string;
  subLabel: string;
  flag: string;
}

const LANGUAGES: LangOption[] = [
  { code: 'en-US', label: 'English', subLabel: 'Add 2 bottles of milk', flag: '🇺🇸' },
  { code: 'hi-IN', label: 'हिंदी (Hindi)', subLabel: 'मेरी लिस्ट में दूध जोड़ो', flag: '🇮🇳' },
  { code: 'hinglish', label: 'Hinglish', subLabel: 'Meri list mein 2 kg apples add karo', flag: '🇮🇳' },
  { code: 'es-ES', label: 'Español', subLabel: 'Agrega leche a mi lista', flag: '🇪🇸' },
];

export const LanguageSelector: React.FC = () => {
  const { preferences, setLanguage } = useShoppingStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = LANGUAGES.find((l) => l.code === preferences.language) || LANGUAGES[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`Select voice language, current language is ${currentLang.label}`}
        aria-expanded={isOpen}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all shadow-sm"
      >
        <span className="text-sm">{currentLang.flag}</span>
        <span className="hidden sm:inline">{currentLang.label}</span>
        <Globe className="w-3.5 h-3.5 sm:hidden text-slate-500" />
        <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-700/60">
            Select Recognition Language
          </div>
          {LANGUAGES.map((lang) => {
            const isSelected = lang.code === preferences.language;
            return (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${
                  isSelected ? 'bg-brand-50/70 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300' : 'text-slate-700 dark:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base">{lang.flag}</span>
                  <div>
                    <div className="text-xs font-semibold">{lang.label}</div>
                    <div className="text-[10px] text-slate-400 dark:text-slate-400 italic">
                      "{lang.subLabel}"
                    </div>
                  </div>
                </div>
                {isSelected && <Check className="w-4 h-4 text-brand-600 dark:text-brand-400 flex-shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
