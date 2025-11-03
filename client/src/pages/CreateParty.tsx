import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Upload,
  ArrowRight,
  CheckCircle2,
  Clock,
  Tag,
  Shield,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { saveParty, getHostByEmail } from "@/lib/storage";
import { sanitizeInput, validatePartyDateTime, validateCapacity, validatePrice } from "@/lib/validation";
import { uploadMultipleImages } from "@/lib/imageUpload";

export default function CreateParty() {
  const [, setLocation] = useLocation();
  const [hostEmail, setHostEmail] = useState("");
  const [isHostVerified, setIsHostVerified] = useState(false);
  const [currentHost, setCurrentHost] = useState<{ id: string; name: string; email: string } | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    city: "",
    address: "",
    type: "",
    theme: "",
    ageRange: "",
    maxAttendees: "",
    price: "",
    included: "",
  });
  const [partyImages, setPartyImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Auto-verify host on page load if hostEmail exists in localStorage
  useEffect(() => {
    const savedHostEmail = localStorage.getItem("hostEmail");
    if (savedHostEmail) {
      setHostEmail(savedHostEmail);
      const host = getHostByEmail(savedHostEmail);
      if (host) {
        setIsHostVerified(true);
        setCurrentHost(host);
      }
    }
  }, []);

  const handleRemoveImage = (index: number) => {
    setPartyImages((prev) => prev.filter((_, i) => i !== index));
    toast.success("Image removed");
  };

  const handleHostVerification = () => {
    if (!hostEmail.trim()) {
      toast.error("Please enter your email");
      return;
    }

    const host = getHostByEmail(hostEmail);
    if (host) {
      setIsHostVerified(true);
      setCurrentHost(host);
      toast.success("Host Verified Successfully!", {
        description: `Welcome, ${host.name}님!`,
      });
    } else {
      toast.error("Not an Approved Host", {
        description: "You must apply as a host and get approved before creating parties.",
      });
    }
  };

  const MAX_IMAGES = 10;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Check image count limit
    if (partyImages.length + files.length > MAX_IMAGES) {
      toast.error("Too Many Images", {
        description: `Maximum ${MAX_IMAGES} images allowed. You can upload ${MAX_IMAGES - partyImages.length} more.`,
      });
      return;
    }

    // File size and format validation
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

    setIsUploading(true);

    try {
      // Convert FileList to Array
      const fileArray = Array.from(files);
      
      // Upload all images to imgbb
      const results = await uploadMultipleImages(fileArray);
      
      const uploadedUrls: string[] = [];
      const failedFiles: string[] = [];
      
      results.forEach((result, index) => {
        if (result.success && result.url) {
          uploadedUrls.push(result.url);
        } else {
          failedFiles.push(fileArray[index].name);
        }
      });

      // Update state with successfully uploaded images
      if (uploadedUrls.length > 0) {
        setPartyImages((prev) => [...prev, ...uploadedUrls]);
      }

      // Show appropriate toast message
      if (failedFiles.length === 0) {
        toast.success("Party Images Uploaded Successfully!", {
          description: `${uploadedUrls.length} file(s) uploaded.`,
        });
      } else if (uploadedUrls.length > 0) {
        toast.warning(`${uploadedUrls.length} uploaded, ${failedFiles.length} failed`, {
          description: `Failed files: ${failedFiles.join(", ")}`,
        });
      } else {
        toast.error("All uploads failed", {
          description: "Please check your connection and try again.",
        });
      }
    } catch (error) {
      console.error("Party images upload error:", error);
      toast.error("Upload Failed", {
        description: error instanceof Error ? error.message : "An error occurred while uploading party images.",
      });
    } finally {
      setIsUploading(false);
      // Reset input to allow re-uploading same files
      e.target.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 필수 필드 검증
    if (!formData.title || !formData.date || !formData.city || !formData.address || !formData.description) {
      toast.error("Please fill in all required fields", {
        description: "Party title, description, date, city, and address are required.",
      });
      return;
    }
    
    if (!formData.time) {
      toast.error("Please select a time", {
        description: "Party time is required.",
      });
      return;
    }
    
    // Date/Time validation
    const dateTimeValidation = validatePartyDateTime(formData.date, formData.time);
    if (!dateTimeValidation.valid) {
      toast.error("Invalid Date/Time", {
        description: dateTimeValidation.error,
      });
      return;
    }
    
    // Capacity validation
    const capacityValidation = validateCapacity(formData.maxAttendees);
    if (!capacityValidation.valid) {
      toast.error("Invalid Capacity", {
        description: capacityValidation.error,
      });
      return;
    }
    
    // Price validation
    if (formData.price) {
      const priceValidation = validatePrice(formData.price);
      if (!priceValidation.valid) {
        toast.error("Invalid Price", {
          description: priceValidation.error,
        });
        return;
      }
    }

    if (!isHostVerified || !currentHost) {
      toast.error("Host verification required", {
        description: "Please verify your host email first.",
      });
      return;
    }

    // Check if admin is logged in
    const isAdmin = localStorage.getItem("adminLoggedIn") === "true";
    
    // Sanitize all text inputs to prevent XSS
    const partyData = {
      id: `party-${Date.now()}`,
      title: sanitizeInput(formData.title.trim()),
      date: formData.date,
      time: formData.time || "19:00",
      location: sanitizeInput(formData.address.trim()),
      city: sanitizeInput(formData.city.trim()),
      host: sanitizeInput(currentHost.name),
      hostNickname: sanitizeInput(currentHost.nickname || currentHost.name),
      hostId: currentHost.id,
      price: parseInt(formData.price) || 50,
      capacity: parseInt(formData.maxAttendees) || 20,
      attendees: 0,
      ageRange: formData.ageRange || "21-35",
      type: formData.type || "House Party",
      description: sanitizeInput(formData.description.trim()) || "Join us for an amazing party experience!",
      images: partyImages.length > 0 ? partyImages : ["https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800"],
      tags: formData.theme ? [sanitizeInput(formData.theme), sanitizeInput(formData.city)] : [sanitizeInput(formData.city)],
      rating: 4.5,
      reviews: 0,
      status: (isAdmin ? "approved" : "pending") as const,
      createdAt: new Date().toISOString(),
    };

    const success = saveParty(partyData);
    
    if (success) {
      console.log("Party saved successfully:", partyData);
      toast.success("Party Created Successfully!", {
        description: "Your party will be reviewed and published soon.",
      });
      
      setTimeout(() => {
        setLocation("/all-parties");
      }, 2000);
    } else {
      console.error("Failed to save party");
      toast.error("Failed to Create Party", {
        description: "Please try again.",
      });
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/20 opacity-30" />
          
          <div className="container relative z-10">
            <div className="max-w-4xl mx-auto text-center space-y-4">
              <div className="inline-flex items-center space-x-2 glass px-4 py-2 rounded-full border border-primary/30 mb-4">
                <Calendar className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">Create Party</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl font-bold">
                Create a New Party
                <br />
                <span className="gradient-text">and Get Started</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Join special parties prepared by verified hosts
              </p>
            </div>
          </div>
        </section>

        {/* Form Section */}
        <section className="py-16">
          <div className="container">
            <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-8">
              {/* Host Verification */}
              <div className={`glass p-8 rounded-2xl border space-y-6 ${
                isHostVerified ? "border-green-500/50 bg-green-500/5" : "border-primary/30"
              }`}>
                <div className="flex items-center space-x-3 mb-6">
                  <Shield className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-bold">Host Verification</h2>
                  {isHostVerified && (
                    <CheckCircle2 className="w-6 h-6 text-green-500 ml-auto" />
                  )}
                </div>

                {!isHostVerified ? (
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      You must be a verified host to create a party.
                    </p>
                    <div className="flex gap-3">
                      <Input
                        type="email"
                        placeholder="Email address used for host registration"
                        value={hostEmail}
                        onChange={(e) => setHostEmail(e.target.value)}
                        className="glass border-white/20"
                      />
                      <Button
                        type="button"
                        onClick={handleHostVerification}
                        className="gradient-button whitespace-nowrap"
                      >
                        Verify Host
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Not a host yet?{" "}
                      <Link href="/become-host" className="text-primary hover:underline">
                        Apply to Become a Host
                      </Link>
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="font-semibold text-green-400">
                        Verified: {currentHost?.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {currentHost?.email}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Basic Information */}
              <div className="glass p-8 rounded-2xl border border-white/10 space-y-6">
                <div className="flex items-center space-x-3 mb-6">
                  <Tag className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-bold">Basic Information</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Party Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => updateField("title", e.target.value)}
                      placeholder="e.g., Rooftop Party"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Party Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => updateField("description", e.target.value)}
                      placeholder="Enter a description for your party"
                      rows={4}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Date and Time */}
              <div className="glass p-8 rounded-2xl border border-white/10 space-y-6">
                <div className="flex items-center space-x-3 mb-6">
                  <Clock className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-bold">Date and Time</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date">Date *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => updateField("date", e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="time">Time *</Label>
                    <Input
                      id="time"
                      type="time"
                      value={formData.time}
                      onChange={(e) => updateField("time", e.target.value)}
                      lang="en-US"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="glass p-8 rounded-2xl border border-white/10 space-y-6">
                <div className="flex items-center space-x-3 mb-6">
                  <MapPin className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-bold">Location</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Select value={formData.city} onValueChange={(value) => updateField("city", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select City" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="New York">New York</SelectItem>
                        <SelectItem value="Los Angeles">Los Angeles</SelectItem>
                        <SelectItem value="Chicago">Chicago</SelectItem>
                        <SelectItem value="San Francisco">San Francisco</SelectItem>
                        <SelectItem value="Miami">Miami</SelectItem>
                        <SelectItem value="Boston">Boston</SelectItem>
                        <SelectItem value="Seattle">Seattle</SelectItem>
                        <SelectItem value="Austin">Austin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="address">Address *</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => updateField("address", e.target.value)}
                      placeholder="Enter detailed address"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Attendees and Price */}
              <div className="glass p-8 rounded-2xl border border-white/10 space-y-6">
                <div className="flex items-center space-x-3 mb-6">
                  <DollarSign className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-bold">Attendees and Price</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="maxAttendees">Max Attendees *</Label>
                    <Input
                      id="maxAttendees"
                      type="number"
                      value={formData.maxAttendees}
                      onChange={(e) => updateField("maxAttendees", e.target.value)}
                      placeholder="20"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="price">Entry Fee ($) *</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => updateField("price", e.target.value)}
                      placeholder="50000"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Party Images */}
              <div className="glass p-8 rounded-2xl border border-white/10 space-y-6">
                <div className="flex items-center space-x-3 mb-6">
                  <Upload className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-bold">Party Images</h2>
                </div>

                <div className="space-y-4">
                  {/* Image Preview Grid */}
                  {partyImages.length > 0 && (
                    <div>
                      <Label>Uploaded Images ({partyImages.length})</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                        {partyImages.map((image, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={image}
                              alt={`Party image ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg border border-white/20"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(index)}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Upload Button */}
                  <div>
                    <Label htmlFor="images">Click to Upload Images</Label>
                    <input
                      id="images"
                      type="file"
                      accept="image/jpeg,image/jpg,image/png"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="images"
                      className={`mt-2 flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-all ${
                        partyImages.length > 0
                          ? "border-green-500/50 bg-green-500/10"
                          : "border-white/20 hover:border-primary/50"
                      }`}
                    >
                      {isUploading ? (
                        <>
                          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                          <p className="text-sm text-primary font-semibold">
                            Uploading...
                          </p>
                        </>
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground mb-1">
                            {partyImages.length > 0 ? "Upload More Images" : "Click to Upload Images"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            JPG, PNG (max 10MB) - Multiple files allowed
                          </p>
                        </>
                      )}
                    </label>
                  </div>
                </div>
              </div>

              {/* 제출 버튼 */}
              <div className="flex justify-center pt-6">
                <Button
                  type="submit"
                  size="lg"
                  className="px-12 group"
                >
                  Create Party
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>

              <p className="text-center text-sm text-muted-foreground">
                Review results will be notified within 24 hours after registration
              </p>
            </form>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}

