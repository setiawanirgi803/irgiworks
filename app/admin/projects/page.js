"use client";
import { useState, useEffect } from 'react';
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

export default function ProjectsManagement() {
  const { lang } = useApp();
  const t = translations[lang]?.admin || translations.id.admin;
  const searchParams = useSearchParams();
  const router = useRouter();
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
        setProjects(data.projects);
        setUser(data.user);
        
        if (editId) {
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
      {/* Sidebar - Shared */}
      <aside className="w-72 flex-shrink-0 bg-white dark:bg-industrial-900 border-r border-industrial-200 dark:border-industrial-800 flex flex-col z-20 transition-colors duration-300">
        <div className="p-8">
          <Link href="/" className="flex items-center space-x-3 group text-industrial-900 dark:text-white">
            <div className="bg-accent-teal p-2.5 rounded-xl text-white shadow-lg"><LayoutDashboard size={22} /></div>
            <span className="font-black text-xl tracking-tighter">IRGI.ADMIN</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          <Link href="/admin/dashboard" className="flex items-center space-x-3 px-4 py-3 text-industrial-500 dark:text-industrial-400 hover:bg-industrial-100 dark:hover:bg-white/5 rounded-xl font-medium transition-all">
            <LayoutDashboard size={20} /> <span>{t.overview}</span>
          </Link>
          <Link href="/admin/projects" className="flex items-center space-x-3 px-4 py-3 bg-accent-teal text-white rounded-xl font-bold shadow-lg shadow-teal-500/20">
            <Briefcase size={20} /> <span>{t.projects}</span>
          </Link>
          {user.role_name === 'SuperAdmin' && (
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
              <Link href="/" target="_blank" className="flex items-center space-x-2 text-xs font-bold text-industrial-500 hover:text-accent-teal transition-colors">
                <ExternalLink size={14} /> <span>Situs Live</span>
              </Link>
              {(!action) && (
                <Link href="/admin/projects?action=new" className="btn-primary py-2 px-4 text-xs">
                  <Plus size={14} className="mr-2 inline" /> {t.buttons.addNew}
                </Link>
              )}
           </div>
        </header>

        <main className="flex-1 overflow-y-auto p-10 bg-industrial-50/50 dark:bg-industrial-950 transition-colors duration-300">
          {(!action) ? (
            /* List View */
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
                             <div className="w-16 h-12 rounded-xl bg-industrial-100 dark:bg-industrial-800 overflow-hidden border border-industrial-200 dark:border-industrial-700">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={proj.image_url} alt="" className="w-full h-full object-cover" />
                             </div>
                          </td>
                          <td className="px-8 py-6">
                             <div className="font-bold text-industrial-900 dark:text-white truncate max-w-[300px]">{lang === 'id' ? proj.title_id : proj.title_en}</div>
                             <div className="text-[10px] text-industrial-400 truncate max-w-[200px] mt-1">{lang === 'id' ? proj.desc_id : proj.desc_en}</div>
                          </td>
                          <td className="px-8 py-6">
                            <span className="px-3 py-1 bg-industrial-100 dark:bg-industrial-800 rounded-full text-[10px] font-bold uppercase text-industrial-500 dark:text-industrial-400 tracking-wider">
                              {translations[lang].portfolio.categories[proj.category] || proj.category}
                            </span>
                          </td>
                          <td className="px-8 py-6">
                             <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${proj.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                {proj.status}
                             </span>
                          </td>
                          <td className="px-8 py-6 text-right">
                             <div className="flex justify-end space-x-2">
                                <Link href={`/admin/projects?action=edit&id=${proj.id}`} className="p-2.5 text-blue-500 hover:bg-blue-500/10 rounded-xl transition-all">
                                  <Edit3 size={18} />
                                </Link>
                             </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
               </div>
            </div>
          ) : (
            /* Form View - Bilingual Fields */
            <div className="max-w-4xl mx-auto pb-20">
               <div className="bg-white dark:bg-industrial-900 rounded-3xl shadow-2xl border border-industrial-100 dark:border-industrial-800 overflow-hidden">
                  <div className="p-10 border-b border-industrial-100 dark:border-industrial-800 flex justify-between items-center bg-industrial-50/50 dark:bg-industrial-900/50">
                     <h2 className="text-2xl font-black text-industrial-900 dark:text-white tracking-tighter">{action === 'edit' ? t.form.edit : t.form.new}</h2>
                     <Link href="/admin/projects" className="w-10 h-10 flex items-center justify-center bg-white dark:bg-industrial-800 rounded-full text-industrial-400 hover:text-industrial-900 shadow-sm"><X size={20} /></Link>
                  </div>

                  <form action="/api/admin/projects/save" method="POST" className="p-10 space-y-10">
                     <input type="hidden" name="id" value={editProject?.id || ''} />
                     
                     {/* Bilingual Titles */}
                     <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                           <label className="flex items-center text-[10px] font-black text-industrial-400 uppercase tracking-widest ml-1">
                              <span className="w-4 h-3 bg-red-600 mr-2 rounded-sm border border-red-800"></span> Judul Proyek (Indonesia)
                           </label>
                           <input name="title_id" required defaultValue={editProject?.title_id || ''} className="w-full bg-industrial-50 dark:bg-industrial-800/50 border border-industrial-200 dark:border-industrial-700 rounded-2xl px-6 py-4 text-industrial-900 dark:text-white focus:outline-none focus:border-accent-teal transition-all font-medium" placeholder="Contoh: Instalasi Panel Listrik" />
                        </div>
                        <div className="space-y-2">
                           <label className="flex items-center text-[10px] font-black text-industrial-400 uppercase tracking-widest ml-1">
                              <Globe size={12} className="mr-2 text-blue-500" /> Project Title (English)
                           </label>
                           <input name="title_en" required defaultValue={editProject?.title_en || ''} className="w-full bg-industrial-50 dark:bg-industrial-800/50 border border-industrial-200 dark:border-industrial-700 rounded-2xl px-6 py-4 text-industrial-900 dark:text-white focus:outline-none focus:border-accent-teal transition-all font-medium" placeholder="Example: Electrical Panel Installation" />
                        </div>
                     </div>

                     {/* Category & Status */}
                     <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-industrial-400 uppercase tracking-widest ml-1">{t.form.cat}</label>
                           <select name="category" defaultValue={editProject?.category || 'Electrical Installation'} className="w-full bg-industrial-50 dark:bg-industrial-800/50 border border-industrial-200 dark:border-industrial-700 rounded-2xl px-6 py-4 text-industrial-900 dark:text-white focus:outline-none focus:border-accent-teal transition-all font-medium appearance-none">
                              {categories.map(c => <option key={c} value={c}>{translations[lang].portfolio.categories[c] || c}</option>)}
                           </select>
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-industrial-400 uppercase tracking-widest ml-1">{t.form.status}</label>
                           <select name="status" defaultValue={editProject?.status || 'active'} className="w-full bg-industrial-50 dark:bg-industrial-800/50 border border-industrial-200 dark:border-industrial-700 rounded-2xl px-6 py-4 text-industrial-900 dark:text-white focus:outline-none focus:border-accent-teal transition-all font-medium appearance-none">
                              <option value="active">Active</option>
                              <option value="archived">Archived</option>
                           </select>
                        </div>
                     </div>

                     {/* Image URL */}
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-industrial-400 uppercase tracking-widest ml-1">{t.form.image}</label>
                        <div className="relative">
                           <ImageIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-industrial-400" size={18} />
                           <input name="image_url" defaultValue={editProject?.image_url || ''} className="w-full bg-industrial-50 dark:bg-industrial-800/50 border border-industrial-200 dark:border-industrial-700 rounded-2xl py-4 pl-14 pr-6 text-industrial-900 dark:text-white focus:outline-none focus:border-accent-teal transition-all font-medium" placeholder="https://images.unsplash.com/..." />
                        </div>
                     </div>

                     {/* Bilingual Descriptions */}
                     <div className="space-y-8">
                        <div className="space-y-2">
                           <label className="flex items-center text-[10px] font-black text-industrial-400 uppercase tracking-widest ml-1">
                              <span className="w-4 h-3 bg-red-600 mr-2 rounded-sm border border-red-800"></span> Deskripsi Proyek (Indonesia)
                           </label>
                           <textarea name="desc_id" rows={4} required defaultValue={editProject?.desc_id || ''} className="w-full bg-industrial-50 dark:bg-industrial-800/50 border border-industrial-200 dark:border-industrial-700 rounded-2xl px-6 py-4 text-industrial-900 dark:text-white focus:outline-none focus:border-accent-teal transition-all font-medium" placeholder="Jelaskan detail pekerjaan teknis Anda..."></textarea>
                        </div>
                        <div className="space-y-2">
                           <label className="flex items-center text-[10px] font-black text-industrial-400 uppercase tracking-widest ml-1">
                              <Globe size={12} className="mr-2 text-blue-500" /> Project Description (English)
                           </label>
                           <textarea name="desc_en" rows={4} required defaultValue={editProject?.desc_en || ''} className="w-full bg-industrial-50 dark:bg-industrial-800/50 border border-industrial-200 dark:border-industrial-700 rounded-2xl px-6 py-4 text-industrial-900 dark:text-white focus:outline-none focus:border-accent-teal transition-all font-medium" placeholder="Describe the technical implementation details..."></textarea>
                        </div>
                     </div>

                     <div className="flex gap-4 pt-6">
                        <button type="submit" className="flex-1 btn-primary py-5 rounded-2xl text-lg font-black shadow-xl">
                           <Save size={20} className="mr-3 inline" /> {t.form.save}
                        </button>
                        <Link href="/admin/projects" className="flex-1 bg-industrial-100 dark:bg-industrial-800 text-industrial-600 dark:text-industrial-300 py-5 rounded-2xl text-center font-bold hover:bg-industrial-200 transition-all">
                           {t.form.cancel}
                        </Link>
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
