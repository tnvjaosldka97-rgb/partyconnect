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
  getParties,
  updatePartyStatus,
  type HostApplication,
  type Party,
} from "@/lib/storage";

export default function Admin() {
  const [, setLocation] = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hostApplications, setHostApplications] = useState<HostApplication[]>([]);
  const [parties, setParties] = useState<Party[]>([]);

  useEffect(() => {
    // Check authentication with backend
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/check");
        const data = await response.json();
        
        if (response.ok && data.authenticated) {
          setIsAuthenticated(true);
          // Load host applications and parties
          loadHostApplications();
          loadParties();
        } else {
          toast.error("Access Denied", {
            description: "Admin login required.",
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
          loadParties();
        } else {
          toast.error("Access Denied", {
            description: "Admin login required.",
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

  const loadParties = () => {
    const allParties = getParties();
    setParties(allParties);
  };

  const handleApprove = (application: HostApplication) => {
    // Update application status
    const success = updateHostApplicationStatus(application.id, "approved");
    
    if (success) {
      // Create party from application
      const partyCreated = createPartyFromApplication(application);
      
      if (partyCreated) {
        toast.success("Host Approved!", {
          description: `${application.name}'s application has been approved and a party has been automatically created.`,
        });
      } else {
        toast.success("Host Approved!", {
          description: `${application.name}'s application has been approved.`,
        });
      }
      
      // Reload applications
      loadHostApplications();
    } else {
      toast.error("Approval Failed", {
        description: "다시 시도해주세요.",
      });
    }
  };

  const handleReject = (application: HostApplication) => {
    const success = updateHostApplicationStatus(application.id, "rejected");
    
    if (success) {
      toast.success("Host Application Rejected", {
        description: `${application.name}'s application has been rejected.`,
      });
      loadHostApplications();
    } else {
      toast.error("Rejection Failed", {
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
    toast.success("Logged out successfully");
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
                  <span className="text-sm font-medium">Admin Dashboard</span>
                </div>
                <h1 className="text-4xl font-bold mb-2">
                  <span className="gradient-text">PartyConnect</span> Management
                </h1>
                <p className="text-muted-foreground">
                  Manage host applications, tickets, and parties in one place
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  className="glass border-white/20"
                  onClick={() => setLocation("/")}
                >
                  Back to Home
                </Button>
                <Button
                  variant="outline"
                  className="glass border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10"
                  onClick={() => setLocation("/admin/change-password")}
                >
                  <Key className="w-4 h-4 mr-2" />
                  Change Password
                </Button>
                <Button
                  variant="outline"
                  className="glass border-red-500/30 text-red-400 hover:bg-red-500/10"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
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
              <p className="text-sm text-muted-foreground">Total Host Applications</p>
            </div>

            <div className="glass-strong rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <Check className="w-6 h-6 text-green-500" />
                </div>
                <Badge className="bg-green-500/20 text-green-500 border-green-500/30">
                  Approved
                </Badge>
              </div>
              <h3 className="text-2xl font-bold mb-1">{approvedApplications.length}</h3>
              <p className="text-sm text-muted-foreground">Approved Applications</p>
            </div>

            <div className="glass-strong rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
                  <X className="w-6 h-6 text-red-500" />
                </div>
                <Badge className="bg-red-500/20 text-red-500 border-red-500/30">
                  Rejected
                </Badge>
              </div>
              <h3 className="text-2xl font-bold mb-1">{rejectedApplications.length}</h3>
              <p className="text-sm text-muted-foreground">Rejected Applications</p>
            </div>

            <div className="glass-strong rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <PartyPopper className="w-6 h-6 text-primary" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-1">{approvedApplications.length}</h3>
              <p className="text-sm text-muted-foreground">Created Parties</p>
            </div>
          </div>
        </section>

        {/* Tabs */}
        <section className="container">
          <Tabs defaultValue="hosts" className="space-y-6">
            <TabsList className="glass border border-white/10">
              <TabsTrigger value="hosts" className="data-[state=active]:bg-primary/20">
                <Users className="w-4 h-4 mr-2" />
                Host Applications ({hostApplications.length})
              </TabsTrigger>
              <TabsTrigger value="tickets" className="data-[state=active]:bg-primary/20">
                <Ticket className="w-4 h-4 mr-2" />
                Ticket Purchases (0)
              </TabsTrigger>
              <TabsTrigger value="parties" className="data-[state=active]:bg-primary/20">
                <PartyPopper className="w-4 h-4 mr-2" />
                Party Management ({approvedApplications.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="hosts" className="space-y-4">
              {hostApplications.length === 0 ? (
                <div className="glass-strong rounded-2xl p-8 border border-white/10 text-center">
                  <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Host Applications</h3>
                  <p className="text-muted-foreground">
                    New host applications will appear here when submitted.
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
                              ? "Approved"
                              : "Rejected"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Applied: {new Date(application.appliedAt).toLocaleString("ko-KR")}
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
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-500/30 text-red-500 hover:bg-red-500/10"
                            onClick={() => handleReject(application)}
                          >
                            <X className="w-4 h-4 mr-1" />
                            Reject
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
                <h3 className="text-xl font-semibold mb-2">Ticket Purchases 내역이 없습니다</h3>
                <p className="text-muted-foreground">
                  Ticket Purchases가 발생하면 여기에 표시됩니다.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="parties" className="space-y-4">
              {parties.length === 0 ? (
                <div className="glass-strong rounded-2xl p-8 border border-white/10 text-center">
                  <PartyPopper className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No parties yet</h3>
                  <p className="text-muted-foreground">
                    Parties created by hosts will appear here for approval.
                  </p>
                </div>
              ) : (
                parties.map((party) => (
                  <div
                    key={party.id}
                    className="glass-strong rounded-2xl p-6 border border-white/10"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold">{party.title}</h3>
                          <Badge
                            className={
                              party.status === "pending"
                                ? "bg-yellow-500/20 text-yellow-500 border-yellow-500/30"
                                : party.status === "approved"
                                ? "bg-green-500/20 text-green-500 border-green-500/30"
                                : "bg-red-500/20 text-red-500 border-red-500/30"
                            }
                          >
                            {party.status === "pending"
                              ? "Pending"
                              : party.status === "approved"
                              ? "Approved"
                              : "Rejected"}
                          </Badge>
                        </div>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <p><strong>Host:</strong> {party.host}</p>
                          <p><strong>Date:</strong> {party.date} {party.time}</p>
                          <p><strong>Location:</strong> {party.location}, {party.city}</p>
                          <p><strong>Price:</strong> ${party.price}</p>
                          <p><strong>Capacity:</strong> {party.capacity} people</p>
                        </div>
                      </div>
                      {party.status === "pending" && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="bg-green-500/20 text-green-500 hover:bg-green-500/30 border border-green-500/30"
                            onClick={() => {
                              const success = updatePartyStatus(party.id, "approved");
                              if (success) {
                                toast.success("Party Approved!", {
                                  description: `${party.title} is now live.`,
                                });
                                loadParties();
                              }
                            }}
                          >
                            <Check className="w-4 h-4 mr-2" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-500/30 text-red-500 hover:bg-red-500/10"
                            onClick={() => {
                              const success = updatePartyStatus(party.id, "rejected");
                              if (success) {
                                toast.success("Party Rejected", {
                                  description: `${party.title} has been rejected.`,
                                });
                                loadParties();
                              }
                            }}
                          >
                            <X className="w-4 h-4 mr-2" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <p className="text-sm text-muted-foreground">
                        <strong>Description:</strong> {party.description}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </TabsContent>
          </Tabs>
        </section>
      </main>

      <Footer />
    </div>
  );
}

