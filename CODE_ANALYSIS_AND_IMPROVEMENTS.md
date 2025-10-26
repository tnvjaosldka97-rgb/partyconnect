# PartyConnect 코드 분석 및 개선 보고서

## 날짜: 2025-10-27
## 분석자: Manus AI Assistant

---

## 📋 분석 개요

**목적**: 전체 코드베이스의 잠재적 오류, 보안 취약점, 성능 문제, 개선 가능 영역 식별

**분석 범위**:
- CreateParty.tsx
- Admin.tsx
- HostApprovals.tsx
- storage.ts
- 전체 아키텍처

---

## 🚨 심각도 분류

- 🔴 **Critical**: 즉시 수정 필요 (보안, 데이터 손실)
- 🟠 **High**: 빠른 시일 내 수정 권장 (기능 오류, 성능)
- 🟡 **Medium**: 개선 권장 (UX, 코드 품질)
- 🟢 **Low**: 선택적 개선 (최적화, 리팩토링)

---

## 🔴 Critical Issues (즉시 수정 필요)

### 1. localStorage 용량 제한 문제 (CreateParty.tsx)

**위치**: `CreateParty.tsx:104-113`

**문제**:
```typescript
// Base64로 이미지를 localStorage에 저장
for (let i = 0; i < files.length; i++) {
  const base64 = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(files[i]);
  });
  uploadedUrls.push(base64);
}
```

**위험**:
- localStorage는 5-10MB 제한
- Base64 인코딩은 파일 크기를 33% 증가
- 10MB 이미지 → 13.3MB Base64 → localStorage 초과
- 여러 이미지 업로드 시 QuotaExceededError 발생

**영향**:
- 사용자가 이미지를 업로드했는데 저장 실패
- 파티 생성 실패
- 데이터 손실

**해결 방법**:

#### 옵션 A: 서버 업로드 (추천 ⭐⭐⭐⭐⭐)
```typescript
const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = e.target.files;
  if (!files || files.length === 0) return;

  setIsUploading(true);

  try {
    const uploadedUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const formData = new FormData();
      formData.append("image", files[i]);

      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        uploadedUrls.push(data.url); // S3 URL 또는 서버 URL
      } else {
        throw new Error(`Failed to upload ${files[i].name}`);
      }
    }

    setPartyImages((prev) => [...prev, ...uploadedUrls]);
    toast.success(`${uploadedUrls.length} image(s) uploaded successfully!`);
  } catch (error) {
    console.error("Image upload error:", error);
    toast.error("Failed to upload images");
  } finally {
    setIsUploading(false);
  }
};
```

#### 옵션 B: IndexedDB 사용
```typescript
// IndexedDB는 50MB+ 저장 가능
import { openDB } from 'idb';

const db = await openDB('PartyConnectDB', 1, {
  upgrade(db) {
    db.createObjectStore('images');
  },
});

// 저장
await db.put('images', base64Data, imageId);

// 불러오기
const imageData = await db.get('images', imageId);
```

#### 옵션 C: 이미지 압축
```typescript
import imageCompression from 'browser-image-compression';

const compressImage = async (file: File) => {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  };
  
  try {
    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  } catch (error) {
    console.error('Compression error:', error);
    return file;
  }
};
```

**우선순위**: 🔴 Critical - 즉시 수정 필요

---

### 2. XSS (Cross-Site Scripting) 취약점

**위치**: 여러 곳에서 사용자 입력을 직접 렌더링

**문제**:
```typescript
// CreateParty.tsx:172
host: currentHost.name, // 사용자 입력을 직접 사용

// Admin.tsx에서 직접 렌더링
<div>{application.name}</div>
<div>{application.intro}</div>
```

**위험**:
```javascript
// 악의적인 사용자가 이름에 스크립트 삽입
name: "<script>alert('XSS')</script>"
name: "<img src=x onerror='alert(1)'>"
```

**해결 방법**:

