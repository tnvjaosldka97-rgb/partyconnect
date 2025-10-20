# Vercel 배포 최종 해결 방법

## 문제 요약

**현재 상황:**
- Build Command: `cd client && pnpm install && pnpm build`
- Output Directory: `dist/public`
- 빌드 결과: `../dist/public/` (프로젝트 루트의 `dist/public`)
- 에러: `No Output Directory named "dist" found`

**원인:**
`cd client`로 이동한 후 빌드하면, vite.config.ts의 `outDir: "../dist/public"`에 의해 빌드 결과가 프로젝트 루트의 `dist/public`에 생성됩니다. 하지만 Vercel은 `client` 디렉토리에서 `dist/public`을 찾으려고 합니다.

## 해결 방법

### 옵션 1: vite.config.ts 수정 (추천)

**client/vite.config.ts** 파일에서 `outDir`을 수정:

```typescript
export default defineConfig({
  build: {
    outDir: "dist",  // "../dist/public" → "dist"로 변경
    emptyOutDir: true,
  },
});
```

**Vercel Settings:**
- Build Command: `cd client && pnpm install && pnpm build`
- Output Directory: `client/dist`

### 옵션 2: Root Directory 사용

**Vercel Settings:**
- Root Directory: `client`
- Build Command: `pnpm install && pnpm build`
- Output Directory: `dist`

**client/vite.config.ts:**
```typescript
export default defineConfig({
  build: {
    outDir: "dist",  // "../dist/public" → "dist"로 변경
    emptyOutDir: true,
  },
});
```

### 옵션 3: Output Directory 수정

**Vercel Settings:**
- Build Command: `cd client && pnpm install && pnpm build`
- Output Directory: `dist/public` (프로젝트 루트 기준)

**client/vite.config.ts:**
```typescript
export default defineConfig({
  build: {
    outDir: "../dist/public",  // 그대로 유지
    emptyOutDir: true,
  },
});
```

## 추천 방법

**옵션 1**을 추천합니다:

1. `client/vite.config.ts`에서 `outDir: "dist"`로 변경
2. Vercel Settings:
   - Build Command: `cd client && pnpm install && pnpm build`
   - Output Directory: `client/dist`
3. Git commit & push
4. Vercel이 자동으로 새로운 배포 트리거

## 실행 단계

```bash
# 1. vite.config.ts 수정
cd /home/ubuntu/partyconnect
sed -i 's|outDir: "../dist/public"|outDir: "dist"|' client/vite.config.ts

# 2. Git commit
git add client/vite.config.ts
git commit -m "Fix: Update vite outDir for Vercel deployment"

# 3. GitHub에 푸시 (인증 필요)
# gh auth login 또는 Personal Access Token 사용

# 4. Vercel Settings 업데이트
# Output Directory: client/dist
```

## 결론

가장 간단한 방법은 **vite.config.ts의 outDir을 `dist`로 변경**하고, **Vercel Output Directory를 `client/dist`로 설정**하는 것입니다.

