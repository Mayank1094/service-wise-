import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserPredictions, deletePredictionHistory, type SavedPrediction } from '../services/history';
import { History, Trash2, ArrowRight, Car, Calendar, Gauge, Wrench, CheckCircle2 } from 'lucide-react';

export default function HistoryPage() {
  const { user } = useAuth();
  const [history, setHistory] = useState<SavedPrediction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    let isMounted = true;
    getUserPredictions(user.uid)
      .then((records) => {
        if (isMounted) {
          setHistory(records);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to load history:', err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!user) return;
    setHistory((prev) => prev.filter((item) => item.id !== id));
    await deletePredictionHistory(user.uid, id);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-[calc(100vh-76px)] bg-[#F8F9FA] py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1100px] mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAECEF] text-xs font-semibold text-[#4E5664] mb-2.5">
              <History className="w-3.5 h-3.5" />
              <span>Calculation History</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#101318]">
              Your Vehicle Service Estimates
            </h1>
            <p className="text-sm text-[#66707C] mt-1">
              Review and track all your previous data-backed cost calculations.
            </p>
          </div>

          <Link
            to="/predict"
            className="inline-flex h-[44px] items-center justify-center gap-2 rounded-full bg-[#111820] px-6 text-sm font-semibold text-white transition-all hover:bg-black hover:scale-[1.01] active:scale-[0.99] shadow-xs shrink-0"
          >
            New Estimate
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Content */}
        {loading ? (
          <div className="bg-white rounded-2xl border border-[#E6E8ED] p-12 text-center">
            <div className="w-8 h-8 border-3 border-[#111820]/20 border-t-[#111820] rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-[#66707C]">Loading your prediction history...</p>
          </div>
        ) : history.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E6E8ED] p-12 text-center max-w-xl mx-auto shadow-xs">
            <div className="w-14 h-14 rounded-full bg-[#F0F2F5] flex items-center justify-center mx-auto mb-4 text-[#8C95A3]">
              <Car className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-[#101318] mb-1">No calculations saved yet</h3>
            <p className="text-sm text-[#66707C] mb-6">
              When you predict vehicle maintenance costs, your estimates will automatically appear here.
            </p>
            <Link
              to="/predict"
              className="inline-flex h-[44px] items-center justify-center gap-2 rounded-full bg-[#111820] px-6 text-sm font-semibold text-white hover:bg-black transition-all"
            >
              Calculate Your First Estimate
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {history.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-[#E6E8ED] p-6 shadow-xs hover:border-[#CBD0D8] transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar: Vehicle Badge & Date */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-lg text-[#101318]">
                          {item.vehicleType}
                        </span>
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#F0F2F5] text-[#4E5664] uppercase tracking-wider">
                          {item.brandSegment}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-[#8C95A3] mt-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{formatDate(item.createdAt)}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="text-[#8C95A3] hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                      title="Delete record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Vehicle Parameters */}
                  <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-[#F8F9FA] border border-[#EAECEF] mb-4 text-xs">
                    <div className="flex items-center gap-2 text-[#4E5664]">
                      <Gauge className="w-3.5 h-3.5 text-[#8C95A3]" />
                      <span>{item.kilometersDriven.toLocaleString()} km</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#4E5664]">
                      <Wrench className="w-3.5 h-3.5 text-[#8C95A3]" />
                      <span>{item.vehicleAge} {item.vehicleAge === 1 ? 'Year' : 'Years'} Old</span>
                    </div>
                  </div>

                  {/* Cost Prediction Highlight */}
                  <div className="mb-4">
                    <div className="text-xs uppercase tracking-wider font-semibold text-[#8C95A3] mb-1">
                      Estimated Cost
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-extrabold text-[#101318]">
                        ₹{Math.round(item.estimatedCost).toLocaleString()}
                      </span>
                      <span className="text-xs text-[#66707C]">
                        (Range: ₹{Math.round(item.minCost).toLocaleString()} – ₹{Math.round(item.maxCost).toLocaleString()})
                      </span>
                    </div>
                  </div>

                  {/* Cost Breakdown */}
                  {item.costBreakdown && (
                    <div className="flex items-center gap-2 pt-3 border-t border-[#F0F2F5] text-xs text-[#66707C]">
                      <span>Parts: <strong>₹{Math.round(item.costBreakdown.partsCost).toLocaleString()}</strong></span>
                      <span>•</span>
                      <span>Labor: <strong>₹{Math.round(item.costBreakdown.laborCost).toLocaleString()}</strong></span>
                      <span>•</span>
                      <span>Tax: <strong>₹{Math.round(item.costBreakdown.taxes).toLocaleString()}</strong></span>
                    </div>
                  )}
                </div>

                {/* Model & Accuracy Badge */}
                {(item.modelUsed || item.accuracyEstimate) && (
                  <div className="mt-4 pt-3 border-t border-[#F0F2F5] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-[#4E5664] font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{item.modelUsed || 'ML Model'}</span>
                    </div>
                    {item.accuracyEstimate && (
                      <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md">
                        {item.accuracyEstimate}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
