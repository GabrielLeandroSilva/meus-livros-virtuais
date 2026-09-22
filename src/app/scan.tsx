import { CameraView, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { Button } from '../components/Button';
import { lookupByIsbn, type GoogleBookResult } from '../services/googleBooks';
import { ocrTitleFromBase64 } from '../services/ocr';

type Mode = 'barcode' | 'ocr';

function toFormParams(found: GoogleBookResult): Record<string, string> {
  const params: Record<string, string> = {};
  if (found.titulo) params.titulo = found.titulo;
  if (found.autor) params.autor = found.autor;
  if (found.editora) params.editora = found.editora;
  if (found.ano) params.ano = String(found.ano);
  if (found.isbn) params.isbn = found.isbn;
  if (found.paginas) params.paginas = String(found.paginas);
  if (found.descricao) params.descricao = found.descricao.slice(0, 500);
  return params;
}

export default function Scan() {
  const [permission, requestPermission] = useCameraPermissions();
  const [mode, setMode] = useState<Mode>('barcode');
  const [locked, setLocked] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [lastIsbn, setLastIsbn] = useState('');
  const cameraRef = useRef<CameraView>(null);

  if (!permission) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-6">
        <Text className="text-center text-lg font-bold text-slate-900">Precisamos da câmera</Text>
        <Text className="mt-2 text-center text-sm text-slate-500">
          Para escanear o código de barras (ISBN) ou fotografar a capa do livro.
        </Text>
        <View className="mt-4 w-full">
          <Button title="Permitir câmera" onPress={requestPermission} />
        </View>
      </View>
    );
  }

  async function handleBarcode(data: string) {
    if (locked || busy) return;
    setLocked(true);
    const digits = data.replace(/[^0-9Xx]/g, '');
    if (digits.length < 10) {
      setError('Código inválido. Aponte para o código de barras do ISBN (13 dígitos).');
      setLocked(false);
      return;
    }
    setBusy(true);
    setError('');
    try {
      const found = await lookupByIsbn(digits);
      if (found?.titulo) {
        router.replace({ pathname: '/form', params: toFormParams({ ...found, isbn: digits }) });
      } else {
        setLastIsbn(digits);
        setError('Livro não encontrado no Google Books. Cadastre manualmente.');
      }
    } catch {
      setLastIsbn(digits);
      setError('Sem conexão para buscar o ISBN. Cadastre manualmente.');
    } finally {
      setBusy(false);
    }
  }

  async function handleOcr() {
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      const photo = await cameraRef.current?.takePictureAsync({ base64: true, quality: 0.6 });
      const base64 = photo?.base64;
      if (!base64) throw new Error('photo');
      // Foto descartada após o OCR — fica só no cache temporário, nada vai ao banco.
      const titulo = await ocrTitleFromBase64(base64);
      if (titulo) {
        router.replace({ pathname: '/form', params: { titulo } });
      } else {
        setError('Não consegui ler o texto. Aproxime da capa com boa luz ou digite manualmente.');
      }
    } catch {
      setError('Falha ao processar a foto. Tente de novo ou cadastre manualmente.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <View className="flex-1 bg-black">
      <View className="flex-row gap-2 bg-white px-4 py-3">
        {(['barcode', 'ocr'] as Mode[]).map((m) => (
          <Pressable
            key={m}
            onPress={() => { setMode(m); setError(''); setLocked(false); }}
            className={`rounded-full px-4 py-2 ${mode === m ? 'bg-primary-600' : 'bg-slate-200'}`}
          >
            <Text className={`text-sm font-semibold ${mode === m ? 'text-white' : 'text-slate-700'}`}>
              {m === 'barcode' ? 'Código de barras' : 'Foto da capa (OCR)'}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={{ flex: 1, minHeight: 220 }}>
        <CameraView
          ref={cameraRef}
          style={{ flex: 1 }}
          facing="back"
          barcodeScannerSettings={mode === 'barcode' ? { barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e'] } : undefined}
          onBarcodeScanned={mode === 'barcode' ? ({ data }) => handleBarcode(data) : undefined}
        />
      </View>

      <ScrollView
        style={{ maxHeight: '55%' }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 16, paddingBottom: 32 }}
        className="bg-white"
        keyboardShouldPersistTaps="handled"
      >
        {busy ? (
          <View className="items-center py-2">
            <ActivityIndicator size="large" color="#2563EB" />
            <Text className="mt-2 text-sm text-slate-500">
              {mode === 'barcode' ? 'Buscando livro...' : 'Lendo texto da capa...'}
            </Text>
          </View>
        ) : mode === 'ocr' ? (
          <Button title="📷 Fotografar capa e ler título" onPress={handleOcr} />
        ) : (
          <Text className="text-center text-sm text-slate-500">
            Aponte a câmera para o código de barras do verso do livro
          </Text>
        )}
        {error ? <Text className="mt-2 text-center text-sm text-red-600">{error}</Text> : null}
        {error && lastIsbn ? (
          <View className="mt-2">
            <Button
              title="Cadastrar manualmente"
              variant="secondary"
              onPress={() => router.replace({ pathname: '/form', params: { isbn: lastIsbn } })}
            />
          </View>
        ) : null}
        {error && mode === 'ocr' ? (
          <View className="mt-2">
            <Button title="Cadastrar manualmente" variant="secondary" onPress={() => router.replace('/form')} />
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}
