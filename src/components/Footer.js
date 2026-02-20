import Link from "next/link";
import { GraduationCap, Twitter, Facebook, Linkedin, Instagram } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function Footer() {
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
              The premier peer-to-peer marketplace for academic success. Connect with top student tutors from leading universities and master any subject.
            </p>
            <div className="flex gap-4">
              {[
                { Icon: Twitter, href: "#" },
                { Icon: Facebook, href: "#" },
                { Icon: Linkedin, href: "#" },
                { Icon: Instagram, href: "#" }
              ].map(({ Icon, href }, index) => (
                <a 
                  key={index} 
                  href={href} 
                  className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-1"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-foreground font-bold mb-6 font-heading">For Students</h4>
            <ul className="space-y-4 text-muted-foreground text-sm">
              <li><Link href="/tutors" className="hover:text-primary transition-colors">Browse Tutors</Link></li>
              <li><Link href="/jobs" className="hover:text-primary transition-colors">Post a Job</Link></li>
              <li><Link href="/#how-it-works" className="hover:text-primary transition-colors">How to Hire</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Student Success Stories</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-foreground font-bold mb-6 font-heading">For Tutors</h4>
            <ul className="space-y-4 text-muted-foreground text-sm">
              <li><Link href="/jobs" className="hover:text-primary transition-colors">Browse Jobs</Link></li>
              <li><Link href="/register" className="hover:text-primary transition-colors">Become a Tutor</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Tutor Resources</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Community Guidelines</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-foreground font-bold mb-6 font-heading">Company</h4>
            <ul className="space-y-4 text-muted-foreground text-sm">
              <li><Link href="#" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Careers</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Blog</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Contact Support</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-1">
            <h4 className="text-foreground font-bold mb-6 font-heading">Stay Updated</h4>
            <p className="text-muted-foreground text-sm mb-4">Subscribe to our newsletter for the latest tips and updates.</p>
            <form className="flex flex-col gap-3">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-background border-input focus:border-primary"
              />
              <Button type="button" className="w-full">
                Subscribe
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
            <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-primary transition-colors">Cookie Settings</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
