import { getSession, hashPassword } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getDb } from '@/lib/db';
import Link from 'next/link';
import { 
  Users, 
  UserPlus, 
  Trash2, 
  Shield, 
  ChevronLeft, 
  Save,
  LayoutDashboard,
  Briefcase,
  LogOut,
  X
} from 'lucide-react';

export default async function UserManagement({ searchParams }) {
  const user = await getSession();
  if (!user || user.role_name !== 'SuperAdmin') redirect('/admin/dashboard');

  const action = searchParams.action;

  async function createUser(formData) {
    "use server";
    const username = formData.get('username');
    const password = formData.get('password');
    const roleId = formData.get('role_id');
    const hashedPassword = hashPassword(password);

    const db = await getDb();
    db.prepare('INSERT INTO users (username, password_hash, role_id) VALUES (?, ?, ?)')
      .run(username, hashedPassword, roleId);
    
    redirect('/admin/users');
  }

  async function deleteUser(formData) {
    "use server";
    const sessionUser = await getSession();
    if (!sessionUser || sessionUser.role_name !== 'SuperAdmin') return;

    const id = formData.get('id');
    if (id == sessionUser.id) return;
    
    const db = await getDb();
    db.prepare('DELETE FROM users WHERE id = ?').run(id);
    redirect('/admin/users');
  }

  const db = await getDb();
  const usersList = db.prepare('SELECT u.*, r.role_name FROM users u JOIN roles r ON u.role_id = r.id').all() || [];
  const roles = db.prepare('SELECT * FROM roles').all() || [];

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar - Shared */}
      <aside className="w-72 bg-white dark:bg-industrial-900 border-r border-industrial-200 dark:border-industrial-800 flex flex-col z-20">
        <div className="p-8">
          <Link href="/" className="flex items-center space-x-3 group text-industrial-900 dark:text-white">
            <div className="bg-accent-teal p-2.5 rounded-xl text-white shadow-lg"><LayoutDashboard size={22} /></div>
            <span className="font-black text-xl tracking-tighter">IRGI.ADMIN</span>
          </Link>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          <Link href="/admin/dashboard" className="flex items-center space-x-3 px-4 py-3 text-industrial-500 dark:text-industrial-400 hover:bg-industrial-100 dark:hover:bg-white/5 rounded-xl font-medium transition-all">
            <LayoutDashboard size={20} /> <span>Overview</span>
          </Link>
          <Link href="/admin/projects" className="flex items-center space-x-3 px-4 py-3 text-industrial-500 dark:text-industrial-400 hover:bg-industrial-100 dark:hover:bg-white/5 rounded-xl font-medium transition-all">
            <Briefcase size={20} /> <span>Projects</span>
          </Link>
          <Link href="/admin/users" className="flex items-center space-x-3 px-4 py-3 bg-accent-teal text-white rounded-xl font-bold shadow-lg">
            <Users size={20} /> <span>User Management</span>
          </Link>
        </nav>
        <div className="p-4 mt-auto">
          <Link href="/admin/login" className="flex items-center justify-center space-x-2 w-full py-3 bg-red-500/10 text-red-500 rounded-xl font-bold hover:bg-red-500 hover:text-white transition-all">
            <LogOut size={16} /> <span>Sign Out</span>
          </Link>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-20 bg-white dark:bg-industrial-950 border-b border-industrial-100 dark:border-industrial-800 flex items-center justify-between px-10 z-10">
           <h2 className="text-sm font-bold text-industrial-400 uppercase tracking-widest">Team Settings</h2>
           {!action && (
             <Link href="/admin/users?action=new" className="btn-primary py-2 px-4 text-xs"><UserPlus size={14} className="mr-2 inline" /> New User</Link>
           )}
        </header>

        <main className="flex-1 overflow-y-auto p-10 bg-industrial-50/50 dark:bg-industrial-950">
           {!action ? (
             <div className="bg-white dark:bg-industrial-900 rounded-3xl shadow-sm border border-industrial-100 dark:border-industrial-800 overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-industrial-50/50 dark:bg-industrial-900/50 text-[10px] font-black text-industrial-400 uppercase tracking-widest">
                      <th className="px-8 py-5">Administrator</th>
                      <th className="px-8 py-5">Role Permission</th>
                      <th className="px-8 py-5 text-right">Control</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-industrial-100 dark:divide-industrial-800">
                     {usersList.map((u) => (
                        <tr key={u.id} className="hover:bg-industrial-50 dark:hover:bg-industrial-800/50">
                           <td className="px-8 py-6 font-bold text-industrial-900 dark:text-white flex items-center">
                              <div className="w-10 h-10 rounded-full bg-accent-teal/20 text-accent-teal flex items-center justify-center mr-4 text-xs font-black">{u.username[0].toUpperCase()}</div>
                              {u.username}
                           </td>
                           <td className="px-8 py-6">
                              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${u.role_name === 'SuperAdmin' ? 'bg-purple-500/10 text-purple-500' : 'bg-blue-500/10 text-blue-500'}`}>
                                 <Shield size={10} className="inline mr-1" /> {u.role_name}
                              </span>
                           </td>
                           <td className="px-8 py-6 text-right">
                              {u.id != user.id && (
                                 <form action={deleteUser}>
                                    <input type="hidden" name="id" value={u.id} />
                                    <button type="submit" className="p-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-all"><Trash2 size={18} /></button>
                                 </form>
                              )}
                           </td>
                        </tr>
                     ))}
                  </tbody>
                </table>
             </div>
           ) : (
             <div className="max-w-md mx-auto">
                <div className="bg-white dark:bg-industrial-900 rounded-3xl shadow-2xl border border-industrial-100 dark:border-industrial-800 p-10">
                   <div className="flex justify-between items-center mb-8">
                      <h2 className="text-2xl font-black text-industrial-900 dark:text-white">New User</h2>
                      <Link href="/admin/users" className="p-2 text-industrial-400 hover:text-industrial-900"><X size={20} /></Link>
                   </div>
                   <form action={createUser} className="space-y-6">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-industrial-400 uppercase tracking-widest">Username</label>
                         <input name="username" required className="w-full bg-industrial-50 dark:bg-industrial-800 border border-industrial-100 dark:border-industrial-700 rounded-2xl px-6 py-4 text-industrial-900 dark:text-white focus:outline-none focus:border-accent-teal transition-all" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-industrial-400 uppercase tracking-widest">Password</label>
                         <input name="password" type="password" required className="w-full bg-industrial-50 dark:bg-industrial-800 border border-industrial-100 dark:border-industrial-700 rounded-2xl px-6 py-4 text-industrial-900 dark:text-white focus:outline-none focus:border-accent-teal transition-all" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-industrial-400 uppercase tracking-widest">Access Role</label>
                         <select name="role_id" className="w-full bg-industrial-50 dark:bg-industrial-800 border border-industrial-100 dark:border-industrial-700 rounded-2xl px-6 py-4 text-industrial-900 dark:text-white focus:outline-none focus:border-accent-teal transition-all appearance-none">
                            {roles.map(r => <option key={r.id} value={r.id}>{r.role_name}</option>)}
                         </select>
                      </div>
                      <button type="submit" className="w-full btn-primary py-5 rounded-2xl text-lg font-black shadow-xl mt-4"><Save size={20} className="mr-3 inline" /> Create User</button>
                   </form>
                </div>
             </div>
           )}
        </main>
      </div>
    </div>
  );
}
