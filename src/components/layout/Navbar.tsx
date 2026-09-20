import { Link, useLocation } from 'react-router-dom';
import { Car } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

export default function Navbar() {
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
        <Link to="/" className="flex items-center gap-2 group">
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
                location.pathname === link.path ? "text-primary-text" : "text-secondary-text"
              )}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* CTA Button */}
        <div className="flex items-center">
          <Link
            to="/predict"
            className="hidden md:inline-flex h-10 items-center justify-center rounded-full bg-[#111827] px-6 text-sm font-medium text-white transition-colors hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
          >
            Get Started
          </Link>
          
          {/* Mobile menu button could go here */}
        </div>
      </div>
    </header>
  );
}
