"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Zap, 
  Shield, 
  Clock, 
  ArrowRight, 
  Mail, 
  Instagram, 
  MessageSquare,
  ChevronRight,
  Loader2,
  CheckCircle2,
  HardHat,
  Network,
  Waves
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { translations } from '@/lib/translations';

export default function Home() {
  const { lang } = useApp();
  const t = translations[lang];
  
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch('/api/projects?limit=3');
        const data = await res.json();
        setProjects(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  const services = [
    { 
      title: t.services.electrical, 
      desc: t.services.electrical_desc, 
      icon: <Zap className="text-yellow-500" />,
      tag: "Power Systems"
    },
    { 
      title: t.services.networking, 
      desc: t.services.networking_desc, 
      icon: <Network className="text-blue-500" />,
      tag: "IT Backbone"
    },
    { 
      title: t.services.hvac, 
      desc: t.services.hvac_desc, 
      icon: <Waves className="text-cyan-500" />,
      tag: "Climate Control"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-industrial-50 dark:bg-industrial-950">
      {/* Hero Section */}
      <section className="relative pt-48 pb-32 lg:pt-64 lg:pb-48 overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-accent-teal/5 to-transparent pointer-events-none"></div>
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-accent-teal/10 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="container-proper relative z-10">
          <div className="max-w-4xl">
            <div className="inline-flex items-center space-x-3 bg-white dark:bg-industrial-900 px-5 py-2.5 rounded-2xl border border-industrial-100 dark:border-industrial-800 mb-10 shadow-sm animate-in fade-in slide-in-from-left-4 duration-500">
              <div className="bg-accent-teal/10 p-1.5 rounded-lg">
                <HardHat className="text-accent-teal" size={16} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-industrial-500 dark:text-industrial-400">{t.hero.tagline}</span>
            </div>
            
            <h1 className="text-6xl lg:text-8xl font-black text-industrial-900 dark:text-white mb-10 tracking-tightest leading-[0.85] animate-in fade-in slide-in-from-bottom-8 duration-700">
              <span className="text-gradient block">{t.hero.title.split(' ').slice(0, 2).join(' ')}</span>
              <span>{t.hero.title.split(' ').slice(2).join(' ')}</span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-industrial-500 dark:text-industrial-400 mb-12 leading-relaxed max-w-2xl animate-in fade-in slide-in-from-bottom-12 duration-1000">
              {t.hero.desc}
            </p>
            
            <div className="flex flex-wrap gap-5 animate-in fade-in zoom-in-95 duration-1000 delay-300">
              <Link href="/portfolio" className="btn-primary group">
                {t.hero.cta_view} <ArrowRight className="ml-3 group-hover:translate-x-1.5 transition-transform" size={20} />
              </Link>
              <Link href="#contact" className="px-10 py-4 bg-white dark:bg-industrial-900 text-industrial-900 dark:text-white font-black rounded-2xl border border-industrial-200 dark:border-industrial-800 hover:border-accent-teal hover:shadow-xl transition-all">
                {t.hero.cta_contact}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-32 bg-white dark:bg-industrial-900 relative z-10">
        <div className="container-proper">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-24 gap-10">
            <div className="max-w-2xl">
              <h2 className="text-4xl lg:text-6xl font-black text-industrial-900 dark:text-white mb-8 tracking-tighter leading-none">{t.services.title}</h2>
              <p className="text-lg text-industrial-500 dark:text-industrial-400 leading-relaxed">{t.services.desc}</p>
            </div>
            <div className="flex items-center space-x-6">
               <div className="flex -space-x-3">
                 {[1,2,3].map(i => (
                   <div key={i} className="w-12 h-12 rounded-full border-4 border-white dark:border-industrial-900 bg-industrial-100 dark:bg-industrial-800 flex items-center justify-center font-bold text-xs">A{i}</div>
                 ))}
               </div>
               <div className="text-sm font-bold text-industrial-500 uppercase tracking-widest">Trusted by 50+ Clients</div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-10">
            {services.map((service, index) => (
              <div key={index} className="p-12 bg-industrial-50 dark:bg-industrial-950 rounded-[3rem] border border-industrial-100 dark:border-industrial-800 hover:border-accent-teal transition-all group relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-accent-teal/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                <div className="w-16 h-16 bg-white dark:bg-industrial-900 rounded-[1.5rem] flex items-center justify-center mb-10 shadow-sm group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 relative z-10">
                  {service.icon}
                </div>
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-accent-teal mb-4">{service.tag}</div>
                <h3 className="text-2xl font-black mb-4 text-industrial-900 dark:text-white leading-tight">{service.title}</h3>
                <p className="text-industrial-500 dark:text-industrial-400 leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-32">
        <div className="container-proper">
          <div className="flex justify-between items-end mb-20">
            <div>
              <h2 className="text-4xl lg:text-6xl font-black text-industrial-900 dark:text-white mb-6 tracking-tighter leading-none">Featured Work</h2>
              <p className="text-lg text-industrial-500 dark:text-industrial-400">Engineering excellence in every detail.</p>
            </div>
            <Link href="/portfolio" className="group flex items-center space-x-3 text-industrial-900 dark:text-white font-black uppercase tracking-widest text-sm hover:text-accent-teal transition-colors">
              <span>{t.portfolio.all}</span> 
              <div className="w-10 h-10 bg-white dark:bg-industrial-900 rounded-full flex items-center justify-center border border-industrial-200 dark:border-industrial-800 group-hover:bg-accent-teal group-hover:text-white transition-all">
                <ArrowRight size={18} />
              </div>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {loading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="h-[30rem] bg-industrial-200 dark:bg-industrial-800 rounded-[3rem] animate-pulse"></div>
              ))
            ) : (
              projects.map((project, idx) => (
                <div key={project.id} className="bg-white dark:bg-industrial-900 rounded-[3rem] overflow-hidden shadow-sm hover:shadow-3xl hover:-translate-y-2 transition-all duration-500 group border border-industrial-100 dark:border-industrial-800">
                  <div className="aspect-[3/4] overflow-hidden relative">
                    <img src={project.image_url} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-industrial-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute top-8 left-8 glass-card text-white text-[10px] font-black px-4 py-2 rounded-xl uppercase tracking-widest">
                       {translations[lang].portfolio.categories[project.category] || project.category}
                    </div>
                  </div>
                  <div className="p-10">
                    <h3 className="text-2xl font-black mb-4 text-industrial-900 dark:text-white leading-tight">
                      {lang === 'id' ? project.title_id : project.title_en}
                    </h3>
                    <p className="text-industrial-500 dark:text-industrial-400 text-sm leading-relaxed line-clamp-2 mb-10">
                      {lang === 'id' ? project.desc_id : project.desc_en}
                    </p>
                    <Link href="/portfolio" className="flex items-center space-x-3 text-accent-teal text-xs font-black uppercase tracking-widest hover:translate-x-2 transition-transform">
                       <span>Explore Project</span> <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Stats / Proof Section */}
      <section className="py-24 border-y border-industrial-100 dark:border-industrial-800">
        <div className="container-proper">
           <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
             {[
               { val: "7+", lab: "Years Exp" },
               { val: "200+", lab: "Projects" },
               { val: "50+", lab: "Clients" },
               { val: "100%", lab: "Safety" }
             ].map((stat, i) => (
               <div key={i}>
                 <div className="text-4xl lg:text-6xl font-black text-industrial-900 dark:text-white mb-2 tracking-tighter">{stat.val}</div>
                 <div className="text-xs font-black text-industrial-400 uppercase tracking-widest">{stat.lab}</div>
               </div>
             ))}
           </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-32">
        <div className="container-proper">
          <div className="bg-industrial-950 rounded-[4rem] p-12 lg:p-24 relative overflow-hidden shadow-3xl">
            <div className="absolute -top-24 -right-24 w-[30rem] h-[30rem] bg-accent-teal/20 blur-[150px] rounded-full"></div>
            <div className="relative z-10 grid lg:grid-cols-2 gap-24 items-center">
              <div>
                <h2 className="text-5xl lg:text-7xl font-black text-white mb-10 tracking-tightest leading-[0.9]">{t.contact.title}</h2>
                <p className="text-industrial-400 text-xl mb-16 leading-relaxed max-w-md">{t.contact.desc}</p>
                
                <div className="flex items-center space-x-8 p-8 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md">
                   <div className="w-16 h-16 bg-accent-teal text-white rounded-2xl flex items-center justify-center shadow-lg shadow-teal-500/20">
                      <Clock size={28} />
                   </div>
                   <div>
                      <h4 className="text-white text-xl font-bold mb-1">{t.contact.response}</h4>
                      <p className="text-industrial-500 text-sm font-medium">{t.contact.response_desc}</p>
                   </div>
                </div>
              </div>
              
              <div className="space-y-6">
                 {[
                   { name: "WhatsApp", sub: "Instant Messaging", icon: <MessageSquare />, color: "green", href: "https://wa.me/6281383981373" },
                   { name: "Instagram", sub: "Latest Updates", icon: <Instagram />, color: "pink", href: "https://instagram.com/igibaiq" },
                   { name: "Email", sub: "Official Inquiry", icon: <Mail />, color: "blue", href: "mailto:setiawanirgi803@gmail.com" }
                 ].map((social, i) => (
                   <a key={i} href={social.href} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-8 bg-white/5 border border-white/5 rounded-[2rem] hover:bg-white/10 hover:border-white/20 transition-all group">
                      <div className="flex items-center space-x-8">
                         <div className={`w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                            {social.icon}
                         </div>
                         <div>
                            <span className="text-2xl font-black text-white block mb-1">{social.name}</span>
                            <span className="text-industrial-500 text-xs font-bold uppercase tracking-widest">{social.sub}</span>
                         </div>
                      </div>
                      <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white group-hover:bg-white group-hover:text-industrial-950 transition-all">
                        <ArrowRight size={20} />
                      </div>
                   </a>
                 ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
