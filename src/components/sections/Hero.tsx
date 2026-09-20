import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-bg-base pt-16 md:pt-24 lg:pt-32 pb-16">
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Left Text Content */}
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-xs font-semibold tracking-widest text-secondary-text mb-6">
              SMARTER SERVICE. A SMOOTHER JOURNEY.
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-primary-text leading-[1.1] mb-6">
              Vehicle Service<br />Cost Prediction
            </h1>
            
            <p className="text-lg md:text-xl text-secondary-text mb-8 max-w-lg leading-relaxed">
              Know your estimated service cost before you visit the garage.<br/>
              Powered by Machine Learning.
            </p>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-16">
              <Link
                to="/predict"
                className="inline-flex h-14 items-center justify-center rounded-full bg-[#111827] px-8 text-base font-medium text-white transition-all hover:bg-gray-800 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-gray-900/20"
              >
                Predict Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                to="/about"
                className="inline-flex h-14 items-center justify-center rounded-full bg-gray-100 px-8 text-base font-medium text-primary-text transition-all hover:bg-gray-200"
              >
                Learn More
              </Link>
            </div>

            {/* Stats Bar */}
            <div className="flex items-center gap-8 md:gap-12 pt-8 border-t border-border-subtle/60">
              <div>
                <h3 className="text-lg font-bold text-primary-text">Accurate</h3>
                <p className="text-sm text-secondary-text">ML Powered</p>
              </div>
              <div className="w-px h-10 bg-border-subtle/60 hidden sm:block"></div>
              <div>
                <h3 className="text-lg font-bold text-primary-text">Fast</h3>
                <p className="text-sm text-secondary-text">Get results in seconds</p>
              </div>
              <div className="w-px h-10 bg-border-subtle/60 hidden sm:block"></div>
              <div>
                <h3 className="text-lg font-bold text-primary-text">Reliable</h3>
                <p className="text-sm text-secondary-text">Built for every vehicle</p>
              </div>
            </div>
          </div>

          {/* Right Image/Car Content */}
          <div className="relative w-full h-[400px] lg:h-[600px] flex items-center justify-center">
            {/* Background shape mimicking the reference */}
            <div className="absolute top-0 right-0 w-[150%] h-[150%] bg-gradient-to-bl from-gray-100 to-transparent rounded-[100%] translate-x-1/4 -translate-y-1/4 -z-10"></div>
            
            {/* Decorative Quote */}
            <div className="absolute top-10 right-10 text-right opacity-60 hidden md:block">
              <p className="italic font-serif text-lg">"Plan smarter.<br/>Drive longer."</p>
              <div className="w-8 h-px bg-current ml-auto mt-2"></div>
            </div>

            {/* Car Image */}
            <div className="relative w-full max-w-2xl mx-auto flex justify-center items-center">
              <img 
                src="/car.png" 
                alt="Premium modern car" 
                className="w-full h-auto object-contain scale-110 mix-blend-multiply"
                style={{ WebkitMaskImage: 'radial-gradient(circle, black 60%, transparent 100%)' }}
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
