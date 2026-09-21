import { z } from 'zod';

export const bookSchema = z.object({
  titulo: z.string().min(1, 'Título é obrigatório'),
  autor: z.string().min(1, 'Autor é obrigatório'),
  editora: z.string().optional().nullable(),
  ano: z.number().int().min(1000).max(2100).optional().nullable(),
  isbn: z.string().optional().nullable(),
  genero: z.string().optional().nullable(),
  paginas: z.number().int().positive().optional().nullable(),
  status: z.enum(['quero_ler', 'lendo', 'lido']).default('quero_ler'),
  nota: z.number().int().min(0).max(5).default(0),
  descricao: z.string().optional().nullable(),
  coverUrl: z.string().url().optional().nullable().or(z.literal('')),
});

export type BookInput = z.infer<typeof bookSchema>;
