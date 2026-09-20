import { useState } from 'react';
import { Loader2, Info } from 'lucide-react';
import { predictServiceCost, type PredictionRequest, type PredictionResponse } from '../services/api';

export default function Predict() {
  const [formData, setFormData] = useState<PredictionRequest>({
    vehicle_type: 'Car',
    vehicle_age: 3,
    kilometers_driven: 25000,
    fuel_type: 'Petrol',
    engine_type: 'Manual',
    service_type: 'General',
    previous_service_cost: 0,
    previous_services: 1,
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResponse | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: e.target.type === 'number' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const response = await predictServiceCost(formData);
      setResult(response);
    } catch (error) {
      console.error("Prediction failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-base py-12 md:py-24">
      <div className="container mx-auto px-6 max-w-5xl">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-text mb-4">Estimate Your Service Cost</h1>
          <p className="text-lg text-secondary-text max-w-2xl mx-auto">
            Enter your vehicle details below. Our machine learning model will analyze the data and predict the estimated service cost.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          
          {/* Form Section */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-border-subtle/50">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Vehicle Type */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-primary-text">Vehicle Type</label>
                  <select 
                    name="vehicle_type" 
                    value={formData.vehicle_type} 
                    onChange={handleChange}
                    className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#111827] focus:border-transparent transition-all outline-none"
                  >
                    <option value="Car">Car</option>
                    <option value="SUV">SUV</option>
                    <option value="Bike">Bike</option>
                  </select>
                </div>

                {/* Service Type */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-primary-text">Service Type</label>
                  <select 
                    name="service_type" 
                    value={formData.service_type} 
                    onChange={handleChange}
                    className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#111827] focus:border-transparent transition-all outline-none"
                  >
                    <option value="General">General Maintenance</option>
                    <option value="Major">Major Service</option>
                    <option value="Repair">Specific Repair</option>
                  </select>
                </div>

                {/* Vehicle Age */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-primary-text">Vehicle Age (Years)</label>
                  <input 
                    type="number" 
                    name="vehicle_age"
                    min="0"
                    value={formData.vehicle_age} 
                    onChange={handleChange}
                    className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#111827] focus:border-transparent transition-all outline-none"
                  />
                </div>

                {/* Kilometers Driven */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-primary-text">Kilometers Driven</label>
                  <input 
                    type="number" 
                    name="kilometers_driven"
                    min="0"
                    step="100"
                    value={formData.kilometers_driven} 
                    onChange={handleChange}
                    className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#111827] focus:border-transparent transition-all outline-none"
                  />
                </div>

                {/* Fuel Type */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-primary-text">Fuel Type</label>
                  <select 
                    name="fuel_type" 
                    value={formData.fuel_type} 
                    onChange={handleChange}
                    className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#111827] focus:border-transparent transition-all outline-none"
                  >
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="EV">Electric (EV)</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>

                {/* Engine Type */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-primary-text">Transmission / Engine</label>
                  <select 
                    name="engine_type" 
                    value={formData.engine_type} 
                    onChange={handleChange}
                    className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#111827] focus:border-transparent transition-all outline-none"
                  >
                    <option value="Manual">Manual</option>
                    <option value="Automatic">Automatic</option>
                  </select>
                </div>

              </div>

              <div className="pt-4 border-t border-gray-100">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full h-14 rounded-full bg-[#111827] text-white font-medium text-lg hover:bg-gray-800 transition-all active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center shadow-lg shadow-gray-900/20"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Analyzing Data...
                    </>
                  ) : (
                    "Predict Service Cost"
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Result Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-6">
              
              {!result && !loading && (
                <div className="bg-bg-subtle rounded-3xl p-8 border border-border-subtle/50 text-center flex flex-col items-center justify-center min-h-[300px]">
                  <Info className="w-12 h-12 text-gray-300 mb-4" />
                  <h3 className="text-lg font-semibold text-primary-text mb-2">Ready to Predict</h3>
                  <p className="text-secondary-text text-sm">Fill out the form and click predict to see the estimated cost.</p>
                </div>
              )}

              {loading && (
                <div className="bg-bg-subtle rounded-3xl p-8 border border-border-subtle/50 text-center flex flex-col items-center justify-center min-h-[300px]">
                  <Loader2 className="w-12 h-12 text-[#111827] animate-spin mb-4" />
                  <h3 className="text-lg font-semibold text-primary-text mb-2">Processing Data</h3>
                  <p className="text-secondary-text text-sm animate-pulse">Running ML model inference...</p>
                </div>
              )}

              {result && !loading && (
                <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-xl shadow-gray-200/50 relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gray-100 rounded-bl-[100px] -z-10"></div>
                  
                  <div className="text-sm font-semibold tracking-widest text-secondary-text uppercase mb-2">
                    Estimated Cost
                  </div>
                  
                  <div className="flex items-baseline gap-1 mb-6 text-[#111827]">
                    <span className="text-4xl font-bold">₹</span>
                    <span className="text-5xl md:text-6xl font-bold tracking-tight">
                      {result.predicted_cost.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="space-y-4 pt-6 border-t border-gray-100">
                    <div>
                      <div className="text-xs text-secondary-text mb-1">Model Used</div>
                      <div className="text-sm font-medium text-primary-text">{result.model_used}</div>
                    </div>
                    <div>
                      <div className="text-xs text-secondary-text mb-1">Estimated Accuracy</div>
                      <div className="text-sm font-medium text-green-600 bg-green-50 inline-block px-2 py-0.5 rounded">{result.accuracy_estimate}</div>
                    </div>
                  </div>
                  
                  <div className="mt-8 pt-4 border-t border-gray-100 flex items-start gap-3">
                    <Info className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-secondary-text">
                      This is an ML-based estimate. Actual costs may vary depending on the garage, location, and specific physical condition of the vehicle parts.
                    </p>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
