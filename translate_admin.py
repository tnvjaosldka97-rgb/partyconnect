#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import re

# Read the file
with open('/home/ubuntu/partyconnect/client/src/pages/Admin.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Korean to English translations
translations = [
    # Toast messages
    ('접근 권한이 없습니다', 'Access Denied'),
    ('관리자 로그인이 필요합니다.', 'Admin login required.'),
    ('호스트 승인 완료!', 'Host Approved!'),
    ('님의 신청이 승인되었고, 파티가 자동으로 생성되었습니다.', "'s application has been approved and a party has been automatically created."),
    ('님의 신청이 승인되었습니다.', "'s application has been approved."),
    ('승인 실패', 'Approval Failed'),
    ('호스트 신청 거부', 'Host Application Rejected'),
    ('님의 신청이 거부되었습니다.', "'s application has been rejected."),
    ('거부 실패', 'Rejection Failed'),
    ('파티 승인 완료!', 'Party Approved!'),
    ('파티가 승인되었습니다.', 'Party has been approved.'),
    ('파티 거부 완료', 'Party Rejected'),
    ('파티가 거부되었습니다.', 'Party has been rejected.'),
    ('로그아웃되었습니다', 'Logged out successfully'),
    
    # UI text
    ('관리자 대시보드', 'Admin Dashboard'),
    ('관리', 'Management'),
    ('호스트 신청, 티켓 구매, 파티 관리를 한 곳에서', 'Manage host applications, tickets, and parties in one place'),
    ('홈으로 돌아가기', 'Back to Home'),
    ('비밀번호 변경', 'Change Password'),
    ('로그아웃', 'Logout'),
    
    # Statistics
    ('총 호스트 신청', 'Total Host Applications'),
    ('승인된 신청', 'Approved Applications'),
    ('거부된 신청', 'Rejected Applications'),
    ('생성된 파티', 'Created Parties'),
    ('승인됨', 'Approved'),
    ('거부됨', 'Rejected'),
    ('대기중', 'Pending'),
    
    # Tabs
    ('호스트 신청', 'Host Applications'),
    ('티켓 구매', 'Ticket Purchases'),
    ('파티 관리', 'Party Management'),
    
    # Empty states
    ('호스트 신청이 없습니다', 'No Host Applications'),
    ('새로운 호스트 신청이 들어오면 여기에 표시됩니다.', 'New host applications will appear here when submitted.'),
    ('파티가 없습니다', 'No Parties'),
    ('생성된 파티가 없습니다.', 'No parties have been created yet.'),
    
    # Form labels
    ('신청일:', 'Applied:'),
    ('이름:', 'Name:'),
    ('이메일:', 'Email:'),
    ('전화번호:', 'Phone:'),
    ('도시:', 'City:'),
    ('공간 타입:', 'Space Type:'),
    ('수용 인원:', 'Capacity:'),
    ('신청일', 'Applied Date'),
    
    # Buttons
    ('승인', 'Approve'),
    ('거부', 'Reject'),
    ('상세보기', 'View Details'),
    ('문서 보기', 'View Documents'),
    
    # Party details
    ('파티 제목:', 'Party Title:'),
    ('날짜:', 'Date:'),
    ('위치:', 'Location:'),
    ('가격:', 'Price:'),
    ('참석자:', 'Attendees:'),
    ('호스트:', 'Host:'),
    ('상태:', 'Status:'),
]

# Apply translations
for korean, english in translations:
    content = content.replace(korean, english)

# Write back
with open('/home/ubuntu/partyconnect/client/src/pages/Admin.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print(f"Translated {len(translations)} phrases in Admin.tsx")

