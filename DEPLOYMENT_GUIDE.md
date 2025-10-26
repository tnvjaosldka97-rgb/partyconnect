# 🚀 PartyConnect 배포 가이드

## 날짜: 2025-10-27

---

## ✅ 배포 준비 완료!

모든 보안 및 안정성 개선이 완료되어 프로덕션 배포가 가능합니다.

---

## 🎯 배포 옵션

### 옵션 1: Render.com (추천! ⭐⭐⭐⭐⭐)

**장점**:
- ✅ 완전 무료 (Free tier)
- ✅ 파일 업로드 지원 (1GB 디스크)
- ✅ 영구 URL 제공
- ✅ 자동 HTTPS
- ✅ 24/7 실행
- ✅ GitHub 자동 배포

**단점**:
- ⚠️ 15분 비활성 시 슬립 모드 (무료 플랜)
- ⚠️ 첫 요청 시 ~30초 웨이크업 시간

#### 배포 방법

1. **Render.com 계정 생성**
   ```
   https://render.com
   → Sign Up with GitHub
   ```

2. **New Web Service 생성**
   ```
   Dashboard → New + → Web Service
   → Connect GitHub repository: tnvjaosldka97-rgb/partyconnect
   ```

3. **설정 입력**
   ```
   Name: partyconnect
   Region: Oregon (US West)
   Branch: main
   Root Directory: (비워두기)
   Runtime: Node
   Build Command: pnpm install && cd client && pnpm exec vite build
   Start Command: node server/index.ts
   Plan: Free
   ```

4. **환경 변수 설정**
   ```
   NODE_ENV = production
   PORT = 10000
   ```

5. **디스크 추가 (이미지 저장용)**
   ```
   Settings → Disks → Add Disk
   Name: uploads
   Mount Path: /opt/render/project/src/uploads
   Size: 1 GB
   ```

6. **배포 시작**
   ```
   Create Web Service 버튼 클릭
   → 자동 빌드 및 배포 시작
   → 5-10분 후 완료
   ```

7. **URL 확인**
   ```
   https://partyconnect.onrender.com
   (또는 Render가 자동 생성한 URL)
   ```

---

### 옵션 2: Railway.app

**장점**:
- ✅ 무료 $5 크레딧/월
- ✅ 슬립 모드 없음
- ✅ 빠른 배포
- ✅ 파일 업로드 지원

**단점**:
- ⚠️ 크레딧 소진 시 중단

#### 배포 방법

1. **Railway 계정 생성**
   ```
   https://railway.app
   → Login with GitHub
   ```

2. **New Project**
   ```
   Dashboard → New Project
   → Deploy from GitHub repo
   → tnvjaosldka97-rgb/partyconnect
   ```

3. **설정 자동 감지**
   ```
   Railway가 자동으로 Node.js 프로젝트 감지
   → 자동 빌드 및 배포
   ```

4. **환경 변수 설정**
   ```
   Settings → Variables
   NODE_ENV = production
   ```

5. **도메인 설정**
   ```
   Settings → Domains
   → Generate Domain
   ```

---

### 옵션 3: Vercel (정적 사이트만)

**주의**: Vercel은 서버리스 환경이라 파일 업로드가 제한적입니다.  
이미지를 Cloudinary 등 외부 서비스에 저장해야 합니다.

**추천하지 않음** ❌

---

### 옵션 4: 자체 서버 (VPS)

**장점**:
- ✅ 완전한 제어
- ✅ 무제한 저장공간
- ✅ 슬립 모드 없음

**단점**:
- ⚠️ 비용 발생 ($5-10/월)
- ⚠️ 서버 관리 필요

#### 추천 VPS
- DigitalOcean ($6/월)
- Linode ($5/월)
- Vultr ($5/월)
- AWS Lightsail ($3.50/월)

---

## 📋 배포 전 체크리스트

### ✅ 코드 준비
- ✅ 모든 보안 수정 완료
- ✅ 빌드 테스트 성공
- ✅ Git 커밋 및 푸시 완료

### ✅ 환경 설정
- ✅ `render.yaml` 생성
- ✅ `.gitignore` 확인
- ✅ `package.json` 스크립트 확인

### ✅ 데이터베이스 (선택)
- ⚠️ 현재는 localStorage 사용
- ⚠️ 프로덕션에서는 MongoDB/PostgreSQL 권장

---

## 🔧 배포 후 설정

### 1. Admin 계정 변경
```typescript
// server/index.ts 또는 환경 변수
ADMIN_USERNAME=your_username
ADMIN_PASSWORD=your_secure_password
```