#### A. 입력 검증 및 새니타이제이션
```typescript
import DOMPurify from 'dompurify';

// 입력 시 검증
const sanitizeInput = (input: string): string => {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [], // 모든 HTML 태그 제거
    ALLOWED_ATTR: [],
  });
};

// 사용
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  
  const partyData = {
    title: sanitizeInput(formData.title.trim()),
    description: sanitizeInput(formData.description.trim()),
    host: sanitizeInput(currentHost.name),
    // ...
  };
};
```

#### B. 입력 패턴 검증
```typescript
const validateName = (name: string): boolean => {
  // 영문, 한글, 공백만 허용
  const namePattern = /^[a-zA-Z가-힣\s]+$/;
  return namePattern.test(name);
};

const validateEmail = (email: string): boolean => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
};

const validatePhone = (phone: string): boolean => {
  const phonePattern = /^[0-9-+() ]+$/;
  return phonePattern.test(phone);
};
```

#### C. React의 자동 이스케이핑 활용
```typescript
// React는 기본적으로 이스케이프하지만, dangerouslySetInnerHTML 사용 시 주의
// ❌ 위험
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// ✅ 안전
<div>{userInput}</div>
```

**우선순위**: 🔴 Critical - 즉시 수정 필요

---

### 3. localStorage 데이터 무결성 문제

**위치**: `storage.ts`

**문제**:
```typescript
export function getHostApplications(): HostApplication[] {
  const data = localStorage.getItem("hostApplications");
  return data ? JSON.parse(data) : [];
}
```

**위험**:
- localStorage 데이터가 손상되면 JSON.parse 실패
- 사용자가 직접 localStorage 수정 가능
- 데이터 타입 검증 없음

**해결 방법**:

```typescript
import { z } from 'zod';

// Zod 스키마 정의
const HostApplicationSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string(),
  city: z.string(),
  status: z.enum(["pending", "approved", "rejected"]),
  // ... 나머지 필드
});

const HostApplicationsSchema = z.array(HostApplicationSchema);

export function getHostApplications(): HostApplication[] {
  try {
    const data = localStorage.getItem("hostApplications");
    if (!data) return [];
    
    const parsed = JSON.parse(data);
    
    // 데이터 검증
    const validated = HostApplicationsSchema.safeParse(parsed);
    
    if (validated.success) {
      return validated.data;
    } else {
      console.error("Invalid data format:", validated.error);
      // 손상된 데이터 백업 후 초기화
      localStorage.setItem("hostApplications_backup", data);
      localStorage.removeItem("hostApplications");
      return [];
    }
  } catch (error) {
    console.error("Failed to load host applications:", error);
    return [];
  }
}

export function saveHostApplication(application: HostApplication): boolean {
  try {
    // 저장 전 검증
    const validated = HostApplicationSchema.safeParse(application);
    
    if (!validated.success) {
      console.error("Invalid application data:", validated.error);
      return false;
    }
    
    const applications = getHostApplications();
    applications.push(validated.data);
    localStorage.setItem("hostApplications", JSON.stringify(applications));
    return true;
  } catch (error) {
    console.error("Failed to save host application:", error);
    return false;
  }
}
```

**우선순위**: 🔴 Critical - 즉시 수정 필요

---

## 🟠 High Priority Issues (빠른 수정 권장)

### 4. 에러 처리 불완전 (CreateParty.tsx)

**위치**: `CreateParty.tsx:79-127`

**문제**:
```typescript
const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  // ...
  try {
    // ...
  } catch (error) {
    console.error("Party images upload error:", error);
    toast.error("Upload Failed");
  } finally {
    setIsUploading(false);
  }
};
```

**문제점**:
- 부분 업로드 실패 시 처리 없음 (3개 중 1개 실패)
- 네트워크 에러와 파일 에러 구분 없음
- 재시도 메커니즘 없음

**해결 방법**:

