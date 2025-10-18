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
import { MapPin, Search, User } from "lucide-react";
import { Link } from "wouter";

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
      <div className="container">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center space-x-2 cursor-pointer">
              <div className="w-10 h-10 rounded-xl gradient-button flex items-center justify-center">
                <span className="text-2xl">🎉</span>
              </div>
              <span className="text-2xl font-bold gradient-text hidden sm:block">
                {APP_TITLE}
              </span>
            </div>
          </Link>

          {/* Search Bar */}
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
          <div className="flex items-center space-x-3">
            {/* City Selector */}
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

            {/* Host Party Button */}
            <Link href="/become-host">
              <Button
                variant="outline"
                className="h-10 px-4 glass border-primary/50 hover:bg-primary/10 rounded-xl hidden sm:flex"
              >
                Become a Host
              </Button>
            </Link>
            
            <Link href="/create-party">
              <Button
                variant="outline"
                className="h-10 px-4 glass border-accent/50 hover:bg-accent/10 rounded-xl hidden lg:flex"
              >
                Create Party
              </Button>
            </Link>

            {/* User Profile */}
            <Button
              variant="ghost"
              size="icon"
              className="w-10 h-10 rounded-xl glass hover:bg-white/10"
            >
              <User className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="pb-4 md:hidden">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search parties... (e.g., New York, music)"
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="pl-12 pr-4 h-12 glass border-white/20 focus:border-primary/50 rounded-2xl"
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
      </div>
    </header>
  );
}

