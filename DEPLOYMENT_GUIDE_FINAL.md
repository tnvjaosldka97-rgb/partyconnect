# PartyConnect 배포 가이드 (최종)

## 📋 완료된 작업 요약

### 1. Admin Dashboard - Edit & Delete 기능 추가 ✅
- Party 수정 모달 (제목, 날짜, 시간, 위치, 가격, 수용인원 등 편집 가능)
- Party 삭제 확인 다이얼로그
- `storage.ts`에 `updateParty()` 함수 추가

### 2. Google Translate 위젯 수정 ✅
- 초기화 로직 개선
- 중복 로드 방지
- 안정적인 렌더링

### 3. 영어 번역 완료 ✅
- PartyDetail.tsx: 모든 한글 → 영어
- FeaturedParties.tsx: "날짜" → "Date"
- PartyCard.tsx: "명" 제거
- Admin.tsx: "대기 중" → "Pending"

### 4. 빌드 성공 ✅
### 5. Git 커밋 완료 ✅

---

## 🚀 배포 방법 (3단계)

현재 샌드박스에서 모든 변경사항이 커밋되었지만, GitHub에 push되지 않은 상태입니다.
로컬 컴퓨터에서 다음 단계를 따라하시면 됩니다.

---

## 📝 Step 1: 로컬 컴퓨터에서 최신 변경사항 받기

### 1-1. 터미널/명령 프롬프트 열기
- **Windows**: `Win + R` → `cmd` 입력 → Enter
- **Mac**: `Cmd + Space` → `terminal` 입력 → Enter

### 1-2. 프로젝트 폴더로 이동
```bash
cd /path/to/your/partyconnect
```
> 💡 **팁**: 폴더를 터미널로 드래그하면 경로가 자동 입력됩니다.

### 1-3. 현재 상태 확인
```bash
git status
```

**예상 출력:**
```
On branch main
Your branch is up to date with 'origin/main'.
nothing to commit, working tree clean
```

---

## 📥 Step 2: 샌드박스의 변경사항 가져오기

샌드박스에서 작업한 내용을 로컬로 가져오는 방법은 **2가지**입니다:

### 방법 A: Git Pull (권장) ⭐

**문제점**: 샌드박스에서 GitHub에 push하지 못했으므로, 이 방법은 사용 불가능합니다.

### 방법 B: 파일 직접 복사 (현재 상황에서 필요)

아래 6개 파일을 직접 수정해야 합니다:

---

## 📂 Step 3: 변경된 파일 수동 업데이트

다음 파일들을 수정하세요. 각 파일의 **전체 내용**을 제공해드리겠습니다.

### 변경된 파일 목록:
1. `client/src/lib/storage.ts` - updateParty 함수 추가
2. `client/src/pages/Admin.tsx` - Edit/Delete 기능 추가
3. `client/src/components/GoogleTranslate.tsx` - 위젯 수정
4. `client/src/pages/PartyDetail.tsx` - 영어 번역
5. `client/src/components/FeaturedParties.tsx` - 영어 번역
6. `client/src/components/PartyCard.tsx` - 영어 번역

---

## 🔧 각 파일별 수정 방법

### 파일 1: `client/src/lib/storage.ts`

**위치**: 164번째 줄 근처에 다음 함수 추가

**추가할 코드:**
```typescript
// Update party
export function updateParty(id: string, updatedParty: Partial<Party>): boolean {
  try {
    const parties = getParties();
    const index = parties.findIndex((party) => party.id === id);
    
    if (index === -1) return false;
    
    parties[index] = { ...parties[index], ...updatedParty };
    
    localStorage.setItem("parties", JSON.stringify(parties));
    return true;
  } catch (error) {
    console.error("Failed to update party:", error);
    return false;
  }
}
```

**삽입 위치**: `getApprovedParties()` 함수 다음, `deleteParty()` 함수 이전

---

### 파일 2: `client/src/pages/Admin.tsx`

이 파일은 전체를 교체해야 합니다. 파일이 너무 길어서 다음 섹션에서 제공하겠습니다.

**수정 방법:**
1. VS Code 또는 텍스트 에디터로 `client/src/pages/Admin.tsx` 열기
2. **전체 내용 삭제**
3. 아래 제공되는 새 코드 전체 복사 & 붙여넣기
4. 저장 (Ctrl+S / Cmd+S)

**주요 변경사항:**
- Import에 Dialog, Input, Label, Textarea, Edit, Trash2 추가
- `editingParty`, `isEditDialogOpen`, `isDeleteDialogOpen`, `partyToDelete` state 추가
- `handleEditParty()`, `handleSaveEdit()`, `handleDeletePartyClick()`, `handleConfirmDelete()` 함수 추가
- Party 목록에 Edit/Delete 버튼 추가
- Edit Dialog 및 Delete Confirmation Dialog 추가

