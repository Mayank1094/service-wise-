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
    <section id="how-it-works" className="py-16 sm:py-20 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 text-center">
        
        {/* Eyebrow */}
        <div className="text-[12px] sm:text-[13px] tracking-[0.2em] font-semibold text-[#6B7480] uppercase mb-2">
          HOW IT WORKS
        </div>
        
        {/* Main Heading */}
        <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold tracking-tight text-[#101318]">
          Simple. Fast. Useful.
        </h2>
        {/* Short Line Divider */}
        <div className="w-12 h-1 bg-[#101318] rounded-full mx-auto mt-3.5 mb-12 sm:mb-14"></div>

        {/* 3 Process Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-7 text-left">
          {steps.map((step, i) => (
            <div 
              key={i} 
              className="flex items-center gap-4 sm:gap-5 p-6 sm:p-7 rounded-2xl bg-white border border-[#E6E8ED] hover:border-gray-300 transition-all shadow-xs"
            >
              <div className="w-12 h-12 rounded-full bg-[#EAECEF] text-[#101318] flex items-center justify-center text-lg font-bold shrink-0">
                {step.num}
              </div>
              <div className="min-w-0">
                <h3 className="text-base sm:text-[17px] font-bold text-[#101318] leading-snug">
                  {step.title}
                </h3>
                <p className="text-[13px] sm:text-[14px] text-[#68717D] mt-0.5 leading-snug">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
}
