import { CheckCircle2, Shield, Star, Users } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Verified Profiles",
    description:
      "All guests undergo rigorous verification including OTP, ID upload, selfie matching, and phone verification.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Users,
    title: "Balanced Parties",
    description:
      "Each party requires a minimum of 7 attendees and a 60:40 gender ratio to ensure a vibrant and inclusive atmosphere.",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    icon: Star,
    title: "Real Reviews",
    description:
      "Rate hosts and guests to help others, and share feedback on atmosphere and entertainment.",
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
            <span className="text-sm font-medium">Safe & Reliable</span>
          </div>
          <h2 className="animate-fadeIn">
            Enjoy with Peace of Mind
            <br />
            in a <span className="gradient-text">Verified Community</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A trusted party platform with 30,000+ members over 6 years
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
              <div className="text-sm text-muted-foreground">Safe Party Success Rate</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold gradient-text">4.9/5</div>
              <div className="text-sm text-muted-foreground">Average Satisfaction Score</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold gradient-text">24/7</div>
              <div className="text-sm text-muted-foreground">Customer Support Service</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