**현재 기본값**:
- Username: `onlyup1!`
- Password: `onlyup12!`

**⚠️ 프로덕션에서 반드시 변경하세요!**

### 2. 이미지 저장 경로 확인
```typescript
// server/index.ts
const uploadDir = path.join(__dirname, '../uploads');
```

Render에서는 디스크 마운트 경로로 자동 설정됩니다.

### 3. CORS 설정 (필요 시)
```typescript
// server/index.ts
app.use(cors({
  origin: 'https://your-domain.com',
  credentials: true
}));
```

---

## 🧪 배포 후 테스트

### 1. 기본 기능 테스트
```
✅ 메인 페이지 로드
✅ 파티 목록 표시
✅ 파티 상세 페이지
✅ 검색 기능
```

### 2. 호스트 기능 테스트
```
✅ 호스트 신청
✅ 파티 생성
✅ 이미지 업로드
✅ 파티 수정
```

### 3. Admin 기능 테스트
```
✅ Admin 로그인
✅ 호스트 승인
✅ 파티 관리
✅ 성범죄자 확인
```

### 4. 보안 테스트
```
✅ XSS 방어 확인
✅ 입력 검증 확인
✅ 인증 확인
```

---

## 📊 모니터링

### Render 대시보드
```
https://dashboard.render.com
→ 로그 확인
→ 메트릭 확인
→ 에러 추적
```

### 로그 확인
```bash
# Render CLI 설치
npm install -g render-cli

# 로그 스트리밍
render logs -f
```

---

## 🔄 자동 배포 설정

### GitHub Actions (선택)
```yaml
# .github/workflows/deploy.yml
name: Deploy to Render
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Trigger Render Deploy
        run: curl ${{ secrets.RENDER_DEPLOY_HOOK }}
```

### Render 자동 배포
```
Settings → Build & Deploy
→ Auto-Deploy: Yes
→ GitHub에 푸시하면 자동 배포
```

---

## 💰 비용 예상

### Render Free Plan
```
웹 서비스: $0/월
디스크 1GB: $0/월
대역폭: 100GB/월 무료
총 비용: $0/월
```

**제한사항**:
- 15분 비활성 시 슬립
- 월 750시간 실행 (충분함)

### Render Paid Plan (선택)
```
Starter: $7/월
- 슬립 모드 없음
- 더 빠른 성능
- 우선 지원
```

---

## 🎯 추천 배포 방법

### 1단계: Render Free (지금)
```
비용: $0
목적: MVP 테스트, 사용자 피드백
기간: 1-3개월
```

### 2단계: Render Paid (성장 시)
```
비용: $7/월
목적: 안정적인 서비스
조건: 일일 사용자 100명+
```

### 3단계: VPS (확장 시)
```
비용: $10-50/월
목적: 완전한 제어
조건: 일일 사용자 1000명+
```

---

## 🚀 지금 바로 배포하기!

### 빠른 시작 (5분)

1. **Render.com 접속**
   ```
   https://render.com
   ```

2. **GitHub 연결**
   ```
   Sign Up with GitHub
   ```

3. **저장소 선택**
   ```
   New Web Service
   → tnvjaosldka97-rgb/partyconnect
   ```

4. **자동 배포**
   ```
   Create Web Service 클릭
   → 5-10분 대기
   → 완료!
   ```

5. **URL 확인**
   ```
   https://partyconnect.onrender.com
   ```

---

## 📝 배포 후 할 일

### 즉시
1. ✅ Admin 비밀번호 변경
2. ✅ 기본 기능 테스트
3. ✅ 에러 로그 확인

### 1주일 내
1. ⭐ Google Analytics 설정
2. ⭐ 도메인 연결 (선택)
3. ⭐ 백업 설정

### 1개월 내
1. ⭐ 데이터베이스 마이그레이션 (localStorage → MongoDB)
2. ⭐ 이미지 CDN 설정 (Cloudinary)
3. ⭐ 성능 최적화

---

## 🎉 축하합니다!

PartyConnect가 이제 전 세계에서 접속 가능합니다!

**배포 URL**: https://partyconnect.onrender.com (예시)

---

## 📞 문제 발생 시

### Render 지원
```
https://render.com/docs
https://community.render.com
```

### GitHub Issues
```
https://github.com/tnvjaosldka97-rgb/partyconnect/issues
```

---

**작성일**: 2025-10-27  
**작성자**: Manus AI Assistant  
**배포 준비**: ✅ 완료

