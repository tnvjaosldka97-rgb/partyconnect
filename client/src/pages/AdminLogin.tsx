import { useState } from "react";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Lock, User } from "lucide-react";
import { toast } from "sonner";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Check credentials
      if (formData.username === "onlyup1!" && formData.password === "onlyup12!") {
        localStorage.setItem("adminLoggedIn", "true");
        
        toast.success("로그인 성공!", {
          description: "관리자 대시보드로 이동합니다.",
        });
        
        setTimeout(() => {
          setLocation("/admin");
        }, 1000);
      } else {
        toast.error("로그인 실패", {
          description: "아이디 또는 비밀번호가 올바르지 않습니다.",
        });
      }
    } catch (error) {
      toast.error("로그인 실패", {
        description: "오류가 발생했습니다.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-20 pb-20">
        <section className="py-20 relative overflow-hidden min-h-[80vh] flex items-center">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/20 opacity-30" />
          <div className="absolute top-20 right-20 w-96 h-96 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute bottom-20 left-20 w-96 h-96 rounded-full bg-accent/20 blur-3xl" />
          
          <div className="container relative z-10">
            <div className="max-w-md mx-auto">
              {/* Logo & Title */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl glass border border-primary/30 mb-6">
                  <Shield className="w-10 h-10 text-primary" />
                </div>
                <h1 className="text-3xl font-bold mb-2">
                  <span className="gradient-text">관리자 로그인</span>
                </h1>
                <p className="text-muted-foreground">
                  PartyConnect 관리자 대시보드 접속
                </p>
              </div>

              {/* Login Form */}
              <div className="glass-strong rounded-3xl p-8 border border-white/10">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="username" className="flex items-center space-x-2 mb-2">
                      <User className="w-4 h-4" />
                      <span>관리자 ID</span>
                    </Label>
                    <Input
                      id="username"
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      placeholder="관리자 아이디를 입력하세요"
                      className="h-12 glass border-white/20"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="password" className="flex items-center space-x-2 mb-2">
                      <Lock className="w-4 h-4" />
                      <span>비밀번호</span>
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="비밀번호를 입력하세요"
                      className="h-12 glass border-white/20"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full gradient-button h-12 rounded-xl text-base font-semibold"
                    disabled={isLoading}
                  >
                    {isLoading ? "로그인 중..." : "로그인"}
                  </Button>
                </form>

                <div className="mt-6 pt-6 border-t border-white/10">
                  <div className="bg-yellow-500/10 p-4 rounded-lg border border-yellow-500/30">
                    <p className="text-sm text-yellow-400 font-medium flex items-center">
                      <Shield className="w-4 h-4 mr-2" />
                      보안 안내
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      관리자 계정은 승인된 직원만 사용할 수 있습니다. 
                      무단 접근 시도는 기록되며 법적 조치가 취해질 수 있습니다.
                    </p>
                  </div>
                </div>
              </div>

              {/* Back to Home */}
              <div className="text-center mt-6">
                <Button
                  variant="ghost"
                  onClick={() => setLocation("/")}
                  className="text-muted-foreground hover:text-foreground"
                >
                  홈으로 돌아가기
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

