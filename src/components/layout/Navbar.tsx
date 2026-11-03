import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Car, Menu, X, LogOut, History } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { warmUpBackend } from '../../services/warmup';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Predict', path: '/predict' },
    ...(user ? [{ name: 'History', path: '/history' }] : []),
    { name: 'About', path: '/about' },
    { name: 'Features', path: '/features' },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Get single clean initial letter
  const userInitial = (
    user?.displayName?.trim() ||
    user?.email?.trim() ||
    'U'
  ).charAt(0).toUpperCase();

  const userDisplayName = user?.displayName || user?.email?.split('@')[0] || 'User';

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
                onMouseEnter={() => {
                  if (link.path === '/predict') warmUpBackend();
                }}
                className={twMerge(
                  "text-[15px] transition-colors duration-150 flex items-center gap-1.5",
                  isActive 
                    ? "text-[#101318] font-semibold" 
                    : "text-[#66707C] font-normal hover:text-[#101318]"
                )}
              >
                {link.name === 'History' && <History className="w-4 h-4 text-[#8C95A3]" />}
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Auth & CTA Buttons (Right) */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="hidden md:flex items-center gap-3">
              {/* User Identity Pill with First Letter Initial Badge */}
              <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#F6F7FA] border border-[#E6E8ED] text-xs font-medium text-[#101318]">
                <div className="w-6 h-6 rounded-full bg-[#111820] text-white flex items-center justify-center text-[11px] font-bold tracking-tight shadow-xs select-none">
                  {userInitial}
                </div>
                <span className="max-w-[120px] truncate font-semibold text-[#101318]">
                  {userDisplayName}
                </span>
              </div>

              {/* History Button */}
              <Link
                to="/history"
                className={twMerge(
                  "inline-flex h-[38px] items-center justify-center gap-1.5 rounded-full border px-3.5 text-[13px] font-medium transition-all",
                  location.pathname === '/history'
                    ? "bg-[#111820] text-white border-transparent"
                    : "bg-white border-[#D9DDE3] text-[#4E5664] hover:text-[#101318] hover:border-[#B5BBC6]"
                )}
                title="View Calculation History"
              >
                <History className="w-3.5 h-3.5" />
                <span>History</span>
              </Link>

              {/* Logout Button */}
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex h-[38px] items-center justify-center gap-1.5 rounded-full border border-[#D9DDE3] bg-white px-3.5 text-[13px] font-medium text-[#4E5664] hover:text-red-600 hover:border-red-200 hover:bg-red-50/50 transition-all cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>

              {/* Predict Now CTA */}
              <Link
                to="/predict"
                onMouseEnter={() => warmUpBackend()}
                className="inline-flex h-[40px] items-center justify-center rounded-full bg-[#111820] px-5 text-[13px] font-semibold text-white transition-all hover:bg-black hover:scale-[1.02] active:scale-[0.98] shadow-xs"
              >
                Calculate Now
              </Link>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-3">
              {/* Sign In Button */}
              <Link
                to="/login"
                className="inline-flex h-[40px] items-center justify-center px-4 text-[14px] font-semibold text-[#101318] hover:text-black transition-colors"
              >
                Sign In
              </Link>

              {/* Predict CTA */}
              <Link
                to="/predict"
                onMouseEnter={() => warmUpBackend()}
                className="inline-flex h-[40px] items-center justify-center rounded-full bg-[#111820] px-5 text-[14px] font-semibold text-white transition-all hover:bg-black hover:scale-[1.02] active:scale-[0.98] shadow-xs"
              >
                Calculate Now
              </Link>
            </div>
          )}
          
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
        <div className="md:hidden border-b border-[#E6E8ED] bg-white/95 backdrop-blur-lg px-6 py-4 space-y-3 shadow-lg">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={twMerge(
                  "px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2",
                  location.pathname === link.path 
                    ? "bg-gray-100 text-[#101318] font-bold" 
                    : "text-[#66707C] hover:bg-gray-50 hover:text-[#101318]"
                )}
              >
                {link.name === 'History' && <History className="w-4 h-4" />}
                {link.name}
              </Link>
            ))}
          </nav>
          
          <div className="pt-3 border-t border-gray-100 space-y-2">
            {user ? (
              <>
                <div className="px-3 py-2 text-xs text-[#66707C] flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-[#111820] text-white flex items-center justify-center text-[11px] font-bold">
                    {userInitial}
                  </div>
                  <span>Signed in as <strong className="text-[#101318]">{userDisplayName}</strong></span>
                </div>
                <Link
                  to="/history"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex h-11 items-center justify-center gap-2 rounded-xl border border-[#D9DDE3] bg-white px-4 text-sm font-semibold text-[#101318] transition-colors hover:bg-gray-50"
                >
                  <History className="w-4 h-4" />
                  View History
                </Link>
                <Link
                  to="/predict"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex h-11 items-center justify-center rounded-xl bg-[#111820] px-4 text-sm font-semibold text-white transition-colors hover:bg-black"
                >
                  Calculate Now
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex h-11 items-center justify-center gap-2 rounded-xl border border-red-200 text-red-600 px-4 text-sm font-semibold transition-colors hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex h-11 items-center justify-center rounded-xl border border-[#D9DDE3] bg-white px-4 text-sm font-semibold text-[#101318] transition-colors hover:bg-gray-50"
                >
                  Sign In
                </Link>
                <Link
                  to="/predict"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex h-11 items-center justify-center rounded-xl bg-[#111820] px-4 text-sm font-semibold text-white transition-colors hover:bg-black"
                >
                  Calculate Now
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
