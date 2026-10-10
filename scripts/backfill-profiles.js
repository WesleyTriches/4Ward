/**
 * Cria o Profile dos usuários que já existiam ANTES do cadastro automático
 * e ficaram sem perfil (fullName = name do usuário).
 *
 * Uso, na raiz do backend, com o servidor PARADO:
 *   node scripts/backfill-profiles.js            -> só lista o que seria criado
 *   node scripts/backfill-profiles.js --apply    -> grava no banco
 *
 * Faça uma cópia do dev.db antes de usar --apply.
 */
require('dotenv/config');
const Database = require('better-sqlite3');

const apply = process.argv.includes('--apply');
const databaseUrl = process.env.DATABASE_URL ?? 'file:./dev.db';
const file = databaseUrl.replace(/^file:/, '');

const db = new Database(file);

try {
  const missing = db
    .prepare(
      `SELECT u.id, u.name, u.email, u.role
         FROM "User" u
         LEFT JOIN "Profile" p ON p.userId = u.id
        WHERE p.id IS NULL
        ORDER BY u.id`,
    )
    .all();

  if (missing.length === 0) {
    console.log('Todos os usuários já possuem Profile. Nada a fazer.');
    process.exit(0);
  }

  console.log(`Usuários sem Profile (${missing.length}):`);
  for (const user of missing) {
    console.log(`  #${user.id}  ${user.role.padEnd(15)}  ${user.email}  (${user.name})`);
  }

  if (!apply) {
    console.log('\nSimulação: nada foi gravado. Rode com --apply para criar os perfis.');
    process.exit(0);
  }

  // Mesmo formato de data que o Prisma grava: 2026-10-08T12:00:00.000+00:00
  const now = new Date().toISOString().replace('Z', '+00:00');

  const insert = db.prepare(
    `INSERT INTO "Profile" ("userId", "fullName", "createdAt", "updatedAt")
     VALUES (?, ?, ?, ?)`,
  );

  const run = db.transaction((users) => {
    for (const user of users) {
      insert.run(user.id, user.name || user.email, now, now);
    }
  });

  run(missing);
  console.log(`\nOK: ${missing.length} perfil(is) criado(s).`);
} finally {
  db.close();
}
