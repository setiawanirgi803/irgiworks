"use client";
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Calendar, Folder, Loader2, ArrowRight } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { translations } from '@/lib/translations';

function PortfolioContent() {
  const { lang } = useApp();
  const t = translations[lang].portfolio;
  const searchParams = useSearchParams();
  const categoryFilter = searchParams.get('category') || 'All';
  
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      setLoading(true);
      try {
        const res = await fetch(`/api/projects?category=${encodeURIComponent(categoryFilter)}`);
        const data = await res.json();
        setProjects(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, [categoryFilter]);

  const categories = ['All', 'Electrical Installation', 'Networking', 'Cooling (HVAC)', 'Heating', 'Plumbing'];

  return (
    <div className="container-proper">
        <div className="max-w-4xl mb-20">
          <div className="inline-flex items-center space-x-3 bg-white dark:bg-industrial-900 px-4 py-2 rounded-xl border border-industrial-100 dark:border-industrial-800 mb-6 shadow-sm">
             <div className="w-2 h-2 bg-accent-teal rounded-full animate-pulse"></div>
             <span className="text-[10px] font-black uppercase tracking-widest text-industrial-500">{t.case_study}</span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-black text-industrial-900 dark:text-white mb-8 tracking-tightest leading-[0.9]">{t.title}</h1>
          <p className="text-xl text-industrial-500 dark:text-industrial-400 leading-relaxed max-w-2xl">{t.desc}</p>
        </div>

        <div className="flex flex-wrap gap-4 mb-20">
          {categories.map((cat) => (
            <Link 
              key={cat}
              href={cat === 'All' ? '/portfolio' : `/portfolio?category=${encodeURIComponent(cat)}`}
              className={`px-8 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                categoryFilter === cat ? 'bg-accent-teal text-white shadow-xl' : 'bg-white dark:bg-industrial-900 text-industrial-500 dark:text-industrial-400 border border-industrial-100 dark:border-industrial-800 hover:border-accent-teal'
              }`}
            >
              {t.categories[cat] || cat}
            </Link>
          ))}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40">
            <Loader2 className="animate-spin text-accent-teal mb-6" size={48} />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
            {projects.map((project, idx) => (
              <div key={project.id} className="bg-white dark:bg-industrial-900 rounded-[3rem] overflow-hidden shadow-sm hover:shadow-3xl hover:-translate-y-2 transition-all duration-700 group border border-industrial-100 dark:border-industrial-800">
                <div className="aspect-[4/5] overflow-hidden relative">
                  <img src={project.image_url} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                  <div className="absolute top-8 left-8 glass-card text-white text-[10px] font-black px-4 py-2 rounded-xl uppercase tracking-widest">{t.categories[project.category] || project.category}</div>
                </div>
                <div className="p-10">
                  <h3 className="text-2xl font-black mb-4 text-industrial-900 dark:text-white leading-tight">{lang === 'id' ? project.title_id : project.title_en}</h3>
                  <p className="text-industrial-500 dark:text-industrial-400 text-sm leading-relaxed line-clamp-3 mb-10">{lang === 'id' ? project.desc_id : project.desc_en}</p>
                  <div className="flex items-center justify-between pt-8 border-t border-industrial-100 dark:border-industrial-800">
                    <div className="flex items-center text-[10px] font-black text-industrial-400 uppercase tracking-widest">
                      <Calendar size={14} className="mr-2 text-accent-teal" />
                      {new Date(project.date_created).toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US', { year: 'numeric', month: 'short' })}
                    </div>
                    <div className="w-12 h-12 bg-industrial-50 dark:bg-industrial-800 text-industrial-400 rounded-full flex items-center justify-center"><ArrowRight size={20} /></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
  );
}

export default function PortfolioPage() {
  return (
    <div className="pt-48 pb-32 min-h-screen bg-industrial-50 dark:bg-industrial-950">
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin text-accent-teal" size={48} /></div>}>
        <PortfolioContent />
      </Suspense>
    </div>
  );
}
