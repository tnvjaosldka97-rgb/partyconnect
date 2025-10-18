import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LayoutDashboard,
  Users,
  Ticket,
  PartyPopper,
  LogOut,
  Shield,
  Key,
  Check,
  X,
} from "lucide-react";
import { toast } from "sonner";
import {
  getHostApplications,
  updateHostApplicationStatus,
  createPartyFromApplication,
  type HostApplication,
} from "@/lib/storage";

export default function Admin() {
  const [, setLocation] = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hostApplications, setHostApplications] = useState<HostApplication[]>([]);

  useEffect(() => {
    // Check authentication with backend
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/check");
        const data = await response.json();
        
        if (response.ok && data.authenticated) {
          setIsAuthenticated(true);
          // Load host applications
          loadHostApplications();
        } else {
          toast.error("접근 권한이 없습니다", {
            description: "관리자 로그인이 필요합니다.",
          });
          setLocation("/admin/login");
        }
      } catch (error) {
        console.log("Auth check failed, trying localStorage auth...");
        // Fallback to localStorage auth
        const isLoggedIn = localStorage.getItem("adminLoggedIn") === "true";
        if (isLoggedIn) {
          setIsAuthenticated(true);
          loadHostApplications();
        } else {
          toast.error("접근 권한이 없습니다", {
            description: "관리자 로그인이 필요합니다.",
          });
          setLocation("/admin/login");
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [setLocation]);

  const loadHostApplications = () => {
    const applications = getHostApplications();
    setHostApplications(applications);
  };

  const handleApprove = (application: HostApplication) => {
    // Update application status
    const success = updateHostApplicationStatus(application.id, "approved");
    
    if (success) {
      // Create party from application
      const partyCreated = createPartyFromApplication(application);
      
      if (partyCreated) {
        toast.success("호스트 승인 완료!", {
          description: `${application.name}님의 신청이 승인되었고, 파티가 자동으로 생성되었습니다.`,
        });
      } else {
        toast.success("호스트 승인 완료!", {
          description: `${application.name}님의 신청이 승인되었습니다.`,
        });
      }
      
      // Reload applications
      loadHostApplications();
    } else {
      toast.error("승인 실패", {
        description: "다시 시도해주세요.",
      });
    }
  };

  const handleReject = (application: HostApplication) => {
    const success = updateHostApplicationStatus(application.id, "rejected");
    
    if (success) {
      toast.success("호스트 신청 거부", {
        description: `${application.name}님의 신청이 거부되었습니다.`,
      });
      loadHostApplications();
    } else {
      toast.error("거부 실패", {
        description: "다시 시도해주세요.",
      });
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
    } catch (error) {
      console.log("Backend logout failed");
    }
    
    localStorage.removeItem("adminLoggedIn");
    toast.success("로그아웃되었습니다");
    setLocation("/admin/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">인증 확인 중...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const pendingApplications = hostApplications.filter((app) => app.status === "pending");
  const approvedApplications = hostApplications.filter((app) => app.status === "approved");
  const rejectedApplications = hostApplications.filter((app) => app.status === "rejected");

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-20 pb-20">
        {/* Header */}
        <section className="py-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/20 opacity-30" />
          
          <div className="container relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <div className="inline-flex items-center space-x-2 glass px-4 py-2 rounded-full border border-primary/30 mb-4">
                  <LayoutDashboard className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium">관리자 대시보드</span>
                </div>
                <h1 className="text-4xl font-bold mb-2">
                  <span className="gradient-text">PartyConnect</span> 관리
                </h1>
                <p className="text-muted-foreground">
                  호스트 신청, 티켓 구매, 파티 관리를 한 곳에서
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  className="glass border-white/20"
                  onClick={() => setLocation("/")}
                >
                  홈으로 돌아가기
                </Button>
                <Button
                  variant="outline"
                  className="glass border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10"
                  onClick={() => setLocation("/admin/change-password")}
                >
                  <Key className="w-4 h-4 mr-2" />
                  비밀번호 변경
                </Button>
                <Button
                  variant="outline"
                  className="glass border-red-500/30 text-red-400 hover:bg-red-500/10"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  로그아웃
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="container mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-strong rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30">
                  {pendingApplications.length}개 대기
                </Badge>
              </div>
              <h3 className="text-2xl font-bold mb-1">{hostApplications.length}</h3>
              <p className="text-sm text-muted-foreground">총 호스트 신청</p>
            </div>

            <div className="glass-strong rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <Check className="w-6 h-6 text-green-500" />
                </div>
                <Badge className="bg-green-500/20 text-green-500 border-green-500/30">
                  승인됨
                </Badge>
              </div>
              <h3 className="text-2xl font-bold mb-1">{approvedApplications.length}</h3>
              <p className="text-sm text-muted-foreground">승인된 신청</p>
            </div>

            <div className="glass-strong rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
                  <X className="w-6 h-6 text-red-500" />
                </div>
                <Badge className="bg-red-500/20 text-red-500 border-red-500/30">
                  거부됨
                </Badge>
              </div>
              <h3 className="text-2xl font-bold mb-1">{rejectedApplications.length}</h3>
              <p className="text-sm text-muted-foreground">거부된 신청</p>
            </div>

            <div className="glass-strong rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <PartyPopper className="w-6 h-6 text-primary" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-1">{approvedApplications.length}</h3>
              <p className="text-sm text-muted-foreground">생성된 파티</p>
            </div>
          </div>
        </section>

        {/* Tabs */}
        <section className="container">
          <Tabs defaultValue="hosts" className="space-y-6">
            <TabsList className="glass border border-white/10">
              <TabsTrigger value="hosts" className="data-[state=active]:bg-primary/20">
                <Users className="w-4 h-4 mr-2" />
                호스트 신청 ({hostApplications.length})
              </TabsTrigger>
              <TabsTrigger value="tickets" className="data-[state=active]:bg-primary/20">
                <Ticket className="w-4 h-4 mr-2" />
                티켓 구매 (0)
              </TabsTrigger>
              <TabsTrigger value="parties" className="data-[state=active]:bg-primary/20">
                <PartyPopper className="w-4 h-4 mr-2" />
                파티 관리 ({approvedApplications.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="hosts" className="space-y-4">
              {hostApplications.length === 0 ? (
                <div className="glass-strong rounded-2xl p-8 border border-white/10 text-center">
                  <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">호스트 신청이 없습니다</h3>
                  <p className="text-muted-foreground">
                    새로운 호스트 신청이 들어오면 여기에 표시됩니다.
                  </p>
                </div>
              ) : (
                hostApplications.map((application) => (
                  <div
                    key={application.id}
                    className="glass-strong rounded-2xl p-6 border border-white/10"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold">{application.name}</h3>
                          <Badge
                            className={
                              application.status === "pending"
                                ? "bg-yellow-500/20 text-yellow-500 border-yellow-500/30"
                                : application.status === "approved"
                                ? "bg-green-500/20 text-green-500 border-green-500/30"
                                : "bg-red-500/20 text-red-500 border-red-500/30"
                            }
                          >
                            {application.status === "pending"
                              ? "대기 중"
                              : application.status === "approved"
                              ? "승인됨"
                              : "거부됨"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          신청일: {new Date(application.appliedAt).toLocaleString("ko-KR")}
                        </p>
                      </div>
                      {application.status === "pending" && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="bg-green-500/20 text-green-500 hover:bg-green-500/30 border-green-500/30"
                            onClick={() => handleApprove(application)}
                          >
                            <Check className="w-4 h-4 mr-1" />
                            승인
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-500/30 text-red-500 hover:bg-red-500/10"
                            onClick={() => handleReject(application)}
                          >
                            <X className="w-4 h-4 mr-1" />
                            거부
                          </Button>
                        </div>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground mb-1">전화번호</p>
                        <p className="font-medium">{application.phone}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">이메일</p>
                        <p className="font-medium">{application.email}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">도시</p>
                        <p className="font-medium">{application.city}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">공간 유형</p>
                        <p className="font-medium">{application.spaceType}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">주소</p>
                        <p className="font-medium">{application.address}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">수용 인원</p>
                        <p className="font-medium">{application.capacity}명</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">호스팅 경험</p>
                        <p className="font-medium">{application.experience}</p>
                      </div>
                    </div>
                    
                    {application.intro && (
                      <div className="mt-4">
                        <p className="text-muted-foreground mb-1 text-sm">자기소개</p>
                        <p className="text-sm">{application.intro}</p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </TabsContent>

            <TabsContent value="tickets" className="space-y-4">
              <div className="glass-strong rounded-2xl p-8 border border-white/10 text-center">
                <Ticket className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">티켓 구매 내역이 없습니다</h3>
                <p className="text-muted-foreground">
                  티켓 구매가 발생하면 여기에 표시됩니다.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="parties" className="space-y-4">
              <div className="glass-strong rounded-2xl p-8 border border-white/10 text-center">
                <PartyPopper className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  {approvedApplications.length}개의 파티가 생성되었습니다
                </h3>
                <p className="text-muted-foreground">
                  호스트 승인 시 자동으로 파티가 생성됩니다.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </section>
      </main>

      <Footer />
    </div>
  );
}

