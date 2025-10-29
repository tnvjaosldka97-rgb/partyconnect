import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { User, LayoutDashboard, Shield, LogOut } from "lucide-react";
import { Link } from "wouter";

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleLogout = () => {
    localStorage.removeItem("hostEmail");
    localStorage.removeItem("adminLoggedIn");
    window.location.reload();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="icon"
        className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl glass hover:bg-white/10"
        onClick={() => setIsOpen(!isOpen)}
      >
        <User className="w-5 h-5" />
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 glass-strong border-white/20 bg-black/95 backdrop-blur-xl rounded-xl shadow-2xl overflow-hidden z-[9999] animate-in fade-in-0 zoom-in-95 duration-200">
          <div className="px-4 py-3 border-b border-white/10">
            <p className="text-sm font-semibold">My Account</p>
          </div>
          
          <div className="py-2">
            <Link href="/profile">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full px-4 py-2.5 text-left hover:bg-white/10 transition-colors flex items-center gap-3 text-sm"
              >
                <User className="w-4 h-4" />
                <span>My Profile</span>
              </button>
            </Link>

            <Link href="/host/dashboard">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full px-4 py-2.5 text-left hover:bg-white/10 transition-colors flex items-center gap-3 text-sm"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Host Dashboard</span>
              </button>
            </Link>

            <Link href="/admin/login">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full px-4 py-2.5 text-left hover:bg-white/10 transition-colors flex items-center gap-3 text-sm"
              >
                <Shield className="w-4 h-4" />
                <span>Admin Login</span>
              </button>
            </Link>
          </div>

          <div className="border-t border-white/10 py-2">
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2.5 text-left hover:bg-white/10 transition-colors flex items-center gap-3 text-sm text-red-500"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

