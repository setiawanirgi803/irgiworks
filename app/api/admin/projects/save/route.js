import { getDb } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function POST(request) {
  const user = await getSession();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const formData = await request.formData();
  const id = formData.get('id');
  const title_id = formData.get('title_id');
  const title_en = formData.get('title_en');
  const category = formData.get('category');
  const desc_id = formData.get('desc_id');
  const desc_en = formData.get('desc_en');
  const image = formData.get('image_url');
  const status = formData.get('status');

  const db = await getDb();
  if (id && id !== "null" && id !== "") {
    db.prepare('UPDATE projects SET title_id = ?, title_en = ?, category = ?, desc_id = ?, desc_en = ?, image_url = ?, status = ? WHERE id = ?')
      .run(title_id, title_en, category, desc_id, desc_en, image, status, id);
  } else {
    db.prepare('INSERT INTO projects (title_id, title_en, category, desc_id, desc_en, image_url, status) VALUES (?, ?, ?, ?, ?, ?, ?)')
      .run(title_id, title_en, category, desc_id, desc_en, image, status || 'active');
  }

  // Redirect back to projects list
  return Response.redirect(new URL('/admin/projects', request.url));
}
