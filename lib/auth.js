import { cookies } from 'next/headers';
import { getDb } from './db';
import crypto from 'crypto';

export async function getSession() {
    const session = cookies().get('session');
    if (!session) return null;
    
    try {
        const decoded = JSON.parse(Buffer.from(session.value, 'base64').toString());
        const db = await getDb();
        const user = db.prepare('SELECT u.*, r.role_name FROM users u JOIN roles r ON u.role_id = r.id WHERE u.id = ?').get(decoded.id);
        if (!user) return null;
        return user;
    } catch (e) {
        return null;
    }
}

export function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}
