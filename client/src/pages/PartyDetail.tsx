import { useState, useEffect } from "react";
import { useRoute, Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockParties } from "@/data/mockParties";
import { getApprovedParties, purchaseTicket } from "@/lib/storage";
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
  
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // Load parties from both mockParties and localStorage
  const localParties = getApprovedParties();
  
  // Map localStorage parties to match mockParties format
  const mappedLocalParties = localParties.map((p: any) => ({
    id: p.id,
    title: p.title,
    image: p.images?.[0] || "/placeholder-party.jpg",
    date: p.date,
    dateTimestamp: new Date(p.date).getTime(),
    location: p.location || p.city,
    city: p.city,
    price: p.price,
    priceFormatted: `$${p.price.toLocaleString()}`,
    attendees: p.attendees || 0,
    maxAttendees: p.capacity,
    ageRange: p.ageRange,
    type: p.type,
    theme: p.type,
    description: p.description,
    hostName: p.hostNickname || p.host,
    rating: p.rating || 4.5,
    time: p.time,
    tags: p.tags || [],
  }));
  
  const allParties = [...mockParties, ...mappedLocalParties];
  const party = allParties.find((p) => p.id === params?.id);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [ticketCount, setTicketCount] = useState(1);
  const [gender, setGender] = useState("");

  if (!party) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Party Not Found</h2>
          <Link href="/">
            <Button className="gradient-button rounded-xl">Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const totalPrice = party.price * ticketCount;
  const availableSpots = party.maxAttendees - party.attendees;

  const handlePurchase = () => {
    if (!gender) {
      toast.error("Please select your gender");
      return;
    }
    
    // Create Instagram DM message with party details
    const message = encodeURIComponent(
      `Hi, I'm trying to apply for the party. Please reply\n\n` +
      `Party: ${party.title}\n` +
      `Host: ${party.host}\n` +
      `Date & Time: ${party.date} ${party.time || ''}\n` +
      `Spots left: ${availableSpots} people\n` +
      `Number of Tickets: ${ticketCount}\n` +
      `Tickets (${ticketCount}): $${party.price * ticketCount}\n` +
      `Service Fee: $5\n` +
      `Total: $${totalPrice + 5}\n\n` +
      `Requests, Questions: `
    );
    
    // Redirect to Instagram DM
    const instagramDM = `https://www.instagram.com/direct/t/17842340226608213/?text=${message}`;
    window.open(instagramDM, '_blank');
    
    toast.success("Instagram DM으로 이동합니다!", {
      description: "DM에서 결제를 진행해주세요.",
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link Copied!");
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
              Back
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
                    <span className="text-muted-foreground">(128 reviews)</span>
                  </div>
                  <div className="text-muted-foreground">·</div>
                  <div className="text-muted-foreground">Host: {party.hostName}</div>
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
                      <div className="text-sm text-muted-foreground mb-1">Date & Time</div>
                      <div className="font-semibold">{party.date}</div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Location</div>
                      <div className="font-semibold">{party.location}</div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
                      <Users className="w-6 h-6 text-secondary" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Attendance</div>
                      <div className="font-semibold">{party.attendees}/{party.maxAttendees} people</div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Duration</div>
                      <div className="font-semibold">3-4 hours</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="glass-strong rounded-3xl p-8 border border-white/10">
                <h2 className="text-2xl font-bold mb-4">About This Party</h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {party.description}
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  This party is exclusively for verified members, and all attendees must receive prior approval. 
                  Meet new friends in a safe and enjoyable atmosphere. Drinks and light snacks will be provided, 
                  and you're welcome to bring additional food if you'd like.
                </p>
              </div>

              {/* What's Included */}
              <div className="glass-strong rounded-3xl p-8 border border-white/10">
                <h2 className="text-2xl font-bold mb-6">What's Included</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    "Welcome Drinks",
                    "Snacks & Finger Food",
                    "Music & Entertainment",
                    "Games & Activities",
                    "Photo Session",
                    "Safe Environment",
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
                <h2 className="text-2xl font-bold mb-6">Host Information</h2>
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
                      <div>42 parties hosted</div>
                      <div>·</div>
                      <div>Joined 2023</div>
                    </div>
                    <p className="text-muted-foreground">
                      Hello! I'm a host who loves meeting people and creating memorable experiences. 
                      Everyone is welcome!
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
                    <span className="text-muted-foreground">/ person</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="font-semibold">{party.rating}</span>
                    <span className="text-muted-foreground">(128 reviews)</span>
                  </div>
                </div>

                {/* Gender Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-3">Gender *</label>
                  <Select value={gender} onValueChange={setGender}>
                    <SelectTrigger className="glass border-white/10">
                      <SelectValue placeholder="Select your gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Ticket Count */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-3">Number of Tickets</label>
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
                    Spots left: {availableSpots} people
                  </p>
                </div>

                {/* Total Price */}
                <div className="mb-6 p-4 glass rounded-xl border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-muted-foreground">Tickets ({ticketCount})</span>
                    <span className="font-semibold">${(party.price * ticketCount).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-muted-foreground">Service Fee</span>
                    <span className="font-semibold">${Math.floor(party.price * ticketCount * 0.05).toLocaleString()}</span>
                  </div>
                  <div className="border-t border-white/10 my-3" />
                  <div className="flex items-center justify-between">
                    <span className="font-bold">Total</span>
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
                  Purchase Tickets
                </Button>

                <p className="text-xs text-center text-muted-foreground mb-6">
                  By purchasing, you agree to our cancellation and refund policy
                </p>

                {/* Safety Info */}
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <div className="font-semibold mb-1">Secure Payment</div>
                      <div className="text-muted-foreground">All payments are encrypted and protected</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <div className="font-semibold mb-1">Verified Host</div>
                      <div className="text-muted-foreground">All hosts are identity-verified</div>
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

