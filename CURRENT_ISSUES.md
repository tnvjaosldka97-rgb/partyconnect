# PartyConnect - 현재 문제점

## 1. 호스트 신청이 Admin에 안 나타남

**문제**:
- 사용자가 Become a Host에서 신청을 제출했는데
- Admin 페이지에서 "No Host Applications" 표시됨
- localStorage에 저장은 되지만 Admin에서 읽지 못함

**원인 파악**:
- Admin.tsx의 localStorage fallback에서 `loadParties()` 누락 (이미 수정함)
- 하지만 여전히 문제 발생

**해결 방법**:
1. localStorage 저장 확인
2. Admin 페이지 리로드 시 데이터 로드 확인
3. useEffect 의존성 배열 확인

## 2. "전체 캠페인 보기" 버튼 사라짐

**문제**:
- 메인 페이지의 "For You Featured Parties" 섹션에
- "전체 캠페인 보기" 또는 "View All Parties" 버튼이 없음

**확인 필요**:
- Home.tsx에서 버튼이 렌더링되는지 확인
- 파티 목록 아래에 버튼이 있어야 함

## 3. 필터 토글 색상 변경 문제

**상태**:
- 실제로는 작동하는 것 같음 (Popular 클릭 시 보라색으로 바뀜)
- 하지만 사용자가 "안 된다"고 함
- 더 명확한 시각적 피드백 필요

**해결 방법**:
- 색상 대비를 더 강하게
- 애니메이션 추가
- 테두리 두께 증가

