
import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, ArrowLeft } from 'lucide-react';
import type { ViewType, NavigationState } from '../types';

interface NavbarProps {
  currentNav: NavigationState;
  onNavigate: (nav: NavigationState) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentNav, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isDetailView = currentNav.view === 'destination' || currentNav.view === 'subdestino' || currentNav.view === 'paquete';

  const navLinks = [
    { name: 'Inicio', view: 'home' as ViewType, href: '#home' },
    { name: 'Destinos', view: 'home' as ViewType, href: '#destinations' },
    { name: 'Paquetes', view: 'home' as ViewType, href: '#packages' },
    { name: 'Nosotros', view: 'about' as ViewType, href: '#about' },
    { name: 'Licencia', view: 'legal' as ViewType, href: '#legal' },
  ];

  const handleNavClick = (view: ViewType, href: string) => {
    if (view !== currentNav.view || isDetailView) {
      onNavigate({ view });
      setIsOpen(false);
      if (view === 'home') {
        setTimeout(() => {
          const element = document.querySelector(href);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      setIsOpen(false);
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else if (view === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  return (
    <nav className={`fixed w-full z-[100] transition-all duration-500 ${scrolled || isOpen ? 'glass-nav py-3' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          {/* Back button for detail views */}
          {isDetailView && (
            <button
              onClick={() => onNavigate({ view: 'home' })}
              className="text-celadon-500 hover:text-celadon-400 transition-colors mr-2"
              title="Volver al inicio"
            >
              <ArrowLeft size={22} />
            </button>
          )}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => handleNavClick('home', '#home')}
          >
            <div className="w-10 h-10 tropical-gradient rounded-full flex items-center justify-center text-deep-teal-950 font-bold text-xl shadow-lg shadow-celadon-500/20 group-hover:scale-110 transition-transform">
              C
            </div>
            <span className="text-xl font-serif font-bold tracking-tight hidden sm:block">
              Cartagena <span className="text-celadon-500">Entertainment</span>
            </span>
          </div>
        </div>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-10">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => handleNavClick(link.view, link.href)}
              className={`text-xs font-bold transition-all uppercase tracking-[0.2em] relative py-2 group ${currentNav.view === link.view && !isDetailView ? 'text-celadon-500' : 'text-deep-teal-50 hover:text-celadon-500'}`}
            >
              {link.name}
              <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-celadon-500 transform origin-left transition-transform duration-300 ${currentNav.view === link.view && !isDetailView ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
            </button>
          ))}
          <button className="bg-celadon-500 hover:bg-celadon-600 text-deep-teal-950 px-8 py-2.5 rounded-full font-bold transition-all transform hover:scale-105 flex items-center gap-2 shadow-lg shadow-celadon-500/20">
            <Phone size={16} />
            Contactar
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button className="lg:hidden text-deep-teal-50 p-2" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <div className={`lg:hidden fixed inset-x-0 top-[72px] h-screen glass-nav transition-transform duration-500 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col gap-8 p-10 items-center">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => handleNavClick(link.view, link.href)}
              className={`text-2xl font-serif font-bold transition-colors ${currentNav.view === link.view && !isDetailView ? 'text-celadon-500' : 'hover:text-celadon-500'}`}
            >
              {link.name}
            </button>
          ))}
          <button className="bg-celadon-500 w-full max-w-xs text-deep-teal-950 py-4 rounded-full font-bold text-lg mt-4 shadow-xl">
            Reservar Ahora
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
