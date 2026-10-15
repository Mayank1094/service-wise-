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
    <header className="sticky top-0 z-50 w-full border-b border-border-subtle bg-bg-base/80 backdrop-blur-md">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link 
          to="/" 
          onClick={() => setMobileMenuOpen(false)}
          className="flex items-center gap-2 group"
        >
          <Car className="w-7 h-7 text-primary-text transition-transform group-hover:-translate-y-0.5 duration-300" />
          <span className="font-bold text-xl tracking-tight text-primary-text">ServiceWise</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={twMerge(
                "text-sm font-medium transition-colors hover:text-primary-text",
                location.pathname === link.path ? "text-primary-text font-semibold" : "text-secondary-text"
              )}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* CTA Button & Mobile Menu Toggle */}
        <div className="flex items-center gap-3">
          <Link
            to="/predict"
            className="hidden md:inline-flex h-10 items-center justify-center rounded-full bg-[#111827] px-6 text-sm font-medium text-white transition-colors hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
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
