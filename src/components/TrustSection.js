import { CheckCircle, Lock, Video, Headset, Star } from "lucide-react";

export default function TrustSection() {
  const items = [
    { icon: CheckCircle, title: "Verified Student Profiles", desc: "Every tutor undergoes a strict verification process." },
    { icon: Lock, title: "Secure Stripe Payments", desc: "Funds are held safely until you're satisfied." },
    { icon: Video, title: "Session Recording Options", desc: "Review your lessons anytime with cloud recordings." },
    { icon: Star, title: "Rating and Review System", desc: "Real ratings from verified students only." },
    { icon: Headset, title: "24/7 Support", desc: "Our team is here to help whenever you need it." },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-16 text-foreground font-heading">Why Trust TutorFreelance?</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 text-center">
          {items.map((item, i) => (
            <div key={i} className="group p-6 rounded-xl hover:bg-muted/50 transition duration-300 border border-transparent hover:border-border">
              <div className="flex justify-center mb-4 group-hover:scale-110 transition duration-300 text-primary">
                <item.icon size={40} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2 font-heading">{item.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
