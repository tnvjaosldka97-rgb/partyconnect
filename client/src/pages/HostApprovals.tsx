import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Shield,
  Check,
  X,
  ExternalLink,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import {
  getHostApplications,
  updateHostApplicationStatus,
  createPartyFromApplication,
  type HostApplication,
} from "@/lib/storage";
import { checkAdminAuth } from "@/lib/auth";

export default function HostApprovals() {
  const [, setLocation] = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hostApplications, setHostApplications] = useState<HostApplication[]>([]);
  const [checkedHosts, setCheckedHosts] = useState<Record<string, { idVerified: boolean; sorChecked: boolean }>>({});

  useEffect(() => {
    const checkAuth = async () => {
      const result = await checkAdminAuth();
      
      if (result.authenticated) {
        setIsAuthenticated(true);
        loadHostApplications();
      } else {
        toast.error("Access Denied", {
          description: "Admin login required.",
        });
        setLocation("/admin/login");
      }
      
      setIsLoading(false);
    };
    
    checkAuth();
  }, [setLocation]);

  const loadHostApplications = () => {
    const applications = getHostApplications();
    const pending = applications.filter((app) => app.status === "pending");
    setHostApplications(pending);
    
    // Initialize checked state
    const initialChecked: Record<string, { idVerified: boolean; sorChecked: boolean }> = {};
    pending.forEach((app) => {
      initialChecked[app.id] = { idVerified: false, sorChecked: false };
    });
    setCheckedHosts(initialChecked);
  };

  const handleCheckboxChange = (hostId: string, field: "idVerified" | "sorChecked", checked: boolean) => {
    setCheckedHosts((prev) => ({
      ...prev,
      [hostId]: {
        ...prev[hostId],
        [field]: checked,
      },
    }));
  };

  const getNSOPWSearchUrl = (application: HostApplication) => {
    const firstName = encodeURIComponent(application.name.split(" ")[0] || "");
    const lastName = encodeURIComponent(application.name.split(" ").slice(1).join(" ") || "");
    const state = encodeURIComponent(application.city.split(",").pop()?.trim() || "TX");
    
    return `https://www.nsopw.gov/search?firstName=${firstName}&lastName=${lastName}&state=${state}`;
  };

  const canApprove = (hostId: string) => {
    const checks = checkedHosts[hostId];
    return checks && checks.idVerified && checks.sorChecked;
  };

  const handleApprove = (application: HostApplication) => {
    if (!canApprove(application.id)) {
      toast.error("Verification Required", {
        description: "Please complete all verification checks before approving.",
      });
      return;
    }

    const success = updateHostApplicationStatus(application.id, "approved");
    
    if (success) {
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
      
      loadHostApplications();
    } else {
      toast.error("Approval Failed", {
        description: "Please try again.",
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
        description: "Please try again.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

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
                  <Shield className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium">Host Approvals</span>
                </div>
                <h1 className="text-4xl font-bold mb-2">
                  Pending <span className="gradient-text">Host Applications</span>
                </h1>
                <p className="text-muted-foreground">
                  Review and verify host applications with background checks
                </p>
              </div>
              <Button
                variant="outline"
                className="glass border-white/20"
                onClick={() => setLocation("/admin")}
              >
                Back to Dashboard
              </Button>
            </div>
          </div>
        </section>

        {/* Host Applications */}
        <section className="container">
          {hostApplications.length === 0 ? (
            <div className="glass-strong rounded-2xl p-8 border border-white/10 text-center">
              <Shield className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Pending Applications</h3>
              <p className="text-muted-foreground">
                All host applications have been reviewed.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {hostApplications.map((application) => (
                <div
                  key={application.id}
                  className="glass-strong rounded-2xl p-6 border border-white/10"
                >
                  {/* Host Info */}
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold">{application.name}</h3>
                        <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30">
                          Pending Review
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Applied: {new Date(application.appliedAt).toLocaleString("en-US")}
                      </p>
                    </div>
                  </div>

                  {/* Host Details */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-6">
                    <div>
                      <p className="text-muted-foreground mb-1">Phone</p>
                      <p className="font-medium">{application.phone}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Email</p>
                      <p className="font-medium">{application.email}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">City</p>
                      <p className="font-medium">{application.city}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Space Type</p>
                      <p className="font-medium">{application.spaceType}</p>
                    </div>
                  </div>

                  {/* Verification Checklist */}
                  <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6">
                    <h4 className="font-semibold mb-4 flex items-center">
                      <AlertTriangle className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                      Verification Checklist
                    </h4>
                    
                    <div className="space-y-4">
                      {/* ID Verification */}
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id={`id-${application.id}`}
                          checked={checkedHosts[application.id]?.idVerified || false}
                          onCheckedChange={(checked) =>
                            handleCheckboxChange(application.id, "idVerified", checked as boolean)
                          }
                        />
                        <div className="flex-1">
                          <label
                            htmlFor={`id-${application.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            ID Verification Completed
                          </label>
                          <p className="text-xs text-muted-foreground mt-1">
                            Verify government-issued ID matches application information
                          </p>
                        </div>
                      </div>

                      {/* Sex Offender Registry Check */}
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id={`sor-${application.id}`}
                          checked={checkedHosts[application.id]?.sorChecked || false}
                          onCheckedChange={(checked) =>
                            handleCheckboxChange(application.id, "sorChecked", checked as boolean)
                          }
                        />
                        <div className="flex-1">
                          <label
                            htmlFor={`sor-${application.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            Sex Offender Registry Check Completed
                          </label>
                          <p className="text-xs text-muted-foreground mt-1 mb-2">
                            Verify applicant is NOT on the national sex offender registry
                          </p>
                          <a
                            href={getNSOPWSearchUrl(application)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                          >
                            <ExternalLink className="w-3 h-3 mr-1.5" />
                            Check NSOPW Registry
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Button
                      className={`flex-1 ${
                        canApprove(application.id)
                          ? "bg-green-500/20 text-green-500 hover:bg-green-500/30 border-green-500/30"
                          : "bg-gray-500/20 text-gray-500 border-gray-500/30 cursor-not-allowed"
                      }`}
                      onClick={() => handleApprove(application)}
                      disabled={!canApprove(application.id)}
                    >
                      <Check className="w-4 h-4 mr-2" />
                      {canApprove(application.id) ? "Approve Host" : "Complete Checks to Approve"}
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 border-red-500/30 text-red-500 hover:bg-red-500/10"
                      onClick={() => handleReject(application)}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Reject Application
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}

