import Link from "next/link";
import { 
  Calculator, Laptop, FlaskConical, Languages, PenTool, TrendingUp, Music, Palette,
  Briefcase, Cog, BookOpen, Users, Gavel, Stethoscope, Pencil, Database,
  Megaphone, Receipt, Building, Brain
} from "lucide-react";
import { Card } from "@/components/ui/Card";

const iconMap = {
  "mathematics": Calculator,
  "computer-science": Laptop,
  "science": FlaskConical,
  "languages": Languages,
  "business": Briefcase,
  "engineering": Cog,
  "humanities": BookOpen,
  "social-sciences": Users,
  "law": Gavel,
  "medicine": Stethoscope,
  "design-art": Palette,
  "music": Music,
  "test-prep": Pencil,
  "writing": PenTool,
  "data-science": Database,
  "marketing": Megaphone,
  "accounting": Receipt,
  "architecture": Building,
  "psychology": Brain,
  "economics": TrendingUp
};

export default function Categories({ categories }) {
  if (!categories) return null;

  return (
    <section id="categories" className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-foreground font-heading">
          Explore Popular Subjects
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {categories.map((cat) => {
            const Icon = iconMap[cat.slug] || Laptop;
            return (
              <Link
                key={cat._id}
                href={`/jobs?category=${cat.slug}`}
                className="group block"
              >
                <Card className="h-full p-6 flex flex-col items-center gap-4 hover:border-primary/50 hover:shadow-lg transition-all duration-300 bg-card hover:bg-card/80">
                  <div className="text-primary group-hover:scale-110 transition-transform duration-300">
                    <Icon size={40} strokeWidth={1.5} />
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors font-heading">
                      {cat.name}
                    </h3>
                    <p className="text-muted-foreground text-sm mt-1">
                      {cat.activeJobs} Active Jobs
                    </p>
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  );
}