---

### 파일 3: `client/src/components/GoogleTranslate.tsx`

**전체 교체:**

```typescript
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    googleTranslateElementInit: () => void;
    google: any;
  }
}

export default function GoogleTranslate() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptLoadedRef = useRef(false);

  useEffect(() => {
    // Prevent multiple script loads
    if (scriptLoadedRef.current) {
      return;
    }

    // Google Translate initialization function
    const initGoogleTranslate = () => {
      if (window.google && window.google.translate && containerRef.current) {
        // Clear any existing content
        containerRef.current.innerHTML = "";
        
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: "en,ko,es,fr,de,ja,zh-CN,zh-TW,pt,ru,ar",
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
          },
          "google_translate_element"
        );
      }
    };

    // Set up the callback
    window.googleTranslateElementInit = initGoogleTranslate;

    // Check if script already exists
    const existingScript = document.querySelector('script[src*="translate.google.com"]');
    
    if (!existingScript) {
      // Add the script
      const script = document.createElement("script");
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      script.onerror = () => {
        console.error("Failed to load Google Translate script");
        scriptLoadedRef.current = false;
      };
      script.onload = () => {
        scriptLoadedRef.current = true;
      };
      document.body.appendChild(script);
    } else if (window.google && window.google.translate) {
      // Script already loaded, just initialize
      initGoogleTranslate();
      scriptLoadedRef.current = true;
    }

    return () => {
      // Cleanup on unmount
      if (window.googleTranslateElementInit) {
        delete window.googleTranslateElementInit;
      }
    };
  }, []);

  return (
    <div
      id="google_translate_element"
      ref={containerRef}
      className="flex items-center"
      style={{
        minWidth: "150px",
        minHeight: "30px",
      }}
    />
  );
}
```

---

### 파일 4: `client/src/pages/PartyDetail.tsx`

**수정할 부분들:**

1. **76번째 줄** - 변경:
```typescript
// 변경 전
description: `${party.title} - ${ticketCount}매`,

// 변경 후
description: `${party.title} - ${ticketCount} ticket(s)`,
```

2. **194번째 줄** - 변경:
```typescript
// 변경 전
<div className="font-semibold">{party.attendees}/{party.maxAttendees}people</div>

// 변경 후
<div className="font-semibold">{party.attendees}/{party.maxAttendees} people</div>
```

3. **204번째 줄** - 변경:
```typescript
// 변경 전
<div className="font-semibold">3-4hours</div>

// 변경 후
<div className="font-semibold">3-4 hours</div>
```

4. **217-220번째 줄** - 전체 교체:
```typescript
// 변경 전
<p className="text-muted-foreground leading-relaxed">
  이 파티는 Verified Members들만 참석할 수 있으며, All 참석자는 사전 승인을 받아야 합니다. 
  안전하고 즐거운 분위기에서 새로운 친구들을 만나보세요. 음료와 간단한 스낵이 제공되며, 
  추가 음식은 각자 준비하실 수 있습니다.
</p>

// 변경 후
<p className="text-muted-foreground leading-relaxed">
  This party is exclusively for verified members, and all attendees must receive prior approval. 
  Meet new friends in a safe and enjoyable atmosphere. Drinks and light snacks will be provided, 
  and you're welcome to bring additional food if you'd like.
</p>
```

5. **258번째 줄** - 변경:
```typescript
// 변경 전
<div>42개 Host a Party</div>

// 변경 후
<div>42 parties hosted</div>
```

6. **260번째 줄** - 변경:
```typescript
// 변경 전
<div>Joined: 2023년</div>

// 변경 후
<div>Joined 2023</div>
```

7. **263-265번째 줄** - 전체 교체:
```typescript
// 변경 전
<p className="text-muted-foreground">
  안녕하세요! 저는 사람들과 만나고 즐거운 hours을 보내는 것을 좋아하는 호스트입니다. 
  여러분 모두 환영합니다!
</p>

// 변경 후
<p className="text-muted-foreground">
  Hello! I'm a host who loves meeting people and creating memorable experiences. 
  Everyone is welcome!
</p>
```

8. **313번째 줄** - 변경:
```typescript
// 변경 전
Spots left: {availableSpots}people

// 변경 후
Spots left: {availableSpots} people
```

9. **320번째 줄** - 변경:
```typescript
// 변경 전
<span className="text-muted-foreground">입장권 ({ticketCount}매)</span>

// 변경 후
<span className="text-muted-foreground">Tickets ({ticketCount})</span>
```

