# MongoDB Atlas 접속 정보

## 🔐 중요: 이 파일은 안전하게 보관하세요!

---

## MongoDB Atlas 계정

**로그인 URL**: https://cloud.mongodb.com

**계정 정보**:
- **Email**: tnvjaosldka97@gmail.com
- **인증 방법**: Google OAuth (2단계 인증 활성화)

---

## 데이터베이스 연결 정보

**Connection String**:
```
mongodb+srv://tnvjaosldka97_db_user:bmOTIfW6As31STJm@cluster0.jnxrk89.mongodb.net/?appName=Cluster0
```

**분해된 정보**:
- **Protocol**: `mongodb+srv://`
- **Username**: `tnvjaosldka97_db_user`
- **Password**: `bmOTIfW6As31STJm`
- **Host**: `cluster0.jnxrk89.mongodb.net`
- **Database**: `partybear` (기본값)
- **App Name**: `Cluster0`

---

## 클러스터 정보

**Cluster Name**: Cluster0

**Configuration**:
- **Provider**: AWS
- **Region**: Singapore (ap-southeast-1)
- **Tier**: M0 Sandbox (Free)
- **Storage**: 512 MB
- **RAM**: Shared
- **vCPU**: Shared

---

## 데이터베이스 구조

**Database Name**: `partybear`

**Collections**:
1. **hosts** - 호스트 신청 데이터
   - 호스트 프로필
   - 신청 상태 (pending, approved, rejected)
   - 장소 정보

2. **parties** - 파티 데이터
   - 파티 상세 정보
   - 참가자 목록
   - 파티 상태

---

## Vercel 환경 변수

**Environment Variable**:
```
MONGODB_URI=mongodb+srv://tnvjaosldka97_db_user:bmOTIfW6As31STJm@cluster0.jnxrk89.mongodb.net/?appName=Cluster0
```

**설정 위치**:
- Vercel Dashboard → partybear → Settings → Environment Variables

**적용 환경**:
- ✅ Production
- ✅ Preview
- ✅ Development

---

## 빠른 접속 링크

- **MongoDB Atlas Dashboard**: https://cloud.mongodb.com/v2/6908e936b985760610aa733a#/overview
- **Database Collections**: https://cloud.mongodb.com/v2/6908e936b985760610aa733a#/clusters
- **Network Access**: https://cloud.mongodb.com/v2/6908e936b985760610aa733a#/security/network/accessList
- **Database Users**: https://cloud.mongodb.com/v2/6908e936b985760610aa733a#/security/database/users

---

## 보안 설정

**Network Access**:
- IP Whitelist: `0.0.0.0/0` (모든 IP 허용)
- 필요시 특정 IP로 제한 가능

**Database Users**:
- Username: `tnvjaosldka97_db_user`
- Role: Read and write to any database
- Authentication: SCRAM-SHA-256

---

## 사용 예시

### Node.js (MongoDB Driver)
```javascript
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const database = client.db('partybear');
    const collection = database.collection('hosts');
    
    const hosts = await collection.find({}).toArray();
    console.log(hosts);
  } finally {
    await client.close();
  }
}

run().catch(console.error);
```

### MongoDB Compass (GUI Tool)
1. MongoDB Compass 다운로드: https://www.mongodb.com/products/compass
2. Connection String 입력:
   ```
   mongodb+srv://tnvjaosldka97_db_user:bmOTIfW6As31STJm@cluster0.jnxrk89.mongodb.net/
   ```
3. Connect 클릭

### MongoDB Shell
```bash
mongosh "mongodb+srv://cluster0.jnxrk89.mongodb.net/" --username tnvjaosldka97_db_user
```

---

## 주의사항

⚠️ **보안 주의사항**:
1. 이 파일을 Git에 커밋하지 마세요
2. 비밀번호를 공개 저장소에 업로드하지 마세요
3. 환경 변수를 사용하여 안전하게 관리하세요
4. 정기적으로 비밀번호를 변경하세요

⚠️ **무료 티어 제한**:
- 최대 512MB 저장 공간
- 공유 리소스 (RAM, vCPU)
- 최대 100개 동시 연결
- 백업 기능 없음

---

## 문제 해결

### 연결 오류 발생 시
1. Network Access에서 IP가 허용되었는지 확인
2. Connection String이 정확한지 확인
3. 비밀번호에 특수문자가 있으면 URL 인코딩 필요
4. MongoDB Atlas 서비스 상태 확인: https://status.mongodb.com

### 비밀번호 변경 방법
1. MongoDB Atlas 로그인
2. Security → Database Access
3. 사용자 선택 → Edit
4. Password → Edit Password
5. 새 비밀번호 입력 → Update User
6. Vercel 환경 변수 업데이트 필수!

---

*마지막 업데이트: 2025년 11월 3일*

