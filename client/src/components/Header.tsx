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
import { useState } from "react";

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-strong border-b border-white/10">
      <div className="container">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-xl gradient-button flex items-center justify-center">
              <span className="text-2xl">🎉</span>
            </div>
            <span className="text-2xl font-bold gradient-text hidden sm:block">
              {APP_TITLE}
            </span>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-4 sm:mx-8 hidden md:block">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="파티, 호스트, 테마 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 h-12 glass border-white/20 focus:border-primary/50 rounded-2xl text-base"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-3">
            {/* City Selector */}
            <Select defaultValue="all">
              <SelectTrigger className="w-32 h-10 glass border-white/20 rounded-xl hidden lg:flex">
                <MapPin className="w-4 h-4 mr-1" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 도시</SelectItem>
                <SelectItem value="seoul">서울</SelectItem>
                <SelectItem value="busan">부산</SelectItem>
                <SelectItem value="incheon">인천</SelectItem>
                <SelectItem value="daegu">대구</SelectItem>
              </SelectContent>
            </Select>

            {/* Host Party Button */}
            <Button
              variant="outline"
              className="h-10 px-4 glass border-primary/50 hover:bg-primary/10 rounded-xl hidden sm:flex"
            >
              파티 호스팅
            </Button>

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
              placeholder="파티 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 h-12 glass border-white/20 focus:border-primary/50 rounded-2xl"
            />
          </div>
        </div>
      </div>
    </header>
  );
}