```typescript
const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = e.target.files;
  if (!files || files.length === 0) return;

  setIsUploading(true);

  try {
    const uploadedUrls: string[] = [];
    const failedFiles: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      try {
        // 개별 파일 업로드 시도
        const formData = new FormData();
        formData.append("image", file);

        const response = await fetch("/api/upload-image", {
          method: "POST",
          body: formData,
          signal: AbortSignal.timeout(30000), // 30초 타임아웃
        });

        if (response.ok) {
          const data = await response.json();
          uploadedUrls.push(data.url);
        } else {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Upload failed: ${response.status}`);
        }
      } catch (fileError) {
        console.error(`Failed to upload ${file.name}:`, fileError);
        failedFiles.push(file.name);
        
        // 네트워크 에러인 경우 재시도
        if (fileError instanceof TypeError && fileError.message.includes('fetch')) {
          // 재시도 로직
          const retryResult = await retryUpload(file, 2); // 2번 재시도
          if (retryResult) {
            uploadedUrls.push(retryResult);
            failedFiles.pop(); // 성공하면 실패 목록에서 제거
          }
        }
      }
    }

    // 결과 처리
    if (uploadedUrls.length > 0) {
      setPartyImages((prev) => [...prev, ...uploadedUrls]);
    }

    // 사용자에게 결과 알림
    if (failedFiles.length === 0) {
      toast.success(`${uploadedUrls.length} image(s) uploaded successfully!`);
    } else if (uploadedUrls.length > 0) {
      toast.warning(`${uploadedUrls.length} uploaded, ${failedFiles.length} failed`, {
        description: `Failed files: ${failedFiles.join(", ")}`,
      });
    } else {
      toast.error("All uploads failed", {
        description: "Please check your connection and try again.",
      });
    }
  } catch (error) {
    console.error("Image upload error:", error);
    toast.error("Upload failed", {
      description: error instanceof Error ? error.message : "Unknown error",
    });
  } finally {
    setIsUploading(false);
    // input 초기화 (같은 파일 재업로드 가능하도록)
    e.target.value = "";
  }
};

// 재시도 헬퍼 함수
const retryUpload = async (file: File, maxRetries: number): Promise<string | null> => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1))); // 지수 백오프
      
      const formData = new FormData();
      formData.append("image", file);
      
      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.url;
      }
    } catch (error) {
      console.error(`Retry ${i + 1} failed:`, error);
    }
  }
  return null;
};
```

**우선순위**: 🟠 High - 빠른 수정 권장

---

### 5. 타입 안정성 문제

**위치**: 여러 곳

**문제**:
```typescript
// CreateParty.tsx:36
const [currentHost, setCurrentHost] = useState<any>(null);

// Admin.tsx에서도 any 사용
const [editingParty, setEditingParty] = useState<Party | null>(null);
```

**해결 방법**:

```typescript
// types.ts 파일 생성
export interface Host {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  status: "pending" | "approved" | "rejected";
  appliedAt: string;
  approvedAt?: string;
}

// CreateParty.tsx
const [currentHost, setCurrentHost] = useState<Host | null>(null);

// 타입 가드 함수
function isHost(obj: unknown): obj is Host {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'name' in obj &&
    'email' in obj
  );
}

// 사용
const host = getHostByEmail(hostEmail);
if (isHost(host)) {
  setCurrentHost(host);
} else {
  console.error("Invalid host data");
}
```

**우선순위**: 🟠 High - 빠른 수정 권장

---

### 6. 인증 로직 중복 및 불일치

**위치**: `Admin.tsx`, `HostApprovals.tsx`

**문제**:
```typescript
// Admin.tsx:59-97
const checkAuth = async () => {
  try {
    const response = await fetch("/api/auth/check");
    // ...
  } catch (error) {
    const isLoggedIn = localStorage.getItem("adminLoggedIn") === "true";
    // ...
  }
};

// HostApprovals.tsx:30-69 (거의 동일한 코드)
const checkAuth = async () => {
  const isLoggedIn = localStorage.getItem("adminLoggedIn") === "true";
  // ...
};
```

**문제점**:
- 인증 로직이 두 파일에 중복
- 순서가 다름 (Admin은 API 먼저, HostApprovals는 localStorage 먼저)
- 유지보수 어려움

**해결 방법**:

```typescript
// lib/auth.ts 생성
export interface AuthResult {
  authenticated: boolean;
  user?: {
    id: string;
    username: string;
    role: string;
  };
}

