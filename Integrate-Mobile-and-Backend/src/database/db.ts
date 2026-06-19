import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('integracaoSQL.db');

export async function initDatabase(): Promise<void> {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS categoria (
      id_categoria INTEGER PRIMARY KEY AUTOINCREMENT,
      dc_categoria TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS produto (
      id_produto INTEGER PRIMARY KEY AUTOINCREMENT,
      dc_produto TEXT NOT NULL,
      vl_produto REAL NOT NULL,
      id_categoria INTEGER NOT NULL
    );
  `);

  const [{ total }] = await db.getAllAsync<{ total: number }>('SELECT COUNT(*) as total FROM categoria');
  if (total === 0) {
    await seedMockData();
  }
}

async function seedMockData(): Promise<void> {
  await db.runAsync('INSERT INTO categoria (dc_categoria) VALUES (?)', 'Bebidas');
  await db.runAsync('INSERT INTO categoria (dc_categoria) VALUES (?)', 'Alimentos');
  await db.runAsync('INSERT INTO categoria (dc_categoria) VALUES (?)', 'Limpeza');

  await db.runAsync(
    'INSERT INTO produto (dc_produto, vl_produto, id_categoria) VALUES (?, ?, ?)',
    'Refrigerante 2L', 8.5, 1
  );
  await db.runAsync(
    'INSERT INTO produto (dc_produto, vl_produto, id_categoria) VALUES (?, ?, ?)',
    'Suco de Laranja 1L', 6.9, 1
  );
  await db.runAsync(
    'INSERT INTO produto (dc_produto, vl_produto, id_categoria) VALUES (?, ?, ?)',
    'Arroz 5kg', 24.9, 2
  );
  await db.runAsync(
    'INSERT INTO produto (dc_produto, vl_produto, id_categoria) VALUES (?, ?, ?)',
    'Detergente', 3.5, 3
  );
}

export default db;
