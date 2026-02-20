import { Quote, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default function TestimonialCard({ review }) {
  if (!review) return null;

  return (
    <Card className="h-full relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/50">
      <CardContent className="p-8">
        <Quote className="text-primary/20 absolute top-6 right-6 w-12 h-12" />
        <div className="flex items-center gap-4 mb-6">
          <img
            src={review.reviewer.avatar || `https://ui-avatars.com/api/?name=${review.reviewer.name}&background=10b981&color=fff`}
            alt={review.reviewer.name}
            className="w-14 h-14 rounded-full border-2 border-primary/30 object-cover"
          />
          <div>
            <h4 className="text-foreground font-bold font-heading">{review.reviewer.name}</h4>
            <p className="text-primary text-sm">{review.reviewer.university}</p>
          </div>
        </div>
        <div className="flex gap-1 mb-4 text-yellow-500">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              size={16} 
              className={i < review.rating ? "fill-current" : "text-muted"} 
            />
          ))}
        </div>
        <p className="text-muted-foreground italic leading-relaxed mb-4">"{review.comment}"</p>
        {(review.session?.job?.subject || review.session?.subject) && (
          <Badge variant="secondary" className="mt-auto">
            Studied {review.session?.job?.subject || review.session?.subject}
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}
