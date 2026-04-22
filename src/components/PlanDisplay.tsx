import { useState } from 'react';
import { Copy, Check, Search, Map, MessageSquare, Type, Gift, User, Brain, AlertTriangle, BadgeDollarSign, Swords, TrendingUp } from 'lucide-react';
import { MarketingPlanResult } from '../services/gemini';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface PlanDisplayProps {
  plan: MarketingPlanResult;
}

export default function PlanDisplay({ plan }: PlanDisplayProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopied(sectionId);
    setTimeout(() => setCopied(null), 2000);
  };

  const Section = ({ title, content, icon: Icon, id, isSpecial, children }: { title: string, content?: string, icon: any, id: string, isSpecial?: boolean, children?: React.ReactNode }) => (
    <div className={cn(
      "border rounded-xl p-5 flex flex-col shadow-sm transition-all",
      isSpecial ? "bg-indigo-900 text-white border-indigo-800 shadow-lg" : "bg-white border-slate-200 text-slate-900"
    )}>
      <div className="flex justify-between items-center mb-3">
        <h3 className={cn(
          "font-bold text-xs uppercase tracking-wider",
          isSpecial ? "text-indigo-200" : "text-indigo-900"
        )}>
          {title}
        </h3>
        {content && (
          <button
            onClick={() => copyToClipboard(content, id)}
            className={cn(
              "text-[10px] font-bold hover:underline transition-colors uppercase tracking-tight",
              isSpecial ? "text-indigo-300" : "text-indigo-600"
            )}
          >
            {copied === id ? "Copied!" : "Copy"}
          </button>
        )}
      </div>
      <div className={cn(
        "text-sm leading-relaxed flex-1",
        isSpecial ? "text-indigo-50" : "text-slate-600"
      )}>
        {content ? (
          <div className="whitespace-pre-wrap">{content}</div>
        ) : children}
      </div>
      {isSpecial && (
        <div className="mt-4 border-t border-indigo-800 pt-3 flex justify-around text-[10px] font-bold uppercase tracking-tight text-indigo-300/80">
          <span>Urgency: High</span>
          <span>Exclusivity: 10/10</span>
          <span>Trust: Secured</span>
        </div>
      )}
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 pb-8">
      {/* Market Research */}
      <Section id="research" title="Market Research" icon={Search}>
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            {[
              { label: 'Who Buys?', value: plan.market_research.who_buys, icon: User },
              { label: 'Core Problem', value: plan.market_research.problems, icon: AlertTriangle },
              { label: 'Buyer Psychology', value: plan.market_research.psychology, icon: Brain },
              { label: 'Price Insight', value: plan.market_research.price_insight, icon: BadgeDollarSign },
              { label: 'Competitor Edge', value: plan.market_research.competitor, icon: Swords },
              { label: 'Current Demand', value: plan.market_research.demand, icon: TrendingUp },
            ].map((item, idx) => (
              <div key={idx} className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div className="flex items-center gap-2 mb-1">
                  <item.icon className="w-3.5 h-3.5 text-indigo-500" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{item.label}</span>
                </div>
                <p className="text-slate-700 font-medium leading-tight">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Funnel Plan */}
      <Section id="funnel" title="Funnel Strategy" content={plan.funnel} icon={Map} />

      {/* Ad Creative & Headlines */}
      <div className="flex flex-col gap-6">
        <Section id="headlines" title="Headlines & Hooks" icon={Type}>
          <div className="space-y-2">
            {plan.headlines.map((head, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-indigo-50/50 border border-indigo-100 rounded-lg group">
                <span className="font-bold italic text-indigo-900 leading-tight">"{head}"</span>
                <button 
                  onClick={() => copyToClipboard(head, `head-${i}`)}
                  className="text-[10px] font-bold text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-tight"
                >
                  {copied === `head-${i}` ? "Copied" : "Copy"}
                </button>
              </div>
            ))}
          </div>
        </Section>

        <Section id="copies" title="FB Ad Copies" icon={MessageSquare}>
          <div className="space-y-4">
            {plan.ad_copies.map((copy, i) => (
              <div key={i} className="relative bg-white p-4 rounded-xl border border-slate-200">
                <p className="text-slate-600 mb-3 leading-relaxed whitespace-pre-wrap">{copy}</p>
                <div className="flex justify-end">
                  <button 
                    onClick={() => copyToClipboard(copy, `copy-${i}`)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-indigo-50 text-slate-500 hover:text-indigo-600 rounded-lg text-[10px] font-bold border border-slate-100 hover:border-indigo-100 transition-all uppercase tracking-tight"
                  >
                    <Copy className="w-3 h-3" />
                    {copied === `copy-${i}` ? "Copied" : "Copy Copy"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Section>
      </div>

      {/* Offer Strategy */}
      <Section 
        id="offer"
        isSpecial
        title="The Irresistible Offer" 
        content={plan.offer} 
        icon={Gift} 
      />
    </div>
  );
}
