import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  Edit,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import {
  getHostApplications,
  updateHostApplicationStatus,
  createPartyFromApplication,
  getParties,
  updatePartyStatus,
  updateParty,
  deleteParty,
  deleteHostApplication,
  resetPartiesToInitialData,
  type HostApplication,
  type Party,
} from "@/lib/storage";
import { checkAdminAuth, logout } from "@/lib/auth";
import { sanitizeInput } from "@/lib/validation";

export default function Admin() {
  const [, setLocation] = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hostApplications, setHostApplications] = useState<HostApplication[]>([]);
  const [parties, setParties] = useState<Party[]>([]);
  const [editingParty, setEditingParty] = useState<Party | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [partyToDelete, setPartyToDelete] = useState<Party | null>(null);
  const [isUploadingImages, setIsUploadingImages] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const result = await checkAdminAuth();
      
      if (result.authenticated) {
        setIsAuthenticated(true);
        loadHostApplications();
        loadParties();
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
    // Sort applications: pending first, then approved, then rejected
    const sortedApplications = [...applications].sort((a, b) => {
      const statusOrder = { pending: 0, approved: 1, rejected: 2 };
      const aOrder = statusOrder[a.status] !== undefined ? statusOrder[a.status] : 3;
      const bOrder = statusOrder[b.status] !== undefined ? statusOrder[b.status] : 3;
      return aOrder - bOrder;
    });
    setHostApplications(sortedApplications);
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

  const handleEditParty = (party: Party) => {
    setEditingParty({ ...party });
    setIsEditDialogOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !editingParty) return;

    // Check image count limit
    const MAX_IMAGES = 10;
    const currentCount = editingParty.images?.length || 0;
    if (currentCount + files.length > MAX_IMAGES) {
      toast.error("Too Many Images", {
        description: `Maximum ${MAX_IMAGES} images allowed. You can upload ${MAX_IMAGES - currentCount} more.`,
      });
      return;
    }

    // File validation
    for (let i = 0; i < files.length; i++) {
      if (files[i].size > 10 * 1024 * 1024) {
        toast.error("File size error", {
          description: "File size must be 10MB or less.",
        });
        return;
      }
      if (!files[i].type.match(/image\/(jpeg|jpg|png)/)) {
        toast.error("File format error", {
          description: "Only JPG or PNG files are allowed.",
        });
        return;
      }
    }

    setIsUploadingImages(true);

    try {
      const { uploadMultipleImages } = await import("@/lib/imageUpload");
      const results = await uploadMultipleImages(Array.from(files));
      
      const uploadedUrls: string[] = [];
      const failedFiles: string[] = [];

      results.forEach((result, index) => {
        if (result.success && result.url) {
          uploadedUrls.push(result.url);
        } else {
          failedFiles.push(files[index].name);
        }
      });

      if (uploadedUrls.length > 0) {
        setEditingParty({
          ...editingParty,
          images: [...(editingParty.images || []), ...uploadedUrls],
        });
      }
      
      if (failedFiles.length === 0) {
        toast.success("Images Uploaded Successfully!", {
          description: `${uploadedUrls.length} file(s) uploaded.`,
        });
      } else if (uploadedUrls.length > 0) {
        toast.warning(`${uploadedUrls.length} uploaded, ${failedFiles.length} failed`, {
          description: `Failed files: ${failedFiles.join(", ")}`,
        });
      } else {
        toast.error("All uploads failed");
      }
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error("Upload Failed", {
        description: "An error occurred while uploading images.",
      });
    } finally {
      setIsUploadingImages(false);
      e.target.value = "";
    }
  };

  const handleRemoveImage = (index: number) => {
    if (!editingParty) return;
    const newImages = [...(editingParty.images || [])];
    newImages.splice(index, 1);
    setEditingParty({ ...editingParty, images: newImages });
    toast.success("Image removed");
  };

  const handleSaveEdit = () => {
    if (!editingParty) return;

    // Sanitize text inputs before saving
    const sanitizedParty = {
      ...editingParty,
      title: sanitizeInput(editingParty.title),
      description: sanitizeInput(editingParty.description),
      location: sanitizeInput(editingParty.location),
      city: sanitizeInput(editingParty.city),
      host: sanitizeInput(editingParty.host),
    };

    const success = updateParty(sanitizedParty.id, sanitizedParty);
    
    if (success) {
      toast.success("Party Updated!", {
        description: "The party has been successfully updated.",
      });
      setIsEditDialogOpen(false);
      setEditingParty(null);
      loadParties();
    } else {
      toast.error("Update Failed", {
        description: "Please try again.",
      });
    }
  };

  const handleDeletePartyClick = (party: Party) => {
    setPartyToDelete(party);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!partyToDelete) return;

    const success = deleteParty(partyToDelete.id);
    
    if (success) {
      toast.success("Party Deleted!", {
        description: "The party has been successfully deleted.",
      });
      setIsDeleteDialogOpen(false);
      setPartyToDelete(null);
      loadParties();
    } else {
      toast.error("Delete Failed", {
        description: "Please try again.",
      });
    }
  };

  const handleDeleteHost = (hostId: string) => {
    const success = deleteHostApplication(hostId);
    
    if (success) {
      toast.success("Host Application Deleted!", {
        description: "The host application has been successfully deleted.",
      });
      loadHostApplications();
    } else {
      toast.error("Delete Failed", {
        description: "Please try again.",
      });
    }
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    setLocation("/admin/login");
  };

  const handleResetData = () => {
    if (window.confirm("Are you sure you want to reset all parties to the default English data? This action cannot be undone.")) {
      const success = resetPartiesToInitialData();
      if (success) {
        toast.success("Data Reset Successful", {
          description: "All parties have been reset to default English data.",
        });
        loadParties();
        window.location.reload();
      } else {
        toast.error("Reset Failed", {
          description: "Failed to reset party data. Please try again.",
        });
      }
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
                  <span className="gradient-text">PartyBear</span> Management
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
                  className="glass border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
                  onClick={handleResetData}
                >
                  Reset to English Data
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
                  {pendingApplications.length} Pending
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
              <h3 className="text-2xl font-bold mb-1">{parties.length}</h3>
              <p className="text-sm text-muted-foreground">Total Parties</p>
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
                Party Management ({parties.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="hosts" className="space-y-4">
              {pendingApplications.length > 0 && (
                <div className="glass-strong rounded-2xl p-6 border border-blue-500/30 bg-blue-500/5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Pending Approvals</h3>
                      <p className="text-sm text-muted-foreground">
                        {pendingApplications.length} host application{pendingApplications.length > 1 ? 's' : ''} waiting for background check and approval
                      </p>
                    </div>
                    <Button
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => setLocation("/admin/host-approvals")}
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      Review & Approve
                    </Button>
                  </div>
                </div>
              )}
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
                              ? "Pending"
                              : application.status === "approved"
                              ? "Approved"
                              : "Rejected"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Applied: {new Date(application.appliedAt).toLocaleString("en-US")}
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
                      <div>
                        <p className="text-muted-foreground mb-1">Address</p>
                        <p className="font-medium">{application.address}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">Capacity</p>
                        <p className="font-medium">{application.capacity} people</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">Experience</p>
                        <p className="font-medium">{application.experience}</p>
                      </div>
                    </div>
                    
                    {application.intro && (
                      <div className="mt-4">
                        <p className="text-muted-foreground mb-1 text-sm">Introduction</p>
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
                <h3 className="text-xl font-semibold mb-2">No Ticket Purchases</h3>
                <p className="text-muted-foreground">
                  Ticket purchases will appear here when made.
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
                      <div className="flex flex-col gap-2">
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
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-blue-500/30 text-blue-500 hover:bg-blue-500/10"
                            onClick={() => handleEditParty(party)}
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-500/30 text-red-500 hover:bg-red-500/10"
                            onClick={() => handleDeletePartyClick(party)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </Button>
                        </div>
                      </div>
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

      {/* Edit Party Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="glass-strong border-white/10 max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Party</DialogTitle>
            <DialogDescription>
              Make changes to the party details below.
            </DialogDescription>
          </DialogHeader>
          {editingParty && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={editingParty.title}
                  onChange={(e) => setEditingParty({ ...editingParty, title: e.target.value })}
                  className="glass border-white/20"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={editingParty.date}
                    onChange={(e) => setEditingParty({ ...editingParty, date: e.target.value })}
                    className="glass border-white/20"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={editingParty.time}
                    onChange={(e) => setEditingParty({ ...editingParty, time: e.target.value })}
                    className="glass border-white/20"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={editingParty.location}
                  onChange={(e) => setEditingParty({ ...editingParty, location: e.target.value })}
                  className="glass border-white/20"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={editingParty.city}
                  onChange={(e) => setEditingParty({ ...editingParty, city: e.target.value })}
                  className="glass border-white/20"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={editingParty.price}
                    onChange={(e) => setEditingParty({ ...editingParty, price: Number(e.target.value) })}
                    className="glass border-white/20"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="capacity">Capacity</Label>
                  <Input
                    id="capacity"
                    type="number"
                    value={editingParty.capacity}
                    onChange={(e) => setEditingParty({ ...editingParty, capacity: Number(e.target.value) })}
                    className="glass border-white/20"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="ageRange">Age Range</Label>
                <Input
                  id="ageRange"
                  value={editingParty.ageRange}
                  onChange={(e) => setEditingParty({ ...editingParty, ageRange: e.target.value })}
                  className="glass border-white/20"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type">Type</Label>
                <Input
                  id="type"
                  value={editingParty.type}
                  onChange={(e) => setEditingParty({ ...editingParty, type: e.target.value })}
                  className="glass border-white/20"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={editingParty.description}
                  onChange={(e) => setEditingParty({ ...editingParty, description: e.target.value })}
                  className="glass border-white/20 min-h-[100px]"
                />
              </div>
              <div className="grid gap-2">
                <Label>Party Images</Label>
                <div className="space-y-3">
                  {editingParty.images && editingParty.images.length > 0 && (
                    <div className="grid grid-cols-3 gap-3">
                      {editingParty.images.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image}
                            alt={`Party image ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border border-white/20"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Input
                      id="party-images"
                      type="file"
                      accept="image/jpeg,image/jpg,image/png"
                      multiple
                      onChange={handleImageUpload}
                      className="glass border-white/20"
                      disabled={isUploadingImages}
                    />
                    {isUploadingImages && (
                      <span className="text-sm text-muted-foreground">Uploading...</span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Upload party images (JPG or PNG, max 10MB each)
                  </p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} className="gradient-button">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="glass-strong border-white/10">
          <DialogHeader>
            <DialogTitle>Delete Party</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{partyToDelete?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleConfirmDelete} 
              className="bg-red-500/20 text-red-500 hover:bg-red-500/30 border-red-500/30"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}


