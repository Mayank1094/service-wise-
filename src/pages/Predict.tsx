import { useState } from 'react';
import { 
  Car, 
  Bike, 
  Wrench, 
  ShieldCheck, 
  Gauge, 
  Calendar, 
  Building2, 
  MapPin, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  RotateCcw,
  TrendingDown
} from 'lucide-react';
import { predictServiceCost, type PredictionRequest, type PredictionResponse } from '../services/api';

interface VehicleConstraint {
  label: string;
  allowedFuels: { value: string; label: string }[];
  allowedTransmissions: { value: string; label: string }[];
  defaultFuel: string;
  defaultTransmission: string;
  segments: { id: string; label: string; examples: string }[];
}

const VEHICLE_CONFIGS: Record<string, VehicleConstraint> = {
  Car: {
    label: 'Hatchback / Sedan',
    allowedFuels: [
      { value: 'Petrol', label: 'Petrol' },
      { value: 'Diesel', label: 'Diesel' },
      { value: 'EV', label: 'Electric (EV)' },
      { value: 'Hybrid', label: 'Hybrid' },
    ],
    allowedTransmissions: [
      { value: 'Manual', label: 'Manual' },
      { value: 'Automatic', label: 'Automatic (AT/CVT/DCT)' },
    ],
    defaultFuel: 'Petrol',
    defaultTransmission: 'Manual',
    segments: [
      { id: 'budget', label: 'Budget / Entry', examples: 'Alto, Swift, WagonR, Tiago, i10' },
      { id: 'mid', label: 'Mid-size / Sedan', examples: 'City, Verna, Dzire, Amaze, Ciaz' },
      { id: 'premium', label: 'Executive / Premium', examples: 'Octavia, Slavia, Virtus, Civic' },
      { id: 'luxury', label: 'Luxury', examples: 'Mercedes C-Class, BMW 3 Series, Audi A4' },
    ],
  },
  SUV: {
    label: 'Compact / Full SUV',
    allowedFuels: [
      { value: 'Diesel', label: 'Diesel' },
      { value: 'Petrol', label: 'Petrol' },
      { value: 'EV', label: 'Electric (EV)' },
      { value: 'Hybrid', label: 'Hybrid' },
    ],
    allowedTransmissions: [
      { value: 'Manual', label: 'Manual' },
      { value: 'Automatic', label: 'Automatic (AT/Torque Converter/DCT)' },
    ],
    defaultFuel: 'Diesel',
    defaultTransmission: 'Manual',
    segments: [
      { id: 'budget', label: 'Compact / Sub-4m', examples: 'Brezza, Nexon, Venue, Sonet, Punch' },
      { id: 'mid', label: 'Mid-size SUV', examples: 'Creta, Seltos, Grand Vitara, Kushaq' },
      { id: 'premium', label: 'Premium 7-Seater', examples: 'XUV700, Harrier, Safari, Scorpio-N, Compass' },
      { id: 'luxury', label: 'Luxury SUV', examples: 'Fortuner, BMW X3/X5, Mercedes GLC, Audi Q5' },
    ],
  },
  Bike: {
    label: 'Motorcycle',
    allowedFuels: [{ value: 'Petrol', label: 'Petrol' }],
    allowedTransmissions: [
      { value: 'Manual', label: 'Manual (Geared)' },
      { value: 'Automatic', label: 'Clutchless / Quickshifter' },
    ],
    defaultFuel: 'Petrol',
    defaultTransmission: 'Manual',
    segments: [
      { id: 'budget', label: 'Commuter (100–125cc)', examples: 'Splendor, Shine, Platina, HF Deluxe' },
      { id: 'mid', label: 'Sports / Executive (150–200cc)', examples: 'Pulsar, Apache, FZ, Unicorn' },
      { id: 'premium', label: 'Cruiser / Touring (300cc+)', examples: 'Royal Enfield Classic/Hunter, Duke 390, Speed 400' },
      { id: 'luxury', label: 'Superbike / Adventure', examples: 'Kawasaki Ninja, Triumph Tiger, BMW GS' },
    ],
  },
  Scooty: {
    label: 'Scooter (ICE)',
    allowedFuels: [{ value: 'Petrol', label: 'Petrol' }],
    allowedTransmissions: [{ value: 'Automatic', label: 'Automatic (CVT / Gearless)' }],
    defaultFuel: 'Petrol',
    defaultTransmission: 'Automatic',
    segments: [
      { id: 'budget', label: 'Standard 110cc', examples: 'Activa 6G, TVS Jupiter, Pleasure' },
      { id: 'mid', label: '125cc Premium', examples: 'Access 125, Ntorq 125, Burgman, Fascino' },
      { id: 'premium', label: 'Maxi / Lifestyle', examples: 'Aerox 155, Aprilia SR 160, Vespa' },
    ],
  },
  'Electric Bike': {
    label: 'Electric Motorcycle',
    allowedFuels: [{ value: 'EV', label: 'Electric (EV)' }],
    allowedTransmissions: [{ value: 'Automatic', label: 'Automatic (Direct Drive)' }],
    defaultFuel: 'EV',
    defaultTransmission: 'Automatic',
    segments: [
      { id: 'budget', label: 'City Commuter EV', examples: 'Revolt RV400, Tork Kratos R' },
      { id: 'premium', label: 'Performance EV', examples: 'Ultraviolette F77, Oben Rorr' },
    ],
  },
  'Electric Scooter': {
    label: 'Electric Scooter',
    allowedFuels: [{ value: 'EV', label: 'Electric (EV)' }],
    allowedTransmissions: [{ value: 'Automatic', label: 'Automatic (Direct Drive)' }],
    defaultFuel: 'EV',
    defaultTransmission: 'Automatic',
    segments: [
      { id: 'budget', label: 'Value EV Scooter', examples: 'Ola S1X, Hero Vida V1, Bounce' },
      { id: 'mid', label: 'Smart EV Scooter', examples: 'Ather 450X, TVS iQube, Bajaj Chetak, Ola S1 Pro' },
      { id: 'premium', label: 'Premium Smart EV', examples: 'Ather Apex, BMW CE 02' },
    ],
  },
};

