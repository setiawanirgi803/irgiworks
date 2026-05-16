"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  Plus, 
  TrendingUp, 
  CheckCircle,
  Clock,
  LogOut,
  ExternalLink,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { translations } from '@/lib/translations';

export default function AdminDashboard() {
  const { lang } = useApp();
  const t = translations[lang]?.admin || translations.id.admin;
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/admin/stats');
        if (!res.ok) {
          if (res.status === 401) {
            window.location.href = '/admin/login';
            return;
          }
          throw new Error('Failed to fetch stats');
        }
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) return (
    <div className="flex h-screen w-full items-center justify-center bg-industrial-50 dark:bg-industrial-950">
      <Loader2 className="animate-spin text-accent-teal" size={40} />
    </div>
  );

  if (error || !data) return (
    <div className="flex h-screen w-full items-center justify-center bg-industrial-50 dark:bg-industrial-950 p-6">
      <div className="bg-white dark:bg-industrial-900 p-10 rounded-[3rem] shadow-2xl text-center max-w-md border border-red-500/20">
        <AlertCircle className="mx-auto text-red-500 mb-6" size={64} />
        <h2 className="text-2xl font-black text-industrial-900 dark:text-white mb-4">Sesi Berakhir / Error</h2>
        <p className="text-industrial-500 mb-8">Silakan login kembali untuk mengakses dashboard.</p>
        <Link href="/admin/login" className="btn-primary w-full">Login Kembali</Link>
      </div>
    </div>
  );

  const { user = { username: 'Admin', role_name: 'SuperAdmin' }, stats = { total: 0, active: 0 }, recentProjects = [] } = data;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-industrial-50 dark:bg-industrial-950">
      {/* Sidebar */}
      <aside className="w-72 flex-shrink-0 bg-white dark:bg-industrial-900 border-r border-industrial-200 dark:border-industrial-800 flex flex-col z-20">
        <div className="p-8">
          <Link href="/" className="flex items-center space-x-3 group text-industrial-900 dark:text-white">
            <div className="bg-accent-teal p-2.5 rounded-xl text-white shadow-lg"><LayoutDashboard size={22} /></div>
            <span className="font-black text-xl tracking-tighter uppercase">Irgi.Admin</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          <Link href="/admin/dashboard" className="flex items-center space-x-3 px-4 py-3 bg-accent-teal text-white rounded-xl font-bold shadow-lg">
            <LayoutDashboard size={20} /> <span>{t.overview}</span>
          </Link>
          <Link href="/admin/projects" className="flex items-center space-x-3 px-4 py-3 text-industrial-500 dark:text-industrial-400 hover:bg-industrial-100 dark:hover:bg-white/5 rounded-xl font-medium transition-all">
            <Briefcase size={20} /> <span>{t.projects}</span>
          </Link>
          {user.role_name === 'SuperAdmin' && (
            <Link href="/admin/users" className="flex items-center space-x-3 px-4 py-3 text-industrial-500 dark:text-industrial-400 hover:bg-industrial-100 dark:hover:bg-white/5 rounded-xl font-medium transition-all">
              <Users size={20} /> <span>{t.users}</span>
            </Link>
          )}
        </nav>

        <div className="p-4 mt-auto border-t border-industrial-100 dark:border-industrial-800">
          <div className="bg-industrial-50 dark:bg-industrial-800/50 rounded-2xl p-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-accent-teal text-white rounded-full flex items-center justify-center font-bold uppercase">{user.username[0]}</div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-industrial-900 dark:text-white truncate">{user.username}</p>
                <p className="text-[10px] text-industrial-500 uppercase font-bold">{user.role_name}</p>
              </div>
            </div>
            <Link href="/admin/login" className="flex items-center justify-center space-x-2 w-full py-2 bg-red-500/10 text-red-500 hover:bg-red-500 text-xs font-bold rounded-lg hover:text-white transition-all">
              <LogOut size={14} /> <span>{t.buttons.signOut}</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <header className="h-20 bg-white/80 dark:bg-industrial-950/80 backdrop-blur-md border-b border-industrial-100 dark:border-industrial-800 flex items-center justify-between px-10 flex-shrink-0 z-10">
           <div className="flex items-center space-x-4">
              <h2 className="text-sm font-bold text-industrial-400 uppercase tracking-widest">{t.overview}</h2>
              <div className="h-4 w-[1px] bg-industrial-200 dark:bg-industrial-700"></div>
              <p className="text-sm font-medium text-industrial-600 dark:text-industrial-300">{t.welcome}, {user.username}</p>
           </div>
           <div className="flex items-center space-x-4">
              <Link href="/" target="_blank" className="flex items-center space-x-2 text-xs font-bold text-industrial-500 hover:text-accent-teal transition-colors">
                <ExternalLink size={14} /> <span>Situs Live</span>
              </Link>
              <Link href="/admin/projects?action=new" className="btn-primary py-2 px-4 text-xs">
                <Plus size={14} className="mr-2 inline" /> {t.buttons.addNew}
              </Link>
           </div>
        </header>

        <main className="flex-1 overflow-y-auto p-10 transition-colors duration-300">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            <div className="bg-white dark:bg-industrial-900 p-8 rounded-3xl shadow-sm border border-industrial-100 dark:border-industrial-800 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-industrial-400 uppercase tracking-widest mb-1">{t.stats.total}</p>
                <h3 className="text-4xl font-black text-industrial-900 dark:text-white">{stats.total || 0}</h3>
              </div>
              <div className="w-16 h-16 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center">
                <Briefcase size={32} />
              </div>
            </div>

            <div className="bg-white dark:bg-industrial-900 p-8 rounded-3xl shadow-sm border border-industrial-100 dark:border-industrial-800 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-industrial-400 uppercase tracking-widest mb-1">{t.stats.active}</p>
                <h3 className="text-4xl font-black text-industrial-900 dark:text-white">{stats.active || 0}</h3>
              </div>
              <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-2xl flex items-center justify-center">
                <CheckCircle size={32} />
              </div>
            </div>

            <div className="bg-white dark:bg-industrial-900 p-8 rounded-3xl shadow-sm border border-industrial-100 dark:border-industrial-800 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-industrial-400 uppercase tracking-widest mb-1">{t.stats.activity}</p>
                <h3 className="text-xl font-black text-industrial-900 dark:text-white">{lang === 'id' ? 'Baru saja' : 'Just Now'}</h3>
              </div>
              <div className="w-16 h-16 bg-orange-500/10 text-orange-500 rounded-2xl flex items-center justify-center">
                <TrendingUp size={32} />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-industrial-900 rounded-3xl shadow-sm border border-industrial-100 dark:border-industrial-800 overflow-hidden">
            <div className="p-8 border-b border-industrial-100 dark:border-industrial-800 flex justify-between items-center">
               <h3 className="text-xl font-bold text-industrial-900 dark:text-white">{t.recent}</h3>
               <Link href="/admin/projects" className="px-4 py-2 bg-industrial-50 dark:bg-industrial-800 text-industrial-600 dark:text-industrial-300 text-xs font-bold rounded-lg hover:bg-accent-teal hover:text-white transition-all">{t.buttons.viewAll}</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-industrial-50/50 dark:bg-industrial-900/50 text-[10px] font-black text-industrial-400 uppercase tracking-widest">
                    <th className="px-8 py-5">{t.table.title}</th>
                    <th className="px-8 py-5">{t.table.cat}</th>
                    <th className="px-8 py-5">{t.table.date}</th>
                    <th className="px-8 py-5 text-right">{t.table.status}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-industrial-100 dark:divide-industrial-800">
                  {recentProjects.map((proj) => (
                    <tr key={proj.id} className="hover:bg-industrial-50 dark:hover:bg-industrial-800/50 transition-colors">
                      <td className="px-8 py-6 font-bold text-industrial-900 dark:text-white">{lang === 'id' ? proj.title_id : proj.title_en}</td>
                      <td className="px-8 py-6">
                        <span className="px-3 py-1 bg-industrial-100 dark:bg-industrial-800 rounded-full text-[10px] font-bold uppercase text-industrial-500 dark:text-industrial-400 tracking-wider">
                          {translations[lang].portfolio.categories[proj.category] || proj.category}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-sm text-industrial-500 dark:text-industrial-400">
                         <div className="flex items-center"><Clock size={14} className="mr-2 opacity-50" /> {new Date(proj.date_created).toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US')}</div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${proj.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                          {proj.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {recentProjects.length === 0 && (
                <div className="p-20 text-center text-industrial-300 font-bold uppercase tracking-widest">No Projects Found</div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
