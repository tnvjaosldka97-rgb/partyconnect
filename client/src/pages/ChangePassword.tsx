import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Lock, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function ChangePassword() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/admin/check");
        if (!response.ok) {
          toast.error("접근 권한이 없습니다");
          setLocation("/admin/login");
        }
      } catch (error) {
        toast.error("서버 오류");
        setLocation("/admin/login");
      }
    };
    checkAuth();
  }, [setLocation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("비밀번호 불일치", {
        description: "새 비밀번호와 확인 비밀번호가 일치하지 않습니다.",
      });
      return;
    }

    if (formData.newPassword.length < 6) {
      toast.error("비밀번호 오류", {
        description: "새 비밀번호는 최소 6자 이상이어야 합니다.",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success("비밀번호 변경 성공!", {
          description: "새 비밀번호로 다시 로그인해주세요.",
        });

        // Logout and redirect to login
        await fetch("/api/admin/logout", { method: "POST" });
        
        setTimeout(() => {
          setLocation("/admin/login");
        }, 2000);
      } else {
        toast.error("비밀번호 변경 실패", {
          description: data.message || "현재 비밀번호가 올바르지 않습니다.",
        });
      }
    } catch (error) {
      toast.error("서버 오류", {
        description: "비밀번호 변경에 실패했습니다.",
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
              {/* Back Button */}
              <Button
                variant="ghost"
                onClick={() => setLocation("/admin")}
                className="mb-6"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                대시보드로 돌아가기
              </Button>

              {/* Logo & Title */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl glass border border-primary/30 mb-6">
                  <Lock className="w-10 h-10 text-primary" />
                </div>
                <h1 className="text-3xl font-bold mb-2">
                  <span className="gradient-text">비밀번호 변경</span>
                </h1>
                <p className="text-muted-foreground">
                  관리자 계정의 비밀번호를 변경합니다
                </p>
              </div>

              {/* Change Password Form */}
              <div className="glass-strong rounded-3xl p-8 border border-white/10">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="currentPassword" className="flex items-center space-x-2 mb-2">
                      <Lock className="w-4 h-4" />
                      <span>현재 비밀번호</span>
                    </Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={formData.currentPassword}
                      onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                      placeholder="현재 비밀번호를 입력하세요"
                      className="h-12 glass border-white/20"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="newPassword" className="flex items-center space-x-2 mb-2">
                      <Lock className="w-4 h-4" />
                      <span>새 비밀번호</span>
                    </Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={formData.newPassword}
                      onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                      placeholder="새 비밀번호를 입력하세요 (최소 6자)"
                      className="h-12 glass border-white/20"
                      required
                      minLength={6}
                    />
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword" className="flex items-center space-x-2 mb-2">
                      <Lock className="w-4 h-4" />
                      <span>새 비밀번호 확인</span>
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      placeholder="새 비밀번호를 다시 입력하세요"
                      className="h-12 glass border-white/20"
                      required
                      minLength={6}
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full gradient-button h-12 rounded-xl text-base font-semibold"
                    disabled={isLoading}
                  >
                    {isLoading ? "변경 중..." : "비밀번호 변경"}
                  </Button>
                </form>

                <div className="mt-6 pt-6 border-t border-white/10">
                  <div className="bg-yellow-500/10 p-4 rounded-lg border border-yellow-500/30">
                    <p className="text-sm text-yellow-400 font-medium flex items-center">
                      <Shield className="w-4 h-4 mr-2" />
                      보안 안내
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      비밀번호 변경 후 자동으로 로그아웃되며, 새 비밀번호로 다시 로그인해야 합니다.
                      비밀번호는 정기적으로 변경하는 것을 권장합니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

