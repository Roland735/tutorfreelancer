import Link from "next/link";
import { GraduationCap, Twitter, Facebook, Linkedin, Instagram } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { usePlatformContent } from "@/lib/usePlatformContent";

const iconMap = {
  Twitter,
  Facebook,
  LinkedIn: Linkedin,
  Instagram,
};

export default function Footer() {
  const { content } = usePlatformContent(["site.footer"]);
  const footer = content["site.footer"] || {};
  const sections = footer.sections || [];
  const socialLinks = footer.socialLinks || [];
  const newsletter = footer.newsletter || {};
  const legalLinks = footer.legalLinks || [];

  return (
    <footer className="bg-background border-t border-border pt-20 pb-10 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="text-2xl font-bold text-foreground flex items-center gap-2 group mb-6 font-heading">
              <GraduationCap className="text-primary text-3xl group-hover:text-primary/80 transition-colors" />
              <span className="tracking-tight">
                Tutor<span className="text-primary">Freelance</span>
              </span>
            </Link>
            <p className="text-muted-foreground mb-6 max-w-sm leading-relaxed">
              {footer.brandDescription}
            </p>
            <div className="flex gap-4">
              {socialLinks.map(({ name, href }, index) => {
                const Icon = iconMap[name] || Twitter;
                return (
                <a 
                  key={index} 
                  href={href} 
                  className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-1"
                >
                  <Icon size={18} />
                </a>
                );
              })}
            </div>
          </div>

          {sections.map((section) => (
            <div key={section.title}>
              <h4 className="text-foreground font-bold mb-6 font-heading">{section.title}</h4>
              <ul className="space-y-4 text-muted-foreground text-sm">
                {section.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link href={link.href} className="hover:text-primary transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          <div className="lg:col-span-1">
            <h4 className="text-foreground font-bold mb-6 font-heading">{newsletter.title}</h4>
            <p className="text-muted-foreground text-sm mb-4">{newsletter.description}</p>
            <form className="flex flex-col gap-3">
              <Input
                type="email"
                placeholder={newsletter.placeholder}
                className="bg-background border-input focus:border-primary"
              />
              <Button type="button" className="w-full">
                {newsletter.buttonLabel}
              </Button>
            </form>
          </div>
        </div>

        {/* Newsletter & Copyright */}
        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} TutorFreelance. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            {legalLinks.map((link) => (
              <Link key={link.href + link.label} href={link.href} className="hover:text-primary transition-colors">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
