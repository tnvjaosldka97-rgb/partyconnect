# 성범죄자 등록부 수동 확인 완벽 가이드

**작성일**: 2025년 10월 27일  
**질문**: "이건 우리가 수동으로 확인할 수 있어? 성범죄자 등록부를 들어가서?"

---

## 🎯 핵심 답변

### Q: "성범죄자 등록부를 수동으로 확인할 수 있나요?"

### A: 네! 가능합니다. 하지만 제한사항이 있습니다.

---

## ✅ 가능한 것

### 1. 무료 수동 검색 (100% 가능)

#### 국가 성범죄자 등록부 (NSOPW)
- **URL**: https://www.nsopw.gov
- **비용**: 완전 무료
- **범위**: 전국 50개 주 + DC + 준주
- **검색 방법**: 2가지

#### 방법 A: 이름으로 검색
```
1. https://www.nsopw.gov 접속
2. "Search by Name" 선택
3. First Name + Last Name 입력
4. (선택) County, City, Zip Code 추가
5. State 선택 (또는 All States)
6. "Search" 버튼 클릭
7. 결과 확인
```

**필요 정보**:
- ✅ First Name (필수)
- ✅ Last Name (필수)
- ⭐ County (선택)
- ⭐ City/Town (선택)
- ⭐ Zip Code (선택)
- ⭐ State (선택, 기본값 All)

**결과**:
- 매칭되는 성범죄자 목록
- 사진, 이름, 나이, 주소
- 범죄 유형, 등록 상태

---

#### 방법 B: 주소로 검색
```
1. https://www.nsopw.gov 접속
2. "Search by Address Radius" 선택
3. Address + City/Town 입력
4. State 선택
5. Distance 선택 (1-3 miles)
6. "Search" 버튼 클릭
7. 해당 지역 성범죄자 목록 확인
```

**필요 정보**:
- ✅ Address (필수)
- ✅ City/Town (필수)
- ✅ State (필수)
- ✅ Distance (1-3 miles)

**결과**:
- 해당 반경 내 모든 성범죄자
- 지도에 위치 표시
- 거리 정보 포함

---

### 2. PartyConnect 적용 방법

#### 옵션 A: 호스트 자가 확인 (가장 쉬움)

```typescript
// client/src/pages/BecomeHost.tsx

<div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
  <div className="flex">
    <div className="flex-shrink-0">
      <svg className="h-5 w-5 text-yellow-400">⚠️</svg>
    </div>
    <div className="ml-3">
      <h3 className="text-sm font-medium text-yellow-800">
        Sex Offender Registry Check (Required)
      </h3>
      <div className="mt-2 text-sm text-yellow-700">
        <p>
          For the safety of our community, please verify you are not 
          on the National Sex Offender Registry.
        </p>
        <ol className="list-decimal ml-5 mt-2 space-y-1">
          <li>
            Visit{' '}
            <a 
              href="https://www.nsopw.gov" 
              target="_blank"
              className="underline font-medium"
            >
              NSOPW.gov
            </a>
          </li>
          <li>Search your name</li>
          <li>Confirm you are NOT on the registry</li>
          <li>Check the box below</li>
        </ol>
      </div>
      <div className="mt-4">
        <label className="flex items-start">
          <input 
            type="checkbox" 
            required
            className="mt-1"
          />
          <span className="ml-2 text-sm text-gray-700">
            I confirm that I have checked the National Sex Offender 
            Registry and I am NOT listed on it. I understand that 
            providing false information may result in immediate 
            account termination.
          </span>
        </label>
      </div>
    </div>
  </div>
</div>
```

**장점**:
- ✅ 완전 무료
- ✅ 구현 1시간
- ✅ 법적 문제 없음

**단점**:
- ❌ 자가 신고 (검증 불가)
- ❌ 거짓말 가능
- ❌ 신뢰도 낮음

---

#### 옵션 B: Admin 수동 확인 (중간)

