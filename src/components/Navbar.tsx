import { LogOut, LayoutDashboard, Rocket } from 'lucide-react';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import { useAuth } from '../hooks/useAuth';
import { cn } from '../lib/utils';

export default function Navbar() {
  const { user } = useAuth();
  
  const handleLogout = () => signOut(auth);

  const isPro = user?.email === 'hossainsolyman534@gmail.com' || user?.email === 'hmsolyman33@gmail.com';

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 flex-shrink-0 z-10">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
          <Rocket className="w-5 h-5 text-white" />
        </div>
        <span className="font-display font-bold text-xl tracking-tight">AI Marketing Assistant <span className="text-indigo-600">BD</span></span>
      </div>

      <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
        <a href="#" className="text-indigo-600">Campaigns</a>
        <a href="#" className="hover:text-indigo-600 transition-colors">Templates</a>
        <a href="#" className="hover:text-indigo-600 transition-colors">Analytics</a>
        <a href="#" className="hover:text-indigo-600 transition-colors">Settings</a>
      </nav>
      
      {user && (
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className={cn(
              "text-[10px] font-bold uppercase tracking-wider leading-none mb-1",
              isPro ? "text-indigo-600" : "text-slate-400"
            )}>
              {isPro ? 'APPROVED PRO' : 'FREE PLAN'}
            </p>
            <p className="text-sm font-semibold">{user.email?.split('@')[0]}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-red-600 border border-slate-200 rounded-md hover:border-red-100 hover:bg-red-50 transition-all uppercase tracking-tight"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      )}
    </header>
  );
}
