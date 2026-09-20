import { Cpu, Zap, LayoutTemplate, DatabaseZap, PieChart, Smartphone } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: <Cpu className="w-6 h-6 text-white" />,
      title: "Machine Learning Prediction",
      desc: "Utilizes advanced regression algorithms to provide accurate cost estimates based on historical data patterns."
    },
    {
      icon: <Zap className="w-6 h-6 text-[#111827]" />,
      title: "Fast Cost Estimation",
      desc: "Get near-instantaneous predictions without waiting. The optimized model inference runs in milliseconds."
    },
    {
      icon: <LayoutTemplate className="w-6 h-6 text-[#111827]" />,
      title: "Simple User Interface",
      desc: "A clean, minimal, and premium design that makes entering vehicle data straightforward and frustration-free."
    },
    {
      icon: <DatabaseZap className="w-6 h-6 text-[#111827]" />,
      title: "Vehicle Information Analysis",
      desc: "Takes into account crucial factors like kilometers driven, vehicle age, and specific service types."
    },
    {
      icon: <PieChart className="w-6 h-6 text-[#111827]" />,
      title: "Service Cost Insights",
      desc: "Helps users understand baseline costs, preventing overcharging and promoting transparency."
    },
    {
      icon: <Smartphone className="w-6 h-6 text-[#111827]" />,
      title: "Responsive Design",
      desc: "Fully optimized for desktop, tablet, and mobile devices ensuring a seamless experience anywhere."
    }
  ];

  return (
    <div className="min-h-screen bg-bg-base py-12 md:py-24">
      <div className="container mx-auto px-6 max-w-6xl">
        
        <div className="text-center mb-16 md:mb-24">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-text mb-6">Core Features</h1>
          <p className="text-lg text-secondary-text max-w-2xl mx-auto">
            ServiceWise combines modern frontend technologies with machine learning to deliver a powerful, yet simple cost prediction tool.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-bg-subtle rounded-3xl p-8 border border-border-subtle/50 transition-all hover:bg-white hover:shadow-xl hover:shadow-gray-200/50 group"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm ${index === 0 ? 'bg-[#111827]' : 'bg-white border border-border-subtle/50'}`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-primary-text mb-3 group-hover:text-black transition-colors">{feature.title}</h3>
              <p className="text-secondary-text leading-relaxed text-sm">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