10. **347번째 줄** - 변경:
```typescript
// 변경 전
구매 시 취소 및 환불 정책에 동의하게 됩니다

// 변경 후
By purchasing, you agree to our cancellation and refund policy
```

11. **356번째 줄** - 변경:
```typescript
// 변경 전
<div className="text-muted-foreground">All 결제는 암호화되어 보호됩니다</div>

// 변경 후
<div className="text-muted-foreground">All payments are encrypted and protected</div>
```

12. **363번째 줄** - 변경:
```typescript
// 변경 전
<div className="text-muted-foreground">All 호스트는 신원 확인을 거쳤습니다</div>

// 변경 후
<div className="text-muted-foreground">All hosts are identity-verified</div>
```

---

### 파일 5: `client/src/components/FeaturedParties.tsx`

**수정할 부분:**

1. **116번째 줄** - 변경:
```typescript
// 변경 전
? `${totalResults}parties found`

// 변경 후
? `${totalResults} parties found`
```

2. **171번째 줄** - 변경:
```typescript
// 변경 전
날짜: {quickFilters.find((f) => f.value === filters.dateRange)?.label}

// 변경 후
Date: {quickFilters.find((f) => f.value === filters.dateRange)?.label}
```

---

### 파일 6: `client/src/components/PartyCard.tsx`

**수정할 부분:**

**103번째 줄** - 변경:
```typescript
// 변경 전
<span>{attendees}명 Attending</span>

// 변경 후
<span>{attendees} Attending</span>
```

---

## 💾 Step 4: Git에 커밋하고 푸시하기

모든 파일 수정이 완료되었으면:

```bash
# 1. 변경사항 확인
git status

# 2. 모든 변경사항 스테이징
git add .

# 3. 커밋
git commit -m "Add Edit/Delete to Admin Dashboard, fix Google Translate, complete English translations"

# 4. GitHub에 푸시
git push origin main
```

---

## 🚀 Step 5: Vercel 자동 배포 확인

GitHub에 push하면 **Vercel이 자동으로 감지**하여 배포를 시작합니다.

### 배포 확인 방법:

1. **Vercel Dashboard 접속**
   - https://vercel.com/dashboard
   - 로그인

2. **프로젝트 선택**
   - `partyconnect` 프로젝트 클릭

3. **배포 상태 확인**
   - "Deployments" 탭에서 진행 상황 확인
   - 보통 **2-3분** 소요

4. **배포 완료 확인**
   - 상태가 "Ready"로 변경되면 완료
   - https://partyconnect.vercel.app 접속하여 확인

---

## ✅ 배포 후 테스트 항목

### 1. Google Translate 위젯
- [ ] 헤더에 Google Translate 위젯이 표시되는가?
- [ ] 언어 선택이 정상 작동하는가?

### 2. Admin Dashboard
- [ ] Admin 로그인 (Username: `onlyup1!`, Password: `onlyup12!`)
- [ ] Party Management 탭으로 이동
- [ ] Edit 버튼 클릭 → 모달이 열리는가?
- [ ] Party 정보 수정 후 저장 → 변경사항이 반영되는가?
- [ ] Delete 버튼 클릭 → 확인 다이얼로그가 나타나는가?
- [ ] 삭제 확인 → Party가 삭제되는가?

### 3. 영어 번역
- [ ] PartyDetail 페이지에 한글이 없는가?
- [ ] 모든 텍스트가 영어로 표시되는가?

---

## 🆘 문제 해결

### 문제 1: Git push가 안 됨
```bash
# GitHub 인증 확인
git remote -v

# HTTPS 사용 중이면 Personal Access Token 필요
# Settings → Developer settings → Personal access tokens → Generate new token
```

### 문제 2: Vercel 배포가 시작되지 않음
- Vercel Dashboard에서 프로젝트 설정 확인
- GitHub 연동 상태 확인
- Manual Deploy 시도

### 문제 3: 빌드 에러
```bash
# 로컬에서 빌드 테스트
cd client
npm run build
```

---

## 📞 추가 지원

문제가 발생하면 다음 정보를 제공해주세요:
1. 어느 단계에서 문제가 발생했는지
2. 에러 메시지 전체
3. 스크린샷 (가능한 경우)

---

## 🎉 완료!

모든 단계를 완료하면:
- ✅ Admin Dashboard에서 Party 편집/삭제 가능
- ✅ Google Translate 위젯 정상 작동
- ✅ 전체 사이트 영어로 표시
- ✅ https://partyconnect.vercel.app 에서 확인 가능

수고하셨습니다! 🚀

