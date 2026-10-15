import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Hero from '../components/sections/Hero';
import FeatureHighlights from '../components/sections/FeatureHighlights';
import HowItWorks from '../components/sections/HowItWorks';

export default function Home() {
  return (
    <div className="w-full">
      <Hero />
      <FeatureHighlights />
      <HowItWorks />
      
      {/* Bottom CTA Section */}
      <section className="py-16 sm:py-20 bg-[#F6F7FA] border-t border-[#EAECEF]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#101318] tracking-tight mb-4">
            Ready to Estimate Your Service Cost?
          </h2>
          <p className="text-base sm:text-lg text-[#66707C] max-w-xl mx-auto mb-8">
            Select your vehicle model, mileage, and workshop tier to get an instant, data-backed cost breakdown.
          </p>
          <Link
            to="/predict"
            className="inline-flex h-[56px] items-center justify-center rounded-full bg-[#111820] hover:bg-black px-9 text-base font-semibold text-white transition-all hover:scale-[1.01] active:scale-[0.99] group shadow-sm"
          >
            Calculate Now
            <ArrowRight className="ml-2.5 w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </div>
  );
}
