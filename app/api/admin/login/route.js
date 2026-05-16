import { getDb } from '@/lib/db';
import { hashPassword } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(request) {
  try {
    const { username, password } = await request.json();
    const db = await getDb();
    
    // Find user
    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
    
    if (!user) {
      return Response.json({ error: 'User not found' }, { status: 401 });
    }

    // Verify password
    const hashedPassword = hashPassword(password);
    if (user.password_hash !== hashedPassword) {
      return Response.json({ error: 'Invalid password' }, { status: 401 });
    }

    // Create session (simple base64 of user info for this demo)
    const sessionData = JSON.stringify({ id: user.id, username: user.username, role_id: user.role_id });
    const sessionToken = Buffer.from(sessionData).toString('base64');

    // Set cookie
    cookies().set('session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });

    return Response.json({ success: true, user: { username: user.username } });
  } catch (err) {
    console.error('Login error:', err);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
