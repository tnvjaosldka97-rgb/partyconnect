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
} from "lucide-react";
import { toast } from "sonner";

export default function CreateParty() {
  const [, setLocation] = useLocation();
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast.success("파티 등록이 완료되었습니다!", {
      description: "검토 후 승인되면 게시됩니다.",
    });
    
    setTimeout(() => {
      setLocation("/");
    }, 2000);
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
                <span className="text-sm font-medium">파티 등록</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl font-bold">
                새로운 파티를
                <br />
                <span className="gradient-text">등록하세요</span>
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                멋진 파티를 계획하고 새로운 사람들을 초대하세요
              </p>
            </div>
          </div>
        </section>

        {/* Form Section */}
        <section className="py-12">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <div className="glass-strong rounded-3xl p-8 md:p-12 border border-white/10">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Basic Info */}
                  <div className="space-y-4">
                    <h3 className="text-2xl font-semibold flex items-center">
                      <CheckCircle2 className="w-6 h-6 text-primary mr-2" />
                      기본 정보
                    </h3>
                    
                    <div>
                      <Label htmlFor="title">파티 제목 *</Label>
                      <Input
                        id="title"
                        required
                        value={formData.title}
                        onChange={(e) => updateField("title", e.target.value)}
                        className="glass border-white/20 mt-2"
                        placeholder="예: Golden Hour Gatherings - 축제 분위기의 저녁 파티"
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">파티 설명 *</Label>
                      <Textarea
                        id="description"
                        required
                        value={formData.description}
                        onChange={(e) => updateField("description", e.target.value)}
                        className="glass border-white/20 mt-2 min-h-32"
                        placeholder="파티에 대해 자세히 설명해주세요. 분위기, 활동, 제공되는 것들 등..."
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="type">파티 유형 *</Label>
                        <Select value={formData.type} onValueChange={(value) => updateField("type", value)}>
                          <SelectTrigger className="glass border-white/20 mt-2">
                            <SelectValue placeholder="파티 유형 선택" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="하우스 파티">하우스 파티</SelectItem>
                            <SelectItem value="루프탑 파티">루프탑 파티</SelectItem>
                            <SelectItem value="브런치 파티">브런치 파티</SelectItem>
                            <SelectItem value="테마 파티">테마 파티</SelectItem>
                            <SelectItem value="네트워킹 파티">네트워킹 파티</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="theme">테마 *</Label>
                        <Select value={formData.theme} onValueChange={(value) => updateField("theme", value)}>
                          <SelectTrigger className="glass border-white/20 mt-2">
                            <SelectValue placeholder="테마 선택" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="축제">축제</SelectItem>
                            <SelectItem value="음악">음악</SelectItem>
                            <SelectItem value="댄스">댄스</SelectItem>
                            <SelectItem value="문화">문화</SelectItem>
                            <SelectItem value="대화">대화</SelectItem>
                            <SelectItem value="게임">게임</SelectItem>
                            <SelectItem value="음식">음식</SelectItem>
                            <SelectItem value="칵테일">칵테일</SelectItem>
                            <SelectItem value="와인">와인</SelectItem>
                            <SelectItem value="케이팝">케이팝</SelectItem>
                            <SelectItem value="복고">복고</SelectItem>
                            <SelectItem value="럭셔리">럭셔리</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Date & Time */}
                  <div className="space-y-4 pt-6 border-t border-white/10">
                    <h3 className="text-2xl font-semibold flex items-center">
                      <Clock className="w-6 h-6 text-primary mr-2" />
                      날짜 및 시간
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="date">날짜 *</Label>
                        <Input
                          id="date"
                          type="date"
                          required
                          value={formData.date}
                          onChange={(e) => updateField("date", e.target.value)}
                          className="glass border-white/20 mt-2"
                        />
                      </div>

                      <div>
                        <Label htmlFor="time">시간 *</Label>
                        <Input
                          id="time"
                          type="time"
                          required
                          value={formData.time}
                          onChange={(e) => updateField("time", e.target.value)}
                          className="glass border-white/20 mt-2"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="space-y-4 pt-6 border-t border-white/10">
                    <h3 className="text-2xl font-semibold flex items-center">
                      <MapPin className="w-6 h-6 text-primary mr-2" />
                      장소
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">도시 *</Label>
                        <Select value={formData.city} onValueChange={(value) => updateField("city", value)}>
                          <SelectTrigger className="glass border-white/20 mt-2">
                            <SelectValue placeholder="도시 선택" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="서울">서울</SelectItem>
                            <SelectItem value="부산">부산</SelectItem>
                            <SelectItem value="인천">인천</SelectItem>
                            <SelectItem value="대구">대구</SelectItem>
                            <SelectItem value="대전">대전</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="address">상세 주소 *</Label>
                        <Input
                          id="address"
                          required
                          value={formData.address}
                          onChange={(e) => updateField("address", e.target.value)}
                          className="glass border-white/20 mt-2"
                          placeholder="강남구, 서울"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Attendees & Pricing */}
                  <div className="space-y-4 pt-6 border-t border-white/10">
                    <h3 className="text-2xl font-semibold flex items-center">
                      <Users className="w-6 h-6 text-primary mr-2" />
                      참석 인원 및 가격
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="maxAttendees">최대 인원 *</Label>
                        <Input
                          id="maxAttendees"
                          type="number"
                          required
                          min="5"
                          max="100"
                          value={formData.maxAttendees}
                          onChange={(e) => updateField("maxAttendees", e.target.value)}
                          className="glass border-white/20 mt-2"
                          placeholder="20"
                        />
                      </div>

                      <div>
                        <Label htmlFor="ageRange">연령대 *</Label>
                        <Select value={formData.ageRange} onValueChange={(value) => updateField("ageRange", value)}>
                          <SelectTrigger className="glass border-white/20 mt-2">
                            <SelectValue placeholder="연령대 선택" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="18-30세">18-30세</SelectItem>
                            <SelectItem value="21-35세">21-35세</SelectItem>
                            <SelectItem value="23-34세">23-34세</SelectItem>
                            <SelectItem value="25-40세">25-40세</SelectItem>
                            <SelectItem value="28-45세">28-45세</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="price">입장료 (원) *</Label>
                        <Input
                          id="price"
                          type="number"
                          required
                          min="0"
                          step="1000"
                          value={formData.price}
                          onChange={(e) => updateField("price", e.target.value)}
                          className="glass border-white/20 mt-2"
                          placeholder="35000"
                        />
                      </div>
                    </div>
                  </div>

                  {/* What's Included */}
                  <div className="space-y-4 pt-6 border-t border-white/10">
                    <h3 className="text-2xl font-semibold flex items-center">
                      <Tag className="w-6 h-6 text-primary mr-2" />
                      포함 사항
                    </h3>
                    
                    <div>
                      <Label htmlFor="included">포함되는 것들 *</Label>
                      <Textarea
                        id="included"
                        required
                        value={formData.included}
                        onChange={(e) => updateField("included", e.target.value)}
                        className="glass border-white/20 mt-2 min-h-24"
                        placeholder="예: 웰컴 드링크, 스낵 & 핑거푸드, 음악 & 엔터테인먼트, 게임 & 액티비티"
                      />
                      <p className="text-sm text-muted-foreground mt-2">
                        각 항목을 쉼표(,)로 구분해주세요
                      </p>
                    </div>
                  </div>

                  {/* Photos */}
                  <div className="space-y-4 pt-6 border-t border-white/10">
                    <h3 className="text-2xl font-semibold flex items-center">
                      <Upload className="w-6 h-6 text-primary mr-2" />
                      파티 사진
                    </h3>
                    
                    <div className="glass border-2 border-dashed border-white/20 rounded-xl p-12 text-center hover:border-primary/50 transition-colors cursor-pointer">
                      <Upload className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-lg font-semibold mb-2">
                        클릭하여 사진 업로드
                      </p>
                      <p className="text-sm text-muted-foreground mb-1">
                        파티 장소나 분위기를 보여주는 사진을 업로드하세요
                      </p>
                      <p className="text-xs text-muted-foreground">
                        JPG, PNG (최대 10MB, 최소 1장)
                      </p>
                    </div>
                  </div>

                  {/* Submit */}
                  <div className="pt-6 border-t border-white/10">
                    <div className="glass rounded-2xl p-6 mb-6 border border-primary/20">
                      <h4 className="font-semibold mb-2 flex items-center">
                        <CheckCircle2 className="w-5 h-5 text-primary mr-2" />
                        검토 프로세스
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        파티 등록 후 24시간 내에 검토가 완료됩니다. 승인되면 즉시 게시되며 
                        참석자들이 예약할 수 있습니다. 안전하고 즐거운 파티를 위해 
                        모든 정보를 정확하게 입력해주세요.
                      </p>
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full gradient-button h-14 rounded-2xl text-lg font-semibold group"
                    >
                      파티 등록하기
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    
                    <p className="text-sm text-center text-muted-foreground mt-4">
                      등록 시 <Link href="#" className="text-primary hover:underline">이용약관</Link> 및{" "}
                      <Link href="#" className="text-primary hover:underline">호스트 정책</Link>에 동의하게 됩니다
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