```typescript
// admin/src/pages/HostApprovals.tsx

<div className="bg-white shadow rounded-lg p-6">
  <h3 className="text-lg font-medium mb-4">
    Pending Host: {host.firstName} {host.lastName}
  </h3>
  
  <div className="space-y-4">
    {/* 호스트 정보 */}
    <div>
      <h4 className="font-medium text-sm text-gray-700">Host Information</h4>
      <dl className="mt-2 text-sm">
        <dt className="text-gray-500">Full Name:</dt>
        <dd className="font-medium">{host.firstName} {host.lastName}</dd>
        
        <dt className="text-gray-500 mt-2">Date of Birth:</dt>
        <dd className="font-medium">{host.dateOfBirth}</dd>
        
        <dt className="text-gray-500 mt-2">Address:</dt>
        <dd className="font-medium">
          {host.address}, {host.city}, {host.state} {host.zipCode}
        </dd>
      </dl>
    </div>
    
    {/* 성범죄자 확인 도구 */}
    <div className="bg-blue-50 border border-blue-200 p-4 rounded">
      <h4 className="font-medium text-sm text-blue-900 mb-2">
        Sex Offender Registry Check
      </h4>
      <p className="text-sm text-blue-700 mb-3">
        Manually verify this host is not on the registry:
      </p>
      
      {/* 자동 링크 생성 */}
      <a
        href={`https://www.nsopw.gov/search-public-sex-offender-registries?firstName=${host.firstName}&lastName=${host.lastName}&state=${host.state}`}
        target="_blank"
        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        🔍 Check NSOPW Registry
        <svg className="ml-2 h-4 w-4">↗️</svg>
      </a>
      
      <div className="mt-4">
        <label className="flex items-center">
          <input 
            type="checkbox"
            onChange={(e) => setRegistryChecked(e.target.checked)}
          />
          <span className="ml-2 text-sm">
            I have verified this person is NOT on the sex offender registry
          </span>
        </label>
      </div>
    </div>
    
    {/* 승인/거부 버튼 */}
    <div className="flex space-x-3">
      <button
        disabled={!registryChecked}
        className="px-4 py-2 bg-green-600 text-white rounded disabled:bg-gray-300"
      >
        ✅ Approve Host
      </button>
      <button className="px-4 py-2 bg-red-600 text-white rounded">
        ❌ Reject Host
      </button>
    </div>
  </div>
</div>
```

**작동 방식**:
1. 호스트가 가입 신청
2. Admin 대시보드에 알림
3. Admin이 NSOPW 링크 클릭 (자동으로 이름 입력됨)
4. 새 탭에서 NSOPW 검색 결과 확인
5. 체크박스 클릭 후 승인/거부

**장점**:
- ✅ 완전 무료
- ✅ 실제 검증 가능
- ✅ 법적 문제 없음
- ✅ 신뢰도 높음

**단점**:
- ❌ 수동 작업 필요 (시간 소요)
- ❌ 확장성 낮음 (호스트 많으면 힘듦)
- ❌ 사람 실수 가능

---

#### 옵션 C: 반자동 (이메일 알림)

```typescript
// server/src/services/hostApproval.ts

async function notifyAdminForRegistryCheck(host: Host) {
  const nsopwUrl = `https://www.nsopw.gov/search-public-sex-offender-registries?firstName=${encodeURIComponent(host.firstName)}&lastName=${encodeURIComponent(host.lastName)}&state=${host.state}`;
  
  await sendEmail({
    to: 'admin@partyconnect.com',
    subject: `New Host Approval Required: ${host.firstName} ${host.lastName}`,
    html: `
      <h2>New Host Pending Approval</h2>
      
      <h3>Host Information</h3>
      <ul>
        <li><strong>Name:</strong> ${host.firstName} ${host.lastName}</li>
        <li><strong>DOB:</strong> ${host.dateOfBirth}</li>
        <li><strong>Address:</strong> ${host.address}, ${host.city}, ${host.state}</li>
        <li><strong>Email:</strong> ${host.email}</li>
        <li><strong>Phone:</strong> ${host.phone}</li>
      </ul>
      
      <h3>Action Required</h3>
      <ol>
        <li>
          <a href="${nsopwUrl}" target="_blank" style="color: blue;">
            Click here to check NSOPW Registry
          </a>
        </li>
        <li>Verify the host is NOT on the registry</li>
        <li>
          <a href="https://admin.partyconnect.com/hosts/${host.id}/approve" style="color: green;">
            Approve Host
          </a>
          or
          <a href="https://admin.partyconnect.com/hosts/${host.id}/reject" style="color: red;">
            Reject Host
          </a>
        </li>
      </ol>
      
      <p style="color: gray; font-size: 12px;">
        This check must be completed within 24 hours of application.
      </p>
    `
  });
}
```

**장점**:
- ✅ 무료
- ✅ 이메일로 즉시 알림
- ✅ 클릭 한 번으로 확인
- ✅ 모바일에서도 가능

**단점**:
- ❌ 여전히 수동
- ❌ 24시간 대기 시간

---

## ❌ 불가능한 것

### 1. 자동화 (API 없음)

#### NSOPW API 상태
```
❌ 공식 API 없음
❌ 자동화 도구 없음
❌ 웹훅 없음
❌ Bulk 검색 불가
```

**이유**:
- 개인정보 보호
- 악용 방지
- 수동 확인 강제

---

### 2. 웹 스크래핑 (불법 가능성)

```python
# ❌ 이런 식으로 하면 안 됩니다!
import requests
from bs4 import BeautifulSoup

