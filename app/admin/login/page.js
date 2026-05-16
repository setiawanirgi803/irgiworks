"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ShieldCheck, 
  User, 
  Lock, 
  ArrowRight, 
  Loader2,
  AlertCircle,
  Home
} from 'lucide-react';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push('/admin/dashboard');
        router.refresh();
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-industrial-50 dark:bg-industrial-950 flex items-center justify-center p-6 transition-colors duration-500">
      <div className="max-w-md w-full animate-in fade-in zoom-in-95 duration-700">
        
        {/* Logo / Header */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center justify-center w-16 h-16 bg-accent-teal text-white rounded-2xl shadow-2xl shadow-teal-500/20 mb-6 hover:rotate-12 transition-transform">
            <ShieldCheck size={32} />
          </Link>
          <h1 className="text-3xl font-black text-industrial-900 dark:text-white tracking-tighter">Admin Portal</h1>
          <p className="text-industrial-500 text-sm mt-2">Secure access for technical management.</p>
        </div>

        {/* Login Card */}
        <div className="bg-white dark:bg-industrial-900 rounded-[2.5rem] p-10 shadow-2xl border border-industrial-100 dark:border-industrial-800">
          <form onSubmit={handleLogin} className="space-y-6">
            
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center space-x-3 text-red-500 text-sm font-bold animate-in slide-in-from-top-2">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black text-industrial-400 uppercase tracking-widest ml-1">Username</label>
              <div className="relative">
                <User className="absolute left-6 top-1/2 -translate-y-1/2 text-industrial-400" size={18} />
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full bg-industrial-50 dark:bg-industrial-800/50 border border-industrial-200 dark:border-industrial-700 rounded-2xl py-4 pl-14 pr-6 text-industrial-900 dark:text-white focus:outline-none focus:border-accent-teal transition-all font-medium" 
                  placeholder="admin"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-industrial-400 uppercase tracking-widest ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-industrial-400" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-industrial-50 dark:bg-industrial-800/50 border border-industrial-200 dark:border-industrial-700 rounded-2xl py-4 pl-14 pr-6 text-industrial-900 dark:text-white focus:outline-none focus:border-accent-teal transition-all font-medium" 
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full btn-primary py-5 rounded-2xl text-lg font-black shadow-xl shadow-teal-500/20 flex items-center justify-center space-x-3"
            >
              {loading ? <Loader2 className="animate-spin" size={24} /> : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-10">
          <Link href="/" className="inline-flex items-center space-x-2 text-industrial-400 hover:text-accent-teal font-bold text-sm transition-colors">
            <Home size={16} />
            <span>Back to Website</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
