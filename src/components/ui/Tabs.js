"use client";
import * as React from "react"
import { cn } from "@/lib/utils"

const Tabs = React.forwardRef(({ className, value, onValueChange, children, ...props }, ref) => (
  <div ref={ref} className={cn("w-full", className)} {...props}>
    {React.Children.map(children, child => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, { value, onValueChange });
      }
      return child;
    })}
  </div>
))
Tabs.displayName = "Tabs"

const TabsList = React.forwardRef(({ className, value, onValueChange, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
      className
    )}
    {...props}
  >
    {React.Children.map(children, child => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, { activeValue: value, onValueChange });
      }
      return child;
    })}
  </div>
))
TabsList.displayName = "TabsList"

const TabsTrigger = React.forwardRef(({ className, value, activeValue, onValueChange, children, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      activeValue === value
        ? "bg-background text-foreground shadow-sm"
        : "hover:bg-background/50 hover:text-foreground",
      className
    )}
    onClick={() => onValueChange && onValueChange(value)}
    {...props}
  >
    {children}
  </button>
))
TabsTrigger.displayName = "TabsTrigger"

const TabsContent = React.forwardRef(({ className, value: contentValue, value: parentValue, children, ...props }, ref) => {
  // Note: We need to handle value prop from parent (Tabs) vs value prop of this content
  // In this simple implementation, we rely on the parent passing 'value' as 'parentValue' via cloneElement
  // But TabsContent is usually not a direct child of TabsList, but Tabs.
  // So Tabs needs to pass value to direct children.
  
  if (contentValue !== parentValue) return null
  
  return (
    <div
      ref={ref}
      className={cn(
        "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 animate-in fade-in-50 zoom-in-95 duration-200",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})
TabsContent.displayName = "TabsContent"

export { Tabs, TabsList, TabsTrigger, TabsContent }
