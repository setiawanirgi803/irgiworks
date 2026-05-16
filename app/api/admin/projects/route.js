import { getDb } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  const user = await getSession();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const db = await getDb();
  const projects = db.prepare('SELECT * FROM projects ORDER BY date_created DESC').all() || [];

  return Response.json({ projects, user });
}
