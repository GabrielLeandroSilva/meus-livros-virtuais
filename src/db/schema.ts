export const CREATE_BOOKS_TABLE = `
CREATE TABLE IF NOT EXISTS books (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  titulo TEXT NOT NULL,
  autor TEXT NOT NULL,
  editora TEXT,
  ano INTEGER,
  isbn TEXT,
  genero TEXT,
  paginas INTEGER,
  status TEXT NOT NULL DEFAULT 'quero_ler',
  nota INTEGER DEFAULT 0,
  descricao TEXT,
  coverUrl TEXT,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_books_titulo ON books(titulo);
CREATE INDEX IF NOT EXISTS idx_books_autor ON books(autor);
`;
