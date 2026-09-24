import { useState } from 'react';
import { Loader2, Info } from 'lucide-react';
import { predictServiceCost, type PredictionRequest, type PredictionResponse } from '../services/api';

interface VehicleConstraint {
  label: string;
  allowedFuels: { value: string; label: string }[];
  allowedTransmissions: { value: string; label: string }[];
  defaultFuel: string;
  defaultTransmission: string;
}

const VEHICLE_CONFIGS: Record<string, VehicleConstraint> = {
  Car: {
    label: 'Car',
    allowedFuels: [
      { value: 'Petrol', label: 'Petrol' },
      { value: 'Diesel', label: 'Diesel' },
      { value: 'EV', label: 'Electric (EV)' },
      { value: 'Hybrid', label: 'Hybrid' },
    ],
    allowedTransmissions: [
      { value: 'Manual', label: 'Manual' },
      { value: 'Automatic', label: 'Automatic' },
    ],
    defaultFuel: 'Petrol',
    defaultTransmission: 'Manual',
  },
  SUV: {
    label: 'SUV',
    allowedFuels: [
      { value: 'Petrol', label: 'Petrol' },
      { value: 'Diesel', label: 'Diesel' },
      { value: 'EV', label: 'Electric (EV)' },
      { value: 'Hybrid', label: 'Hybrid' },
    ],
    allowedTransmissions: [
      { value: 'Manual', label: 'Manual' },
      { value: 'Automatic', label: 'Automatic' },
    ],
    defaultFuel: 'Diesel',
    defaultTransmission: 'Manual',
  },
  Bike: {
    label: 'Bike',
    allowedFuels: [{ value: 'Petrol', label: 'Petrol' }],
    allowedTransmissions: [
      { value: 'Manual', label: 'Manual (Geared)' },
      { value: 'Automatic', label: 'Clutchless / Semi-Auto' },
    ],
    defaultFuel: 'Petrol',
    defaultTransmission: 'Manual',
  },
  Scooty: {
    label: 'Scooty',
    allowedFuels: [{ value: 'Petrol', label: 'Petrol' }],
    allowedTransmissions: [{ value: 'Automatic', label: 'Automatic (CVT / Gearless)' }],
    defaultFuel: 'Petrol',
    defaultTransmission: 'Automatic',
  },
  'Electric Bike': {
    label: 'Electric Bike',
    allowedFuels: [{ value: 'EV', label: 'Electric (EV)' }],
    allowedTransmissions: [{ value: 'Automatic', label: 'Automatic (Direct Drive)' }],
    defaultFuel: 'EV',
    defaultTransmission: 'Automatic',
  },
  'Electric Scooter': {
    label: 'Electric Scooter',
    allowedFuels: [{ value: 'EV', label: 'Electric (EV)' }],
    allowedTransmissions: [{ value: 'Automatic', label: 'Automatic (Direct Drive)' }],
    defaultFuel: 'EV',
    defaultTransmission: 'Automatic',
  },
};

interface FormState {
  vehicle_type: string;
  vehicle_age: number | string;
  kilometers_driven: number | string;
  fuel_type: string;
  engine_type: string;
  service_type: string;
  previous_service_cost: number;
  previous_services: number;
}

export default function Predict() {
  const [formData, setFormData] = useState<FormState>({
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

  const currentVehicleConfig = VEHICLE_CONFIGS[formData.vehicle_type] || VEHICLE_CONFIGS['Car'];

  const handleVehicleTypeChange = (newVehicle: string) => {
    const config = VEHICLE_CONFIGS[newVehicle] || VEHICLE_CONFIGS['Car'];
    setFormData(prev => {
      const isFuelValid = config.allowedFuels.some(f => f.value === prev.fuel_type);
      const isTransValid = config.allowedTransmissions.some(t => t.value === prev.engine_type);
      return {
        ...prev,
        vehicle_type: newVehicle,
        fuel_type: isFuelValid ? prev.fuel_type : config.defaultFuel,
        engine_type: isTransValid ? prev.engine_type : config.defaultTransmission,
      };
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'vehicle_type') {
      handleVehicleTypeChange(value);
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: value === '' ? '' : (e.target.type === 'number' ? (isNaN(Number(value)) ? value : Number(value)) : value)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const payload: PredictionRequest = {
        ...formData,
        vehicle_age: Number(formData.vehicle_age) || 0,
        kilometers_driven: Number(formData.kilometers_driven) || 0,
      };
      const response = await predictServiceCost(payload);
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
                    className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#111827] focus:border-transparent transition-all outline-none font-medium text-gray-800"
                  >
                    <option value="Bike">Bike</option>
                    <option value="Scooty">Scooty</option>
                    <option value="Car">Car</option>
                    <option value="SUV">SUV</option>
                    <option value="Electric Bike">Electric Bike</option>
                    <option value="Electric Scooter">Electric Scooter</option>
                  </select>
                </div>

                {/* Service Type */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-primary-text">Service Type</label>
                  <select 
                    name="service_type" 
                    value={formData.service_type} 
                    onChange={handleChange}
                    className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#111827] focus:border-transparent transition-all outline-none font-medium text-gray-800"
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
                    placeholder="e.g. 4"
                    value={formData.vehicle_age} 
                    onChange={handleChange}
                    className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#111827] focus:border-transparent transition-all outline-none font-medium text-gray-800"
                  />
                </div>

                {/* Kilometers Driven */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-primary-text">Kilometers Driven</label>
                  <input 
                    type="number" 
                    name="kilometers_driven"
                    min="0"
                    step="500"
                    placeholder="e.g. 35000"
                    value={formData.kilometers_driven} 
                    onChange={handleChange}
                    className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#111827] focus:border-transparent transition-all outline-none font-medium text-gray-800"
                  />
                </div>

                {/* Fuel Type */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-primary-text">Fuel Type</label>
                    {currentVehicleConfig.allowedFuels.length === 1 && (
                      <span className="text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-medium">
                        Auto-locked for {formData.vehicle_type}
                      </span>
                    )}
                  </div>
                  <select 
                    name="fuel_type" 
                    value={formData.fuel_type} 
                    onChange={handleChange}
                    disabled={currentVehicleConfig.allowedFuels.length === 1}
                    className={`w-full h-12 px-4 rounded-xl border border-gray-200 transition-all outline-none font-medium text-gray-800 ${
                      currentVehicleConfig.allowedFuels.length === 1 
                        ? 'bg-gray-100 cursor-not-allowed text-gray-600' 
                        : 'bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#111827] focus:border-transparent'
                    }`}
                  >
                    {currentVehicleConfig.allowedFuels.map(fuel => (
                      <option key={fuel.value} value={fuel.value}>
                        {fuel.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Engine Type */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-primary-text">Transmission / Engine</label>
                    {currentVehicleConfig.allowedTransmissions.length === 1 && (
                      <span className="text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-medium">
                        Auto-locked
                      </span>
                    )}
                  </div>
                  <select 
                    name="engine_type" 
                    value={formData.engine_type} 
                    onChange={handleChange}
                    disabled={currentVehicleConfig.allowedTransmissions.length === 1}
                    className={`w-full h-12 px-4 rounded-xl border border-gray-200 transition-all outline-none font-medium text-gray-800 ${
                      currentVehicleConfig.allowedTransmissions.length === 1 
                        ? 'bg-gray-100 cursor-not-allowed text-gray-600' 
                        : 'bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#111827] focus:border-transparent'
                    }`}
                  >
                    {currentVehicleConfig.allowedTransmissions.map(trans => (
                      <option key={trans.value} value={trans.value}>
                        {trans.label}
                      </option>
                    ))}
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
