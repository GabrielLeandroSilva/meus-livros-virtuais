# Meus Livros Virtuais

Estante virtual dos meus livros — app Android local (sideload, sem Play Store), feito para aprendizado de React Native.

## Stack
- Expo SDK 57 + TypeScript + Expo Router (`src/app/`: `index`, `form`, `book/[id]`, `stats`, `scan`)
- Estilo: NativeWind (Tailwind) + Ionicons (`@expo/vector-icons`) — cor principal azul `primary #2563EB`
- Dados: SQLite local (`expo-sqlite`, arquivo `meus-livros.db`) — persistente no aparelho, sem Auth, sem servidor
- Câmera (`expo-camera`): scan ISBN → Google Books com fallback Open Library; foto da capa → OCR (OCR.space) — **nenhuma foto é armazenada**, só texto
- Splash animada (`expo-splash-screen` + `Animated`): livro com efeito mola + nome do app
- Build: APK local via Gradle para instalar direto no celular

## Paleta
- primary-50 `#EFF6FF`, primary-100 `#DBEAFE`, primary-500 `#2563EB`, primary-600 `#1D4ED8`, primary-700 `#1E40AF`
- status: `quero_ler` cinza, `lendo` azul, `lido` verde

## Modelo `books`
`id, titulo*, autor*, editora, ano, isbn, genero, paginas, status[quero_ler|lendo|lido], nota[0-5], descricao, coverUrl, createdAt, updatedAt`

Camada `src/features/books/repository.ts` espelha uma API REST:
`listBooks(search?, status?) | getBook | createBook | updateBook | deleteBook | getStats`

## Configuração local
```bash
npm install
cp .env.example .env   # opcional: EXPO_PUBLIC_OCR_API_KEY (chave gratuita em https://ocr.space/ocrapi)
npx expo start         # Expo Go no mesmo Wi-Fi, ou --tunnel
```
Pré-requisitos de máquina: JDK 17 (Temurin), Android SDK com `ANDROID_HOME`, Expo Go no celular.

> Builds Gradle exigem o JDK 17 (`org.gradle.java.home` já fixado em `android/gradle.properties`, arquivo local fora do git). JDK 25+ quebra o CMake do `react-native-screens`/`worklets`.

## Gerar o APK release
```powershell
$env:JAVA_HOME = 'C:\Program Files\Eclipse Adoptium\jdk-17.0.20.101-hotspot'
$env:ANDROID_HOME = "$env:USERPROFILE\AppData\Local\Android\Sdk"
cd android
.\gradlew.bat "-Dorg.gradle.java.home=C:\Program Files\Eclipse Adoptium\jdk-17.0.20.101-hotspot" assembleRelease
# saída: android\app\build\outputs\apk\release\app-release.apk
```
Instalar: `adb install -r app-release.apk` (Depuração USB) ou copiar o arquivo e permitir "apps desconhecidos". Release assinado com debug keystore — vale para uso pessoal, não para Play Store.

## Git
- `main`, commits pequenos em português (conventional: `feat:`, `fix:`, `style:`).

## Checklist
- [x] Passo 0: pré-requisitos, paleta, modelo, repo
- [x] Passo 1: scaffold Expo + NativeWind + Router + SQLite
- [x] Passo 2: Design System (Button, Input, CardLivro, Badge, Rating, Search, Empty)
- [x] Passo 3: CRUD + validação Zod + navegação
- [x] Passo 4: filtro por status + estatísticas
- [x] Passo 5: scan ISBN (Google Books + Open Library) + OCR fallback
- [x] Extras: card em formato de livro, header primário, splash animada, ícone do app, fix de teclado/scroll
- [x] Passo 6: APK release instalado no dispositivo
