import { BarChart3, ShieldCheck, Clock, Leaf } from 'lucide-react';

export default function FeatureHighlights() {
  const features = [
    {
      icon: <BarChart3 className="w-6 h-6 text-primary-text" />,
      title: "ML Based Prediction",
      desc: "Trained on real-world data"
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-primary-text" />,
      title: "Save Money",
      desc: "Avoid unexpected costs"
    },
    {
      icon: <Clock className="w-6 h-6 text-primary-text" />,
      title: "Quick & Easy",
      desc: "Get results instantly"
    },
    {
      icon: <Leaf className="w-6 h-6 text-primary-text" />,
      title: "For Every Vehicle",
      desc: "Cars, Bikes, SUVs & more"
    }
  ];

  return (
    <section className="py-12 md:py-16 bg-bg-base">
      <div className="container mx-auto px-6">
        <div className="bg-bg-subtle rounded-3xl p-8 md:p-12 shadow-sm border border-border-subtle/50">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 divide-y sm:divide-y-0 sm:divide-x divide-border-subtle/50">
            {features.map((feature, i) => (
              <div key={i} className={`flex items-center gap-4 ${i !== 0 ? 'sm:pl-8 lg:pl-12 pt-6 sm:pt-0' : ''}`}>
                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-2xl bg-white shadow-sm border border-border-subtle/50">
                  {feature.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-primary-text text-sm md:text-base">{feature.title}</h4>
                  <p className="text-secondary-text text-xs md:text-sm mt-0.5">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
