import { getDb } from '../../db/client';
import type { Book } from './types';

// API local: consultar, cadastrar, atualizar, deletar (espelha rotas REST)
export async function listBooks(search?: string): Promise<Book[]> {
  const db = getDb();
  if (search?.trim()) {
    return db.getAllAsync<Book>(
      `SELECT * FROM books WHERE titulo LIKE ? OR autor LIKE ? ORDER BY updatedAt DESC`,
      [`%${search}%`, `%${search}%`],
    );
  }
  return db.getAllAsync<Book>(`SELECT * FROM books ORDER BY updatedAt DESC`);
}

export async function getBook(id: number): Promise<Book | null> {
  const db = getDb();
  return db.getFirstAsync<Book>(`SELECT * FROM books WHERE id = ?`, [id]);
}

export async function createBook(book: Book): Promise<number> {
  const db = getDb();
  const now = new Date().toISOString();
  const res = await db.runAsync(
    `INSERT INTO books (titulo, autor, editora, ano, isbn, genero, paginas, status, nota, descricao, coverUrl, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      book.titulo,
      book.autor,
      book.editora ?? null,
      book.ano ?? null,
      book.isbn ?? null,
      book.genero ?? null,
      book.paginas ?? null,
      book.status,
      book.nota ?? 0,
      book.descricao ?? null,
      book.coverUrl ?? null,
      now,
      now,
    ],
  );
  return res.lastInsertRowId;
}

export async function updateBook(id: number, book: Partial<Book>): Promise<void> {
  const db = getDb();
  const current = await getBook(id);
  if (!current) throw new Error('Livro não encontrado');
  const merged: Book = { ...current, ...book, id };
  await db.runAsync(
    `UPDATE books SET titulo=?, autor=?, editora=?, ano=?, isbn=?, genero=?, paginas=?, status=?, nota=?, descricao=?, coverUrl=?, updatedAt=? WHERE id=?`,
    [
      merged.titulo,
      merged.autor,
      merged.editora ?? null,
      merged.ano ?? null,
      merged.isbn ?? null,
      merged.genero ?? null,
      merged.paginas ?? null,
      merged.status,
      merged.nota ?? 0,
      merged.descricao ?? null,
      merged.coverUrl ?? null,
      new Date().toISOString(),
      id,
    ],
  );
}

export async function deleteBook(id: number): Promise<void> {
  const db = getDb();
  await db.runAsync(`DELETE FROM books WHERE id = ?`, [id]);
}
