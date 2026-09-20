import Hero from '../components/sections/Hero';
import FeatureHighlights from '../components/sections/FeatureHighlights';
import HowItWorks from '../components/sections/HowItWorks';

export default function Home() {
  return (
    <div className="w-full">
      <Hero />
      <FeatureHighlights />
      <HowItWorks />
    </div>
  );
}
