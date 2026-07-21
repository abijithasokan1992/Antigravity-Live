import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function safeSeed() {
  console.log('?? Starting Safe Legacy Data Migration...');

  // 1. Sync Users from root JSON
  const userFilePath = path.join(process.cwd(), 'accounts_user.json');
  if (fs.existsSync(userFilePath)) {
    const rawUsers = JSON.parse(fs.readFileSync(userFilePath, 'utf-8'));
    console.log(`?? Found ${rawUsers.length} user records...`);

    for (const u of rawUsers) {
      const fields = u.fields || u;
      const computedName = `${fields.first_name || ''} ${fields.last_name || ''}`.trim() || fields.username || 'User';
      const emailVal = fields.email || `user_${u.pk || u.id}@streamvista.internal`;

      await prisma.user.upsert({
        where: { id: String(u.pk || u.id) },
        update: {
          email: emailVal,
          fullName: computedName,
        },
        create: {
          id: String(u.pk || u.id),
          email: emailVal,
          fullName: computedName,
        },
      });
    }
    console.log('? Users synced cleanly.');
  } else {
    console.log('?? accounts_user.json not found in root, skipping users...');
  }

  // 2. Sync Films/Projects from root JSON
  const filmFilePath = path.join(process.cwd(), 'films_film.json');
  if (fs.existsSync(filmFilePath)) {
    const rawFilms = JSON.parse(fs.readFileSync(filmFilePath, 'utf-8'));
    console.log(`?? Found ${rawFilms.length} film records...`);

    for (const f of rawFilms) {
      const fields = f.fields || f;
      const filmId = String(f.pk || f.id);
      const code = fields.code || fields.slug || `FILM-${filmId}`;
      const prodType = fields.production_type || fields.type || 'FEATURE_FILM';
      const director = fields.director || fields.director_name || null;

      await prisma.project.upsert({
        where: { id: filmId },
        update: {
          title: fields.title || fields.name || 'Untitled Project',
          directorName: director,
        },
        create: {
          id: filmId,
          title: fields.title || fields.name || 'Untitled Project',
          internalCode: code,
          productionType: prodType,
          directorName: director,
          organization: {
            connectOrCreate: {
              where: { id: 'streamvista-opc' },
              create: {
                id: 'streamvista-opc',
                legalName: 'StreamVista OPC Pvt Ltd',
                displayName: 'StreamVista',
                organizationType: 'PRODUCTION_HOUSE',
              },
            },
          },
        },
      });
    }
    console.log('? Film catalog synced cleanly.');
  } else {
    console.log('?? films_film.json not found in root, skipping films...');
  }

  console.log('?? Seeding pipeline complete.');
}

safeSeed()
  .catch((e) => {
    console.error('? Migration Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