const COMMON_ADDONS = [
  { id: 'brake_pads', label: 'Brake Pads Replacement', desc: 'Front/rear pads worn or squealing', for4W: true, for2W: true },
  { id: 'ac_service', label: 'AC Gas & Filter Service', desc: 'Refrigerant top-up, condenser & blower deep clean', for4W: true, for2W: false },
  { id: 'battery', label: 'Battery Replacement', desc: 'New branded battery with 3–4 yr warranty', for4W: true, for2W: true },
  { id: 'wheel_care', label: 'Wheel Alignment & Balancing', desc: 'Laser alignment, weights & tire rotation', for4W: true, for2W: false },
  { id: 'clutch', label: 'Clutch Assembly Overhaul', desc: 'Clutch plate, pressure plate & bearing kit', for4W: true, for2W: true },
  { id: 'suspension', label: 'Suspension Bushing & Struts', desc: 'Inspection of link rods, lower arms & shockers', for4W: true, for2W: true },
];

export default function Predict() {
  const [formData, setFormData] = useState<PredictionRequest>({
    vehicle_type: 'Car',
    brand_segment: 'mid',
    vehicle_age: 3,
    kilometers_driven: 32000,
    fuel_type: 'Petrol',
    engine_type: 'Manual',
    service_type: 'General',
    workshop_type: 'multibrand',
    city_tier: 'tier1_metro',
    service_history: 'regular',
    selected_addons: [],
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const currentVehicleConfig = VEHICLE_CONFIGS[formData.vehicle_type] || VEHICLE_CONFIGS['Car'];
  const is2W = ['Bike', 'Scooty', 'Electric Bike', 'Electric Scooter'].includes(formData.vehicle_type);

  const handleVehicleTypeChange = (newVehicle: string) => {
    const config = VEHICLE_CONFIGS[newVehicle] || VEHICLE_CONFIGS['Car'];
    setFormData(prev => {
      const isFuelValid = config.allowedFuels.some(f => f.value === prev.fuel_type);
      const isTransValid = config.allowedTransmissions.some(t => t.value === prev.engine_type);
      const defaultSeg = config.segments[1]?.id || config.segments[0]?.id || 'mid';
      
      // Filter out 4W-only add-ons if switching to 2W
      const isNext2W = ['Bike', 'Scooty', 'Electric Bike', 'Electric Scooter'].includes(newVehicle);
      const filteredAddons = isNext2W 
        ? prev.selected_addons.filter(id => !['ac_service', 'wheel_care'].includes(id))
        : prev.selected_addons;

      return {
        ...prev,
        vehicle_type: newVehicle,
        brand_segment: defaultSeg,
        fuel_type: isFuelValid ? prev.fuel_type : config.defaultFuel,
        engine_type: isTransValid ? prev.engine_type : config.defaultTransmission,
        selected_addons: filteredAddons,
      };
    });
  };

  const handleAddonToggle = (addonId: string) => {
    setFormData(prev => {
      const exists = prev.selected_addons.includes(addonId);
      return {
        ...prev,
        selected_addons: exists
          ? prev.selected_addons.filter(id => id !== addonId)
          : [...prev.selected_addons, addonId]
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    try {
      const response = await predictServiceCost({
        ...formData,
        vehicle_age: Math.max(0, Math.min(40, Number(formData.vehicle_age) || 0)),
        kilometers_driven: Math.max(0, Math.min(1000000, Number(formData.kilometers_driven) || 0)),
      });
      setResult(response);
    } catch (error) {
      console.error("Prediction failed", error);
      setErrorMessage("Unable to calculate service cost. Please verify vehicle parameters and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-10 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mb-3 border border-emerald-200/60">
            <Sparkles className="w-3.5 h-3.5" />
            Precise Multi-Factor Cost Engine
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-3">
            Estimate Real-World Service Cost
          </h1>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            Configured with brand tiers, specific wear items, workshop types, and regional labor rates for reliable, transparent quotes.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Form (8 Columns) */}
          <div className="lg:col-span-7 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* SECTION 1: VEHICLE CLASSIFICATION */}
              <div className="bg-white rounded-2xl p-6 md:p-7 shadow-xs border border-gray-200">
                <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-gray-100">
                  <div className="p-2 rounded-lg bg-gray-100 text-gray-800">
                    <Car className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-gray-900">1. Vehicle Profile & Category</h2>
                    <p className="text-xs text-gray-500">Select your body type and vehicle tier</p>
                  </div>
                </div>

                {/* Vehicle Type Tabs */}
                <div className="mb-5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2.5 block">
                    Vehicle Type
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {Object.keys(VEHICLE_CONFIGS).map(vType => {
                      const active = formData.vehicle_type === vType;
                      return (
                        <button
                          key={vType}
                          type="button"
                          onClick={() => handleVehicleTypeChange(vType)}
                          className={`flex items-center gap-2.5 p-3 rounded-xl border text-left text-sm font-semibold transition-all cursor-pointer ${
                            active 
                              ? 'bg-gray-900 text-white border-gray-900 shadow-sm' 
                              : 'bg-gray-50/80 hover:bg-gray-100 text-gray-700 border-gray-200'
                          }`}
                        >
                          {vType.includes('Bike') || vType.includes('Scoot') ? (
                            <Bike className={`w-4 h-4 shrink-0 ${active ? 'text-white' : 'text-gray-500'}`} />
                          ) : (
                            <Car className={`w-4 h-4 shrink-0 ${active ? 'text-white' : 'text-gray-500'}`} />
                          )}
                          <span className="truncate">{vType}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Brand & Model Segment Tier */}
                <div className="mb-5">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Brand & Segment Tier
                    </label>
                    <span className="text-[11px] text-gray-400">Controls parts & oil specifications</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {currentVehicleConfig.segments.map(seg => {
                      const active = formData.brand_segment === seg.id;
                      return (
                        <div
                          key={seg.id}
                          onClick={() => setFormData(prev => ({ ...prev, brand_segment: seg.id }))}
                          className={`p-3 rounded-xl border cursor-pointer transition-all ${
                            active
                              ? 'bg-indigo-50/60 border-indigo-500 ring-1 ring-indigo-500 text-indigo-950'
                              : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-700'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-xs">{seg.label}</span>
                            {active && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                          </div>
                          <p className="text-[11px] text-gray-500 mt-1 line-clamp-1">
                            {seg.examples}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Age & Odometer */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      Vehicle Age
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        max="30"
                        step="any"
                        placeholder="e.g. 3"
                        value={formData.vehicle_age || ''}
                        onChange={e => setFormData(prev => ({ ...prev, vehicle_age: e.target.value === '' ? 0 : Number(e.target.value) }))}
                        className="w-full h-11 px-3.5 pr-14 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none text-sm font-semibold text-gray-800"
                      />
                      <span className="absolute right-3 top-3 text-xs text-gray-400 font-medium pointer-events-none">
                        Years
                      </span>
                    </div>
                    {/* Quick Age Presets */}
                    <div className="flex gap-1.5 mt-2">
                      {[1, 2, 4, 6, 8].map(yrs => (
                        <button
                          key={yrs}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, vehicle_age: yrs }))}
                          className="px-2 py-0.5 text-[11px] rounded bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium cursor-pointer"
                        >
                          {yrs}y
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5 flex items-center gap-1.5">
                      <Gauge className="w-3.5 h-3.5 text-gray-400" />
                      Odometer (Kilometers)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        step="any"
                        placeholder="e.g. 32000"
                        value={formData.kilometers_driven || ''}
                        onChange={e => setFormData(prev => ({ ...prev, kilometers_driven: e.target.value === '' ? 0 : Number(e.target.value) }))}
                        className="w-full h-11 px-3.5 pr-12 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none text-sm font-semibold text-gray-800"
                      />
                      <span className="absolute right-3 top-3 text-xs text-gray-400 font-medium pointer-events-none">
                        KM
                      </span>
                    </div>
                    {/* Quick KM Presets */}
                    <div className="flex gap-1.5 mt-2">
                      {[10000, 25000, 50000, 80000].map(km => (
                        <button
                          key={km}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, kilometers_driven: km }))}
                          className="px-2 py-0.5 text-[11px] rounded bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium cursor-pointer"
                        >
                          {km / 1000}k
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Fuel & Transmission Constraints */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5 block">
                      Fuel Type
                    </label>
                    <select
                      value={formData.fuel_type}
                      disabled={currentVehicleConfig.allowedFuels.length === 1}
                      onChange={e => setFormData(prev => ({ ...prev, fuel_type: e.target.value }))}
                      className="w-full h-11 px-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-gray-900 text-sm font-medium text-gray-800 outline-none disabled:bg-gray-100 disabled:text-gray-500 cursor-pointer"
                    >
                      {currentVehicleConfig.allowedFuels.map(f => (
                        <option key={f.value} value={f.value}>{f.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5 block">
                      Transmission
                    </label>
                    <select
                      value={formData.engine_type}
                      disabled={currentVehicleConfig.allowedTransmissions.length === 1}
                      onChange={e => setFormData(prev => ({ ...prev, engine_type: e.target.value }))}
                      className="w-full h-11 px-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-gray-900 text-sm font-medium text-gray-800 outline-none disabled:bg-gray-100 disabled:text-gray-500 cursor-pointer"
                    >
                      {currentVehicleConfig.allowedTransmissions.map(t => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Service History Regularity */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2 block">
                    Maintenance History
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'regular', label: 'Regular / On-Time', sub: 'Serviced within 12 mo' },
                      { id: 'overdue', label: 'Overdue / Skipped', sub: '>1 year since service' },
                      { id: 'first_service', label: 'First / 1st Service', sub: 'New vehicle period' },
                    ].map(h => (
                      <button
                        key={h.id}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, service_history: h.id as any }))}
                        className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                          formData.service_history === h.id
                            ? 'bg-gray-900 text-white border-gray-900 shadow-xs'
                            : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-200'
                        }`}
                      >
                        <div className="text-xs font-bold">{h.label}</div>
                        <div className={`text-[10px] mt-0.5 truncate ${formData.service_history === h.id ? 'text-gray-300' : 'text-gray-400'}`}>
                          {h.sub}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* SECTION 2: SERVICE SCOPE & WEAR ITEMS */}
              <div className="bg-white rounded-2xl p-6 md:p-7 shadow-xs border border-gray-200">
                <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-gray-100">
                  <div className="p-2 rounded-lg bg-gray-100 text-gray-800">
                    <Wrench className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-gray-900">2. Service Scope & Add-on Repairs</h2>
                    <p className="text-xs text-gray-500">Pick standard periodic plan or add specific worn components</p>
                  </div>
                </div>

                {/* Base Service Package */}
                <div className="mb-6">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2.5 block">
                    Primary Service Package
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { 
                        id: 'General', 
                        title: 'General Service', 
                        desc: 'Engine oil, oil filter, air filter clean, 40-pt health check.' 
                      },
                      { 
                        id: 'Major', 
                        title: 'Major Overhaul', 
                        desc: 'All fluids, spark plugs, deep brake clean & full diagnostic tune-up.' 
                      },
                      { 
                        id: 'Repair', 
                        title: 'Repair / Diagnostic', 
                        desc: 'Inspection & specific component troubleshooting.' 
                      },
                    ].map(pkg => (
                      <div
                        key={pkg.id}
                        onClick={() => setFormData(prev => ({ ...prev, service_type: pkg.id }))}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                          formData.service_type === pkg.id
                            ? 'bg-blue-50/70 border-blue-500 ring-1 ring-blue-500 text-blue-950'
                            : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-700'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs">{pkg.title}</span>
                            {formData.service_type === pkg.id && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                          </div>
                          <p className="text-[11px] text-gray-500 mt-1 leading-snug">
                            {pkg.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Specific Wear Add-on Checklist */}
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Include Specific Wear & Tear Items (Optional)
                    </label>
                    <span className="text-[11px] text-gray-400">Click to add/remove</span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {COMMON_ADDONS.filter(addon => is2W ? addon.for2W : addon.for4W).map(addon => {
                      const selected = formData.selected_addons.includes(addon.id);
                      return (
                        <div
                          key={addon.id}
                          onClick={() => handleAddonToggle(addon.id)}
                          className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                            selected
                              ? 'bg-emerald-50/70 border-emerald-500 ring-1 ring-emerald-500 text-emerald-950'
                              : 'bg-gray-50/50 hover:bg-gray-50 border-gray-200 text-gray-700'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={() => {}} // handled by parent div
                            className="mt-0.5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer pointer-events-none"
                          />
                          <div className="flex-1">
                            <div className="text-xs font-bold">{addon.label}</div>
                            <div className="text-[11px] text-gray-500 mt-0.5">{addon.desc}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* SECTION 3: WORKSHOP & REGION */}
              <div className="bg-white rounded-2xl p-6 md:p-7 shadow-xs border border-gray-200">
                <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-gray-100">
                  <div className="p-2 rounded-lg bg-gray-100 text-gray-800">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-gray-900">3. Workshop & City Tier</h2>
                    <p className="text-xs text-gray-500">Directly impacts labor rates and parts markup</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Workshop Type */}
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5 block">
                      Workshop Preference
                    </label>
                    <div className="space-y-2">
                      {[
                        { id: 'authorized_oem', label: 'Authorized OEM Dealership', note: '100% genuine parts, higher labor' },
                        { id: 'multibrand', label: 'Multi-Brand Garage (Bosch/GoMechanic)', note: 'Save ~25-30% on OEM rates' },
                        { id: 'local_independent', label: 'Local Independent Garage', note: 'Best economy, local mechanic' },
                      ].map(ws => (
                        <div
                          key={ws.id}
                          onClick={() => setFormData(prev => ({ ...prev, workshop_type: ws.id as any }))}
                          className={`p-3 rounded-xl border cursor-pointer transition-all ${
                            formData.workshop_type === ws.id
                              ? 'bg-gray-900 text-white border-gray-900'
                              : 'bg-gray-50/50 hover:bg-gray-100 text-gray-700 border-gray-200'
                          }`}
                        >
                          <div className="text-xs font-bold">{ws.label}</div>
                          <div className={`text-[10px] mt-0.5 ${formData.workshop_type === ws.id ? 'text-gray-300' : 'text-gray-500'}`}>
                            {ws.note}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* City Tier */}
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      Location / City Tier
                    </label>
                    <div className="space-y-2">
                      {[
                        { id: 'tier1_metro', label: 'Tier 1 Metro', cities: 'Delhi NCR, Mumbai, Bengaluru, Hyderabad, Pune, Chennai' },
                        { id: 'tier2', label: 'Tier 2 City', cities: 'Jaipur, Lucknow, Ahmedabad, Chandigarh, Kochi, Indore' },
                        { id: 'tier3', label: 'Tier 3 / District Town', cities: 'Smaller towns & rural service centers' },
                      ].map(loc => (
                        <div
                          key={loc.id}
                          onClick={() => setFormData(prev => ({ ...prev, city_tier: loc.id as any }))}
                          className={`p-3 rounded-xl border cursor-pointer transition-all ${
                            formData.city_tier === loc.id
                              ? 'bg-gray-900 text-white border-gray-900'
                              : 'bg-gray-50/50 hover:bg-gray-100 text-gray-700 border-gray-200'
                          }`}
                        >
                          <div className="text-xs font-bold">{loc.label}</div>
                          <div className={`text-[10px] mt-0.5 ${formData.city_tier === loc.id ? 'text-gray-300' : 'text-gray-500'}`}>
                            {loc.cities}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-14 rounded-2xl bg-gray-900 hover:bg-gray-800 text-white font-bold text-base transition-all active:scale-[0.99] disabled:opacity-70 flex items-center justify-center gap-2 shadow-lg shadow-gray-900/10 cursor-pointer"
              >
                {loading ? (
                  <>
                    <RotateCcw className="w-5 h-5 animate-spin" />
                    Calculating Detailed Cost Estimate...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 text-amber-300" />
                    Calculate Accurate Service Estimate
                  </>
                )}
              </button>

            </form>
          </div>

          {/* Right Sidebar: Output Card (5 Columns) */}
          <div className="lg:col-span-5">
            <div className="sticky top-28 space-y-5">
              
              {errorMessage && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start justify-between gap-3 shadow-xs">
                  <div className="flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setErrorMessage(null)}
                    className="text-rose-500 hover:text-rose-800 font-bold text-sm cursor-pointer"
                  >
                    ×
                  </button>
                </div>
              )}

              {!result && !loading && (
                <div className="bg-white rounded-2xl p-8 border border-gray-200 text-center shadow-xs flex flex-col items-center justify-center min-h-[420px]">
                  <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-4 text-gray-400">
                    <ShieldCheck className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Live Cost Preview Ready</h3>
                  <p className="text-sm text-gray-500 max-w-xs mb-6">
                    Adjust vehicle segment, wear items, and workshop type to see an itemized quote.
                  </p>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold transition-all cursor-pointer"
                  >
                    Quick Estimate with Current Inputs
                  </button>
                </div>
              )}

              {loading && (
                <div className="bg-white rounded-2xl p-8 border border-gray-200 text-center shadow-xs flex flex-col items-center justify-center min-h-[420px]">
                  <RotateCcw className="w-10 h-10 text-gray-900 animate-spin mb-4" />
                  <h3 className="text-base font-bold text-gray-900 mb-1">Analyzing Automotive Metrics</h3>
                  <p className="text-xs text-gray-500 animate-pulse">Calculating parts wear index & labor hours...</p>
                </div>
              )}

              {result && !loading && (
                <div className="bg-white rounded-2xl p-6 md:p-7 border border-gray-200 shadow-xl shadow-gray-200/50 relative overflow-hidden">
                  
                  {/* Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-bold tracking-wider uppercase text-gray-500">
                      Estimated Cost Range
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
                      {result.accuracy_estimate}
                    </span>
                  </div>

                  {/* Main Price */}
                  <div className="mb-4">
                    <div className="flex items-baseline gap-1 text-gray-900">
                      <span className="text-3xl font-extrabold">₹</span>
                      <span className="text-4xl md:text-5xl font-black tracking-tight">
                        {result.predicted_cost.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Expected range: <span className="font-semibold text-gray-700">₹{result.min_cost.toLocaleString('en-IN')}</span> – <span className="font-semibold text-gray-700">₹{result.max_cost.toLocaleString('en-IN')}</span> (incl. GST)
                    </p>
                  </div>

                  {/* Savings Banner if applicable */}
                  {result.breakdown.estimated_savings > 0 && (
                    <div className="mb-6 p-3 rounded-xl bg-emerald-50 border border-emerald-200/70 flex items-center gap-2.5">
                      <TrendingDown className="w-5 h-5 text-emerald-600 shrink-0" />
                      <div className="text-xs">
                        <span className="font-bold text-emerald-900">
                          Save ₹{result.breakdown.estimated_savings.toLocaleString('en-IN')}
                        </span>
                        <span className="text-emerald-700 block">
                          vs Authorized OEM Dealership (~₹{result.breakdown.oem_comparison_cost.toLocaleString('en-IN')})
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Itemized Cost Breakdown */}
                  <div className="space-y-3 pt-4 border-t border-gray-100 text-xs">
                    <div className="font-bold text-gray-900 uppercase tracking-wider text-[11px] mb-2">
                      Cost Breakdown
                    </div>

                    <div className="flex justify-between py-1 border-b border-gray-50 text-gray-600">
                      <span>Parts & Consumables (Oil, Filters, Fluids)</span>
                      <span className="font-semibold text-gray-900">₹{result.breakdown.parts_cost.toLocaleString('en-IN')}</span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-gray-50 text-gray-600">
                      <span>Labor & Diagnostic Charges</span>
                      <span className="font-semibold text-gray-900">₹{result.breakdown.labor_cost.toLocaleString('en-IN')}</span>
                    </div>

                    {result.breakdown.addons_cost > 0 && (
                      <div className="flex justify-between py-1 border-b border-gray-50 text-gray-600">
                        <span>Selected Add-on Replacements</span>
                        <span className="font-semibold text-gray-900">₹{result.breakdown.addons_cost.toLocaleString('en-IN')}</span>
                      </div>
                    )}

                    <div className="flex justify-between py-1 border-b border-gray-50 text-gray-600">
                      <span>Standard GST (18%)</span>
                      <span className="font-semibold text-gray-900">₹{result.breakdown.tax_gst.toLocaleString('en-IN')}</span>
                    </div>

                    <div className="flex justify-between pt-2 font-bold text-sm text-gray-900">
                      <span>Total Estimated Cost</span>
                      <span>₹{result.predicted_cost.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  {/* Recommendations */}
                  {result.recommendations.length > 0 && (
                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900 mb-2">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                        Vehicle Health Advisory
                      </div>
                      <ul className="space-y-1.5">
                        {result.recommendations.map((rec, idx) => (
                          <li key={idx} className="text-[11px] text-gray-600 flex items-start gap-1.5">
                            <span className="text-amber-500 font-bold">•</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Model Footer */}
                  <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
                    <span>Engine: {result.model_used}</span>
                    <button
                      type="button"
                      onClick={() => setResult(null)}
                      className="text-gray-500 hover:text-gray-800 font-medium cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>

                </div>
              )}

              {/* Tips Card */}
              <div className="bg-white/70 rounded-2xl p-5 border border-gray-200/70 text-xs text-gray-500 space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-gray-800">
                  <Info className="w-4 h-4 text-blue-500" />
                  Why Estimates Vary
                </div>
                <p className="leading-relaxed">
                  Actual service invoices depend on physical inspection (e.g. disc rotor skimming, brake caliper pins, synthetic vs semi-synthetic engine oil brand, and workshop shop supplies fee).
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
