import { BarChart3, ShieldCheck, Clock, Leaf } from 'lucide-react';

export default function FeatureHighlights() {
  const features = [
    {
      icon: <BarChart3 className="w-8 h-8 text-[#101318] stroke-[1.8]" />,
      title: "ML Based Prediction",
      desc: "Trained on real-world data"
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-[#101318] stroke-[1.8]" />,
      title: "Save Money",
      desc: "Avoid unexpected costs"
    },
    {
      icon: <Clock className="w-8 h-8 text-[#101318] stroke-[1.8]" />,
      title: "Quick & Easy",
      desc: "Get results instantly"
    },
    {
      icon: <Leaf className="w-8 h-8 text-[#101318] stroke-[1.8]" />,
      title: "For Every Vehicle",
      desc: "Cars, Bikes, SUVs & more"
    }
  ];

  return (
    <section className="py-6 sm:py-8 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Horizontal Feature Bar */}
        <div className="bg-[#F6F7FA] border border-[#EAECEF] rounded-[22px] px-6 sm:px-10 lg:px-12 py-6 sm:py-7">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-0 lg:divide-x lg:divide-[#E5E7EB]">
            {features.map((feature, i) => (
              <div 
                key={i} 
                className={`flex items-center gap-4 ${i !== 0 ? 'lg:pl-8 xl:pl-10' : ''} ${i !== features.length - 1 ? 'lg:pr-6' : ''}`}
              >
                <div className="shrink-0 flex items-center justify-center">
                  {feature.icon}
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-[#101318] text-[15px] sm:text-[16px] leading-snug">
                    {feature.title}
                  </h4>
                  <p className="text-[#68717D] text-[13px] sm:text-[14px] mt-0.5 leading-snug">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
