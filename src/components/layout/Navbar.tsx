import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Car, Menu, X } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Predict', path: '/predict' },
    { name: 'About', path: '/about' },
    { name: 'Features', path: '/features' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#E6E8ED]/80 bg-white/90 backdrop-blur-md">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 h-[76px] flex items-center justify-between">
        {/* Logo (Left) */}
        <Link 
          to="/" 
          onClick={() => setMobileMenuOpen(false)}
          className="flex items-center gap-2.5 group"
        >
          <Car className="w-7 h-7 text-[#101318] stroke-[2] transition-transform group-hover:-translate-y-0.5 duration-200" />
          <span className="font-bold text-[23px] tracking-tight text-[#101318]">ServiceWise</span>
        </Link>

        {/* Desktop Navigation (Center) */}
        <nav className="hidden md:flex items-center gap-9">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={twMerge(
                  "text-[15px] transition-colors duration-150",
                  isActive 
                    ? "text-[#101318] font-semibold" 
                    : "text-[#66707C] font-normal hover:text-[#101318]"
                )}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* CTA Button (Right) */}
        <div className="flex items-center gap-3">
          <Link
            to="/predict"
            className="hidden md:inline-flex h-[42px] items-center justify-center rounded-full bg-[#111820] px-6 text-[14px] font-semibold text-white transition-all hover:bg-black hover:scale-[1.02] active:scale-[0.98] shadow-xs"
          >
            Get Started
          </Link>
          
          {/* Mobile menu button */}
          <button
            type="button"
            aria-label="Toggle navigation menu"
            onClick={() => setMobileMenuOpen(prev => !prev)}
            className="md:hidden p-2 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border-subtle bg-white/95 backdrop-blur-lg px-6 py-4 space-y-3 shadow-lg">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={twMerge(
                  "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  location.pathname === link.path 
                    ? "bg-gray-100 text-primary-text font-bold" 
                    : "text-secondary-text hover:bg-gray-50 hover:text-primary-text"
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>
          <div className="pt-2 border-t border-gray-100">
            <Link
              to="/predict"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex h-11 items-center justify-center rounded-xl bg-[#111827] px-4 text-sm font-semibold text-white transition-colors hover:bg-gray-800"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
