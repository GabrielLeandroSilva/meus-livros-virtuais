export type BookStatus = 'quero_ler' | 'lendo' | 'lido';

export interface Book {
  id?: number;
  titulo: string;
  autor: string;
  editora?: string | null;
  ano?: number | null;
  isbn?: string | null;
  genero?: string | null;
  paginas?: number | null;
  status: BookStatus;
  nota: number;
  descricao?: string | null;
  coverUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
}