export async function checkAdminAuth(): Promise<AuthResult> {
  // 1. localStorage 먼저 확인 (빠름)
  const isLoggedIn = localStorage.getItem("adminLoggedIn") === "true";
  
  if (!isLoggedIn) {
    return { authenticated: false };
  }
  
  // 2. 서버 검증 (선택적)
  try {
    const response = await fetch("/api/auth/check", {
      credentials: "include",
    });
    
    if (response.ok) {
      const data = await response.json();
      return {
        authenticated: true,
        user: data.user,
      };
    }
  } catch (error) {
    console.error("Auth check failed:", error);
  }
  
  // localStorage는 true지만 서버 검증 실패
  // 개발 환경에서는 허용, 프로덕션에서는 로그아웃
  if (import.meta.env.DEV) {
    return { authenticated: true };
  } else {
    localStorage.removeItem("adminLoggedIn");
    return { authenticated: false };
  }
}

export function logout() {
  localStorage.removeItem("adminLoggedIn");
  // 서버에도 로그아웃 요청
  fetch("/api/auth/logout", { method: "POST" }).catch(console.error);
}

// 사용
// Admin.tsx
import { checkAdminAuth } from "@/lib/auth";

useEffect(() => {
  const checkAuth = async () => {
    const result = await checkAdminAuth();
    
    if (result.authenticated) {
      setIsAuthenticated(true);
      loadHostApplications();
      loadParties();
    } else {
      toast.error("Access Denied");
      setLocation("/admin/login");
    }
    
    setIsLoading(false);
  };
  
  checkAuth();
}, [setLocation]);
```

**우선순위**: 🟠 High - 빠른 수정 권장

---

## 🟡 Medium Priority Issues (개선 권장)

### 7. 날짜/시간 검증 부족

**위치**: `CreateParty.tsx:129-160`

**문제**:
```typescript
const handleSubmit = (e: React.FormEvent) => {
  // 날짜 형식만 확인, 과거 날짜 허용
  if (!formData.date) {
    toast.error("Please select a date");
    return;
  }
};
```

**해결 방법**:

```typescript
import { parseISO, isBefore, isAfter, addDays } from 'date-fns';

const validatePartyDateTime = (date: string, time: string): { valid: boolean; error?: string } => {
  try {
    const partyDateTime = parseISO(`${date}T${time}`);
    const now = new Date();
    const maxDate = addDays(now, 365); // 1년 후까지만 허용
    
    // 과거 날짜 체크
    if (isBefore(partyDateTime, now)) {
      return {
        valid: false,
        error: "Party date and time must be in the future",
      };
    }
    
    // 너무 먼 미래 체크
    if (isAfter(partyDateTime, maxDate)) {
      return {
        valid: false,
        error: "Party date cannot be more than 1 year in the future",
      };
    }
    
    // 최소 24시간 전에 생성
    const minDate = addDays(now, 1);
    if (isBefore(partyDateTime, minDate)) {
      return {
        valid: false,
        error: "Party must be created at least 24 hours in advance",
      };
    }
    
    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      error: "Invalid date or time format",
    };
  }
};