def check_sex_offender(first_name, last_name):
    # NSOPW Terms of Service 위반
    # 법적 문제 발생 가능
    response = requests.post('https://www.nsopw.gov/search', {
        'firstName': first_name,
        'lastName': last_name
    })
    # ...
```

**문제점**:
- ❌ Terms of Service 위반
- ❌ 법적 소송 가능
- ❌ IP 차단 가능
- ❌ CAPTCHA로 방어됨

---

### 3. 제3자 API (비싸거나 불법)

#### 합법적 서비스
- **Checkr**: $29.99+ (성범죄자 포함)
- **GoodHire**: $39.99+ (성범죄자 포함)
- **Sterling**: $50+ (성범죄자 포함)

#### 불법 서비스
- **BeenVerified**: ❌ FCRA 위반
- **TruthFinder**: ❌ FCRA 위반
- **Instant Checkmate**: ❌ FCRA 위반

---

## 📊 현실적인 접근법

### MVP 단계 (지금 당장)

#### 방법: 호스트 자가 확인
```typescript
<div className="space-y-4">
  <h3>Safety Verification</h3>
  
  {/* 1. ID 업로드 */}
  <div>
    <label>Upload Government ID</label>
    <input type="file" accept="image/*" />
  </div>
  
  {/* 2. 성범죄자 자가 확인 */}
  <div className="bg-yellow-50 p-4 rounded">
    <p className="text-sm mb-2">
      Please verify you are not on the sex offender registry:
    </p>
    <a 
      href="https://www.nsopw.gov" 
      target="_blank"
      className="text-blue-600 underline"
    >
      Check NSOPW Registry →
    </a>
    <label className="flex items-center mt-3">
      <input type="checkbox" required />
      <span className="ml-2 text-sm">
        I confirm I am NOT on the sex offender registry
      </span>
    </label>
  </div>
  
  {/* 3. 이메일 + 전화 인증 */}
  <div>
    <label>Verify Email</label>
    <button>Send Verification Code</button>
  </div>
  
  <div>
    <label>Verify Phone</label>
    <button>Send SMS Code</button>
  </div>
</div>
```

**비용**: $0  
**시간**: 1-2시간 구현  
**효과**: 기본적인 안전장치

---

### 성장 단계 (3개월 후)

#### 방법: Admin 수동 확인
```typescript
// Admin Dashboard
<div className="pending-hosts">
  {pendingHosts.map(host => (
    <div key={host.id} className="host-card">
      <h4>{host.firstName} {host.lastName}</h4>
      
      {/* 자동 링크 */}
      <a 
        href={`https://www.nsopw.gov/search?name=${host.firstName}+${host.lastName}`}
        target="_blank"
      >
        🔍 Check Registry
      </a>
      
      <label>
        <input type="checkbox" />
        Registry checked - NOT found
      </label>
      
      <button onClick={() => approveHost(host.id)}>
        Approve
      </button>
    </div>
  ))}
</div>
```

**비용**: $0  
**시간**: 호스트당 2-3분  
**효과**: 실제 검증

---

### 확장 단계 (6개월 후)

#### 방법: Checkr 자동 배경 조회
```typescript
// Checkr API 통합
import { Checkr } from '@checkr/node';

async function runBackgroundCheck(host: Host) {
  const checkr = new Checkr(process.env.CHECKR_API_KEY);
  
  const candidate = await checkr.candidates.create({
    email: host.email,
    first_name: host.firstName,
    last_name: host.lastName,
    dob: host.dateOfBirth,
    ssn: host.ssn,
    phone: host.phone,
    zipcode: host.zipCode
  });
  
  const report = await checkr.reports.create({
    candidate_id: candidate.id,
    package: 'tasker_standard', // 성범죄자 포함
  });
  
  return report;
}
```

**비용**: $29.99-89.99/건  
**시간**: 자동 (1시간 내)  
**효과**: 완전 자동화 + 법적 준수

---

## 🎯 단계별 추천

### Phase 1: MVP (0-3개월)
```
✅ 호스트 자가 확인
✅ ID + 셀카 업로드
✅ 이메일 + 전화 인증

비용: $0
시간: 호스트당 5분
신뢰도: 낮음 (60%)
```

### Phase 2: 성장 (3-6개월)
```
✅ Admin 수동 확인
✅ NSOPW 직접 검색
✅ 체크리스트 확인

