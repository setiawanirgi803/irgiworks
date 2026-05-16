"use client";
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  ChevronLeft,
  Save,
  X,
  Image as ImageIcon,
  LayoutDashboard,
  Briefcase,
  Users,
  LogOut,
  ExternalLink,
  Loader2,
  Globe
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { translations } from '@/lib/translations';

function ProjectsContent() {
  const { lang } = useApp();
  const t = translations[lang]?.admin || translations.id.admin;
  const searchParams = useSearchParams();
  const action = searchParams.get('action');
  const editId = searchParams.get('id');

  const [projects, setProjects] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editProject, setEditProject] = useState(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await fetch('/api/admin/projects');
        const data = await res.json();
        setProjects(data.projects || []);
        setUser(data.user);
        
        if (editId && data.projects) {
          const found = data.projects.find(p => p.id == editId);
          setEditProject(found);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [editId]);

  if (loading) return (
    <div className="flex h-screen w-full items-center justify-center bg-industrial-50 dark:bg-industrial-950">
      <Loader2 className="animate-spin text-accent-teal" size={40} />
    </div>
  );

  const categories = ['Electrical Installation', 'Networking', 'Cooling (HVAC)', 'Heating', 'Plumbing'];

  return (
    <div className="flex h-screen w-full overflow-hidden bg-industrial-50 dark:bg-industrial-950">
      {/* Sidebar */}
      <aside className="w-72 flex-shrink-0 bg-white dark:bg-industrial-900 border-r border-industrial-200 dark:border-industrial-800 flex flex-col z-20">
        <div className="p-8">
          <Link href="/" className="flex items-center space-x-3 text-industrial-900 dark:text-white">
            <div className="bg-accent-teal p-2.5 rounded-xl text-white shadow-lg"><LayoutDashboard size={22} /></div>
            <span className="font-black text-xl tracking-tighter uppercase">Irgi.Admin</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          <Link href="/admin/dashboard" className="flex items-center space-x-3 px-4 py-3 text-industrial-500 dark:text-industrial-400 hover:bg-industrial-100 dark:hover:bg-white/5 rounded-xl font-medium transition-all">
            <LayoutDashboard size={20} /> <span>{t.overview}</span>
          </Link>
          <Link href="/admin/projects" className="flex items-center space-x-3 px-4 py-3 bg-accent-teal text-white rounded-xl font-bold shadow-lg">
            <Briefcase size={20} /> <span>{t.projects}</span>
          </Link>
          {user?.role_name === 'SuperAdmin' && (
            <Link href="/admin/users" className="flex items-center space-x-3 px-4 py-3 text-industrial-500 dark:text-industrial-400 hover:bg-industrial-100 dark:hover:bg-white/5 rounded-xl font-medium transition-all">
              <Users size={20} /> <span>{t.users}</span>
            </Link>
          )}
        </nav>

        <div className="p-4 mt-auto border-t border-industrial-100 dark:border-industrial-800">
          <Link href="/admin/login" className="flex items-center justify-center space-x-2 w-full py-3 bg-red-500/10 text-red-500 rounded-xl font-bold hover:bg-red-500 hover:text-white transition-all">
            <LogOut size={16} /> <span>{t.buttons.signOut}</span>
          </Link>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <header className="h-20 bg-white/80 dark:bg-industrial-950/80 backdrop-blur-md border-b border-industrial-100 dark:border-industrial-800 flex items-center justify-between px-10 flex-shrink-0 z-10">
           <div className="flex items-center space-x-4">
              <h2 className="text-sm font-bold text-industrial-400 uppercase tracking-widest">{t.projects}</h2>
           </div>
           <div className="flex items-center space-x-4">
              {(!action) && (
                <Link href="/admin/projects?action=new" className="btn-primary py-2 px-4 text-xs">
                  <Plus size={14} className="mr-2 inline" /> {t.buttons.addNew}
                </Link>
              )}
           </div>
        </header>

        <main className="flex-1 overflow-y-auto p-10 bg-industrial-50/50 dark:bg-industrial-950">
          {(!action) ? (
            <div className="bg-white dark:bg-industrial-900 rounded-3xl shadow-sm border border-industrial-100 dark:border-industrial-800 overflow-hidden">
               <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-industrial-50/50 dark:bg-industrial-900/50 text-[10px] font-black text-industrial-400 uppercase tracking-[0.2em]">
                        <th className="px-8 py-5">{t.table.preview}</th>
                        <th className="px-8 py-5">{t.table.details}</th>
                        <th className="px-8 py-5">{t.table.cat}</th>
                        <th className="px-8 py-5">{t.table.status}</th>
                        <th className="px-8 py-5 text-right">{t.table.action}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-industrial-100 dark:divide-industrial-800">
                      {projects.map((proj) => (
                        <tr key={proj.id} className="hover:bg-industrial-50 dark:hover:bg-industrial-800/50 transition-colors">
                          <td className="px-8 py-6">
                             <div className="w-16 h-12 rounded-xl bg-industrial-100 overflow-hidden border border-industrial-200">
                                <img src={proj.image_url} alt="" className="w-full h-full object-cover" />
                             </div>
                          </td>
                          <td className="px-8 py-6 font-bold text-industrial-900 dark:text-white">{lang === 'id' ? proj.title_id : proj.title_en}</td>
                          <td className="px-8 py-6">
                            <span className="px-3 py-1 bg-industrial-100 dark:bg-industrial-800 rounded-full text-[10px] font-bold uppercase text-industrial-500">
                              {translations[lang].portfolio.categories[proj.category] || proj.category}
                            </span>
                          </td>
                          <td className="px-8 py-6">
                             <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${proj.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                {proj.status}
                             </span>
                          </td>
                          <td className="px-8 py-6 text-right">
                             <Link href={`/admin/projects?action=edit&id=${proj.id}`} className="p-2.5 text-blue-500 hover:bg-blue-500/10 rounded-xl">
                                <Edit3 size={18} />
                             </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
               </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto pb-20">
               <div className="bg-white dark:bg-industrial-900 rounded-3xl shadow-2xl p-10">
                  <form action="/api/admin/projects/save" method="POST" className="space-y-8">
                     <input type="hidden" name="id" value={editProject?.id || ''} />
                     <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-industrial-400 uppercase tracking-widest">Judul (ID)</label>
                           <input name="title_id" required defaultValue={editProject?.title_id || ''} className="w-full bg-industrial-50 dark:bg-industrial-800/50 border border-industrial-200 dark:border-industrial-700 rounded-2xl px-6 py-4" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-industrial-400 uppercase tracking-widest">Title (EN)</label>
                           <input name="title_en" required defaultValue={editProject?.title_en || ''} className="w-full bg-industrial-50 dark:bg-industrial-800/50 border border-industrial-200 dark:border-industrial-700 rounded-2xl px-6 py-4" />
                        </div>
                     </div>
                     <div className="grid md:grid-cols-2 gap-8">
                        <select name="category" defaultValue={editProject?.category || 'Electrical Installation'} className="w-full bg-industrial-50 dark:bg-industrial-800/50 border border-industrial-200 dark:border-industrial-700 rounded-2xl px-6 py-4">
                           {categories.map(c => <option key={c} value={c}>{translations[lang].portfolio.categories[c] || c}</option>)}
                        </select>
                        <select name="status" defaultValue={editProject?.status || 'active'} className="w-full bg-industrial-50 dark:bg-industrial-800/50 border border-industrial-200 dark:border-industrial-700 rounded-2xl px-6 py-4">
                           <option value="active">Active</option>
                           <option value="archived">Archived</option>
                        </select>
                     </div>
                     <input name="image_url" defaultValue={editProject?.image_url || ''} placeholder="Image URL" className="w-full bg-industrial-50 dark:bg-industrial-800/50 border border-industrial-200 dark:border-industrial-700 rounded-2xl px-6 py-4" />
                     <textarea name="desc_id" rows={4} required defaultValue={editProject?.desc_id || ''} className="w-full bg-industrial-50 dark:bg-industrial-800/50 border border-industrial-200 dark:border-industrial-700 rounded-2xl px-6 py-4" placeholder="Deskripsi (ID)"></textarea>
                     <textarea name="desc_en" rows={4} required defaultValue={editProject?.desc_en || ''} className="w-full bg-industrial-50 dark:bg-industrial-800/50 border border-industrial-200 dark:border-industrial-700 rounded-2xl px-6 py-4" placeholder="Description (EN)"></textarea>
                     <div className="flex gap-4">
                        <button type="submit" className="flex-1 btn-primary py-4 rounded-2xl">{t.form.save}</button>
                        <Link href="/admin/projects" className="flex-1 bg-industrial-100 text-center py-4 rounded-2xl font-bold">{t.form.cancel}</Link>
                     </div>
                  </form>
               </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function ProjectsManagement() {
  return (
    <Suspense fallback={<div className="flex h-screen w-full items-center justify-center bg-industrial-50 dark:bg-industrial-950"><Loader2 className="animate-spin text-accent-teal" size={40} /></div>}>
      <ProjectsContent />
    </Suspense>
  );
}
