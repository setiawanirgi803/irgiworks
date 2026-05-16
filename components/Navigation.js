"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { translations } from '@/lib/translations';
import { Sun, Moon, Languages, Menu, X, ArrowRight } from 'lucide-react';

export default function Navigation() {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');
  const { lang, toggleLang, theme, toggleTheme } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isAdminPage) return null;

  const t = translations[lang].nav;

  const navLinks = [
    { name: t.home, href: '/' },
    { name: t.portfolio, href: '/portfolio' },
    { name: t.contact, href: '/#contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled ? 'py-4' : 'py-8'
    }`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className={`glass-card rounded-[2rem] px-8 py-4 flex items-center justify-between transition-all duration-500 ${
          scrolled ? 'shadow-2xl shadow-industrial-900/10' : ''
        }`}>
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-accent-teal text-white rounded-xl flex items-center justify-center font-black shadow-lg shadow-teal-500/30 group-hover:rotate-12 transition-transform">
              I
            </div>
            <span className="font-black text-xl tracking-tighter text-industrial-900 dark:text-white">IRGI.SETIAWAN</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-10">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href} 
                className="text-sm font-bold text-industrial-500 dark:text-industrial-400 hover:text-accent-teal dark:hover:text-white transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center space-x-4 border-l border-industrial-100 dark:border-white/10 pl-6">
            <button onClick={toggleTheme} className="p-2.5 text-industrial-500 dark:text-industrial-400 hover:bg-industrial-100 dark:hover:bg-white/5 rounded-xl transition-all">
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button onClick={toggleLang} className="flex items-center space-x-2 px-3 py-1.5 bg-industrial-100 dark:bg-white/5 text-industrial-600 dark:text-white rounded-lg text-xs font-black uppercase tracking-widest hover:bg-accent-teal hover:text-white transition-all">
              <Languages size={14} /> <span>{lang}</span>
            </button>
            <Link href="/admin/login" className="flex items-center space-x-2 px-5 py-2.5 bg-industrial-900 dark:bg-white text-white dark:text-industrial-900 rounded-xl text-xs font-black hover:bg-accent-teal dark:hover:bg-accent-teal dark:hover:text-white transition-all">
              ADMIN <ArrowRight size={14} />
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden p-2 text-industrial-900 dark:text-white" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Menu */}
      {isOpen && (
        <div className="absolute top-full left-6 right-6 mt-4 p-8 glass-card rounded-[2.5rem] md:hidden animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex flex-col space-y-6">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href} 
                onClick={() => setIsOpen(false)}
                className="text-2xl font-black text-industrial-900 dark:text-white"
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-6 border-t border-industrial-100 dark:border-white/10 flex justify-between">
              <button onClick={toggleTheme} className="p-4 bg-industrial-100 dark:bg-white/5 rounded-2xl">
                {theme === 'dark' ? <Sun /> : <Moon />}
              </button>
              <button onClick={toggleLang} className="px-6 py-4 bg-accent-teal text-white rounded-2xl font-black uppercase tracking-widest">
                {lang}
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