비용: $0
시간: 호스트당 3분
신뢰도: 중간 (80%)
```

### Phase 3: 확장 (6-12개월)
```
✅ Checkr 자동 배경 조회
✅ 성범죄자 자동 확인
✅ 법적 준수 (FCRA)

비용: $34.99/건 (호스트 부담)
시간: 자동 (1시간)
신뢰도: 높음 (95%+)
```

---

## 💻 실제 구현 예시

### 1. 호스트 자가 확인 (무료)

```typescript
// client/src/components/SexOffenderCheck.tsx

import React, { useState } from 'react';

export function SexOffenderCheck({ onComplete }: { onComplete: () => void }) {
  const [checked, setChecked] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">
        Sex Offender Registry Check
      </h2>
      
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
        <p className="text-sm text-yellow-800">
          For the safety of our community, all hosts must verify they 
          are not on the National Sex Offender Registry.
        </p>
      </div>
      
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold mb-2">Step 1: Check the Registry</h3>
          <a
            href="https://www.nsopw.gov"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => setChecked(true)}
          >
            Open NSOPW Registry
            <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
        
        <div>
          <h3 className="font-semibold mb-2">Step 2: Search Your Name</h3>
          <ol className="list-decimal ml-5 text-sm space-y-1">
            <li>Enter your first and last name</li>
            <li>Select your state</li>
            <li>Click "Search"</li>
            <li>Verify you are NOT in the results</li>
          </ol>
        </div>
        
        <div>
          <h3 className="font-semibold mb-2">Step 3: Confirm</h3>
          <label className="flex items-start p-4 border rounded cursor-pointer hover:bg-gray-50">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="mt-1"
              disabled={!checked}
            />
            <span className="ml-3 text-sm">
              I confirm that I have checked the National Sex Offender 
              Public Website (NSOPW) and I am <strong>NOT</strong> listed 
              on the registry. I understand that providing false information 
              may result in immediate account termination and potential 
              legal action.
            </span>
          </label>
        </div>
        
        <button
          onClick={onComplete}
          disabled={!confirmed}
          className="w-full py-3 bg-green-600 text-white rounded font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
```

---

### 2. Admin 수동 확인 (무료)

```typescript
// admin/src/components/HostApprovalCard.tsx

import React, { useState } from 'react';

interface Host {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  email: string;
  phone: string;
}

