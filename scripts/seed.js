const { getDb, initDb } = require('../lib/db');
const { hashPassword } = require('../lib/crypto');

async function seed() {
    console.log('Starting seeding process...');
    
    await initDb();
    const db = await getDb();

    // 1. Roles & Users
    console.log('Seeding roles & users...');
    const superAdminRole = { id: 1 };
    db.prepare('INSERT OR IGNORE INTO users (username, password_hash, role_id) VALUES (?, ?, ?)')
        .run('admin', hashPassword('admin123'), superAdminRole.id);

    // 2. Comprehensive Bilingual Projects
    console.log('Seeding bilingual projects...');
    
    const projects = [
      {
        title_id: 'Perakitan Panel Listrik Smart Home',
        title_en: 'Smart Home Electrical Panel Assembly',
        category: 'Electrical Installation',
        desc_id: 'Perakitan dan pengabelan lengkap panel listrik pintar kustom, mengintegrasikan kontrol IoT untuk pencahayaan dan iklim.',
        desc_en: 'Full assembly and wiring of a custom smart home electrical panel, integrating IoT controls for lighting and climate.',
        image: 'https://images.unsplash.com/photo-1558467523-46113f1fef72?auto=format&fit=crop&q=80&w=800'
      },
      {
        title_id: 'Troubleshooting Sirkuit Industri',
        title_en: 'Industrial Circuit Troubleshooting',
        category: 'Electrical Installation',
        desc_id: 'Pemeliharaan dan perbaikan sirkuit daya industri yang rusak di pabrik manufaktur, memulihkan operasi penuh dalam 4 jam.',
        desc_en: 'Maintenance and repair of a faulty industrial power circuit in a manufacturing plant, restoring full operation within 4 hours.',
        image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800'
      },
      {
        title_id: 'Pemasangan LAN Kantor Korporat',
        title_en: 'Corporate Office LAN Deployment',
        category: 'Networking',
        desc_id: 'Penerapan Jaringan Area Lokal (LAN) berkecepatan tinggi untuk kantor korporat 3 lantai, termasuk pengabelan terstruktur.',
        desc_en: 'Deployment of a high-speed Local Area Network (LAN) for a 3-story corporate office, including structured cabling and server rack setup.',
        image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc51?auto=format&fit=crop&q=80&w=800'
      },
      {
        title_id: 'Optimalisasi AC Sentral Gedung',
        title_en: 'Commercial Central AC Optimization',
        category: 'Cooling (HVAC)',
        desc_id: 'Penyetelan presisi sistem chiller sentral untuk mengurangi biaya operasional sebesar 20% tanpa mengurangi kenyamanan.',
        desc_en: 'Precision tuning of central chiller systems to reduce operational costs by 20% while maintaining optimal climate comfort.',
        image: 'https://images.unsplash.com/photo-1544256718-3bcf237f3974?auto=format&fit=crop&q=80&w=800'
      }
    ];

    for (const proj of projects) {
      db.prepare('INSERT INTO projects (title_id, title_en, category, desc_id, desc_en, image_url, status) VALUES (?, ?, ?, ?, ?, ?, ?)')
        .run(proj.title_id, proj.title_en, proj.category, proj.desc_id, proj.desc_en, proj.image, 'active');
    }

    console.log('Seeding completed successfully with Bilingual content!');
}

seed().catch(err => {
    console.error('Seeding failed:', err);
});
