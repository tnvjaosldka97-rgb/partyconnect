import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import session from "express-session";
import multer from "multer";
import fs from "fs";
import crypto from "crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 파일 업로드 디렉토리 설정
const UPLOAD_DIR = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Multer 설정 (파일 업로드)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    
    // 파일 타입에 따른 prefix
    let prefix = "file";
    if (req.path.includes("idcard")) prefix = "idcard";
    else if (req.path.includes("criminal")) prefix = "criminal";
    else if (req.path.includes("space")) prefix = "space";
    else if (req.path.includes("party") || req.path.includes("image")) prefix = "party";
    
    cb(null, `${prefix}-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPG and PNG files are allowed"));
    }
  },
});

// 관리자 계정 (실제 운영 시 데이터베이스 사용)
let adminCredentials = {
  username: "onlyup1!",
  password: hashPassword("onlyup12!"),
};

// 비밀번호 해싱 함수
function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Session 설정
  app.use(
    session({
      secret: "partyconnect-secret-key-2025",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24시간
      },
    })
  );

  // 업로드된 파일 제공
  app.use("/uploads", express.static(UPLOAD_DIR));

  // ============================================
  // API Routes
  // ============================================

  // 관리자 로그인
  app.post("/api/admin/login", (req, res) => {
    const { username, password } = req.body;

    if (
      username === adminCredentials.username &&
      hashPassword(password) === adminCredentials.password
    ) {
      (req.session as any).isAdmin = true;
      (req.session as any).username = username;
      res.json({ success: true, message: "로그인 성공" });
    } else {
      res.status(401).json({ success: false, message: "아이디 또는 비밀번호가 올바르지 않습니다" });
    }
  });

  // 관리자 로그아웃
  app.post("/api/admin/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        res.status(500).json({ success: false, message: "로그아웃 실패" });
      } else {
        res.json({ success: true, message: "로그아웃 성공" });
      }
    });
  });

  // 관리자 인증 확인
  app.get("/api/admin/check", (req, res) => {
    if ((req.session as any).isAdmin) {
      res.json({ success: true, username: (req.session as any).username });
    } else {
      res.status(401).json({ success: false, message: "인증되지 않음" });
    }
  });

  // 비밀번호 변경
  app.post("/api/admin/change-password", (req, res) => {
    if (!(req.session as any).isAdmin) {
      return res.status(401).json({ success: false, message: "인증되지 않음" });
    }

    const { currentPassword, newPassword } = req.body;

    if (hashPassword(currentPassword) !== adminCredentials.password) {
      return res.status(400).json({ success: false, message: "현재 비밀번호가 올바르지 않습니다" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: "새 비밀번호는 최소 6자 이상이어야 합니다" });
    }

    adminCredentials.password = hashPassword(newPassword);
    res.json({ success: true, message: "비밀번호가 변경되었습니다" });
  });

  // 신분증 업로드
  app.post("/api/upload/idcard", upload.single("idcard"), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "파일이 업로드되지 않았습니다" });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({
      success: true,
      message: "신분증이 업로드되었습니다",
      fileUrl,
      filename: req.file.filename,
    });
  });

  // 범죄기록증명원 업로드
  app.post("/api/upload/criminal-record", upload.single("criminalRecord"), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "파일이 업로드되지 않았습니다" });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({
      success: true,
      message: "범죄기록증명원이 업로드되었습니다",
      fileUrl,
      filename: req.file.filename,
    });
  });

  // 공간 사진 업로드
  app.post("/api/upload/space", upload.single("space"), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "파일이 업로드되지 않았습니다" });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({
      success: true,
      message: "공간 사진이 업로드되었습니다",
      fileUrl,
      filename: req.file.filename,
    });
  });

  // 파티 사진 업로드 (단일)
  app.post("/api/upload/party", upload.single("party"), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "파일이 업로드되지 않았습니다" });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({
      success: true,
      message: "파티 사진이 업로드되었습니다",
      fileUrl,
      filename: req.file.filename,
    });
  });

  // 파티 이미지 업로드 (다중) - CreateParty용
  app.post("/api/upload-image", upload.single("image"), (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ 
          success: false, 
          message: "No file uploaded" 
        });
      }

      const fileUrl = `/uploads/${req.file.filename}`;
      res.json({
        success: true,
        url: fileUrl,
        filename: req.file.filename,
      });
    } catch (error) {
      console.error("Image upload error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to upload image" 
      });
    }
  });

  // 파티 이미지 다중 업로드 - Admin Edit용
  app.post("/api/upload-images", upload.array("images", 10), (req, res) => {
    try {
      if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
        return res.status(400).json({ 
          success: false, 
          message: "No files uploaded" 
        });
      }

      const files = req.files as Express.Multer.File[];
      const urls = files.map(file => `/uploads/${file.filename}`);
      
      res.json({
        success: true,
        urls,
        count: files.length,
      });
    } catch (error) {
      console.error("Images upload error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to upload images" 
      });
    }
  });

  // 호스트 신청 제출
  app.post("/api/host/apply", (req, res) => {
    const application = req.body;
    
    // 실제로는 데이터베이스에 저장
    console.log("호스트 신청 접수:", application);
    
    res.json({
      success: true,
      message: "호스트 신청이 접수되었습니다",
      applicationId: Date.now().toString(),
    });
  });

  // ============================================
  // Static Files & Client-side Routing
  // ============================================

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3002;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);