export function HostApprovalCard({ host }: { host: Host }) {
  const [registryChecked, setRegistryChecked] = useState(false);
  const [idVerified, setIdVerified] = useState(false);

  // NSOPW 검색 URL 자동 생성
  const nsopwUrl = new URL('https://www.nsopw.gov/search-public-sex-offender-registries');
  nsopwUrl.searchParams.set('firstName', host.firstName);
  nsopwUrl.searchParams.set('lastName', host.lastName);
  nsopwUrl.searchParams.set('state', host.state);

  const handleApprove = async () => {
    if (!registryChecked || !idVerified) {
      alert('Please complete all verification steps');
      return;
    }

    await fetch(`/api/admin/hosts/${host.id}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        registryChecked: true,
        idVerified: true,
        approvedBy: 'admin@partyconnect.com',
        approvedAt: new Date().toISOString()
      })
    });
  };

  const handleReject = async () => {
    const reason = prompt('Reason for rejection:');
    if (!reason) return;

    await fetch(`/api/admin/hosts/${host.id}/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason })
    });
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">
            {host.firstName} {host.lastName}
          </h3>
          <p className="text-sm text-gray-600">{host.email}</p>
        </div>
        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
          Pending
        </span>
      </div>

      <dl className="grid grid-cols-2 gap-4 text-sm mb-6">
        <div>
          <dt className="text-gray-500">Date of Birth</dt>
          <dd className="font-medium">{host.dateOfBirth}</dd>
        </div>
        <div>
          <dt className="text-gray-500">Phone</dt>
          <dd className="font-medium">{host.phone}</dd>
        </div>
        <div className="col-span-2">
          <dt className="text-gray-500">Address</dt>
          <dd className="font-medium">
            {host.address}, {host.city}, {host.state} {host.zipCode}
          </dd>
        </div>
      </dl>

      <div className="space-y-4 mb-6">
        {/* ID 확인 */}
        <div className="border rounded p-4">
          <h4 className="font-medium mb-2">1. ID Verification</h4>
          <button className="text-blue-600 hover:underline text-sm">
            View Uploaded ID →
          </button>
          <label className="flex items-center mt-2">
            <input
              type="checkbox"
              checked={idVerified}
              onChange={(e) => setIdVerified(e.target.checked)}
            />
            <span className="ml-2 text-sm">ID verified and matches selfie</span>
          </label>
        </div>

        {/* 성범죄자 확인 */}
        <div className="border rounded p-4 bg-blue-50">
          <h4 className="font-medium mb-2">2. Sex Offender Registry Check</h4>
          <p className="text-sm text-gray-700 mb-3">
            Check if this person is on the National Sex Offender Registry:
          </p>
          <a
            href={nsopwUrl.toString()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
          >
            🔍 Check NSOPW Registry
            <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
          <label className="flex items-center mt-3">
            <input
              type="checkbox"
              checked={registryChecked}
              onChange={(e) => setRegistryChecked(e.target.checked)}
            />
            <span className="ml-2 text-sm">
              I have verified this person is <strong>NOT</strong> on the sex offender registry
            </span>
          </label>
        </div>
      </div>

      <div className="flex space-x-3">
        <button
          onClick={handleApprove}
          disabled={!registryChecked || !idVerified}
          className="flex-1 py-2 bg-green-600 text-white rounded font-medium hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          ✅ Approve Host
        </button>
        <button
          onClick={handleReject}
          className="flex-1 py-2 bg-red-600 text-white rounded font-medium hover:bg-red-700"
        >
          ❌ Reject
        </button>
      </div>
    </div>
  );
}
```

---

## 📋 체크리스트

### 호스트 자가 확인 구현
```
□ SexOffenderCheck 컴포넌트 생성
□ NSOPW 링크 추가
□ 확인 체크박스 추가
□ Terms에 명시
□ 데이터베이스에 기록
□ 테스트
```

### Admin 수동 확인 구현
```
□ HostApprovalCard 컴포넌트 생성
□ NSOPW URL 자동 생성
□ 체크리스트 UI
□ 승인/거부 API
□ 이메일 알림
□ Admin 대시보드 통합
□ 테스트
```

---

## ⚠️ 중요 주의사항

### 법적 제한
```
✅ 참고 정보로 사용 가능
❌ 고용 결정에 직접 사용 불가 (FCRA 위반)
❌ 자동화 불가 (Terms of Service 위반)
❌ 웹 스크래핑 불가 (법적 문제)
```

### 실용적 한계
```
✅ 성범죄만 확인 (다른 범죄 X)
✅ 수동 작업 필요
✅ 확장성 낮음
✅ 호스트 자가 신고 신뢰도 낮음
```

---

## 🎯 최종 권장사항

### 지금 당장 (무료)
```typescript
// 1. 호스트 자가 확인
<SexOffenderCheck onComplete={handleComplete} />

// 2. Terms에 명시
"By signing up, you confirm you are not on the 
National Sex Offender Registry."

// 3. 데이터베이스 기록
await db.hosts.update({
  where: { id: hostId },
  data: { 
    sexOffenderCheckConfirmed: true,
    sexOffenderCheckDate: new Date()
  }
});
```

**비용**: $0  
**시간**: 2시간 구현  
**효과**: 기본 안전장치

---

### 3개월 후 (무료, 더 안전)
```typescript
// Admin 수동 확인 추가
<HostApprovalCard host={host} />

// 이메일 알림
await sendAdminNotification(host);

// 승인 프로세스
await approveHost(host.id, {
  registryChecked: true,
  approvedBy: adminEmail
});
```

**비용**: $0  
**시간**: 호스트당 3분  
**효과**: 실제 검증

---

### 6개월 후 (유료, 완전 자동)
```typescript
// Checkr 통합
const report = await checkr.reports.create({
  candidate_id: candidate.id,
  package: 'tasker_standard'
});

// 자동 승인/거부
if (report.status === 'clear') {
  await approveHost(host.id);
} else {
  await rejectHost(host.id, report.adjudication);
}
```

**비용**: $34.99/건 (호스트 부담)  
**시간**: 자동 (1시간)  
**효과**: 완전 자동화 + 법적 준수

---

## 💡 핵심 메시지

### "네, 수동으로 확인할 수 있습니다!"

1. **무료 방법**:
   - ✅ NSOPW.gov에서 이름 검색
   - ✅ 호스트 자가 확인 또는 Admin 확인
   - ✅ 완전 무료, 2-3분 소요

2. **한계**:
   - ❌ 자동화 불가 (API 없음)
   - ❌ 성범죄만 확인 (다른 범죄 X)
   - ❌ 수동 작업 필요

3. **추천**:
   - ✅ MVP: 호스트 자가 확인 ($0)
   - ✅ 성장기: Admin 수동 확인 ($0)
   - ✅ 확장기: Checkr 자동화 ($35/건)

**지금 당장 호스트 자가 확인 기능을 구현하시겠어요?** 🚀

