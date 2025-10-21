import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Heart, MapPin, Users } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

interface PartyCardProps {
  id: string;
  title: string;
  image: string;
  date: string;
  location: string;
  price: number;
  priceFormatted: string;
  attendees: number;
  maxAttendees: number;
  ageRange: string;
  type: string;
}

export default function PartyCard({
  id,
  title,
  image,
  date,
  location,
  priceFormatted,
  attendees,
  maxAttendees,
  ageRange,
  type,
}: PartyCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  return (
    <div className="group glass rounded-3xl overflow-hidden border border-white/10 hover:border-primary/30 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/20">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          <Badge className="bg-primary/90 backdrop-blur-sm border-0 px-3 py-1">
            {type}
          </Badge>
          <Badge className="bg-accent/90 backdrop-blur-sm border-0 px-3 py-1">
            {ageRange}
          </Badge>
        </div>

        {/* Wishlist Button */}
        <Button
          size="icon"
          variant="ghost"
          className={`absolute top-4 right-4 w-10 h-10 rounded-full glass-strong hover:bg-white/20 transition-all ${
            isWishlisted ? "text-accent" : "text-white"
          }`}
          onClick={() => setIsWishlisted(!isWishlisted)}
        >
          <Heart className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`} />
        </Button>

        {/* Filling Status */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="glass-strong rounded-xl px-3 py-2 text-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-muted-foreground">Attendance</span>
              <span className="text-xs font-semibold">{attendees}/{maxAttendees}</span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
                style={{ width: `${(attendees / maxAttendees) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Title */}
        <h3 className="text-xl font-bold line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </h3>

        {/* Info */}
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-primary" />
            <span>{date}</span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-accent" />
            <span className="line-clamp-1">{location}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-secondary" />
            <span>{attendees} Attending</span>
          </div>
        </div>

        {/* Price & CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div>
            <div className="text-xs text-muted-foreground">Entry Fee</div>
              <div className="text-2xl font-bold gradient-text">{priceFormatted}</div>
          </div>
          <Link href={`/party/${id}`}>
            <Button className="gradient-button rounded-xl px-6 h-10">
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

