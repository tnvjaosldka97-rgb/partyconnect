import { CheckCircle2, Shield, Star, Users } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "검증된 프로필",
    description:
      "모든 게스트는 OTP, ID 업로드, 셀카 매칭, 전화 인증을 포함한 엄격한 검증 절차를 거칩니다.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Users,
    title: "균형잡힌 파티",
    description:
      "각 파티는 최소 7명의 참석자와 60:40 성비를 요구하여 활기차고 포용적인 분위기를 보장합니다.",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    icon: Star,
    title: "실제 리뷰",
    description:
      "호스트와 게스트를 평가하여 다른 사람들을 돕고, 분위기와 엔터테인먼트에 대한 피드백을 공유하세요.",
    color: "text-secondary",
    bgColor: "bg-secondary/10",
  },
];

export default function TrustSection() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Video with Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-background/98 via-background/95 to-background/98 z-10" />
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-20"
        >
          <source src="https://cdn.pixabay.com/video/2022/10/11/134866-760092899_large.mp4" type="video/mp4" />
        </video>
      </div>

      <div className="container relative z-20">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center space-x-2 glass px-4 py-2 rounded-full border border-primary/30 mb-4">
            <CheckCircle2 className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium">안전하고 신뢰할 수 있는</span>
          </div>
          <h2 className="animate-fadeIn">
            <span className="gradient-text">검증된 커뮤니티</span>에서
            <br />
            안심하고 즐기세요
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            6년간 30,000명 이상의 회원이 신뢰한 안전한 파티 플랫폼
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="glass-strong rounded-3xl p-8 border border-white/10 hover:border-primary/30 transition-all duration-300 group animate-fadeIn"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Icon */}
                <div
                  className={`w-16 h-16 rounded-2xl ${feature.bgColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className={`w-8 h-8 ${feature.color}`} />
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Stats Bar */}
        <div className="mt-16 glass-strong rounded-3xl p-8 border border-white/10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-bold gradient-text">99.8%</div>
              <div className="text-sm text-muted-foreground">안전한 파티 성공률</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold gradient-text">4.9/5</div>
              <div className="text-sm text-muted-foreground">평균 만족도 점수</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold gradient-text">24/7</div>
              <div className="text-sm text-muted-foreground">고객 지원 서비스</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

