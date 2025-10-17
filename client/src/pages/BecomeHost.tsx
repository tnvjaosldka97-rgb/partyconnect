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
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.agreedToTerms) {
      toast.error("이용약관에 동의해주세요");
      return;
    }

    toast.success("호스트 신청이 완료되었습니다!", {
      description: "검토 후 24시간 내에 연락드리겠습니다.",
    });
    
    setTimeout(() => {
      setLocation("/");
    }, 2000);
  };

  const updateField = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const benefits = [
    {
      icon: DollarSign,
      title: "월 최대 ₩1,600,000 수익",
      description: "파티 호스팅으로 안정적인 수익 창출",
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
                <span className="text-sm font-medium">호스트 되기</span>
              </div>
              
              <h1 className="text-5xl sm:text-6xl font-bold">
                파티를 호스팅하고
                <br />
                <span className="gradient-text">새로운 수익을 창출하세요</span>
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                당신의 공간을 활용하여 멋진 파티를 주최하고 수익을 얻으세요.
                우리가 모든 것을 도와드립니다.
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
                <h2 className="text-3xl font-bold mb-2">호스트 신청하기</h2>
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
                        placeholder="서울시 강남구 테헤란로 123"
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
                      <div className="mt-2 glass border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                        <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                        <p className="text-sm text-muted-foreground mb-1">
                          클릭하여 사진 업로드
                        </p>
                        <p className="text-xs text-muted-foreground">
                          JPG, PNG (최대 10MB)
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Terms */}
                  <div className="pt-6 border-t border-white/10">
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
                  </div>

                  {/* Submit */}
                  <div className="pt-6">
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full gradient-button h-14 rounded-2xl text-lg font-semibold group"
                    >
                      호스트 신청하기
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