// 사용
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  
  // 날짜/시간 검증
  const dateTimeValidation = validatePartyDateTime(formData.date, formData.time);
  if (!dateTimeValidation.valid) {
    toast.error("Invalid Date/Time", {
      description: dateTimeValidation.error,
    });
    return;
  }
  
  // ...
};
```

**우선순위**: 🟡 Medium - 개선 권장

---

### 8. 가격 및 수용 인원 검증 부족

**위치**: `CreateParty.tsx:147-152`

**문제**:
```typescript
if (!formData.maxAttendees || parseInt(formData.maxAttendees) <= 0) {
  toast.error("Please enter max attendees");
  return;
}
```

**문제점**:
- 최대값 제한 없음 (999999 입력 가능)
- 가격 검증 없음 (음수, 너무 큰 값)
- 현실적이지 않은 값 허용

**해결 방법**:

```typescript
const validateCapacity = (capacity: string): { valid: boolean; error?: string } => {
  const num = parseInt(capacity);
  
  if (isNaN(num)) {
    return { valid: false, error: "Capacity must be a number" };
  }
  
  if (num < 5) {
    return { valid: false, error: "Minimum capacity is 5 people" };
  }
  
  if (num > 500) {
    return { valid: false, error: "Maximum capacity is 500 people" };
  }
  
  return { valid: true };
};

const validatePrice = (price: string): { valid: boolean; error?: string } => {
  const num = parseInt(price);
  
  if (isNaN(num)) {
    return { valid: false, error: "Price must be a number" };
  }
  
  if (num < 0) {
    return { valid: false, error: "Price cannot be negative" };
  }
  
  if (num > 1000000) {
    return { valid: false, error: "Maximum price is $1,000,000" };
  }
  
  return { valid: true };
};

// Input 컴포넌트에 제한 추가
<Input
  id="maxAttendees"
  type="number"
  min="5"
  max="500"
  value={formData.maxAttendees}
  onChange={(e) => {
    const value = Math.min(500, Math.max(5, parseInt(e.target.value) || 0));
    updateField("maxAttendees", value.toString());
  }}
  placeholder="20"
  required
/>

<Input
  id="price"
  type="number"
  min="0"
  max="1000000"
  step="1000"
  value={formData.price}
  onChange={(e) => {
    const value = Math.min(1000000, Math.max(0, parseInt(e.target.value) || 0));
    updateField("price", value.toString());
  }}
  placeholder="50000"
  required
/>
```

**우선순위**: 🟡 Medium - 개선 권장

---

### 9. 이미지 개수 제한 없음

**위치**: `CreateParty.tsx:79`

**문제**:
- 사용자가 무제한 이미지 업로드 가능
- localStorage 초과 위험
- 페이지 성능 저하

**해결 방법**:

```typescript
const MAX_IMAGES = 10;

const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = e.target.files;
  if (!files || files.length === 0) return;

  // 현재 + 새로운 이미지 개수 체크
  if (partyImages.length + files.length > MAX_IMAGES) {
    toast.error("Too Many Images", {
      description: `Maximum ${MAX_IMAGES} images allowed. You can upload ${MAX_IMAGES - partyImages.length} more.`,
    });
    return;
  }

  // ...
};

// UI에 표시
<Label htmlFor="images">
  Click to Upload Images ({partyImages.length}/{MAX_IMAGES})
</Label>

// input 비활성화
<input
  id="images"
  type="file"
  accept="image/jpeg,image/jpg,image/png"
  multiple
  onChange={handleImageUpload}
  disabled={partyImages.length >= MAX_IMAGES}
  className="hidden"
/>
```

**우선순위**: 🟡 Medium - 개선 권장

---

### 10. NSOPW URL 생성 로직 개선

**위치**: `HostApprovals.tsx:94-100`

**문제**:
```typescript
const getNSOPWSearchUrl = (application: HostApplication) => {
  const firstName = encodeURIComponent(application.name.split(" ")[0] || "");
  const lastName = encodeURIComponent(application.name.split(" ").slice(1).join(" ") || "");
  const state = encodeURIComponent(application.city.split(",").pop()?.trim() || "TX");
  
  return `https://www.nsopw.gov/search?firstName=${firstName}&lastName=${lastName}&state=${state}`;
};
```

**문제점**:
- 이름이 한 단어면 lastName이 빈 문자열
- city 형식이 다르면 state 추출 실패
- 한글 이름 처리 안 됨

**해결 방법**:

```typescript
const getNSOPWSearchUrl = (application: HostApplication): string => {
  // 이름 파싱
  const nameParts = application.name.trim().split(/\s+/);
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ") || "";
  
  // 주 추출 (여러 형식 지원)
  let state = "TX"; // 기본값
  
  // "Austin, TX" 형식
  if (application.city.includes(",")) {
    const parts = application.city.split(",");
    const statePart = parts[parts.length - 1].trim();
    if (statePart.length === 2) {
      state = statePart;
    }
  }
  // "Texas" 형식 (전체 이름 → 약자 변환)
  else {
    const stateMap: Record<string, string> = {
      "Texas": "TX",
      "California": "CA",
      "New York": "NY",
      "Florida": "FL",
      // ... 나머지 주
    };
    state = stateMap[application.city] || "TX";
  }
  
  // URL 생성
  const params = new URLSearchParams({
    firstName: firstName,
    lastName: lastName,
    state: state,
  });
  
  return `https://www.nsopw.gov/search?${params.toString()}`;
};

