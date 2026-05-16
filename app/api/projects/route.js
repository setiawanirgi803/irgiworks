import { getDb } from '@/lib/db';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const categoryFilter = searchParams.get('category') || 'All';
  
  const db = await getDb();
  
  let query = 'SELECT * FROM projects WHERE status = "active"';
  let params = [];
  
  if (categoryFilter !== 'All') {
    query += ' AND category = ?';
    params.push(categoryFilter);
  }
  
  const projects = db.prepare(query).all(...params);
  
  return Response.json(projects);
}
