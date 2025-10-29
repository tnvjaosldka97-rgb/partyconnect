import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  User,
  Mail,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  Trash2,
  Eye,
  LogOut,
} from "lucide-react";
import { toast } from "sonner";
import {
  getHostByEmail,
  getParties,
  deleteParty,
  type HostApplication,
  type Party,
} from "@/lib/storage";
import { Link } from "wouter";

export default function HostDashboard() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hostInfo, setHostInfo] = useState<HostApplication | null>(null);
  const [hostParties, setHostParties] = useState<Party[]>([]);

  useEffect(() => {
    // Check if host is already logged in
    const savedEmail = localStorage.getItem("hostEmail");
    if (savedEmail) {
      handleLogin(savedEmail);
    }
  }, []);

  const handleLogin = (loginEmail: string) => {
    const host = getHostByEmail(loginEmail);
    
    if (host) {
      // Check if host application was rejected
      if (host.status === "rejected") {
        setLocation("/host/rejected");
        return;
      }
      
      // Check if host is approved
      if (host.status !== "approved") {
        toast.error("Access Denied", {
          description: "Your host application is still pending review.",
        });
        return;
      }
      
      setHostInfo(host);
      setIsLoggedIn(true);
      setEmail(loginEmail);
      localStorage.setItem("hostEmail", loginEmail);
      
      // Load host's parties
      const allParties = getParties();
      const myParties = allParties.filter(
        (party) => party.hostId === host.id || party.host === host.name
      );
      setHostParties(myParties);
      
      toast.success("Welcome back!", {
        description: `Logged in as ${host.name}`,
      });
    } else {
      toast.error("Host not found", {
        description: "Please check your email or apply to become a host first.",
      });
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin(email);
  };

  const handleLogout = () => {
    localStorage.removeItem("hostEmail");
    setIsLoggedIn(false);
    setHostInfo(null);
    setHostParties([]);
    setEmail("");
    toast.success("Logged out successfully");
  };

  const handleDeleteParty = (partyId: string) => {
    if (confirm("Are you sure you want to delete this party?")) {
      const success = deleteParty(partyId);
      
      if (success) {
        toast.success("Party deleted successfully");
        // Reload parties
        if (hostInfo) {
          const allParties = getParties();
          const myParties = allParties.filter(
            (party) => party.hostId === hostInfo.id || party.host === hostInfo.name
          );
          setHostParties(myParties);
        }
      } else {
        toast.error("Failed to delete party");
      }
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen">
        <Header />
        
        <main className="pt-20 pb-20">
          <div className="container max-w-md py-20">
            <div className="glass-strong rounded-3xl p-8 border border-white/10">
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-full gradient-button flex items-center justify-center mx-auto mb-4">
                  <User className="w-8 h-8" />
                </div>
                <h1 className="text-3xl font-bold mb-2">Host Dashboard</h1>
                <p className="text-muted-foreground">
                  Enter your email to access your dashboard
                </p>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="glass border-white/20"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full gradient-button rounded-xl h-12"
                >
                  Access Dashboard
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  Not a host yet?
                </p>
                <Link href="/become-host">
                  <Button variant="outline" className="glass border-primary/50">
                    Apply to Become a Host
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  const approvedParties = hostParties.filter((p) => p.status === "approved");
  const pendingParties = hostParties.filter((p) => p.status === "pending");

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
                <h1 className="text-4xl font-bold mb-2">
                  Welcome back, <span className="gradient-text">{hostInfo?.name}</span>
                </h1>
                <p className="text-muted-foreground">
                  Manage your parties and view your hosting statistics
                </p>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="glass border-white/20 hover:bg-white/10"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </section>

        <div className="container space-y-8">
          {/* Host Info Card */}
          <div className="glass-strong rounded-2xl p-6 border border-white/10">
            <h2 className="text-2xl font-bold mb-6">Host Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Full Name</p>
                  <p className="font-medium">{hostInfo?.name}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{hostInfo?.email}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">City</p>
                  <p className="font-medium">{hostInfo?.city}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Space Capacity</p>
                  <p className="font-medium">{hostInfo?.capacity} people</p>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-strong rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <p className="text-muted-foreground">Total Parties</p>
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <p className="text-3xl font-bold">{hostParties.length}</p>
            </div>

            <div className="glass-strong rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <p className="text-muted-foreground">Approved</p>
                <Calendar className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-3xl font-bold text-green-500">{approvedParties.length}</p>
            </div>

            <div className="glass-strong rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <p className="text-muted-foreground">Pending</p>
                <Calendar className="w-5 h-5 text-yellow-500" />
              </div>
              <p className="text-3xl font-bold text-yellow-500">{pendingParties.length}</p>
            </div>
          </div>

          {/* Parties List */}
          <div className="glass-strong rounded-2xl p-6 border border-white/10">
            <h2 className="text-2xl font-bold mb-6">Your Parties</h2>
            
            {hostParties.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Parties Yet</h3>
                <p className="text-muted-foreground mb-6">
                  Create your first party to get started
                </p>
                <Link href="/create-party">
                  <Button className="gradient-button rounded-xl">
                    Create Party
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {hostParties.map((party) => (
                  <div
                    key={party.id}
                    className="glass rounded-xl p-4 border border-white/10 flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold">{party.title}</h3>
                        <Badge
                          variant={
                            party.status === "approved"
                              ? "default"
                              : party.status === "pending"
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {party.status || "approved"}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span>{party.date} {party.time}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4" />
                          <span>{party.city}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4" />
                          <span>{party.attendees}/{party.capacity}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <DollarSign className="w-4 h-4" />
                          <span>${party.price}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <Link href={`/party/${party.id}`}>
                        <Button
                          size="sm"
                          variant="outline"
                          className="glass border-primary/50"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="outline"
                        className="glass border-red-500/50 hover:bg-red-500/10"
                        onClick={() => handleDeleteParty(party.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Create Party Button */}
          <div className="text-center">
            <Link href="/create-party">
              <Button className="gradient-button rounded-xl h-12 px-8">
                <Calendar className="w-5 h-5 mr-2" />
                Create New Party
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