// 더 나은 방법: 주소 필드 분리
interface HostApplication {
  // ...
  city: string;
  state: string; // 별도 필드로 분리
  zipCode?: string;
}
```

**우선순위**: 🟡 Medium - 개선 권장

---

## 🟢 Low Priority Issues (선택적 개선)

### 11. 성능 최적화 - 메모이제이션

**위치**: 여러 컴포넌트

**문제**:
- 불필요한 리렌더링
- 함수 재생성

**해결 방법**:

```typescript
import { useMemo, useCallback } from 'react';

// CreateParty.tsx
const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
  // ...
}, [partyImages]); // 의존성 배열

const handleRemoveImage = useCallback((index: number) => {
  setPartyImages((prev) => prev.filter((_, i) => i !== index));
  toast.success("Image removed");
}, []);

// 계산 비용이 높은 값 메모이제이션
const sortedParties = useMemo(() => {
  return parties.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}, [parties]);

// 컴포넌트 메모이제이션
const PartyCard = React.memo(({ party }: { party: Party }) => {
  return (
    <div>
      {/* ... */}
    </div>
  );
});
```

**우선순위**: 🟢 Low - 선택적 개선

---

### 12. 코드 중복 제거

**위치**: 여러 곳

**문제**:
- 유사한 코드 반복
- 유지보수 어려움

**해결 방법**:

```typescript
// lib/validation.ts 생성
export const validators = {
  email: (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  },
  
  phone: (phone: string): boolean => {
    return /^[0-9-+() ]+$/.test(phone);
  },
  
  name: (name: string): boolean => {
    return /^[a-zA-Z가-힣\s]+$/.test(name) && name.length >= 2;
  },
  
  required: (value: string): boolean => {
    return value.trim().length > 0;
  },
};

// lib/toast.ts 생성
export const toastMessages = {
  success: {
    hostApproved: (name: string) => ({
      title: "Host Approved!",
      description: `${name}'s application has been approved.`,
    }),
    partyCreated: () => ({
      title: "Party Created Successfully!",
      description: "Your party will be reviewed and published soon.",
    }),
  },
  
  error: {
    authRequired: () => ({
      title: "Access Denied",
      description: "Admin login required.",
    }),
    invalidInput: (field: string) => ({
      title: "Invalid Input",
      description: `Please check your ${field}.`,
    }),
  },
};

// 사용
import { validators } from '@/lib/validation';
import { toastMessages } from '@/lib/toast';

if (!validators.email(email)) {
  const msg = toastMessages.error.invalidInput("email");
  toast.error(msg.title, { description: msg.description });
}
```

**우선순위**: 🟢 Low - 선택적 개선

---

### 13. 접근성 개선

**위치**: 여러 컴포넌트

**문제**:
- 키보드 네비게이션 부족
- 스크린 리더 지원 부족
- ARIA 속성 누락

**해결 방법**:

```typescript
// 이미지 업로드 영역
<label
  htmlFor="images"
  className="..."
  role="button"
  tabIndex={0}
  aria-label="Upload party images"
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      document.getElementById('images')?.click();
    }
  }}
>
  {/* ... */}
</label>

