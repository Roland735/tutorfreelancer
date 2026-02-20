import { Search, UserCheck, GraduationCap, School, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function HowItWorks() {
  const studentSteps = [
    { icon: Search, title: "1. Post a Request", desc: "Describe your learning needs, budget, and deadline." },
    { icon: UserCheck, title: "2. Choose a Tutor", desc: "Review proposals, profiles, and ratings." },
    { icon: GraduationCap, title: "3. Learn & Pay", desc: "Connect in a virtual classroom and pay only when satisfied." },
  ];

  const tutorSteps = [
    { icon: School, title: "1. Create Profile", desc: "Highlight your expertise, set your rates, and get verified." },
    { icon: Search, title: "2. Browse Jobs", desc: "Find students who need your help and submit proposals." },
    { icon: DollarSign, title: "3. Teach & Earn", desc: "Deliver great sessions and get paid securely." },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-foreground font-heading">How It Works</h2>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
          {/* For Students */}
          <div>
            <h3 className="text-2xl font-bold text-primary mb-8 flex items-center gap-3 font-heading">
              <GraduationCap className="w-8 h-8" /> For Students
            </h3>
            <div className="space-y-8 relative">
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border -z-10" />
              {studentSteps.map((step, i) => (
                <div key={i} className="flex gap-6 items-start">
                  <div className="w-12 h-12 rounded-full bg-card border-4 border-background flex items-center justify-center text-primary shadow-sm flex-shrink-0 z-10">
                    <step.icon size={20} />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-foreground mb-2 font-heading">{step.title}</h4>
                    <p className="text-muted-foreground leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-10 pl-18">
              <Button asChild size="lg" className="rounded-full px-8 shadow-lg shadow-primary/10">
                <Link href="/tutors">Find a Tutor</Link>
              </Button>
            </div>
          </div>

          {/* For Tutors */}
          <div>
            <h3 className="text-2xl font-bold text-emerald-600 mb-8 flex items-center gap-3 font-heading">
              <School className="w-8 h-8" /> For Tutors
            </h3>
            <div className="space-y-8 relative">
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border -z-10" />
              {tutorSteps.map((step, i) => (
                <div key={i} className="flex gap-6 items-start">
                  <div className="w-12 h-12 rounded-full bg-card border-4 border-background flex items-center justify-center text-emerald-600 shadow-sm flex-shrink-0 z-10">
                    <step.icon size={20} />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-foreground mb-2 font-heading">{step.title}</h4>
                    <p className="text-muted-foreground leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-10 pl-18">
              <Button asChild variant="outline" size="lg" className="rounded-full px-8 border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30">
                <Link href="/register">Become a Tutor</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
