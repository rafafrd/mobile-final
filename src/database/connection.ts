import mysql, { Pool } from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Valida e retorna uma variável do .env, lançando erro claro se estiver ausente
function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value || value.trim() === '') {
    throw new Error(`[.env] Variável "${key}" não definida ou vazia. Verifique o arquivo .env`);
  }
  return value.trim();
}

class Database {
  private static instance: Database;
  private pool!: Pool;

  private constructor() {}

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
      Database.instance.createPool();
    }
    return Database.instance;
  }

  private createPool(): void {
    const port = Number(requireEnv('DB_PORT'));
    if (isNaN(port) || port <= 0) {
      throw new Error('[.env] DB_PORT deve ser um número válido (ex: 3306)');
    }

    this.pool = mysql.createPool({
      host:            requireEnv('DB_HOST'),
      user:            requireEnv('DB_USER'),
      password:        requireEnv('DB_PASS'),
      database:        requireEnv('DB_DATABASE'),
      port,
      waitForConnections: true,
      connectionLimit: 100,
      queueLimit:      0,
    });
  }

  public getPool(): Pool {
    return this.pool;
  }
}

export const db = Database.getInstance().getPool();
