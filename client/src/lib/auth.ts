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
  
  // 2. 서버 검증 (선택적)
  try {
    const response = await fetch("/api/admin/check", {
      credentials: "include",
    });
    
    if (response.ok) {
      const data = await response.json();
      return {
        authenticated: true,
        user: {
          id: data.username || "admin",
          username: data.username || "admin",
          role: "admin",
        },
      };
    }
  } catch (error) {
    console.error("Auth check failed:", error);
  }
  
  // localStorage는 true지만 서버 검증 실패
  // 개발 환경에서는 허용, 프로덕션에서는 로그아웃
  if (import.meta.env.DEV) {
    return { 
      authenticated: true,
      user: {
        id: "admin",
        username: "admin",
        role: "admin",
      },
    };
  } else {
    // 프로덕션에서는 서버 검증 실패 시 로그아웃
    localStorage.removeItem("adminLoggedIn");
    return { authenticated: false };
  }
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
  try {
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
      credentials: "include",
    });
    
    const data = await response.json();
    
    if (response.ok && data.success) {
      localStorage.setItem("adminLoggedIn", "true");
      return { success: true };
    } else {
      return { 
        success: false, 
        error: data.message || "Login failed" 
      };
    }
  } catch (error) {
    console.error("Login error:", error);
    return { 
      success: false, 
      error: "Network error. Please try again." 
    };
  }
}

