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
} from "lucide-react";
import { toast } from "sonner";
import { saveParty, getHostByEmail } from "@/lib/storage";

export default function CreateParty() {
  const [, setLocation] = useLocation();
  const [hostEmail, setHostEmail] = useState("");
  const [isHostVerified, setIsHostVerified] = useState(false);
  const [currentHost, setCurrentHost] = useState<any>(null);
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

  const handleHostVerification = () => {
    if (!hostEmail.trim()) {
      toast.error("이메일을 입력해주세요");
      return;
    }

    const host = getHostByEmail(hostEmail);
    if (host) {
      setIsHostVerified(true);
      setCurrentHost(host);
      toast.success("호스트 인증 완료!", {
        description: `환영합니다, ${host.name}님!`,
      });
    } else {
      toast.error("승인된 호스트가 아닙니다", {
        description: "호스트 신청 후 승인을 받아야 파티를 등록할 수 있습니다.",
      });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // 파일 크기 및 형식 검증
    for (let i = 0; i < files.length; i++) {
      if (files[i].size > 10 * 1024 * 1024) {
        toast.error("파일 크기 오류", {
          description: "파일 크기는 10MB or less여야 합니다.",
        });
        return;
      }
      if (!files[i].type.match(/image\/(jpeg|jpg|png)/)) {
        toast.error("파일 형식 오류", {
          description: "JPG 또는 PNG 파일만 업로드 가능합니다.",
        });
        return;
      }
    }

    setIsUploading(true);

    try {
      const uploadedUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append("party", files[i]);

        const response = await fetch("/api/upload/party", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (data.success && data.fileUrl) {
          uploadedUrls.push(data.fileUrl);
        } else {
          throw new Error(data.message || "업로드 실패");
        }
      }

      setPartyImages((prev) => [...prev, ...uploadedUrls]);
      toast.success("파티 사진 업로드 성공", {
        description: `${uploadedUrls.length}개의 파일이 업로드되었습니다.`,
      });
    } catch (error) {
      console.error("Party images upload error:", error);
      toast.error("업로드 실패", {
        description: "파티 사진 업로드 중 오류가 발생했습니다.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 필수 필드 검증
    if (!formData.title || !formData.date || !formData.city) {
      toast.error("필수 항목을 입력해주세요", {
        description: "파티 제목, 날짜, 도시는 필수 항목입니다.",
      });
      return;
    }

    if (!isHostVerified || !currentHost) {
      toast.error("호스트 인증이 필요합니다", {
        description: "먼저 이메일로 호스트 인증을 완료해주세요.",
      });
      return;
    }

    // 파티 데이터 저장
    const partyData = {
      id: `party-${Date.now()}`,
      title: formData.title,
      date: formData.date,
      time: formData.time,
      location: formData.address,
      city: formData.city,
      host: currentHost.name,
      hostId: currentHost.id,
      price: parseInt(formData.price) || 0,
      capacity: parseInt(formData.maxAttendees) || 0,
      attendees: 0,
      ageRange: formData.ageRange || "20-30대",
      type: formData.type || "파티",
      description: formData.description,
      images: partyImages.length > 0 ? partyImages : ["/placeholder.svg"],
      tags: formData.theme ? [formData.theme] : [],
      rating: 0,
      reviews: 0,
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
                새로운 파티를
                <br />
                <span className="gradient-text">등록하세요</span>
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
              {/* 호스트 인증 */}
              <div className={`glass p-8 rounded-2xl border space-y-6 ${
                isHostVerified ? "border-green-500/50 bg-green-500/5" : "border-primary/30"
              }`}>
                <div className="flex items-center space-x-3 mb-6">
                  <Shield className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-bold">호스트 인증</h2>
                  {isHostVerified && (
                    <CheckCircle2 className="w-6 h-6 text-green-500 ml-auto" />
                  )}
                </div>

                {!isHostVerified ? (
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      파티를 등록하려면 먼저 승인된 호스트인지 확인해야 합니다.
                    </p>
                    <div className="flex gap-3">
                      <Input
                        type="email"
                        placeholder="호스트 등록 시 사용한 이메일 주소"
                        value={hostEmail}
                        onChange={(e) => setHostEmail(e.target.value)}
                        className="glass border-white/20"
                      />
                      <Button
                        type="button"
                        onClick={handleHostVerification}
                        className="gradient-button whitespace-nowrap"
                      >
                        인증하기
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      호스트가 아니신가요?{" "}
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
                        인증 완료: {currentHost?.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {currentHost?.email}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* 기본 정보 */}
              <div className="glass p-8 rounded-2xl border border-white/10 space-y-6">
                <div className="flex items-center space-x-3 mb-6">
                  <Tag className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-bold">기본 정보</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">파티 제목 *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => updateField("title", e.target.value)}
                      placeholder="예: 루프탑 파티"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">파티 설명 *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => updateField("description", e.target.value)}
                      placeholder="파티에 대한 설명을 입력하세요"
                      rows={4}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* 날짜 및 시간 */}
              <div className="glass p-8 rounded-2xl border border-white/10 space-y-6">
                <div className="flex items-center space-x-3 mb-6">
                  <Clock className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-bold">날짜 및 시간</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date">날짜 *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => updateField("date", e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="time">시간 *</Label>
                    <Input
                      id="time"
                      type="time"
                      value={formData.time}
                      onChange={(e) => updateField("time", e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* 장소 */}
              <div className="glass p-8 rounded-2xl border border-white/10 space-y-6">
                <div className="flex items-center space-x-3 mb-6">
                  <MapPin className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-bold">장소</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="city">도시 *</Label>
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
                    <Label htmlFor="address">주소 *</Label>
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

              {/* 참석 인원 및 가격 */}
              <div className="glass p-8 rounded-2xl border border-white/10 space-y-6">
                <div className="flex items-center space-x-3 mb-6">
                  <DollarSign className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-bold">참석 인원 및 가격</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="maxAttendees">최대 인원 *</Label>
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
                    <Label htmlFor="price">참가비 (원) *</Label>
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

              {/* 파티 사진 */}
              <div className="glass p-8 rounded-2xl border border-white/10 space-y-6">
                <div className="flex items-center space-x-3 mb-6">
                  <Upload className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-bold">파티 사진</h2>
                </div>

                <div>
                  <Label htmlFor="partyImages">클릭하여 사진 업로드</Label>
                  <input
                    id="partyImages"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="partyImages"
                    className={`mt-2 flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-all ${
                      partyImages.length > 0
                        ? "border-green-500/50 bg-green-500/10"
                        : "border-white/20 hover:border-primary/50"
                    }`}
                  >
                    {isUploading ? (
                      <>
                        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                        <p className="text-sm text-primary font-semibold">
                          업로드 중...
                        </p>
                      </>
                    ) : partyImages.length > 0 ? (
                      <>
                        <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-3">
                          <CheckCircle2 className="w-6 h-6 text-green-500" />
                        </div>
                        <p className="text-sm text-green-400 mb-1 font-semibold">
                          {partyImages.length}개의 사진 업로드 완료
                        </p>
                        <p className="text-xs text-muted-foreground">
                          추가 사진을 업로드하려면 클릭하세요
                        </p>
                      </>
                    ) : (
                      <>
                        <Upload className="w-12 h-12 text-muted-foreground mb-3" />
                        <p className="text-sm text-muted-foreground mb-1">
                          클릭하여 사진 업로드
                        </p>
                        <p className="text-xs text-muted-foreground">
                          JPG, PNG (최대 10MB) - 여러 장 선택 가능
                        </p>
                      </>
                    )}
                  </label>
                </div>
              </div>

              {/* 제출 버튼 */}
              <div className="flex justify-center pt-6">
                <Button
                  type="submit"
                  size="lg"
                  className="px-12 group"
                >
                  Create Party하기
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>

              <p className="text-center text-sm text-muted-foreground">
                등록 후 24시간 내에 검토 결과를 알려드립니다
              </p>
            </form>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}

