import React from "react";
import { Link } from "react-router-dom";
import { Twitter, Linkedin, Youtube, Mail, Heart } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: {
      title: "المنتج",
      links: [
        { label: "المميزات", href: "/features" },
        { label: "الأسعار", href: "/pricing" },
        { label: "الأسئلة الشائعة", href: "/faq" },
        { label: "التحديثات", href: "/updates" },
      ],
    },
    company: {
      title: "الشركة",
      links: [
        { label: "من نحن", href: "/about" },
        { label: "المدونة", href: "/blog" },
        { label: "تواصل معنا", href: "/contact" },
        { label: "الوظائف", href: "/careers" },
      ],
    },
    legal: {
      title: "قانوني",
      links: [
        { label: "الشروط والأحكام", href: "/terms" },
        { label: "سياسة الخصوصية", href: "/privacy" },
        { label: "سياسة الاسترداد", href: "/refund" },
      ],
    },
  };

  const socialLinks = [
    { icon: Twitter, href: "https://twitter.com", label: "تويتر" },
    { icon: Linkedin, href: "https://linkedin.com", label: "لينكدإن" },
    { icon: Youtube, href: "https://youtube.com", label: "يوتيوب" },
    { icon: Mail, href: "mailto:support@alqtar.ai", label: "البريد" },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="col-span-full lg:col-span-1">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-green to-accent-blue flex items-center justify-center">
                <span className="text-white font-bold text-xl">ق</span>
              </div>
              <span className="text-xl font-bold">القطار</span>
            </div>
            <p className="text-gray-300 mb-8 leading-relaxed">
              منصة ذكية تحول أفكارك إلى محتوى بصري احترافي. أنشئ بحوثك وعروضك
              التقديمية وخرائطك الذهنية بسهولة.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([key, section]) => (
            <div key={key}>
              <h4 className="font-bold text-lg mb-6">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm">
              © {currentYear} القطار. جميع الحقوق محفوظة.
            </p>
            <p className="text-gray-400 text-sm flex items-center gap-1">
              صُنع بـ <Heart size={14} className="text-red-500 fill-red-500" />{" "}
              في المملكة العربية السعودية
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
