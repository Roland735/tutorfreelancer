import { cn } from "@/lib/utils"

const Avatar = ({ className, src, alt, fallback, ...props }) => {
  return (
    <div className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-muted", className)} {...props}>
      {src ? (
        <img
          className="aspect-square h-full w-full object-cover"
          src={src}
          alt={alt || "Avatar"}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground font-bold">
          {fallback || alt?.charAt(0).toUpperCase() || "?"}
        </div>
      )}
    </div>
  )
}
export { Avatar }
