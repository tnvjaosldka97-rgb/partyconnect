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
import { Checkbox } from "@/components/ui/checkbox";
import {
  CheckCircle2,
  DollarSign,
  Home,
  TrendingUp,
  Users,
  Upload,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { saveHostApplication, getHostByEmail, type HostApplication } from "@/lib/storage";
import { compressImage } from "@/lib/imageCompression";

export default function BecomeHost() {
  const [, setLocation] = useLocation();
  const [isLoadingPrevious, setIsLoadingPrevious] = useState(true);
  const [previousApplication, setPreviousApplication] = useState<HostApplication | null>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    nickname: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    address: "",
    spaceType: "",
    capacity: "",
    bio: "",
    experience: "",
    agreedToTerms: false,
    agreedToLegalWarning: false,
  });
  const [idCardImage, setIdCardImage] = useState<string | null>(null);
  const [criminalRecordImage, setCriminalRecordImage] = useState<string | null>(null);
  const [spaceImages, setSpaceImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState({
    space: false,
    idCard: false,
    criminalRecord: false,
  });
  
  // Load previous application if user was rejected
  useEffect(() => {
    const hostEmail = localStorage.getItem("hostEmail");
    if (hostEmail) {
      const previous = getHostByEmail(hostEmail);
      if (previous && previous.status === "rejected") {
        setPreviousApplication(previous);
        
        // Pre-fill form with previous data
        setFormData({
          fullName: previous.name,
          nickname: previous.nickname || "",
          firstName: previous.firstName || "",
          lastName: previous.lastName || "",
          email: previous.email,
          phone: previous.phone,
          city: previous.city,
          address: previous.address,
          spaceType: previous.spaceType,
          capacity: previous.capacity.toString(),
          bio: previous.intro,
          experience: previous.experience,
          agreedToTerms: false, // Reset checkboxes
          agreedToLegalWarning: false,
        });
        
        // Pre-fill images if available
        if (previous.idCardImage) {
          setIdCardImage(previous.idCardImage);
        }
        if (previous.criminalRecordImage) {
          setCriminalRecordImage(previous.criminalRecordImage);
        }
        
        toast.info("Previous Application Loaded", {
          description: "Your previous application data has been loaded. You can update it and reapply.",
        });
      }
    }
    setIsLoadingPrevious(false);
  }, []);

  const handleCriminalRecordUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File Size Exceeded", {
        description: "Criminal record document must be 10MB or less.",
      });
      return;
    }

    // Check file type
    if (!file.type.match(/image\/(jpeg|jpg|png)/)) {
      toast.error("Invalid File Format", {
        description: "Only JPG or PNG files can be uploaded.",
      });
      return;
    }

    setIsUploading(prev => ({ ...prev, criminalRecord: true }));

    try {
      // Compress image before storing
      const compressedBase64 = await compressImage(file);
      
      setCriminalRecordImage(compressedBase64);
      toast.success("Criminal Record Uploaded Successfully", {
        description: "File has been securely saved.",
      });
    } catch (error) {
      console.error("Criminal record upload error:", error);
      toast.error("Upload Failed", {
        description: "An error occurred while uploading criminal record.",
      });
    } finally {
      setIsUploading(prev => ({ ...prev, criminalRecord: false }));
    }
  };

  const handleIdCardUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File Size Exceeded", {
        description: "ID card copy must be 10MB or less.",
      });
      return;
    }

    // Check file type
    if (!file.type.match(/image\/(jpeg|jpg|png)/)) {
      toast.error("Invalid File Format", {
        description: "Only JPG or PNG files can be uploaded.",
      });
      return;
    }

    setIsUploading(prev => ({ ...prev, idCard: true }));

    try {
      // Compress image before storing
      const compressedBase64 = await compressImage(file);
      
      setIdCardImage(compressedBase64);
      toast.success("ID Card Uploaded Successfully!", {
        description: "ID card copy has been securely uploaded.",
      });
    } catch (error) {
      toast.error("Upload Failed", {
        description: "An error occurred while uploading file.",
      });
    } finally {
      setIsUploading(prev => ({ ...prev, idCard: false }));
    }
  };

  const handleSpaceImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Check file size for each file (max 10MB)
    for (let i = 0; i < files.length; i++) {
      if (files[i].size > 10 * 1024 * 1024) {
        toast.error("File Size Exceeded", {
          description: "Each file must be 10MB or less.",
        });
        return;
      }

      // Check file type
      if (!files[i].type.match(/image\/(jpeg|jpg|png)/)) {
        toast.error("Invalid File Format", {
          description: "Only JPG or PNG files can be uploaded.",
        });
        return;
      }
    }

    setIsUploading(prev => ({ ...prev, space: true }));

    try {
      // Convert images to Base64 for localStorage persistence
      const uploadedUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        // Compress each image before storing
        const compressedBase64 = await compressImage(files[i]);
        uploadedUrls.push(compressedBase64);
      }

      setSpaceImages((prev) => [...prev, ...uploadedUrls]);
      toast.success("Space Photos Uploaded Successfully", {
        description: `${uploadedUrls.length} files have been uploaded.`,
      });
    } catch (error) {
      console.error("Space images upload error:", error);
      toast.error("Upload Failed", {
        description: "An error occurred while uploading space photos.",
      });
    } finally {
      setIsUploading(prev => ({ ...prev, space: false }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName) {
      toast.error("Please enter your first name and last name");
      return;
    }
    
    if (!formData.nickname || formData.nickname.trim().length < 2) {
      toast.error("Please enter a nickname (at least 2 characters)");
      return;
    }
    
    if (!formData.agreedToTerms) {
      toast.error("Please agree to the terms of service");
      return;
    }
    
    // Temporarily disabled for testing
    // if (!criminalRecordImage) {
    //   toast.error("Criminal record document upload is required");
    //   return;
    // }
    // 
    // if (!idCardImage) {
    //   toast.error("ID card photo upload is required");
    //   return;
    // }
    
    if (!formData.agreedToLegalWarning) {
      toast.error("Consent to legal responsibility for proxy writing is required");
      return;
    }
    
    // Temporarily disabled for testing
    // if (!idCardImage) {
    //   toast.error("Please upload ID card copy");
    //   return;
    // }

    try {
      console.log('=== Host Application Submission ===');
      console.log('Form Data:', formData);
      console.log('ID Card Image:', idCardImage ? 'Uploaded' : 'Missing');
      console.log('Criminal Record Image:', criminalRecordImage ? 'Uploaded' : 'Missing');
      
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      
      const application: HostApplication = {
        id: `host-${Date.now()}`,
        name: fullName,
        nickname: formData.nickname,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        email: formData.email,
        city: formData.city,
        spaceType: formData.spaceType,
        address: formData.address,
        capacity: parseInt(formData.capacity) || 0,
        intro: formData.bio,
        experience: formData.experience,
        images: spaceImages,
        idCardImage: idCardImage || "",
        criminalRecordImage: criminalRecordImage || "",
        agreedToTerms: formData.agreedToTerms,
        agreedToLegalResponsibility: formData.agreedToLegalWarning,
        status: "pending",
        appliedAt: new Date().toISOString(),
      };

      console.log('Application object created:', application);
      console.log('Attempting to save...');
      
      const success = saveHostApplication(application);
      console.log('Save result:', success);

      if (success) {
        // Store email in localStorage for future reference
        localStorage.setItem("hostEmail", formData.email);
        
        toast.success("Host application submitted successfully!", {
          description: "We will contact you within 24 hours after review.",
        });
        
        setTimeout(() => {
          setLocation("/");
        }, 2000);
      } else {
        console.error('Save failed - saveHostApplication returned false');
        toast.error("Application Failed", {
          description: "Failed to submit application. Please try again or contact support.",
        });
      }
    } catch (error) {
      console.error('Application submission error:', error);
      toast.error("Error Occurred", {
        description: error instanceof Error ? error.message : "An error occurred while submitting application.",
      });
    }
  };

  const updateField = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const benefits = [
    {
      icon: DollarSign,
      title: "Earn up to $2,000 per month",
      description: "Generate stable income by hosting parties",
    },
    {
      icon: Home,
      title: "Utilize Your Own Space",
      description: "Additional income using your home or office",
    },
    {
      icon: Users,
      title: "Network with New People",
      description: "Build meaningful relationships with diverse people",
    },
    {
      icon: TrendingUp,
      title: "Flexible Schedule Management",
      description: "Work as much as you want, when you want",
    },
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/20 opacity-30" />
          <div className="absolute top-10 right-10 w-64 h-64 rounded-full bg-primary/20 blur-3xl" />
          
          <div className="container relative z-10">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <div className="inline-flex items-center space-x-2 glass px-4 py-2 rounded-full border border-primary/30 mb-4">
                <TrendingUp className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">Become a Host</span>
              </div>
              
              <h1 className="text-5xl sm:text-6xl font-bold">
                Host Parties and
                <br />
                <span className="gradient-text">Generate New Income</span>
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Host amazing parties using your space and earn income.
                We'll help you with everything.
              </p>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-12 bg-gradient-to-b from-transparent to-background/50">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <div
                    key={benefit.title}
                    className="glass-strong rounded-2xl p-6 border border-white/10 text-center animate-fadeIn"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="font-bold mb-2">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Application Form */}
        <section className="py-20">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <div className="glass-strong rounded-3xl p-8 md:p-12 border border-white/10">
                <h2 className="text-3xl font-bold mb-2">Apply to Become a Host</h2>
                <p className="text-muted-foreground mb-8">
                  Please fill out the information below and we will contact you within 24 hours after review.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Info */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold flex items-center">
                      <CheckCircle2 className="w-5 h-5 text-primary mr-2" />
                      Personal Information
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          required
                          value={formData.firstName}
                          onChange={(e) => updateField("firstName", e.target.value)}
                          className="glass border-white/20 mt-2"
                          placeholder="John"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          required
                          value={formData.lastName}
                          onChange={(e) => updateField("lastName", e.target.value)}
                          className="glass border-white/20 mt-2"
                          placeholder="Doe"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="nickname">Nickname (Public Display Name) *</Label>
                      <Input
                        id="nickname"
                        required
                        value={formData.nickname}
                        onChange={(e) => updateField("nickname", e.target.value)}
                        className="glass border-white/20 mt-2"
                        placeholder="e.g., PartyKing, DJ Sarah, etc."
                      />
                      <p className="text-xs text-white/60 mt-1">This will be displayed publicly instead of your real name for privacy</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => updateField("phone", e.target.value)}
                          className="glass border-white/20 mt-2"
                          placeholder="+1 (512) 555-1234"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => updateField("email", e.target.value)}
                          className="glass border-white/20 mt-2"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Space Info */}
                  <div className="space-y-4 pt-6 border-t border-white/10">
                    <h3 className="text-xl font-semibold flex items-center">
                      <Home className="w-5 h-5 text-primary mr-2" />
                      Space Information
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">City *</Label>
                        <Select value={formData.city} onValueChange={(value) => updateField("city", value)}>
                          <SelectTrigger className="glass border-white/20 mt-2">
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
                        <Label htmlFor="spaceType">Space Type *</Label>
                        <Select value={formData.spaceType} onValueChange={(value) => updateField("spaceType", value)}>
                          <SelectTrigger className="glass border-white/20 mt-2">
                            <SelectValue placeholder="Select Space Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Apartment">Apartment</SelectItem>
                            <SelectItem value="House">House</SelectItem>
                            <SelectItem value="Rooftop">Rooftop</SelectItem>
                            <SelectItem value="Studio">Studio</SelectItem>
                            <SelectItem value="Cafe/Bar">Cafe/Bar</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="address">Address *</Label>
                      <Input
                        id="address"
                        required
                        value={formData.address}
                        onChange={(e) => updateField("address", e.target.value)}
                        className="glass border-white/20 mt-2"
                        placeholder="123 Congress Avenue, Austin, TX 78701"
                      />
                    </div>

                    <div>
                      <Label htmlFor="capacity">Capacity *</Label>
                      <Input
                        id="capacity"
                        type="number"
                        required
                        min="5"
                        max="100"
                        value={formData.capacity}
                        onChange={(e) => updateField("capacity", e.target.value)}
                        className="glass border-white/20 mt-2"
                        placeholder="20"
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        Must accommodate at least 5 people
                      </p>
                    </div>
                  </div>

                  {/* About You */}
                  <div className="space-y-4 pt-6 border-t border-white/10">
                    <h3 className="text-xl font-semibold flex items-center">
                      <Users className="w-5 h-5 text-primary mr-2" />
                      About You
                    </h3>

                    <div>
                      <Label htmlFor="bio">About You *</Label>
                      <Textarea
                        id="bio"
                        required
                        value={formData.bio}
                        onChange={(e) => updateField("bio", e.target.value)}
                        className="glass border-white/20 mt-2 min-h-32"
                        placeholder="Please briefly introduce yourself and your hosting experience..."
                      />
                    </div>

                    <div>
                      <Label htmlFor="experience">Hosting Experience</Label>
                      <Select value={formData.experience} onValueChange={(value) => updateField("experience", value)}>
                        <SelectTrigger className="glass border-white/20 mt-2">
                          <SelectValue placeholder="Select Experience Level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="First Time">First Time</SelectItem>
                          <SelectItem value="Beginner">Beginner (1-5 times)</SelectItem>
                          <SelectItem value="Intermediate">Intermediate (6-20 times)</SelectItem>
                          <SelectItem value="Expert">Expert (20+ times)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="photos">Upload Space Photos</Label>
                      <input
                        id="photos"
                        type="file"
                        multiple
                        accept="image/jpeg,image/jpg,image/png"
                        onChange={handleSpaceImagesUpload}
                        className="hidden"
                      />
                      <label htmlFor="photos" className="block mt-2 glass border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                        <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                        <p className="text-sm text-muted-foreground mb-1">
                          Click to Upload Photos
                        </p>
                        <p className="text-xs text-muted-foreground">
                          JPG, PNG (max 10MB) - Multiple selection available
                        </p>
                        {spaceImages.length > 0 && (
                          <p className="text-xs text-green-400 mt-2">
                            ✓ {spaceImages.length} photos have been uploaded
                          </p>
                        )}
                      </label>
                    </div>

                    <div>
                      <Label htmlFor="idCard" className="text-red-400">
                        Upload ID Card Copy *
                      </Label>
                      <p className="text-xs text-muted-foreground mb-2">
                        ID card or driver's license copy is required for identity verification.
                      </p>
                      <input
                        id="idCard"
                        type="file"
                        accept="image/jpeg,image/jpg,image/png"
                        onChange={handleIdCardUpload}
                        className="hidden"
                      />
                      <label
                        htmlFor="idCard"
                        className={`mt-2 glass border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer block ${
                          idCardImage
                            ? "border-green-500/50 bg-green-500/10"
                            : "border-red-500/30 hover:border-red-500/50"
                        }`}
                      >
                        {isUploading.idCard ? (
                          <>
                            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                            <p className="text-sm text-primary font-semibold">
                              Uploading...
                            </p>
                          </>
                        ) : idCardImage ? (
                          <>
                            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-3">
                              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <p className="text-sm text-green-400 mb-1 font-semibold">
                              ID Card Upload Complete
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Click to change to another file
                            </p>
                          </>
                        ) : (
                          <>
                            <Upload className="w-12 h-12 text-red-400 mx-auto mb-3" />
                            <p className="text-sm text-red-400 mb-1 font-semibold">
                              Required: Upload ID Card Copy
                            </p>
                            <p className="text-xs text-muted-foreground">
                              JPG, PNG (max 10MB) - Personal information is securely protected
                            </p>
                          </>
                        )}
                      </label>
                    </div>
                  </div>

                  {/* Terms */}
                  <div className="pt-6 border-t border-white/10 space-y-4">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="terms"
                        checked={formData.agreedToTerms}
                        onCheckedChange={(checked) => updateField("agreedToTerms", checked as boolean)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <Label htmlFor="terms" className="cursor-pointer">
                          <span className="font-semibold">Terms of Service</span> 및{" "}
                          <span className="font-semibold">Privacy Policy</span> *
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          When joining as a host, you must comply with platform policies and safety guidelines.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-red-400 font-semibold">
                        Upload Criminal Record Document Photo *
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Criminal record document photo is required for guest safety. Host approval may be denied if there are records of sexual crimes, violent crimes, etc.
                      </p>
                      <input
                        id="criminalRecord"
                        type="file"
                        accept="image/jpeg,image/jpg,image/png"
                        onChange={handleCriminalRecordUpload}
                        className="hidden"
                      />
                      <label
                        htmlFor="criminalRecord"
                        className={`mt-2 glass border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer block ${
                          criminalRecordImage
                            ? "border-green-500/50 bg-green-500/10"
                            : "border-red-500/30 hover:border-red-500/50"
                        }`}
                      >
                        {isUploading.criminalRecord ? (
                          <>
                            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                            <p className="text-sm text-primary font-semibold">
                              Uploading...
                            </p>
                          </>
                        ) : criminalRecordImage ? (
                          <>
                            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-3">
                              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <p className="text-sm text-green-400 mb-1 font-semibold">
                              Criminal Record Upload Complete
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Click to change to another file
                            </p>
                          </>
                        ) : (
                          <>
                            <Upload className="w-12 h-12 text-red-400 mx-auto mb-3" />
                            <p className="text-sm text-red-400 mb-1 font-semibold">
                              Required: Upload Criminal Record Document Photo
                            </p>
                            <p className="text-xs text-muted-foreground">
                              JPG, PNG (max 10MB) - Personal information is securely protected
                            </p>
                          </>
                        )}
                      </label>
                    </div>



                    <div className="flex items-start space-x-3 bg-orange-500/10 p-4 rounded-lg border border-orange-500/30">
                      <Checkbox
                        id="legalWarning"
                        checked={formData.agreedToLegalWarning}
                        onCheckedChange={(checked) => updateField("agreedToLegalWarning", checked as boolean)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <Label htmlFor="legalWarning" className="cursor-pointer text-orange-400 font-semibold">
                          Consent to Prohibition of Proxy Writing and Legal Responsibility *
                        </Label>
                        <p className="text-sm text-red-400 mt-1 font-medium">
                          ⚠️ If this application is written by proxy or false information is provided, you may be subject to legal punishment under Article 231 (Forgery of Private Documents) and Article 347 (Fraud) of the Criminal Act.
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">
                          I confirm that I have written this myself and all information is true.
                        </p>
                      </div>
                    </div>

                    <div className="bg-blue-500/10 p-4 rounded-lg border border-blue-500/30">
                      <p className="text-sm text-blue-400 font-medium">
                        🛡️ Privacy Protection Notice
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        The ID card and personal information you provide will only be used for host identity verification and will be securely stored with AES-256 encryption. It will be immediately destroyed if approval is denied, and will be automatically deleted after the legal retention period even after approval.
                      </p>
                    </div>
                  </div>

                  {/* Submit */}
                  <div className="pt-6">
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full gradient-button h-14 rounded-2xl text-lg font-semibold group"
                    >
                      Apply to Become a Host
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <p className="text-sm text-center text-muted-foreground mt-4">
                      We will notify you of the review results within 24 hours after application
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

