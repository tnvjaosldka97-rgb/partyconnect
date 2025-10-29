import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { APP_TITLE } from "@/const";
import { Facebook, Instagram, Twitter, Youtube, AlertTriangle } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { toast } from "sonner";

const platformLinks = [
  { label: "About", href: "#" },
  { label: "Host a Party", href: "#" },
  { label: "Explore Parties", href: "#" },
  { label: "Brand Partnerships", href: "#" },
];

const legalLinks = [
  { label: "Terms of Service", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Refund Policy", href: "#" },
  { label: "Contact Us", href: "#" },
];

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Youtube, href: "#", label: "Youtube" },
];

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = () => {
    if (!email) {
      toast.error("Email Required", {
        description: "Please enter your email address.",
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Invalid Email", {
        description: "Please enter a valid email address.",
      });
      return;
    }

    // Save to localStorage for campaign notifications
    const subscribers = JSON.parse(localStorage.getItem("newsletterSubscribers") || "[]");
    if (subscribers.includes(email)) {
      toast.info("Already Subscribed", {
        description: "This email is already subscribed to our newsletter.",
      });
      return;
    }

    subscribers.push(email);
    localStorage.setItem("newsletterSubscribers", JSON.stringify(subscribers));

    toast.success("Subscription Successful!", {
      description: "You'll receive notifications when new campaigns are created.",
    });
    setEmail("");
  };

  return (
    <footer className="relative border-t border-white/10 mt-20">
      <div className="container py-16">
        {/* Legal Disclaimer Banner */}
        <div className="mb-12 p-6 rounded-xl glass border border-yellow-500/30 bg-yellow-500/5">
          <div className="flex items-start space-x-4">
            <AlertTriangle className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-yellow-500 mb-2">Important Legal Notice</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                <strong>PartyBear is an intermediary platform only.</strong> We connect party hosts with guests but do not organize, host, or manage any parties. 
                All legal responsibilities, including compliance with alcohol laws, safety regulations, and liability for any incidents, lie solely with the hosts and guests. 
                PartyBear is not liable for any injuries, damages, or legal issues arising from parties listed on the platform. 
                By using this platform, you acknowledge and accept these terms. For full details, please read our{" "}
                <Link href="/terms" className="text-yellow-500 hover:text-yellow-400 underline">Terms of Service</Link>.
              </p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-xl gradient-button flex items-center justify-center">
                <img src="/party-bear.png" alt="PartyBear" className="w-8 h-8 object-contain" />
              </div>
              <span className="text-2xl font-bold gradient-text">{APP_TITLE}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Premium party experience with verified people. Make new friends & create unforgettable moments.
            </p>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Platform</h4>
            <ul className="space-y-3">
              {platformLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Legal Notice</h4>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  {link.href.startsWith('/') ? (
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Newsletter Subscription</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Get notified when new campaigns are created
            </p>
            <div className="flex space-x-2">
              <Input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
                className="glass border-white/20 rounded-xl"
              />
              <Button onClick={handleSubscribe} className="gradient-button rounded-xl px-6">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            {/* Copyright */}
            <p className="text-sm text-muted-foreground">
              © 2025 {APP_TITLE}. All rights reserved.
            </p>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground mr-2">Follow:</span>
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="w-10 h-10 rounded-xl glass border border-white/10 hover:border-primary/50 hover:bg-primary/10 flex items-center justify-center transition-all group"
                  >
                    <Icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

