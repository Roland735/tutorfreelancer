import Link from "next/link";
import { Star, GraduationCap, MapPin, CheckCircle, BookOpen, Medal } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export default function TutorCard({ tutor }) {
  if (!tutor || !tutor.user) return null;

  const { user, stats, subjects, hourlyRate, badges } = tutor;

  return (
    <Card className="h-full flex flex-col hover:shadow-xl transition-all duration-300 group relative border-border bg-card overflow-hidden">
      {/* Badge */}
      {badges && badges.length > 0 && (
        <div className="absolute top-4 right-4 z-10">
          <Badge variant="secondary" className="bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400 gap-1">
            <Medal className="w-3 h-3" /> {badges[0]}
          </Badge>
        </div>
      )}

      <CardContent className="pt-6 flex-grow flex flex-col items-center text-center">
        {/* Avatar & Verification */}
        <div className="relative w-24 h-24 mb-4">
          <img
            src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=10b981&color=fff`}
            alt={user.name}
            className="w-24 h-24 rounded-full border-4 border-muted object-cover group-hover:border-primary transition duration-300"
          />
          <div className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-1 rounded-full text-xs border-2 border-background">
            <CheckCircle className="w-3 h-3" />
          </div>
        </div>

        <h3 className="text-xl font-bold text-card-foreground mb-1 group-hover:text-primary transition font-heading">{user.name}</h3>
        <p className="text-sm text-primary font-medium mb-2 flex items-center gap-1 justify-center">
          <GraduationCap className="w-4 h-4" /> {user.university || "University Student"}
        </p>
        <p className="text-xs text-muted-foreground flex items-center gap-1 justify-center mb-6">
          <MapPin className="w-3 h-3" /> {user.location?.city || "Remote"}
        </p>

        {/* Stats */}
        <div className="flex justify-center gap-6 mb-6 text-sm border-y border-border w-full py-3 bg-muted/10">
          <div className="flex flex-col items-center">
            <span className="flex items-center gap-1 text-yellow-500 font-bold text-lg">
              <Star className="w-4 h-4 fill-current" /> {stats.rating.toFixed(1)}
            </span>
            <span className="text-muted-foreground text-xs">Rating</span>
          </div>
          <div className="w-px bg-border" />
          <div className="flex flex-col items-center">
            <span className="font-bold text-foreground text-lg">{stats.totalSessions}</span>
            <span className="text-muted-foreground text-xs">Sessions</span>
          </div>
        </div>

        {/* Subjects */}
        <div className="flex flex-wrap gap-2 justify-center mb-4">
          {subjects.slice(0, 3).map((sub, i) => (
            <Badge key={i} variant="outline" className="text-xs font-normal gap-1 bg-muted/30">
              <BookOpen className="text-primary/70 w-3 h-3" />
              {sub.name}
            </Badge>
          ))}
          {subjects.length > 3 && (
            <span className="text-xs text-muted-foreground px-2 py-1">+{subjects.length - 3} more</span>
          )}
        </div>
      </CardContent>

      {/* Price & CTA */}
      <CardFooter className="pt-4 border-t border-border flex items-center justify-between bg-muted/20">
        <div>
          <span className="text-xs text-muted-foreground block">Starting at</span>
          <span className="font-bold text-foreground text-xl font-heading">${hourlyRate}<span className="text-sm text-muted-foreground font-normal font-sans">/hr</span></span>
        </div>
        <Button asChild className="rounded-full px-6">
          <Link href={`/tutors/${user._id}`}>
            View Profile
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
