import { Button } from "./ui/button";
import { ArrowRight, DollarSign, Home, TrendingUp, Users } from "lucide-react";
import { Link } from "wouter";

const benefits = [
  {
    icon: DollarSign,
    text: "Earn up to $2,000/month",
  },
  {
    icon: Home,
    text: "Use your own space",
  },
  {
    icon: Users,
    text: "Network with new people",
  },
  {
    icon: TrendingUp,
    text: "Flexible scheduling",
  },
];

export default function HostCTA() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/20 opacity-30" />
      <div className="absolute top-10 right-10 w-64 h-64 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute bottom-10 left-10 w-64 h-64 rounded-full bg-accent/20 blur-3xl" />

      <div className="container relative z-10">
        <div className="glass-strong rounded-3xl p-12 md:p-16 border border-white/10 overflow-hidden relative">
          {/* Content */}
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 glass px-4 py-2 rounded-full border border-accent/30">
              <TrendingUp className="w-5 h-5 text-accent" />
              <span className="text-sm font-medium">Become a Host</span>
            </div>

            {/* Headline */}
            <h2 className="animate-fadeIn">
              Host Parties and
              <br />
              <span className="gradient-text">Generate $2,000 Monthly Income</span>
            </h2>

            {/* Description */}
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Host amazing parties using your space and earn income.
              <br className="hidden sm:block" />
              We'll help you with everything.
            </p>

            {/* Benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <div
                    key={benefit.text}
                    className="glass rounded-2xl p-4 border border-white/10 animate-fadeIn"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <Icon className="w-6 h-6 text-primary mb-2 mx-auto" />
                    <p className="text-sm font-medium">{benefit.text}</p>
                  </div>
                );
              })}
            </div>

            {/* CTA Button */}
            <div className="pt-4">
              <Link href="/become-host">
                <Button
                  size="lg"
                  className="gradient-button h-14 px-10 rounded-2xl text-lg font-semibold shadow-2xl group"
                >
                  Start Hosting
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            {/* Additional Info */}
            <p className="text-sm text-muted-foreground">
              Free to join · No fees · Start anytime
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

