import { useState } from "react";
import { useRoute, Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockParties } from "@/data/mockParties";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  DollarSign,
  Star,
  Heart,
  Share2,
  ArrowLeft,
  CheckCircle2,
  Shield,
} from "lucide-react";
import { toast } from "sonner";

export default function PartyDetail() {
  const [, params] = useRoute("/party/:id");
  const party = mockParties.find((p) => p.id === params?.id);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [ticketCount, setTicketCount] = useState(1);

  if (!party) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">파티를 찾을 수 없습니다</h2>
          <Link href="/">
            <Button className="gradient-button rounded-xl">홈으로 돌아가기</Button>
          </Link>
        </div>
      </div>
    );
  }

  const totalPrice = party.price * ticketCount;
  const availableSpots = party.maxAttendees - party.attendees;

  const handlePurchase = () => {
    toast.success("입장권 구매가 완료되었습니다!", {
      description: `${party.title} - ${ticketCount}매`,
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("링크가 복사되었습니다!");
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-20">
        {/* Back Button */}
        <div className="container py-6">
          <Link href="/">
            <Button variant="ghost" className="glass hover:bg-white/10 rounded-xl">
              <ArrowLeft className="w-4 h-4 mr-2" />
              돌아가기
            </Button>
          </Link>
        </div>

        {/* Hero Image */}
        <div className="container mb-8">
          <div className="relative aspect-[21/9] rounded-3xl overflow-hidden">
            <img
              src={party.image}
              alt={party.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
            
            {/* Badges on Image */}
            <div className="absolute top-6 left-6 flex flex-wrap gap-3">
              <Badge className="bg-primary/90 backdrop-blur-sm border-0 px-4 py-2 text-base">
                {party.type}
              </Badge>
              <Badge className="bg-accent/90 backdrop-blur-sm border-0 px-4 py-2 text-base">
                {party.ageRange}
              </Badge>
              <Badge className="bg-secondary/90 backdrop-blur-sm border-0 px-4 py-2 text-base">
                {party.theme}
              </Badge>
            </div>

            {/* Action Buttons */}
            <div className="absolute top-6 right-6 flex gap-3">
              <Button
                size="icon"
                variant="ghost"
                className={`w-12 h-12 rounded-full glass-strong hover:bg-white/20 ${
                  isWishlisted ? "text-accent" : "text-white"
                }`}
                onClick={() => setIsWishlisted(!isWishlisted)}
              >
                <Heart className={`w-6 h-6 ${isWishlisted ? "fill-current" : ""}`} />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="w-12 h-12 rounded-full glass-strong hover:bg-white/20 text-white"
                onClick={handleShare}
              >
                <Share2 className="w-6 h-6" />
              </Button>
            </div>
          </div>
        </div>

        <div className="container pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Title & Rating */}
              <div>
                <h1 className="text-4xl font-bold mb-4">{party.title}</h1>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                    <span className="text-lg font-semibold">{party.rating}</span>
                    <span className="text-muted-foreground">(128 리뷰)</span>
                  </div>
                  <div className="text-muted-foreground">·</div>
                  <div className="text-muted-foreground">호스트: {party.hostName}</div>
                </div>
              </div>

              {/* Key Info */}
              <div className="glass-strong rounded-3xl p-8 border border-white/10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">날짜 및 시간</div>
                      <div className="font-semibold">{party.date}</div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">위치</div>
                      <div className="font-semibold">{party.location}</div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
                      <Users className="w-6 h-6 text-secondary" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">참석 인원</div>
                      <div className="font-semibold">{party.attendees}/{party.maxAttendees}명</div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">예상 시간</div>
                      <div className="font-semibold">3-4시간</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="glass-strong rounded-3xl p-8 border border-white/10">
                <h2 className="text-2xl font-bold mb-4">파티 소개</h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {party.description}
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  이 파티는 Verified Members들만 참석할 수 있으며, 모든 참석자는 사전 승인을 받아야 합니다. 
                  안전하고 즐거운 분위기에서 새로운 친구들을 만나보세요. 음료와 간단한 스낵이 제공되며, 
                  추가 음식은 각자 준비하실 수 있습니다.
                </p>
              </div>

              {/* What's Included */}
              <div className="glass-strong rounded-3xl p-8 border border-white/10">
                <h2 className="text-2xl font-bold mb-6">포함 사항</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    "웰컴 드링크",
                    "스낵 & 핑거푸드",
                    "음악 & 엔터테인먼트",
                    "게임 & 액티비티",
                    "사진 촬영",
                    "안전한 환경",
                  ].map((item) => (
                    <div key={item} className="flex items-center space-x-3">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Host Info */}
              <div className="glass-strong rounded-3xl p-8 border border-white/10">
                <h2 className="text-2xl font-bold mb-6">호스트 정보</h2>
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-2xl font-bold">
                    {party.hostName[0]}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{party.hostName}</h3>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span>4.9</span>
                      </div>
                      <div>·</div>
                      <div>42개 파티 호스팅</div>
                      <div>·</div>
                      <div>가입일: 2023년</div>
                    </div>
                    <p className="text-muted-foreground">
                      안녕하세요! 저는 사람들과 만나고 즐거운 시간을 보내는 것을 좋아하는 호스트입니다. 
                      여러분 모두 환영합니다!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Sidebar */}
            <div className="lg:col-span-1">
              <div className="glass-strong rounded-3xl p-8 border border-white/10 sticky top-24">
                <div className="mb-6">
                  <div className="flex items-baseline space-x-2 mb-2">
                    <span className="text-4xl font-bold gradient-text">
                      {party.priceFormatted}
                    </span>
                    <span className="text-muted-foreground">/ 인</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="font-semibold">{party.rating}</span>
                    <span className="text-muted-foreground">(128 리뷰)</span>
                  </div>
                </div>

                {/* Ticket Count */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-3">입장권 수량</label>
                  <div className="flex items-center justify-between glass rounded-xl p-4 border border-white/10">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setTicketCount(Math.max(1, ticketCount - 1))}
                      disabled={ticketCount <= 1}
                      className="w-10 h-10 rounded-lg"
                    >
                      -
                    </Button>
                    <span className="text-2xl font-bold">{ticketCount}</span>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setTicketCount(Math.min(availableSpots, ticketCount + 1))}
                      disabled={ticketCount >= availableSpots}
                      className="w-10 h-10 rounded-lg"
                    >
                      +
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    남은 자리: {availableSpots}명
                  </p>
                </div>

                {/* Total Price */}
                <div className="mb-6 p-4 glass rounded-xl border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-muted-foreground">입장권 ({ticketCount}매)</span>
                    <span className="font-semibold">${(party.price * ticketCount).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-muted-foreground">서비스 수수료</span>
                    <span className="font-semibold">${Math.floor(party.price * ticketCount * 0.05).toLocaleString()}</span>
                  </div>
                  <div className="border-t border-white/10 my-3" />
                  <div className="flex items-center justify-between">
                    <span className="font-bold">총 금액</span>
                    <span className="text-2xl font-bold gradient-text">
                      ${Math.floor(totalPrice * 1.05).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Purchase Button */}
                <Button
                  size="lg"
                  className="w-full gradient-button h-14 rounded-2xl text-lg font-semibold mb-4"
                  onClick={handlePurchase}
                >
                  <DollarSign className="w-5 h-5 mr-2" />
                  입장권 구매하기
                </Button>

                <p className="text-xs text-center text-muted-foreground mb-6">
                  구매 시 취소 및 환불 정책에 동의하게 됩니다
                </p>

                {/* Safety Info */}
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <div className="font-semibold mb-1">안전한 결제</div>
                      <div className="text-muted-foreground">모든 결제는 암호화되어 보호됩니다</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <div className="font-semibold mb-1">검증된 호스트</div>
                      <div className="text-muted-foreground">모든 호스트는 신원 확인을 거쳤습니다</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

