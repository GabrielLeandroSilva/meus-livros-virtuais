import * as SQLite from 'expo-sqlite';
import { CREATE_BOOKS_TABLE } from './schema';

let db: SQLite.SQLiteDatabase | null = null;

export function getDb(): SQLite.SQLiteDatabase {
  if (!db) db = SQLite.openDatabaseSync('meus-livros.db');
  return db;
}

export async function initDb(): Promise<void> {
  const database = getDb();
  await database.execAsync(CREATE_BOOKS_TABLE);
}
