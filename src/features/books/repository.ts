import { getDb } from '../../db/client';
import type { Book, BookStatus } from './types';

// API local: consultar, cadastrar, atualizar, deletar (espelha rotas REST)
export async function listBooks(search?: string, status?: BookStatus | 'todos'): Promise<Book[]> {
  const db = getDb();
  const clauses: string[] = [];
  const params: (string)[] = [];
  if (search?.trim()) {
    clauses.push(`(titulo LIKE ? OR autor LIKE ?)`);
    params.push(`%${search}%`, `%${search}%`);
  }
  if (status && status !== 'todos') {
    clauses.push(`status = ?`);
    params.push(status);
  }
  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
  return db.getAllAsync<Book>(`SELECT * FROM books ${where} ORDER BY updatedAt DESC`, params);
}

export interface BookStats {
  total: number;
  queroLer: number;
  lendo: number;
  lidos: number;
  pctLidos: number;
  mediaNotas: number;
  totalPaginas: number;
}

export async function getStats(): Promise<BookStats> {
  const db = getDb();
  const rows = await db.getAllAsync<{ status: BookStatus; n: number }>(
    `SELECT status, COUNT(*) as n FROM books GROUP BY status`,
  );
  const count = (s: BookStatus) => rows.find((r) => r.status === s)?.n ?? 0;
  const agg = await db.getFirstAsync<{ total: number; media: number | null; paginas: number | null }>(
    `SELECT COUNT(*) as total, AVG(nota) as media, SUM(paginas) as paginas FROM books`,
  );
  const total = agg?.total ?? 0;
  const lidos = count('lido');
  return {
    total,
    queroLer: count('quero_ler'),
    lendo: count('lendo'),
    lidos,
    pctLidos: total ? Math.round((lidos / total) * 100) : 0,
    mediaNotas: agg?.media ? Math.round(agg.media * 10) / 10 : 0,
    totalPaginas: agg?.paginas ?? 0,
  };
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