// 삭제 버튼
<button
  type="button"
  onClick={() => handleRemoveImage(index)}
  className="..."
  aria-label={`Remove image ${index + 1}`}
>
  <X className="w-4 h-4" />
</button>

// 로딩 상태
{isUploading && (
  <div role="status" aria-live="polite">
    <span className="sr-only">Uploading images...</span>
    <div className="spinner" />
  </div>
)}

// 폼 에러
<Input
  id="email"
  type="email"
  aria-invalid={emailError ? "true" : "false"}
  aria-describedby={emailError ? "email-error" : undefined}
/>
{emailError && (
  <p id="email-error" className="text-red-500 text-sm" role="alert">
    {emailError}
  </p>
)}
```

**우선순위**: 🟢 Low - 선택적 개선

---

## 📊 우선순위별 요약

### 🔴 Critical (즉시 수정)
1. ✅ localStorage 용량 제한 → 서버 업로드로 전환
2. ✅ XSS 취약점 → 입력 검증 및 새니타이제이션
3. ✅ localStorage 데이터 무결성 → Zod 검증

### 🟠 High (빠른 수정)
4. ✅ 에러 처리 개선 → 부분 실패, 재시도 로직
5. ✅ 타입 안정성 → any 제거, 타입 가드
6. ✅ 인증 로직 통합 → 중복 제거

### 🟡 Medium (개선 권장)
7. ✅ 날짜/시간 검증 → 과거 날짜 방지
8. ✅ 가격/수용인원 검증 → 현실적인 범위
9. ✅ 이미지 개수 제한 → 최대 10개
10. ✅ NSOPW URL 개선 → 다양한 형식 지원

### 🟢 Low (선택적)
11. ✅ 성능 최적화 → 메모이제이션
12. ✅ 코드 중복 제거 → 유틸리티 함수
13. ✅ 접근성 개선 → ARIA, 키보드

---

## 🎯 권장 수정 순서

### Phase 1: Critical Issues (1-2일)
1. 서버 이미지 업로드 API 구현
2. XSS 방어 (DOMPurify 설치)
3. Zod 데이터 검증

### Phase 2: High Priority (2-3일)
4. 에러 처리 개선
5. 타입 안정성 강화
6. 인증 로직 통합

### Phase 3: Medium Priority (3-5일)
7-10. 검증 로직 강화

### Phase 4: Low Priority (선택적)
11-13. 최적화 및 리팩토링

---

## 📝 구현 체크리스트

### Critical
- [ ] 서버 이미지 업로드 API 구현
- [ ] DOMPurify 설치 및 적용
- [ ] Zod 스키마 정의 및 검증

### High
- [ ] 에러 처리 개선 (재시도, 부분 실패)
- [ ] any 타입 제거
- [ ] auth.ts 생성 및 통합

### Medium
- [ ] 날짜/시간 검증 추가
- [ ] 가격/수용인원 범위 제한
- [ ] 이미지 개수 제한 (10개)
- [ ] NSOPW URL 생성 개선

### Low
- [ ] useMemo/useCallback 적용
- [ ] 유틸리티 함수 분리
- [ ] ARIA 속성 추가

---

## 🎉 결론

**현재 코드 상태**: 기능적으로는 작동하지만 프로덕션 환경에는 위험

**주요 문제**:
1. 🔴 localStorage 용량 초과 위험
2. 🔴 XSS 보안 취약점
3. 🔴 데이터 무결성 문제

**권장 사항**:
- Critical 이슈는 **즉시 수정** 필요
- High 이슈는 **1주일 내** 수정 권장
- Medium/Low는 **시간 여유 있을 때** 개선

**예상 작업 시간**:
- Critical: 1-2일
- High: 2-3일
- Medium: 3-5일
- Low: 선택적

**총 예상 시간**: 6-10일 (Critical + High만 하면 3-5일)

---

**작성일**: 2025-10-27  
**분석자**: Manus AI Assistant  
**분석 범위**: 전체 코드베이스  
**심각도**: 🔴 Critical 이슈 3개 발견

