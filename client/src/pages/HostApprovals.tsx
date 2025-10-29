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
  Home,
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
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<HostApplication | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [viewMode, setViewMode] = useState<"pending" | "rejected">("pending");

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
  
  useEffect(() => {
    if (isAuthenticated) {
      loadHostApplications();
    }
  }, [viewMode, isAuthenticated]);

  const loadHostApplications = () => {
    const applications = getHostApplications();
    const filtered = applications.filter((app) => 
      viewMode === "pending" ? app.status === "pending" : app.status === "rejected"
    );
    setHostApplications(filtered);
    
    // Initialize checked state only for pending applications
    if (viewMode === "pending") {
      const initialChecked: Record<string, { idVerified: boolean; sorChecked: boolean }> = {};
      filtered.forEach((app) => {
        initialChecked[app.id] = { idVerified: false, sorChecked: false };
      });
      setCheckedHosts(initialChecked);
    }
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
    setSelectedApplication(application);
    setRejectionReason("");
    setShowRejectDialog(true);
  };
  
  const confirmReject = () => {
    if (!selectedApplication) return;
    
    if (!rejectionReason.trim()) {
      toast.error("Rejection Reason Required", {
        description: "Please provide a reason for rejection.",
      });
      return;
    }
    
    const success = updateHostApplicationStatus(
      selectedApplication.id,
      "rejected",
      rejectionReason.trim()
    );
    
    if (success) {
      toast.success("Host Application Rejected", {
        description: `${selectedApplication.name}'s application has been rejected.`,
      });
      setShowRejectDialog(false);
      setSelectedApplication(null);
      setRejectionReason("");
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
                  {viewMode === "pending" ? "Pending" : "Rejected"} <span className="gradient-text">Host Applications</span>
                </h1>
                <p className="text-muted-foreground">
                  {viewMode === "pending" 
                    ? "Review and verify host applications with background checks"
                    : "View rejected applications and their rejection reasons"}
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

        {/* Tab Switcher */}
        <section className="container mb-8">
          <div className="flex space-x-2 glass-strong p-2 rounded-2xl inline-flex">
            <Button
              variant={viewMode === "pending" ? "default" : "ghost"}
              className={viewMode === "pending" ? "gradient-button" : ""}
              onClick={() => setViewMode("pending")}
            >
              Pending Applications
            </Button>
            <Button
              variant={viewMode === "rejected" ? "default" : "ghost"}
              className={viewMode === "rejected" ? "gradient-button" : ""}
              onClick={() => setViewMode("rejected")}
            >
              Rejected Applications
            </Button>
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
                        <Badge className={viewMode === "pending" 
                          ? "bg-yellow-500/20 text-yellow-500 border-yellow-500/30"
                          : "bg-red-500/20 text-red-500 border-red-500/30"}>
                          {viewMode === "pending" ? "Pending Review" : "Rejected"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Applied: {new Date(application.appliedAt).toLocaleString("en-US")}
                      </p>
                      {viewMode === "rejected" && application.rejectedAt && (
                        <p className="text-sm text-muted-foreground">
                          Rejected: {new Date(application.rejectedAt).toLocaleString("en-US")}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Host Details */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-6">
                    {application.firstName && application.lastName && (
                      <>
                        <div>
                          <p className="text-muted-foreground mb-1">First Name</p>
                          <p className="font-medium">{application.firstName}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground mb-1">Last Name</p>
                          <p className="font-medium">{application.lastName}</p>
                        </div>
                      </>
                    )}
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

                  {/* Rejection Reason (for rejected view) */}
                  {viewMode === "rejected" && application.rejectionReason && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
                      <h4 className="font-semibold mb-2 flex items-center text-red-500">
                        <X className="w-5 h-5 mr-2" />
                        Rejection Reason
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {application.rejectionReason}
                      </p>
                    </div>
                  )}

                  {/* Uploaded Documents */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {/* ID Document */}
                    <div className="glass rounded-xl p-4 border border-white/10">
                      <h4 className="font-semibold mb-3 flex items-center">
                        <Shield className="w-5 h-5 mr-2 text-primary" />
                        ID Document
                      </h4>
                      {application.idCardImage ? (
                        <div className="relative group">
                          <img
                            src={application.idCardImage}
                            alt="ID Document"
                            className="w-full h-48 object-cover rounded-lg border border-white/10"
                          />
                          <a
                            href={application.idCardImage}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg"
                          >
                            <span className="text-white font-medium">View Full Size</span>
                          </a>
                        </div>
                      ) : (
                        <div className="w-full h-48 bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
                          No ID document uploaded
                        </div>
                      )}
                    </div>

                    {/* Criminal Record Document */}
                    <div className="glass rounded-xl p-4 border border-white/10">
                      <h4 className="font-semibold mb-3 flex items-center">
                        <Shield className="w-5 h-5 mr-2 text-primary" />
                        Criminal Record Document
                      </h4>
                      {application.criminalRecordImage ? (
                        <div className="relative group">
                          <img
                            src={application.criminalRecordImage}
                            alt="Criminal Record"
                            className="w-full h-48 object-cover rounded-lg border border-white/10"
                          />
                          <a
                            href={application.criminalRecordImage}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg"
                          >
                            <span className="text-white font-medium">View Full Size</span>
                          </a>
                        </div>
                      ) : (
                        <div className="w-full h-48 bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
                          No criminal record document uploaded
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Space Photos */}
                  {application.images && application.images.length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-semibold mb-3 flex items-center">
                        <Home className="w-5 h-5 mr-2 text-primary" />
                        Space Photos ({application.images.length})
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {application.images.map((image, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={image}
                              alt={`Space Photo ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg border border-white/10"
                            />
                            <a
                              href={image}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg"
                            >
                              <span className="text-white font-medium text-sm">View Full Size</span>
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Verification Checklist (for pending view only) */}
                  {viewMode === "pending" && (
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
                  )}

                  {/* Action Buttons (for pending view only) */}
                  {viewMode === "pending" && (
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
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
      
      {/* Rejection Dialog */}
      {showRejectDialog && selectedApplication && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-strong rounded-2xl p-8 border border-white/10 max-w-2xl w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Reject Host Application</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowRejectDialog(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="mb-6">
              <p className="text-muted-foreground mb-4">
                You are about to reject the application from <span className="text-white font-semibold">{selectedApplication.name}</span> ({selectedApplication.email}).
              </p>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Rejection Reason *</label>
                <textarea
                  className="w-full h-32 px-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:outline-none focus:border-primary/50 resize-none"
                  placeholder="Please provide a detailed reason for rejection. This will be shown to the applicant."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Example: "The provided ID document was not clear enough for verification" or "The space does not meet our safety requirements"
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowRejectDialog(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-red-500/20 text-red-500 hover:bg-red-500/30 border-red-500/30"
                onClick={confirmReject}
              >
                Confirm Rejection
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

