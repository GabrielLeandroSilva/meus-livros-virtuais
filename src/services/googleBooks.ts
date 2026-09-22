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

// Busca por ISBN: Google Books primeiro, Open Library como fallback.
// Não salva imagem, só URL (leve).
export async function lookupByIsbn(isbn: string): Promise<GoogleBookResult | null> {
  const clean = isbn.replace(/[^0-9Xx]/g, '');
  try {
    const g = await lookupGoogle(clean);
    if (g?.titulo) return g;
  } catch {
    // sem conexão ou quota excedida no Google → tenta Open Library
  }
  try {
    const ol = await lookupOpenLibrary(clean);
    if (ol?.titulo) return ol;
  } catch {
    // sem conexão também no fallback
  }
  return null;
}

async function lookupGoogle(clean: string): Promise<GoogleBookResult | null> {
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

async function lookupOpenLibrary(clean: string): Promise<GoogleBookResult | null> {
  const res = await fetch(`https://openlibrary.org/isbn/${clean}.json`);
  if (!res.ok) return null;
  const ed = await res.json();
  const authorKeys: string[] = (ed.authors ?? []).map((a: { key: string }) => a.key).filter(Boolean);
  const names = await Promise.all(
    authorKeys.slice(0, 3).map(async (key) => {
      try {
        const r = await fetch(`https://openlibrary.org${key}.json`);
        if (!r.ok) return '';
        return (await r.json()).name ?? '';
      } catch {
        return '';
      }
    }),
  );
  const yearMatch = String(ed.publish_date ?? '').match(/(\d{4})/);
  const coverId = ed.covers?.[0];
  const description = typeof ed.description === 'string' ? ed.description : ed.description?.value;
  return {
    titulo: ed.title ?? '',
    autor: names.filter(Boolean).join(', '),
    editora: ed.publishers?.[0],
    ano: yearMatch ? Number(yearMatch[1]) : undefined,
    isbn: ed.isbn_13?.[0] ?? clean,
    paginas: ed.number_of_pages,
    descricao: description,
    coverUrl: coverId ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg` : undefined,
  };
}
