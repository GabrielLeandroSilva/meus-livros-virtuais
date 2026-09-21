export interface GoogleBookResult {
  titulo: string;
  autor: string;
  editora?: string;
  ano?: number;
  isbn?: string;
  paginas?: number;
  descricao?: string;
  coverUrl?: string;
}

// Busca por ISBN primeiro; fallback por título. Não salva imagem, só URL (leve).
export async function lookupByIsbn(isbn: string): Promise<GoogleBookResult | null> {
  const clean = isbn.replace(/[^0-9Xx]/g, '');
  const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${clean}`);
  if (!res.ok) return null;
  const json = await res.json();
  const item = json.items?.[0];
  if (!item) return null;
  const info = item.volumeInfo ?? {};
  return {
    titulo: info.title ?? '',
    autor: (info.authors ?? []).join(', '),
    editora: info.publisher,
    ano: info.publishedDate ? Number(String(info.publishedDate).slice(0, 4)) || undefined : undefined,
    isbn: clean,
    paginas: info.pageCount,
    descricao: info.description,
    coverUrl: info.imageLinks?.thumbnail?.replace('http://', 'https://'),
  };
}
