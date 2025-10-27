import { Button } from "./ui/button";
import { ArrowRight, Award, Calendar, Users } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-[calc(100vh-3.5rem)] sm:min-h-screen flex items-center justify-center overflow-hidden pt-16 sm:pt-20">
      {/* Background Video with Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/90 to-background/80 z-10" />
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-40"
        >
          <source src="https://cdn.pixabay.com/video/2023/08/03/174433-851984223_large.mp4" type="video/mp4" />
          {/* Fallback image */}
          <img
            src="/hero-party.jpg"
            alt="Party"
            className="w-full h-full object-cover"
          />
        </video>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 rounded-full bg-primary/20 blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-32 h-32 rounded-full bg-accent/20 blur-3xl animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/4 w-24 h-24 rounded-full bg-secondary/20 blur-3xl animate-float" style={{ animationDelay: '2s' }} />

      {/* Content */}
      <div className="container relative z-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 glass px-4 py-2 rounded-full border border-primary/30">
            <Award className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            <span className="text-xs sm:text-sm font-medium">Shark Tank Featured</span>
          </div>

          {/* Headline */}
          <h1 className="animate-fadeIn text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
            Premium Party Experience
            <br />
            <span className="gradient-text">With Verified People</span>
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto animate-fadeIn px-4" style={{ animationDelay: '0.2s' }}>
            Join 30,000+ verified members on the most trusted party platform
            <br className="hidden sm:block" />
            Make new friends and create unforgettable moments
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 animate-fadeIn px-4" style={{ animationDelay: '0.4s' }}>
            <Button
              size="lg"
              className="gradient-button h-12 sm:h-14 px-6 sm:px-8 rounded-xl sm:rounded-2xl text-base sm:text-lg font-semibold shadow-2xl group w-full sm:w-auto"
            >
              Explore Now
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 sm:h-14 px-6 sm:px-8 rounded-xl sm:rounded-2xl text-base sm:text-lg font-semibold glass border-white/20 hover:bg-white/10 w-full sm:w-auto"
            >
              Host a Party
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 sm:gap-6 max-w-3xl mx-auto mt-8 sm:mt-16 animate-fadeIn px-2" style={{ animationDelay: '0.6s' }}>
            <div className="glass-strong rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/10">
              <div className="flex items-center justify-center mb-1 sm:mb-2">
                <Users className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
              </div>
              <div className="text-xl sm:text-3xl font-bold gradient-text">30,000+</div>
              <div className="text-xs sm:text-sm text-muted-foreground mt-1">Verified Members</div>
            </div>
            <div className="glass-strong rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/10">
              <div className="flex items-center justify-center mb-1 sm:mb-2">
                <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
              </div>
              <div className="text-xl sm:text-3xl font-bold gradient-text">4,000+</div>
              <div className="text-xs sm:text-sm text-muted-foreground mt-1">Successful Parties</div>
            </div>
            <div className="glass-strong rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/10">
              <div className="flex items-center justify-center mb-1 sm:mb-2">
                <Award className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
              </div>
              <div className="text-xl sm:text-3xl font-bold gradient-text">6 Years</div>
              <div className="text-xs sm:text-sm text-muted-foreground mt-1">Operating Experience</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

