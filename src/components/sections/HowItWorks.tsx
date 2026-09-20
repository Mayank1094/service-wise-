export default function HowItWorks() {
  const steps = [
    {
      num: "1",
      title: "Enter Vehicle Details",
      desc: "Fill in basic information"
    },
    {
      num: "2",
      title: "Our ML Model Predicts",
      desc: "AI analyzes and estimates cost"
    },
    {
      num: "3",
      title: "Get Estimated Cost",
      desc: "Know before you go"
    }
  ];

  return (
    <section className="py-24 bg-bg-base">
      <div className="container mx-auto px-6 text-center">
        
        <div className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-semibold tracking-widest text-secondary-text uppercase mb-4">
          How It Works
        </div>
        
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-primary-text mb-16 relative inline-block">
          Simple. Fast. Useful.
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-12 h-1 bg-[#111827] rounded-full"></div>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, i) => (
            <div 
              key={i} 
              className="group flex flex-col items-start p-8 rounded-3xl bg-bg-subtle border border-border-subtle/50 transition-all hover:bg-white hover:shadow-xl hover:shadow-gray-200/50 hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-lg font-bold text-primary-text mb-6 group-hover:bg-[#111827] group-hover:text-white transition-colors">
                {step.num}
              </div>
              <h3 className="text-xl font-semibold text-primary-text mb-2 text-left">{step.title}</h3>
              <p className="text-secondary-text text-left">{step.desc}</p>
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
}
