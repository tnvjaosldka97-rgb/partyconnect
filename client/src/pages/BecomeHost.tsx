import { useState } from "react";
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
import { saveHostApplication, type HostApplication } from "@/lib/storage";

export default function BecomeHost() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    fullName: "",
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

  const handleCriminalRecordUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("파일 크기 초과", {
        description: "범죄기록증명원은 10MB or less여야 합니다.",
      });
      return;
    }

    // Check file type
    if (!file.type.match(/image\/(jpeg|jpg|png)/)) {
      toast.error("파일 형식 오류", {
        description: "JPG 또는 PNG 파일만 업로드 가능합니다.",
      });
      return;
    }

    setIsUploading(prev => ({ ...prev, criminalRecord: true }));

    try {
      // Mock upload: Create local URL for preview
      const localUrl = URL.createObjectURL(file);
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCriminalRecordImage(localUrl);
      toast.success("범죄기록증명원 업로드 성공", {
        description: "파일이 안전하게 저장되었습니다.",
      });
    } catch (error) {
      console.error("Criminal record upload error:", error);
      toast.error("업로드 실패", {
        description: "범죄기록증명원 업로드 중 오류가 발생했습니다.",
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
      toast.error("파일 크기 초과", {
        description: "신분증 사본은 10MB or less여야 합니다.",
      });
      return;
    }

    // Check file type
    if (!file.type.match(/image\/(jpeg|jpg|png)/)) {
      toast.error("파일 형식 오류", {
        description: "JPG 또는 PNG 파일만 업로드 가능합니다.",
      });
      return;
    }

    setIsUploading(prev => ({ ...prev, idCard: true }));

    try {
      // Mock upload: Create local URL for preview
      const localUrl = URL.createObjectURL(file);
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIdCardImage(localUrl);
      toast.success("신분증 업로드 성공!", {
        description: "신분증 사본이 안전하게 업로드되었습니다.",
      });
    } catch (error) {
      toast.error("업로드 실패", {
        description: "파일 업로드 중 오류가 발생했습니다.",
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
        toast.error("파일 크기 초과", {
          description: "각 파일은 10MB or less여야 합니다.",
        });
        return;
      }

      // Check file type
      if (!files[i].type.match(/image\/(jpeg|jpg|png)/)) {
        toast.error("파일 형식 오류", {
          description: "JPG 또는 PNG 파일만 업로드 가능합니다.",
        });
        return;
      }
    }

    setIsUploading(prev => ({ ...prev, space: true }));

    try {
      // Mock upload: Create local URLs for preview
      const uploadedUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const localUrl = URL.createObjectURL(files[i]);
        uploadedUrls.push(localUrl);
      }

      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      setSpaceImages((prev) => [...prev, ...uploadedUrls]);
      toast.success("공간 사진 업로드 성공", {
        description: `${uploadedUrls.length}개의 파일이 업로드되었습니다.`,
      });
    } catch (error) {
      console.error("Space images upload error:", error);
      toast.error("업로드 실패", {
        description: "공간 사진 업로드 중 오류가 발생했습니다.",
      });
    } finally {
      setIsUploading(prev => ({ ...prev, space: false }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.agreedToTerms) {
      toast.error("이용약관에 동의해주세요");
      return;
    }
    
    if (!criminalRecordImage) {
      toast.error("범죄기록증명원 사진 업로드는 필수입니다");
      return;
    }
    
    if (!idCardImage) {
      toast.error("신분증 사진 업로드는 필수입니다");
      return;
    }
    
    if (!formData.agreedToLegalWarning) {
      toast.error("대리 작성 법적 책임 동의는 필수입니다");
      return;
    }
    
    if (!idCardImage) {
      toast.error("신분증 사본을 업로드해주세요");
      return;
    }

    try {
      const application: HostApplication = {
        id: `host-${Date.now()}`,
        name: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        city: formData.city,
        spaceType: formData.spaceType,
        address: formData.address,
        capacity: parseInt(formData.capacity) || 0,
        intro: formData.bio,
        experience: formData.experience,
        images: [],
        idCardImage: idCardImage || "",
        criminalRecordImage: criminalRecordImage || "",
        agreedToTerms: formData.agreedToTerms,
        agreedToLegalResponsibility: formData.agreedToLegalWarning,
        status: "pending",
        appliedAt: new Date().toISOString(),
      };

      const success = saveHostApplication(application);

      if (success) {
        toast.success("Host application submitted successfully!", {
          description: "검토 후 24시간 내에 연락드리겠습니다.",
        });
        
        setTimeout(() => {
          setLocation("/");
        }, 2000);
      } else {
        toast.error("신청 실패", {
          description: "신청 제출에 실패했습니다.",
        });
      }
    } catch (error) {
      toast.error("오류 발생", {
        description: "신청 제출 중 오류가 발생했습니다.",
      });
    }
  };

  const updateField = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const benefits = [
    {
      icon: DollarSign,
      title: "월 최대 $2,000 수익",
      description: "Host a Party으로 안정적인 수익 창출",
    },
    {
      icon: Home,
      title: "자신의 공간 활용",
      description: "집이나 사무실을 활용한 부가 수익",
    },
    {
      icon: Users,
      title: "새로운 사람들과 네트워킹",
      description: "다양한 사람들과 의미있는 관계 형성",
    },
    {
      icon: TrendingUp,
      title: "유연한 일정 관리",
      description: "원하는 시간에 원하는 만큼만",
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
                <span className="gradient-text">새로운 수익을 창출하세요</span>
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                당신의 공간을 활용하여 멋진 파티를 주최하고 수익을 얻으세요.
                우리가 All 것을 도와드립니다.
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
                  아래 정보를 입력해주시면 검토 후 24시간 내에 연락드리겠습니다.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Info */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold flex items-center">
                      <CheckCircle2 className="w-5 h-5 text-primary mr-2" />
                      개인 정보
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="fullName">이름 *</Label>
                        <Input
                          id="fullName"
                          required
                          value={formData.fullName}
                          onChange={(e) => updateField("fullName", e.target.value)}
                          className="glass border-white/20 mt-2"
                          placeholder="홍길동"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="phone">전화번호 *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => updateField("phone", e.target.value)}
                          className="glass border-white/20 mt-2"
                          placeholder="010-1234-5678"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">이메일 *</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        className="glass border-white/20 mt-2"
                        placeholder="example@email.com"
                      />
                    </div>
                  </div>

                  {/* Space Info */}
                  <div className="space-y-4 pt-6 border-t border-white/10">
                    <h3 className="text-xl font-semibold flex items-center">
                      <Home className="w-5 h-5 text-primary mr-2" />
                      공간 정보
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">도시 *</Label>
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
                        <Label htmlFor="spaceType">공간 유형 *</Label>
                        <Select value={formData.spaceType} onValueChange={(value) => updateField("spaceType", value)}>
                          <SelectTrigger className="glass border-white/20 mt-2">
                            <SelectValue placeholder="공간 유형 선택" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="아파트">아파트</SelectItem>
                            <SelectItem value="주택">주택</SelectItem>
                            <SelectItem value="루프탑">루프탑</SelectItem>
                            <SelectItem value="스튜디오">스튜디오</SelectItem>
                            <SelectItem value="카페/바">카페/바</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="address">주소 *</Label>
                      <Input
                        id="address"
                        required
                        value={formData.address}
                        onChange={(e) => updateField("address", e.target.value)}
                        className="glass border-white/20 mt-2"
                        placeholder="New York시 Manhattan 테헤란로 123"
                      />
                    </div>

                    <div>
                      <Label htmlFor="capacity">수용 인원 *</Label>
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
                        최소 5명 이상 수용 가능해야 합니다
                      </p>
                    </div>
                  </div>

                  {/* About You */}
                  <div className="space-y-4 pt-6 border-t border-white/10">
                    <h3 className="text-xl font-semibold flex items-center">
                      <Users className="w-5 h-5 text-primary mr-2" />
                      자기소개
                    </h3>

                    <div>
                      <Label htmlFor="bio">자기소개 *</Label>
                      <Textarea
                        id="bio"
                        required
                        value={formData.bio}
                        onChange={(e) => updateField("bio", e.target.value)}
                        className="glass border-white/20 mt-2 min-h-32"
                        placeholder="자신과 호스팅 경험에 대해 간단히 소개해주세요..."
                      />
                    </div>

                    <div>
                      <Label htmlFor="experience">호스팅 경험</Label>
                      <Select value={formData.experience} onValueChange={(value) => updateField("experience", value)}>
                        <SelectTrigger className="glass border-white/20 mt-2">
                          <SelectValue placeholder="경험 수준 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="없음">없음 (처음입니다)</SelectItem>
                          <SelectItem value="초보">초보 (1-5회)</SelectItem>
                          <SelectItem value="중급">중급 (6-20회)</SelectItem>
                          <SelectItem value="전문">전문 (20회 이상)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="photos">공간 사진 업로드</Label>
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
                          클릭하여 사진 업로드
                        </p>
                        <p className="text-xs text-muted-foreground">
                          JPG, PNG (최대 10MB) - 여러 장 선택 가능
                        </p>
                        {spaceImages.length > 0 && (
                          <p className="text-xs text-green-400 mt-2">
                            ✓ {spaceImages.length}개의 사진이 업로드되었습니다
                          </p>
                        )}
                      </label>
                    </div>

                    <div>
                      <Label htmlFor="idCard" className="text-red-400">
                        신분증 사본 업로드 *
                      </Label>
                      <p className="text-xs text-muted-foreground mb-2">
                        본인 확인을 위해 주민등록증 또는 운전면허증 사본이 필요합니다.
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
                              업로드 중...
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
                              신분증 업로드 완료
                            </p>
                            <p className="text-xs text-muted-foreground">
                              다른 파일로 변경하려면 클릭하세요
                            </p>
                          </>
                        ) : (
                          <>
                            <Upload className="w-12 h-12 text-red-400 mx-auto mb-3" />
                            <p className="text-sm text-red-400 mb-1 font-semibold">
                              필수: 신분증 사본 업로드
                            </p>
                            <p className="text-xs text-muted-foreground">
                              JPG, PNG (최대 10MB) - 개인정보는 안전하게 보호됩니다
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
                          <span className="font-semibold">이용약관</span> 및{" "}
                          <span className="font-semibold">개인정보처리방침</span>에 동의합니다 *
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          호스트 가입 시 플랫폼 정책과 안전 가이드라인을 준수해야 합니다.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-red-400 font-semibold">
                        범죄기록증명원 사진 업로드 *
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        게스트의 안전을 위해 범죄기록증명원 사진이 필요합니다. 성범죄, 폭력범죄 등의 기록이 있을 경우 호스트 승인이 거부될 수 있습니다.
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
                              업로드 중...
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
                              범죄기록증명원 업로드 완료
                            </p>
                            <p className="text-xs text-muted-foreground">
                              다른 파일로 변경하려면 클릭하세요
                            </p>
                          </>
                        ) : (
                          <>
                            <Upload className="w-12 h-12 text-red-400 mx-auto mb-3" />
                            <p className="text-sm text-red-400 mb-1 font-semibold">
                              필수: 범죄기록증명원 사진 업로드
                            </p>
                            <p className="text-xs text-muted-foreground">
                              JPG, PNG (최대 10MB) - 개인정보는 안전하게 보호됩니다
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
                          대리 작성 금지 및 법적 책임 동의 *
                        </Label>
                        <p className="text-sm text-red-400 mt-1 font-medium">
                          ⚠️ 본 신청서를 타인이 대리로 작성하거나 허위 정보를 제공할 경우, 형법 제231조(사문서 위조) 및 제347조(사기)에 따라 법적 처벌을 받을 수 있습니다.
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">
                          본인이 직접 작성하였으며, All 정보가 사실임을 확인합니다.
                        </p>
                      </div>
                    </div>

                    <div className="bg-blue-500/10 p-4 rounded-lg border border-blue-500/30">
                      <p className="text-sm text-blue-400 font-medium">
                        🛡️ 개인정보 보호 안내
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        제공하신 신분증 및 개인정보는 호스트 신원 확인 목적으로만 사용되며, AES-256 암호화로 안전하게 보관됩니다. 승인 거부 시 즉시 파기되며, 승인 후에도 법적 보관 기간 종료 시 자동 삭제됩니다.
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
                      신청 후 24시간 내에 검토 결과를 알려드립니다
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

