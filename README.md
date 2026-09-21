# Meus Livros Virtuais

Estante virtual dos meus livros — app Android local (sideload, sem Play Store), para aprendizado de React Native.

## Stack (Passo 0 travado)
- Expo SDK 57 + TypeScript + Expo Router (`src/app/`)
- Estilo: NativeWind (Tailwind) — cor principal azul `primary #2563EB`
- Dados: SQLite local (`expo-sqlite`, arquivo `meus-livros.db`) — persistente no aparelho, sem Auth, sem servidor
- Câmera: ISBN barcode + Google Books, OCR como fallback — **não armazena foto**, só texto (+ `coverUrl` opcional)
- Build: APK debug local para instalar direto no celular

## Paleta
- primary-50 `#EFF6FF`, primary-100 `#DBEAFE`, primary-500 `#2563EB`, primary-600 `#1D4ED8`, primary-700 `#1E40AF`
- status: `quero_ler` cinza, `lendo` azul, `lido` verde

## Modelo `books`
`id, titulo*, autor*, editora, ano, isbn, genero, paginas, status[quero_ler|lendo|lido], nota[0-5], descricao, coverUrl, createdAt, updatedAt`

Camada `src/features/books/repository.ts` espelha a API REST:
`listBooks(search?) | getBook | createBook | updateBook | deleteBook`

## Rodar
```bash
npm install
npx expo start
# com Expo Go no mesmo Wi-Fi, ou:
npx expo run:android
```

## Git
- `main` + `feature/*`, commits pequenos em português ou conventional commits (`feat:`, `fix:`).

## Checklist (resumo)
- [x] Passo 0: pré-requisitos, paleta, modelo, repo
- [x] Passo 1: scaffold Expo + NativeWind + Router + SQLite
- [ ] Passo 2: Design System (Button, Input, CardLivro, Rating)
- [ ] Passo 3-4: CRUD + busca/filtro + estatísticas
- [ ] Passo 5: scan ISBN + OCR fallback
- [ ] Passo 6: APK sideload

## Pré-requisitos pendentes na máquina
- Java 17+ (atual é 1.8 — instalar Temurin 17 ou Android Studio bundled JDK)
- Android SDK (`ANDROID_HOME`) via Android Studio para gerar APK local
- Expo Go no celular para testes sem build
