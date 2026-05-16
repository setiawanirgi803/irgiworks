"use client";
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) return null;

  return (
    <footer className="bg-industrial-900 text-white py-12 mt-20">
      <div className="container mx-auto px-6 text-center">
        <h3 className="text-2xl font-bold mb-4">Irgi Setiawan</h3>
        <p className="text-industrial-400 mb-6">Expert technical installations & troubleshooting.</p>
        <div className="flex justify-center space-x-6 mb-8">
          <a href="https://instagram.com/igibaiq" target="_blank" rel="noopener noreferrer" className="hover:text-accent-teal transition-colors">Instagram</a>
          <a href="https://wa.me/6281383981373?text=Halo%20Mas%20Irgi,%20saya%20tertarik%20dengan%20jasa%20Anda" target="_blank" rel="noopener noreferrer" className="hover:text-accent-teal transition-colors">WhatsApp</a>
          <a href="mailto:setiawanirgi803@gmail.com?subject=Tanya%20Jasa%20Instalasi/Maintenance" className="hover:text-accent-teal transition-colors">Email</a>
        </div>
        <p className="text-industrial-500 text-sm">© 2024 Irgi Setiawan. Built with high performance.</p>
      </div>
    </footer>
  );
}
