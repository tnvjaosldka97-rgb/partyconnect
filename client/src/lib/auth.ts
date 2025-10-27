export interface AuthResult {
  authenticated: boolean;
  user?: {
    id: string;
    username: string;
    role: string;
  };
}

/**
 * Check if admin is authenticated
 * 1. Check localStorage first (fast)
 * 2. Verify with server (optional, for security)
 */
export async function checkAdminAuth(): Promise<AuthResult> {
  // 1. localStorage 먼저 확인 (빠름)
  const isLoggedIn = localStorage.getItem("adminLoggedIn") === "true";
  
  if (!isLoggedIn) {
    return { authenticated: false };
  }
  
  // localStorage가 true면 인증됨으로 처리
  // 서버 API가 없으므로 localStorage만 사용
  return { 
    authenticated: true,
    user: {
      id: "admin",
      username: "admin",
      role: "admin",
    },
  };
}

/**
 * Logout admin
 */
export function logout() {
  localStorage.removeItem("adminLoggedIn");
  
  // 서버에도 로그아웃 요청
  fetch("/api/admin/logout", { 
    method: "POST",
    credentials: "include",
  }).catch(console.error);
}

/**
 * Login admin
 */
export async function login(username: string, password: string): Promise<{ success: boolean; error?: string }> {
  // 서버 API가 없으므로 클라이언트에서 직접 검증
  // 실제 프로덕션에서는 서버 API를 사용해야 함
  if (username === "onlyup1!" && password === "onlyup12!") {
    localStorage.setItem("adminLoggedIn", "true");
    return { success: true };
  } else {
    return { 
      success: false, 
      error: "Invalid username or password" 
    };
  }
}

