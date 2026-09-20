import { BrainCircuit, Database, LineChart, Code2 } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-bg-base py-12 md:py-24">
      <div className="container mx-auto px-6 max-w-4xl">
        
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-semibold tracking-widest text-secondary-text uppercase mb-4">
            Project Overview
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary-text mb-6">About ServiceWise</h1>
          <p className="text-lg text-secondary-text">
            A college machine learning mini-project demonstrating the practical application of regression models in the automotive domain.
          </p>
        </div>

        <div className="space-y-12">
          {/* Section 1 */}
          <section className="bg-bg-subtle rounded-3xl p-8 md:p-12 border border-border-subtle/50">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-border-subtle/50">
                <BrainCircuit className="w-6 h-6 text-[#111827]" />
              </div>
              <h2 className="text-2xl font-bold text-primary-text">What is Vehicle Service Cost Prediction?</h2>
            </div>
            <p className="text-secondary-text leading-relaxed text-lg">
              This system uses machine learning to estimate vehicle service expenses based on historical vehicle and service data. By analyzing past service records, vehicle types, age, and kilometers driven, the model learns the hidden patterns that dictate the final bill.
            </p>
          </section>

          {/* Section 2 */}
          <section className="bg-bg-subtle rounded-3xl p-8 md:p-12 border border-border-subtle/50">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-border-subtle/50">
                <LineChart className="w-6 h-6 text-[#111827]" />
              </div>
              <h2 className="text-2xl font-bold text-primary-text">Why this project?</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-border-subtle/50">
                <h3 className="font-bold text-primary-text mb-2">For Vehicle Owners</h3>
                <p className="text-secondary-text text-sm">Helps estimate upcoming expenses and prevents being overcharged by providing a baseline prediction.</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-border-subtle/50">
                <h3 className="font-bold text-primary-text mb-2">For Service Centers</h3>
                <p className="text-secondary-text text-sm">Assists in providing quick, data-backed initial estimates to customers.</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-border-subtle/50">
                <h3 className="font-bold text-primary-text mb-2">Reduces Uncertainty</h3>
                <p className="text-secondary-text text-sm">Brings transparency to the traditionally opaque automotive repair industry.</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-border-subtle/50">
                <h3 className="font-bold text-primary-text mb-2">Real-world Application</h3>
                <p className="text-secondary-text text-sm">Demonstrates a practical, end-to-end machine learning regression use case.</p>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="bg-bg-subtle rounded-3xl p-8 md:p-12 border border-border-subtle/50">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-[#111827] rounded-2xl flex items-center justify-center shadow-sm">
                <Database className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-primary-text">The Machine Learning Approach</h2>
            </div>
            <p className="text-secondary-text leading-relaxed text-lg mb-6">
              Predicting service cost is formulated as a <strong>Supervised Learning Regression Problem</strong>. 
              The model is trained on a dataset containing various features such as vehicle specifications, usage metrics, and historical service types, with the actual service cost as the target variable.
            </p>
            <div className="flex items-center gap-3 text-sm text-secondary-text bg-white p-4 rounded-xl border border-border-subtle/50 inline-flex">
              <Code2 className="w-5 h-5 text-gray-400" />
              Expected integration: FastAPI backend serving a scikit-learn model.
            </div>
          </section>
        </div>

      </div>
    </div>
  );
}
