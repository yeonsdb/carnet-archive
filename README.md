# CARNET-ARCHIVE

Figma `카르넷_구현` (NlZVjrzU6j4MDxumEG3bq7) → React 19 + Vite + TypeScript (HOME / SHOP / PRODUCT).

## 실행

```bash
npm install
npm run dev          # http://localhost:5173
```

## 빌드 / 확인

```bash
npm run build        # 타입 검사 + dist/ 생성
npm run preview      # dist/ 를 http://localhost:4173 으로 확인
```

검사 스크립트(로컬 Microsoft Edge 사용): `npm run check:home`, `check:shop`, `check:product`, `check:site`.
다른 주소를 검사하려면 `BASE_URL` 환경변수를 지정합니다 (예: `BASE_URL=http://localhost:4173`).

## 배포 (Vercel)

설정은 `vercel.json`에 있습니다 (Vite 빌드, `dist/` 출력, SPA 경로 → `index.html`, 정적 파일 캐시).
`public/images`의 WebP가 저장소에 포함되어 있으므로 원본 PNG(`assets-src/`, 저장소 제외)는 배포에 필요 없습니다.

- CLI: `npx vercel` (첫 실행 시 로그인 → 프로젝트 연결) → 미리보기 URL, `npx vercel --prod` → 운영 배포
- GitHub: 저장소를 GitHub에 올린 뒤 Vercel에서 Import → 설정 변경 없이 Deploy

Node 20 이상이 필요합니다.

## 이미지

원본 PNG는 `assets-src/`(git 제외)에 두고 `npm run images`로 `public/images`의 WebP를 다시 만듭니다.
