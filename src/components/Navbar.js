"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { FaGraduationCap, FaBars, FaTimes } from "react-icons/fa";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";

export default function Navbar() {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Find a Tutor", href: "/tutors" },
    { name: "Browse Jobs", href: "/jobs" },
    { name: "How It Works", href: "/#how-it-works" },
    { name: "Subjects", href: "/#categories" },
    { name: "Pricing", href: "/#pricing" },
  ];

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
          ? "bg-background/95 backdrop-blur-md border-b border-border shadow-sm"
          : "bg-transparent py-5 border-b border-transparent"
        }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-foreground flex items-center gap-2 group font-heading">
          <FaGraduationCap className="text-primary text-3xl group-hover:text-primary/80 transition" />
          <span className="tracking-tight">
            Tutor<span className="text-primary">Freelance</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex gap-6 items-center font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${pathname === link.href ? "text-primary" : "text-muted-foreground"
                }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Auth Buttons */}
        <div className="hidden lg:flex gap-4 items-center">
          {session ? (
            <div className="flex items-center gap-4">
              <span className="text-muted-foreground text-sm hidden xl:block">Hi, {session.user.name}</span>
              <Button variant="ghost" onClick={() => signOut()} size="sm">
                Logout
              </Button>
              <Button asChild className="rounded-full shadow-md">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            </div>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">Log In</Link>
              </Button>
              <Button asChild className="rounded-full shadow-md">
                <Link href="/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex lg:hidden items-center gap-4">
          <button
            className="text-foreground hover:text-primary transition"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-background border-b border-border p-4 shadow-xl flex flex-col gap-4 animate-in slide-in-from-top-5">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-foreground hover:text-primary py-2 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <hr className="border-border" />
          {session ? (
            <>
              <div className="flex items-center gap-2 py-2">
                <img src={session.user.image || `https://ui-avatars.com/api/?name=${session.user.name}`} className="w-8 h-8 rounded-full" alt="User" />
                <span className="font-bold">{session.user.name}</span>
              </div>
              <Button asChild className="w-full">
                <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
              </Button>
              <Button variant="outline" className="w-full" onClick={() => { signOut(); setMobileMenuOpen(false); }}>
                Logout
              </Button>
            </>
          ) : (
            <div className="flex flex-col gap-2">
              <Button asChild variant="outline" className="w-full">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>Log In</Link>
              </Button>
              <Button asChild className="w-full">
                <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
