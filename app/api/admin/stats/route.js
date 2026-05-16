import { getDb } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  const user = await getSession();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const db = await getDb();
    
    // Get total projects - using simplified approach to avoid null errors
    const allProjects = db.prepare('SELECT * FROM projects').all();
    const totalProjects = allProjects.length;
    const activeProjects = allProjects.filter(p => p.status === 'active').length;
    
    // Get recent projects
    const recentProjects = db.prepare('SELECT * FROM projects ORDER BY id DESC LIMIT 5').all();

    return Response.json({
      user,
      stats: {
        total: totalProjects,
        active: activeProjects
      },
      recentProjects
    });
  } catch (err) {
    console.error('Stats API error:', err);
    return Response.json({ error: 'Failed to load stats' }, { status: 500 });
  }
}
