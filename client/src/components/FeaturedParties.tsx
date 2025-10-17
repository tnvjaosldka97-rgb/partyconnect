import PartyCard from "./PartyCard";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";

const mockParties = [
  {
    id: "1",
    title: "Golden Hour Gatherings - 축제 분위기의 저녁 파티",
    image: "/party-1.jpg",
    date: "10월 17일 (금) 19:00",
    location: "강남구, 서울",
    price: "₩35,000",
    attendees: 11,
    maxAttendees: 20,
    ageRange: "21-35세",
    type: "하우스 파티",
  },
  {
    id: "2",
    title: "The Ultimate Party - 음악과 웃음이 가득한 밤",
    image: "/party-2.jpg",
    date: "10월 17일 (금) 20:00",
    location: "홍대, 서울",
    price: "₩38,000",
    attendees: 14,
    maxAttendees: 25,
    ageRange: "23-34세",
    type: "하우스 파티",
  },
  {
    id: "3",
    title: "Tipsy Twinkles - 프리 디왈리 모임",
    image: "/party-3.jpg",
    date: "10월 17일 (금) 18:30",
    location: "이태원, 서울",
    price: "₩35,000",
    attendees: 12,
    maxAttendees: 20,
    ageRange: "21-35세",
    type: "하우스 파티",
  },
  {
    id: "4",
    title: "Twilight Tales - 저녁 모임과 이야기",
    image: "/party-1.jpg",
    date: "10월 18일 (토) 19:00",
    location: "송파구, 서울",
    price: "₩35,000",
    attendees: 11,
    maxAttendees: 20,
    ageRange: "21-35세",
    type: "하우스 파티",
  },
  {
    id: "5",
    title: "Sunset Social - 루프탑 파티",
    image: "/party-2.jpg",
    date: "10월 18일 (토) 17:00",
    location: "마포구, 서울",
    price: "₩42,000",
    attendees: 18,
    maxAttendees: 30,
    ageRange: "25-40세",
    type: "루프탑 파티",
  },
  {
    id: "6",
    title: "Night Vibes - 댄스 & 뮤직 파티",
    image: "/party-3.jpg",
    date: "10월 19일 (일) 20:00",
    location: "강남구, 서울",
    price: "₩40,000",
    attendees: 15,
    maxAttendees: 25,
    ageRange: "21-35세",
    type: "하우스 파티",
  },
];

export default function FeaturedParties() {
  return (
    <section className="py-20 relative">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-12 space-y-4">
          <h2 className="animate-fadeIn">
            당신을 위한 <span className="gradient-text">추천 파티</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            검증된 호스트가 준비한 특별한 파티에 참여하세요
          </p>
        </div>

        {/* Quick Filters */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          {["오늘 밤", "이번 주말", "₩30,000 이하", "강남", "홍대"].map((filter) => (
            <Button
              key={filter}
              variant="outline"
              className="glass border-white/20 hover:border-primary/50 hover:bg-primary/10 rounded-full px-6"
            >
              {filter}
            </Button>
          ))}
          <Button
            variant="outline"
            className="glass border-primary/30 hover:border-primary/50 hover:bg-primary/10 rounded-full px-6 text-primary"
          >
            고급 필터
          </Button>
        </div>

        {/* Party Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {mockParties.map((party, index) => (
            <div
              key={party.id}
              className="animate-fadeIn"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <PartyCard {...party} />
            </div>
          ))}
        </div>

        {/* See All Button */}
        <div className="text-center">
          <Button
            size="lg"
            variant="outline"
            className="glass border-primary/30 hover:border-primary/50 hover:bg-primary/10 rounded-2xl px-8 h-12 group"
          >
            모든 파티 보기
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
}

