import Link from "next/link";
import { Calendar, User } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default function BlogCard({ blog }) {
  if (!blog) return null;

  return (
    <Card className="overflow-hidden hover:shadow-xl hover:border-primary/50 transition-all duration-300 h-full flex flex-col">
      <div className="relative h-48 bg-muted">
        <img
          src={blog.image || "https://source.unsplash.com/random/800x600/?education"}
          alt={blog.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 left-4">
          <Badge className="bg-primary text-primary-foreground hover:bg-primary/90">
            {blog.category}
          </Badge>
        </div>
      </div>
      <CardContent className="p-6 flex-grow">
        <h3 className="text-xl font-bold text-foreground mb-3 hover:text-primary transition-colors cursor-pointer font-heading">
          <Link href={`/blog/${blog.slug}`}>{blog.title}</Link>
        </h3>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-3 leading-relaxed">
          {blog.excerpt}
        </p>
      </CardContent>
      <CardFooter className="p-6 pt-0 border-t border-border mt-auto flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <User size={14} className="text-primary" />
          <span>{blog.author.name || blog.author}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-primary" />
          <span>{blog.date}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
