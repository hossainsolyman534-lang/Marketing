import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { db } from '../lib/firebase';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { generateMarketingPlan, MarketingPlanResult } from '../services/gemini';
import { Sparkles, ShoppingBag, Target, DollarSign, Flag, Loader2, ArrowRight, History, Rocket, Crown, AlertOctagon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import PlanDisplay from './PlanDisplay';
import { cn } from '../lib/utils';

const FREE_LIMIT = 3;

export default function Dashboard() {
  const { user } = useAuth();
  const [productName, setProductName] = useState('');
  const [audience, setAudience] = useState('');
  const [price, setPrice] = useState('');
  const [goal, setGoal] = useState<'Sales' | 'Leads'>('Sales');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MarketingPlanResult | null>(null);
  const [error, setError] = useState('');
  const [usageCount, setUsageCount] = useState(0);

  useEffect(() => {
    if (user) {
      fetchUsageCount();
    }
  }, [user]);

  const fetchUsageCount = async () => {
    if (!user) return;
    const q = query(collection(db, 'plans'), where('userId', '==', user.uid));
    const snapshot = await getDocs(q);
    setUsageCount(snapshot.size);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    if (usageCount >= FREE_LIMIT) {
      setError('Limit Reached: Please upgrade to generate more plans.');
      return;
    }

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

      // Update count locally
      setUsageCount(prev => prev + 1);
    } catch (err: any) {
      console.error(err);
      setError('Failed to generate marketing plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isPro = user?.email === 'hossainsolyman534@gmail.com' || user?.email === 'hmsolyman33@gmail.com';
  const isLimitReached = usageCount >= FREE_LIMIT && !isPro;

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
                disabled={isLimitReached}
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none text-sm bg-white disabled:opacity-50"
                placeholder="Premium Jamdani Saree"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Target Audience</label>
              <input
                required
                disabled={isLimitReached}
                type="text"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none text-sm bg-white disabled:opacity-50"
                placeholder="Middle-class women in Dhaka"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Price (BDT)</label>
              <input
                required
                disabled={isLimitReached}
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none text-sm bg-white disabled:opacity-50"
                placeholder="৳ 8,500"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Goal</label>
              <select
                disabled={isLimitReached}
                value={goal}
                onChange={(e) => setGoal(e.target.value as any)}
                className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none text-sm bg-white appearance-none disabled:opacity-50"
              >
                <option value="Sales">Drive Sales</option>
                <option value="Leads">Generate Leads</option>
              </select>
            </div>
            
            {isLimitReached ? (
              <button
                type="button"
                className="w-full bg-slate-900 hover:bg-black text-white font-bold py-3 rounded-md transition-all flex items-center justify-center gap-2 mt-2 group"
              >
                <Crown className="w-4 h-4 text-yellow-500 group-hover:scale-110 transition-transform" />
                <span>Upgrade to Pro</span>
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-slate-900 text-white font-bold py-3 rounded-md transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
              >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      তৈরি হচ্ছে...
                    </>
                  ) : (
                    <>
                      <span>Generate Plan</span>
                      <Rocket className="w-4 h-4" />
                    </>
                  )}
              </button>
            )}
          </form>
        </div>
        
        <div className="mt-auto p-4 bg-slate-50 rounded-xl border border-slate-200">
          <div className="flex justify-between items-end mb-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{isPro ? 'Usage (Pro)' : 'Usage Limit'}</p>
            <p className="text-xs font-bold leading-none">{usageCount} / {isPro ? '∞' : FREE_LIMIT}</p>
          </div>
          <div className="w-full bg-slate-200 h-1.5 rounded-full">
            <div 
              className={cn(
                "h-1.5 rounded-full transition-all duration-500",
                isLimitReached ? "bg-red-500" : "bg-indigo-500"
              )}
              style={{ width: `${isPro ? (usageCount / 10) * 100 : Math.min((usageCount / FREE_LIMIT) * 100, 100)}%` }}
            ></div>
          </div>
          <p className="text-[10px] text-slate-400 mt-2">{isPro ? 'Unlimited pro access active.' : 'Free strategy limit resets monthly.'}</p>
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
              <h4 className="text-xl font-display font-bold text-slate-900 mb-2">AI marketing plan তৈরি হচ্ছে...</h4>
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
          ) : isLimitReached ? (
            <motion.div
              key="limit"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="h-full min-h-[500px] flex flex-col items-center justify-center bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm"
            >
               <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6">
                  <AlertOctagon className="w-8 h-8 text-red-500" />
               </div>
               <h4 className="text-xl font-display font-bold text-slate-900 mb-2">Usage Limit Reached</h4>
               <p className="text-slate-400 text-sm max-w-sm mb-8">
                 You've used all 3 free marketing plans. Upgrade to our Professional Plan for unlimited generations and advanced SEO insights.
               </p>
               <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                 <div className="p-4 border border-slate-200 rounded-xl text-left bg-slate-50">
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Free Plan</p>
                   <p className="text-xl font-bold mb-1">0 BDT</p>
                   <p className="text-xs text-slate-500">3 Generations / mo</p>
                 </div>
                 <div className="p-4 border-2 border-indigo-600 rounded-xl text-left bg-indigo-50 relative">
                   <div className="absolute -top-3 right-4 px-2 py-1 bg-indigo-600 text-[8px] font-bold text-white rounded uppercase tracking-tighter">Most Popular</div>
                   <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider mb-2">Pro Plan</p>
                   <p className="text-xl font-bold mb-1">৳ 990</p>
                   <p className="text-xs text-indigo-700">Unlimited Plans</p>
                 </div>
               </div>
               <button className="mt-8 px-8 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-lg shadow-indigo-100 hover:bg-slate-900 transition-all">
                  Sign Up for Pro Plan
               </button>
            </motion.div>
          ) : error ? (
            <div className="p-12 bg-red-50 rounded-xl border border-red-100 text-center">
              <p className="text-red-600 font-medium whitespace-pre-wrap">কিছু সমস্যা হয়েছে, আবার চেষ্টা করুন</p>
              <button onClick={handleGenerate} className="mt-4 text-sm font-bold text-red-700 underline underline-offset-4">আবার চেষ্টা করুন</button>
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
