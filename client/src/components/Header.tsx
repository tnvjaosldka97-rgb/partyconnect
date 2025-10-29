import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { APP_TITLE } from "@/const";
import { MapPin, Search, User, LayoutDashboard, Shield, LogOut } from "lucide-react";
import { Link } from "wouter";
import GoogleTranslate from "@/components/GoogleTranslate";
import UserDropdown from "@/components/UserDropdown";

interface HeaderProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  selectedCity?: string;
  onCityChange?: (city: string) => void;
}

export default function Header({
  searchQuery = "",
  onSearchChange,
  selectedCity = "all",
  onCityChange,
}: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-strong border-b border-white/10">
      <div className="container px-4 sm:px-4">
        {/* Main Header Row */}
        <div className="flex items-center justify-between h-14 sm:h-20">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer min-w-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl gradient-button flex items-center justify-center flex-shrink-0">
                <img src={`/party-bear.png?v=${Date.now()}`} alt="PartyBear" className="h-7 w-7 sm:h-8 sm:w-8 object-contain" />
              </div>
              <span className="text-base sm:text-2xl font-bold gradient-text truncate">
                PartyBear
              </span>
            </div>
          </Link>

          {/* Desktop Search Bar */}
          <div className="flex-1 max-w-2xl mx-4 sm:mx-8 hidden md:block">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search parties, hosts, themes, locations... (e.g., New York, music)"
                value={searchQuery}
                onChange={(e) => onSearchChange?.(e.target.value)}
                className="pl-12 pr-4 h-12 glass border-white/20 focus:border-primary/50 rounded-2xl text-base"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange?.("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* City Selector - Desktop Only */}
            <Select value={selectedCity} onValueChange={onCityChange}>
              <SelectTrigger className="w-32 h-10 glass border-white/20 rounded-xl hidden lg:flex">
                <MapPin className="w-4 h-4 mr-1" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cities</SelectItem>
                <SelectItem value="New York">New York</SelectItem>
                <SelectItem value="Los Angeles">Los Angeles</SelectItem>
                <SelectItem value="Chicago">Chicago</SelectItem>
                <SelectItem value="San Francisco">San Francisco</SelectItem>
                <SelectItem value="Miami">Miami</SelectItem>
                <SelectItem value="Boston">Boston</SelectItem>
                <SelectItem value="Seattle">Seattle</SelectItem>
                <SelectItem value="Austin">Austin</SelectItem>
              </SelectContent>
            </Select>

            {/* Host Button */}
            <Link href="/become-host">
              <a>
                <Button
                  variant="outline"
                  className="h-9 px-4 sm:h-10 sm:px-4 glass border-primary/50 hover:bg-primary/10 rounded-xl text-sm sm:text-sm whitespace-nowrap font-medium"
                >
                  Host
                </Button>
              </a>
            </Link>
            
            {/* Create Button */}
            <Link href="/create-party">
              <a>
                <Button
                  variant="outline"
                  className="h-9 px-4 sm:h-10 sm:px-4 glass border-accent/50 hover:bg-accent/10 rounded-xl text-sm sm:text-sm whitespace-nowrap font-medium"
                >
                  Create
                </Button>
              </a>
            </Link>

            {/* Google Translate */}
            <GoogleTranslate />

            {/* User Profile */}
            <UserDropdown />
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="pb-4 md:hidden">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search parties..."
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="pl-12 pr-4 h-11 glass border-white/20 focus:border-primary/50 rounded-xl text-base"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange?.("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground w-8 h-8 flex items-center justify-center"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

