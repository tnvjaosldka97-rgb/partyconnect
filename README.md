# 🎉 PartyConnect

검증된 사람들과 함께하는 프리미엄 파티 경험

![PartyConnect Banner](https://via.placeholder.com/1200x400/6366f1/ffffff?text=PartyConnect)

## 📖 프로젝트 소개

PartyConnect는 안전하고 검증된 커뮤니티에서 파티를 찾고, 참여하고, 호스팅할 수 있는 프리미엄 파티 플랫폼입니다.

### 주요 기능

- ✅ **검증된 커뮤니티**: 모든 회원은 엄격한 검증 절차를 거칩니다
- 🎯 **스마트 필터링**: 날짜, 가격, 인기도, 평점으로 파티 검색
- 🏠 **호스트 시스템**: 공간을 활용하여 파티를 호스팅하고 수익 창출
- 🔒 **관리자 승인**: 호스트 승인 시스템으로 안전성 보장
- 📱 **반응형 디자인**: 모든 디바이스에서 완벽한 경험

## 🚀 기술 스택

### Frontend
- **React 18** - UI 라이브러리
- **TypeScript** - 타입 안정성
- **Vite** - 빌드 도구
- **Tailwind CSS** - 스타일링
- **Lucide React** - 아이콘

### Backend (준비 중)
- **Node.js** - 런타임
- **Express** - 웹 프레임워크
- **PostgreSQL** - 데이터베이스
- **AWS S3** - 파일 스토리지

## 📦 설치 및 실행

### 필수 요구사항
- Node.js 18.0.0 이상
- pnpm 8.0.0 이상

### 설치

```bash
# 리포지토리 클론
git clone https://github.com/YOUR_USERNAME/partyconnect.git
cd partyconnect

# 의존성 설치
pnpm install
```

### 개발 서버 실행

```bash
# 개발 서버 시작
pnpm dev

# 브라우저에서 열기
# http://localhost:3000
```

### 프로덕션 빌드

```bash
# 빌드
pnpm build

# 빌드 결과 미리보기
pnpm preview
```

## 🎨 주요 페이지

### 홈페이지 (`/`)
- 히어로 섹션
- 추천 파티
- 통계 및 신뢰 지표

### 모든 파티 (`/all-parties`)
- 파티 목록
- 스마트 필터링
- 검색 기능

### 호스트 되기 (`/become-host`)
- 호스트 신청 폼
- 파일 업로드 (공간 사진, 신분증, 범죄기록증명원)
- 자동 검증 시스템

### 파티 등록 (`/create-party`)
- 파티 생성 폼
- 호스트 인증 시스템
- 실시간 유효성 검사

### 관리자 대시보드 (`/admin`)
- 호스트 승인/거부
- 파티 관리
- 통계 대시보드

## 🔧 최근 업데이트

### v1.1.0 (2025-10-18)

#### 버그 수정
- ✅ 인기순/평점순 필터 토글 수정
- ✅ 파일 업로드 Mock 구현
- ✅ 필터 해제 시 원본 순서 복원

#### 새로운 기능
- ✨ 호스트 승인 시스템
- ✨ 관리자 대시보드
- ✨ 이메일 기반 호스트 인증

## 📝 환경 변수

프로젝트 루트에 `.env` 파일을 생성하세요:

```env
# API URL (프로덕션 배포 시)
VITE_API_URL=https://api.partyconnect.com

# AWS S3 (파일 업로드용)
VITE_AWS_BUCKET=your-bucket-name
VITE_AWS_REGION=ap-northeast-2
```

## 🚀 배포

### Vercel (추천)

1. GitHub에 코드 푸시
2. [Vercel](https://vercel.com)에서 프로젝트 import
3. 자동 배포 완료!

```bash
# Vercel CLI 사용
npm i -g vercel
vercel --prod
```

### Netlify

```bash
# Netlify CLI 사용
npm i -g netlify-cli
netlify deploy --prod --dir=dist
```

## 📄 라이선스

MIT License

## 👥 기여

기여는 언제나 환영합니다!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 문의

프로젝트 관련 문의: partyconnect@example.com

---

**Made with ❤️ by PartyConnect Team**

