export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-industrial-50 dark:bg-industrial-950 transition-colors duration-300">
      {children}
    </div>
  );
}
