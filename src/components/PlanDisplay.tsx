import { useState } from 'react';
import { Copy, Check, Search, Map, MessageSquare, Type, Gift } from 'lucide-react';
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

  const Section = ({ title, content, icon: Icon, id, isSpecial }: { title: string, content: string, icon: any, id: string, isSpecial?: boolean }) => (
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
        <button
          onClick={() => copyToClipboard(content, id)}
          className={cn(
            "text-[10px] font-bold hover:underline transition-colors uppercase tracking-tight",
            isSpecial ? "text-indigo-300" : "text-indigo-600"
          )}
        >
          {copied === id ? "Copied!" : "Copy"}
        </button>
      </div>
      <div className={cn(
        "text-sm leading-relaxed whitespace-pre-wrap flex-1",
        isSpecial ? "text-indigo-50" : "text-slate-600"
      )}>
        {content}
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
      <Section 
        id="research"
        title="Market Research" 
        content={plan.market_research} 
        icon={Search} 
      />
      <Section 
        id="funnel"
        title="Funnel Plan" 
        content={plan.funnel} 
        icon={Map} 
      />
      <Section 
        id="copies"
        title="Ad Creative" 
        content={plan.copies} 
        icon={MessageSquare} 
      />
      <Section 
        id="offer"
        isSpecial
        title="The Hook (Offer)" 
        content={plan.offer} 
        icon={Gift} 
      />
    </div>
  );
}
