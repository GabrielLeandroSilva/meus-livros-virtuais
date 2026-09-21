import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { RatingStars } from '../components/RatingStars';
import { bookSchema } from '../features/books/bookSchema';
import { createBook, getBook, updateBook } from '../features/books/repository';
import type { BookStatus } from '../features/books/types';

const STATUS: { value: BookStatus; label: string }[] = [
  { value: 'quero_ler', label: 'Quero ler' },
  { value: 'lendo', label: 'Lendo' },
  { value: 'lido', label: 'Lido' },
];

export default function Form() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const editingId = id ? Number(id) : null;

  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [editora, setEditora] = useState('');
  const [ano, setAno] = useState('');
  const [isbn, setIsbn] = useState('');
  const [genero, setGenero] = useState('');
  const [paginas, setPaginas] = useState('');
  const [status, setStatus] = useState<BookStatus>('quero_ler');
  const [nota, setNota] = useState(0);
  const [descricao, setDescricao] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editingId) {
      (async () => {
        const b = await getBook(editingId);
        if (!b) return;
        setTitulo(b.titulo);
        setAutor(b.autor);
        setEditora(b.editora ?? '');
        setAno(b.ano ? String(b.ano) : '');
        setIsbn(b.isbn ?? '');
        setGenero(b.genero ?? '');
        setPaginas(b.paginas ? String(b.paginas) : '');
        setStatus(b.status);
        setNota(b.nota);
        setDescricao(b.descricao ?? '');
      })();
    }
  }, [editingId]);

  async function onSave() {
    const parsed = bookSchema.safeParse({
      titulo: titulo.trim(),
      autor: autor.trim(),
      editora: editora.trim() || null,
      ano: ano.trim() ? Number(ano) : null,
      isbn: isbn.trim() || null,
      genero: genero.trim() || null,
      paginas: paginas.trim() ? Number(paginas) : null,
      status,
      nota,
      descricao: descricao.trim() || null,
      coverUrl: null,
    });
    if (!parsed.success) {
      const map: Record<string, string> = {};
      for (const issue of parsed.error.issues) map[String(issue.path[0])] = issue.message;
      setErrors(map);
      return;
    }
    setErrors({});
    setSaving(true);
    try {
      if (editingId) await updateBook(editingId, parsed.data);
      else await createBook({ ...parsed.data, status, nota });
      router.back();
    } finally {
      setSaving(false);
    }
  }

  return (
    <ScrollView className="flex-1 bg-white px-4 py-4" keyboardShouldPersistTaps="handled">
      <Text className="mb-4 text-xl font-bold text-slate-900">
        {editingId ? 'Editar livro' : 'Novo livro'}
      </Text>
      <Input label="Título *" value={titulo} onChangeText={setTitulo} placeholder="Ex.: Dom Casmurro" error={errors.titulo} />
      <Input label="Autor *" value={autor} onChangeText={setAutor} placeholder="Ex.: Machado de Assis" error={errors.autor} />
      <View className="flex-row gap-2">
        <View className="flex-1">
          <Input label="Editora" value={editora} onChangeText={setEditora} placeholder="Opcional" />
        </View>
        <View className="w-24">
          <Input label="Ano" value={ano} onChangeText={(t) => setAno(t.replace(/[^0-9]/g, ''))} placeholder="Ex.: 1899" error={errors.ano} />
        </View>
      </View>
      <View className="flex-row gap-2">
        <View className="flex-1">
          <Input label="ISBN" value={isbn} onChangeText={setIsbn} placeholder="Opcional" />
        </View>
        <View className="w-28">
          <Input label="Páginas" value={paginas} onChangeText={(t) => setPaginas(t.replace(/[^0-9]/g, ''))} placeholder="Ex.: 256" error={errors.paginas} />
        </View>
      </View>
      <Input label="Gênero" value={genero} onChangeText={setGenero} placeholder="Ex.: Romance" />
      <Text className="mb-1 text-sm font-medium text-slate-700">Status</Text>
      <View className="mb-3 flex-row gap-2">
        {STATUS.map((s) => (
          <Pressable
            key={s.value}
            onPress={() => setStatus(s.value)}
            className={`rounded-full px-3 py-2 ${status === s.value ? 'bg-primary-600' : 'bg-slate-200'}`}
          >
            <Text className={`text-sm font-semibold ${status === s.value ? 'text-white' : 'text-slate-700'}`}>
              {s.label}
            </Text>
          </Pressable>
        ))}
      </View>
      <Text className="mb-1 text-sm font-medium text-slate-700">Nota</Text>
      <View className="mb-3">
        <RatingStars value={nota} onRate={setNota} />
      </View>
      <Input label="Descrição" value={descricao} onChangeText={setDescricao} placeholder="Opcional" multiline />
      <View className="mb-8 mt-2">
        <Button title={saving ? 'Salvando...' : editingId ? 'Salvar alterações' : 'Cadastrar livro'} onPress={onSave} disabled={saving} />
      </View>
    </ScrollView>
  );
}
