import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white pt-8 sm:pt-10 lg:pt-12 pb-10 lg:pb-14">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-8 items-center">
          
          {/* Left Text Content (Column 1-6) */}
          <div className="lg:col-span-6 xl:col-span-6 flex flex-col justify-center">
            {/* Eyebrow */}
            <div className="text-[12px] sm:text-[13px] tracking-[0.2em] uppercase font-medium text-[#66707C] mb-4">
              SMARTER SERVICE. A SMOOTHER JOURNEY.
            </div>
            
            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-[64px] xl:text-[72px] font-extrabold tracking-[-0.035em] text-[#101318] leading-[1.04] mb-5">
              Vehicle Service<br className="hidden sm:inline" /> Cost Prediction
            </h1>
            
            {/* Description */}
            <p className="text-base sm:text-lg lg:text-[20px] text-[#66707C] leading-[1.45] font-normal mb-8 max-w-xl">
              Know your estimated service cost before you visit the garage.<br className="hidden sm:inline" />
              Powered by Machine Learning.
            </p>
            
            {/* Buttons */}
            <div className="flex flex-row items-center gap-4 mb-9">
              <Link
                to="/predict"
                className="inline-flex h-[58px] sm:h-[62px] items-center justify-center rounded-full bg-[#111820] hover:bg-black px-8 sm:px-9 text-base font-semibold text-white transition-all hover:scale-[1.01] active:scale-[0.99] group shadow-sm"
              >
                Predict Now
                <ArrowRight className="ml-2.5 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex h-[58px] sm:h-[62px] items-center justify-center rounded-full bg-[#E9EBF0] hover:bg-[#E2E5EB] px-8 sm:px-9 text-base font-semibold text-[#111820] transition-all"
              >
                Learn More
              </a>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center gap-6 sm:gap-8 pt-1">
              <div>
                <div className="text-[16px] font-bold text-[#101318] leading-tight">Accurate</div>
                <div className="text-[13px] text-[#66707C] mt-0.5">ML Powered</div>
              </div>
              <div className="w-px h-8 bg-[#E6E8ED]"></div>
              <div>
                <div className="text-[16px] font-bold text-[#101318] leading-tight">Fast</div>
                <div className="text-[13px] text-[#66707C] mt-0.5">Get results in seconds</div>
              </div>
              <div className="w-px h-8 bg-[#E6E8ED]"></div>
              <div>
                <div className="text-[16px] font-bold text-[#101318] leading-tight">Reliable</div>
                <div className="text-[13px] text-[#66707C] mt-0.5">Built for every vehicle</div>
              </div>
            </div>
          </div>

          {/* Right Image/Car Content (Column 7-12) */}
          <div className="lg:col-span-6 xl:col-span-6 relative flex flex-col justify-center">
            {/* Decorative Quote in top-right */}
            <div className="text-right mb-2 pr-3 hidden lg:block">
              <p className="text-[15px] sm:text-[16px] text-[#66707C] font-normal leading-snug">
                &ldquo;Plan smarter.<br />Drive longer.&rdquo;
              </p>
              <div className="w-8 h-[1.5px] bg-[#D1D5DB] ml-auto mt-2"></div>
            </div>

            {/* Vehicle Image Container */}
            <div className="relative w-full rounded-2xl overflow-hidden">
              <img 
                src="/hero-car.jpg" 
                alt="Premium silver luxury sedan" 
                className="w-full h-auto object-cover rounded-2xl select-none"
                style={{
                  maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 100%)',
                  WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 100%)'
                }}
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
