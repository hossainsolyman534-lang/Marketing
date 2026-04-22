import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { generateMarketingPlan, MarketingPlanResult } from '../services/gemini';
import { Sparkles, ShoppingBag, Target, DollarSign, Flag, Loader2, ArrowRight, History } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import PlanDisplay from './PlanDisplay';

export default function Dashboard() {
  const { user } = useAuth();
  const [productName, setProductName] = useState('');
  const [audience, setAudience] = useState('');
  const [price, setPrice] = useState('');
  const [goal, setGoal] = useState<'Sales' | 'Leads'>('Sales');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MarketingPlanResult | null>(null);
  const [error, setError] = useState('');

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const plan = await generateMarketingPlan(productName, price, audience, goal);
      setResult(plan);

      // Save to Firestore
      await addDoc(collection(db, 'plans'), {
        userId: user.uid,
        productName,
        targetAudience: audience,
        price,
        goal,
        ...plan,
        createdAt: new Date().toISOString()
      });
    } catch (err: any) {
      console.error(err);
      setError('Failed to generate marketing plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-1 overflow-hidden w-full">
      {/* Left Sidebar: Input Form */}
      <aside className="w-[340px] bg-white border-r border-slate-200 p-6 flex flex-col gap-6 overflow-y-auto">
        <div>
          <h2 className="text-lg font-display font-bold mb-4">Create Campaign</h2>
          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Product Name</label>
              <input
                required
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none text-sm bg-white"
                placeholder="Premium Jamdani Saree"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Target Audience</label>
              <input
                required
                type="text"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none text-sm bg-white"
                placeholder="Middle-class women in Dhaka"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Price (BDT)</label>
              <input
                required
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none text-sm bg-white"
                placeholder="৳ 8,500"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Goal</label>
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value as any)}
                className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none text-sm bg-white appearance-none"
              >
                <option value="Sales">Drive Sales</option>
                <option value="Leads">Generate Leads</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-slate-900 text-white font-bold py-3 rounded-md transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <span>Generate Plan</span>
                  <Rocket className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
        
        <div className="mt-auto p-4 bg-slate-50 rounded-xl border border-slate-200">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Tokens remaining</p>
          <div className="w-full bg-slate-200 h-1.5 rounded-full mb-2">
            <div className="bg-indigo-500 h-1.5 rounded-full w-3/4"></div>
          </div>
          <p className="text-xs font-bold leading-none">750 / 1000</p>
        </div>
      </aside>

      {/* Main Output View */}
      <div className="flex-1 overflow-y-auto p-8 bg-slate-50">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full min-h-[400px] flex flex-col items-center justify-center bg-white rounded-xl border border-slate-200 shadow-sm"
            >
              <div className="relative mb-6">
                <div className="w-20 h-20 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin" />
                <Sparkles className="w-8 h-8 text-indigo-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <h4 className="text-xl font-display font-bold text-slate-900 mb-2">Generating Your Strategy</h4>
              <p className="text-slate-500 text-sm max-w-xs text-center">
                Reviewing local consumer trends and building your high-converting funnel...
              </p>
            </motion.div>
          ) : result ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-6"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-display font-bold text-slate-900">Marketing Strategy: {productName}</h1>
                  <p className="text-slate-500 text-sm">Generated on {new Date().toLocaleDateString()} for Bangladesh Market</p>
                </div>
                <button className="px-4 py-2 bg-white border border-slate-200 rounded-md text-sm font-bold shadow-sm hover:bg-slate-50 transition-colors">Export PDF</button>
              </div>
              <PlanDisplay plan={result} />
            </motion.div>
          ) : error ? (
            <div className="p-12 bg-red-50 rounded-xl border border-red-100 text-center">
              <p className="text-red-600 font-medium">{error}</p>
              <button onClick={handleGenerate} className="mt-4 text-sm font-bold text-red-700 underline underline-offset-4">Try Again</button>
            </div>
          ) : (
            <div className="h-full min-h-[500px] flex flex-col items-center justify-center bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm">
               <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                  <Rocket className="w-8 h-8 text-slate-300" />
               </div>
               <h4 className="text-xl font-display font-bold text-slate-900 mb-3">Ready to Launch?</h4>
               <p className="text-slate-400 text-sm max-w-sm">
                 Fill in your product details in the sidebar to get a structured marketing plan optimized for the Bangladeshi audience.
               </p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
