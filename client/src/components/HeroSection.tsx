import { Button } from "@/components/ui/button";
import { ArrowRight, Award, Calendar, Users } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/90 to-background/80 z-10" />
        <img
          src="/hero-party.jpg"
          alt="Party"
          className="w-full h-full object-cover opacity-30"
        />
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 rounded-full bg-primary/20 blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-32 h-32 rounded-full bg-accent/20 blur-3xl animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/4 w-24 h-24 rounded-full bg-secondary/20 blur-3xl animate-float" style={{ animationDelay: '2s' }} />

      {/* Content */}
      <div className="container relative z-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 glass px-4 py-2 rounded-full border border-primary/30">
            <Award className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium">Shark Tank Featured</span>
          </div>

          {/* Headline */}
          <h1 className="animate-fadeIn">
            검증된 사람들과 함께하는
            <br />
            <span className="gradient-text">프리미엄 파티 경험</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl sm:text-2xl text-muted-foreground max-w-2xl mx-auto animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            30,000명의 회원이 신뢰하는 파티 플랫폼에서
            <br className="hidden sm:block" />
            새로운 친구들과 특별한 순간을 만들어보세요
          </p>

          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fadeIn" style={{ animationDelay: '0.4s' }}>
            <Button
              size="lg"
              className="gradient-button h-14 px-8 rounded-2xl text-lg font-semibold shadow-2xl group"
            >
              지금 탐색하기
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-14 px-8 rounded-2xl text-lg font-semibold glass border-white/20 hover:bg-white/10"
            >
              파티 호스팅하기
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto mt-16 animate-fadeIn" style={{ animationDelay: '0.6s' }}>
            <div className="glass-strong rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-center mb-2">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <div className="text-3xl font-bold gradient-text">30,000+</div>
              <div className="text-sm text-muted-foreground mt-1">검증된 회원</div>
            </div>
            <div className="glass-strong rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-center mb-2">
                <Calendar className="w-8 h-8 text-accent" />
              </div>
              <div className="text-3xl font-bold gradient-text">4,000+</div>
              <div className="text-sm text-muted-foreground mt-1">성공한 파티</div>
            </div>
            <div className="glass-strong rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-center mb-2">
                <Award className="w-8 h-8 text-secondary" />
              </div>
              <div className="text-3xl font-bold gradient-text">6년</div>
              <div className="text-sm text-muted-foreground mt-1">운영 경력</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
          <div className="w-1.5 h-1.5 rounded-full bg-white/50" />
        </div>
      </div>
    </section>
  );
}

