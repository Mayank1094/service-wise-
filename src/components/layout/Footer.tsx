import { Link } from 'react-router-dom';
import { Car } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-[#E6E8ED] bg-[#FBFBFC] py-12 text-sm text-[#66707C]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <Car className="w-5 h-5 text-[#101318]" />
          <span className="font-bold text-base text-[#101318] tracking-tight">ServiceWise</span>
          <span className="text-xs text-[#8A94A2] hidden sm:inline">• Vehicle Service Cost Intelligence</span>
        </div>

        {/* Links */}
        <div className="flex items-center gap-6 text-[13px] font-medium">
          <Link to="/" className="hover:text-[#101318] transition-colors">Home</Link>
          <Link to="/predict" className="hover:text-[#101318] transition-colors">Predict</Link>
          <Link to="/about" className="hover:text-[#101318] transition-colors">About</Link>
          <Link to="/features" className="hover:text-[#101318] transition-colors">Features</Link>
        </div>

        {/* Copyright */}
        <div className="text-xs text-[#8A94A2]">
          © {new Date().getFullYear()} ServiceWise. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
