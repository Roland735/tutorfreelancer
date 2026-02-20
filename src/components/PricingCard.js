import { Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

export default function PricingCard({ plan, isPopular }) {
  if (!plan) return null;

  return (
    <Card
      className={cn(
        "relative transition-all duration-300 transform hover:scale-105 h-full flex flex-col",
        isPopular
          ? "bg-gradient-to-br from-primary/10 to-card border-primary shadow-xl shadow-primary/10"
          : "bg-card border-border"
      )}
    >
      {isPopular && (
        <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-4 py-1 rounded-bl-xl rounded-tr-xl uppercase tracking-wider">
          Most Popular
        </div>
      )}

      <CardHeader className="p-8 pb-0">
        <h3 className="text-2xl font-bold text-foreground mb-2 font-heading">{plan.name}</h3>
        <p className="text-muted-foreground text-sm mb-6">{plan.description}</p>
        <div className="flex items-end gap-1 mb-2">
          <span className="text-4xl font-bold text-foreground">${plan.price}</span>
          <span className="text-muted-foreground mb-1">/month</span>
        </div>
      </CardHeader>

      <CardContent className="p-8 pt-6 flex-grow">
        <ul className="space-y-4">
          {plan.features.map((feature, i) => (
            <li key={i} className="flex items-center gap-3 text-muted-foreground text-sm">
              <Check size={16} className="text-primary flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter className="p-8 pt-0">
        <Button
          className="w-full"
          variant={isPopular ? "default" : "outline"}
          size="lg"
        >
          {plan.cta}
        </Button>
      </CardFooter>
    </Card>
  );
}
