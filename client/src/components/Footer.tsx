import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { APP_TITLE } from "@/const";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

const platformLinks = [
  { label: "소개", href: "#" },
  { label: "파티 호스팅", href: "#" },
  { label: "파티 탐색", href: "#" },
  { label: "브랜드 제휴", href: "#" },
];

const legalLinks = [
  { label: "이용약관", href: "#" },
  { label: "개인정보처리방침", href: "#" },
  { label: "환불 정책", href: "#" },
  { label: "면책조항", href: "#" },
  { label: "문의하기", href: "#" },
];

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Youtube, href: "#", label: "Youtube" },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-white/10 mt-20">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-xl gradient-button flex items-center justify-center">
                <span className="text-2xl">🎉</span>
              </div>
              <span className="text-2xl font-bold gradient-text">{APP_TITLE}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              검증된 사람들과 함께하는 프리미엄 파티 경험. 새로운 친구들과 특별한 순간을 만들어보세요.
            </p>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">플랫폼</h4>
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
            <h4 className="text-lg font-semibold mb-4">법적 고지</h4>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
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

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-semibold mb-4">뉴스레터 구독</h4>
            <p className="text-sm text-muted-foreground mb-4">
              최신 파티 소식과 특별 혜택을 받아보세요
            </p>
            <div className="flex space-x-2">
              <Input
                type="email"
                placeholder="이메일 주소"
                className="glass border-white/20 rounded-xl"
              />
              <Button className="gradient-button rounded-xl px-6">
                구독
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
              <span className="text-sm text-muted-foreground mr-2">팔로우:</span>
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

