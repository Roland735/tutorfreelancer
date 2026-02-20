import Link from "next/link";
import { MapPin, DollarSign, Clock, Tag, Laptop, GraduationCap } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export default function JobCard({ job }) {
  const isRemote = job.sessionType === "Online";

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-all duration-300 group relative overflow-hidden border-border bg-card">
      <div className="absolute top-0 left-0 w-1 h-full bg-primary opacity-0 group-hover:opacity-100 transition duration-300" />

      <CardHeader className="pb-4">
        <div className="flex justify-between items-start mb-2">
          <div className="flex gap-2 mb-2 flex-wrap">
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
              {job.category || "General"}
            </Badge>
            {job.urgency && job.urgency !== "Low" && (
              <Badge variant={job.urgency === "High" || job.urgency === "Immediate" ? "destructive" : "secondary"} className={job.urgency !== "High" && job.urgency !== "Immediate" ? "bg-yellow-500/10 text-yellow-600 border-yellow-500/20 dark:text-yellow-400" : ""}>
                {job.urgency}
              </Badge>
            )}
          </div>
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
          </span>
        </div>
        <h3 className="text-xl font-bold text-card-foreground group-hover:text-primary transition line-clamp-1 font-heading">
          {job.title}
        </h3>
      </CardHeader>

      <CardContent className="flex-grow">
        <p className="text-muted-foreground text-sm mb-6 line-clamp-3 leading-relaxed">
          {job.description}
        </p>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <DollarSign className="w-4 h-4 text-primary" />
              <span className="font-bold text-foreground">
                ${job.budget?.min} - ${job.budget?.max}
              </span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              {isRemote ? <Laptop className="w-4 h-4 text-emerald-600" /> : <MapPin className="w-4 h-4 text-red-500" />}
              <span>{job.sessionType}</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-purple-500" />
              <span>{job.academicLevel}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-primary font-bold">{job.applicants?.length || 0}</span> Applicants
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-4 border-t border-border flex items-center justify-between bg-muted/20">
        <div className="flex items-center gap-2">
          {job.postedBy?.avatar ? (
            <img src={job.postedBy.avatar} alt={job.postedBy.name} className="w-8 h-8 rounded-full border border-border" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-primary">
              {job.postedBy?.name?.charAt(0) || "U"}
            </div>
          )}
          <span className="text-xs text-muted-foreground max-w-[100px] truncate">
            {job.postedBy?.name || "Anonymous"}
          </span>
        </div>
        <Button asChild size="sm">
          <Link href={`/jobs/${job._id}`}>
            Details
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
