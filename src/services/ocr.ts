// OCR fallback: envia a foto para o OCR.space e devolve o melhor candidato a título.
// A foto é processada em memória e descartada — nada é salvo no banco.
// Troque DEMO_KEY por uma chave gratuita em https://ocr.space/ocrapi para uso frequente.
const OCR_API_KEY = 'helloworld';

export async function ocrTitleFromBase64(base64: string): Promise<string | null> {
  const body =
    `apikey=${OCR_API_KEY}` +
    `&base64Image=data:image/jpg;base64,${encodeURIComponent(base64)}` +
    `&language=por&OCREngine=2&scale=true`;
  const res = await fetch('https://api.ocr.space/parse/image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  if (!res.ok) return null;
  const json = await res.json();
  const text: string = json?.ParsedResults?.[0]?.ParsedText ?? '';
  const lines = text
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 2);
  if (!lines.length) return null;
  return lines.sort((a, b) => b.length - a.length)[0];
}
