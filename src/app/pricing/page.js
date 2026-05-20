"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Check, X, ChevronDown, ChevronUp, HelpCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { usePlatformContent } from "@/lib/usePlatformContent";

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState("monthly"); // 'monthly' or 'annual'
  const [activeFaq, setActiveFaq] = useState(null);
  const { content } = usePlatformContent(["page.pricing"]);
  const pricingContent = content["page.pricing"] || {};

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const pricingPlans = (pricingContent.plans || []).map((plan) => ({
    ...plan,
    price: billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice,
  }));
  const faqs = pricingContent.faqs || [];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex flex-col">
      <Navbar />

      <main className="flex-grow py-20">
        {/* Hero Section */}
        <div className="container mx-auto px-4 text-center mb-16">
          <Badge variant="outline" className="mb-4 px-4 py-1 border-primary/20 bg-primary/10 text-primary">
            {pricingContent.badge || "Flexible Plans"}
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 font-display tracking-tight">
            {pricingContent.title || "Simple, Transparent Pricing"}
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-10">
            {pricingContent.description || "Choose the plan that fits your learning or teaching goals. No hidden fees, cancel anytime."}
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className={cn("text-sm font-medium transition-colors", billingCycle === 'monthly' ? 'text-foreground' : 'text-muted-foreground')}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
              className="w-14 h-7 bg-muted rounded-full relative transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 border border-input"
              aria-label="Toggle billing cycle"
            >
              <div
                className={cn(
                  "absolute top-1 w-5 h-5 bg-primary rounded-full transition-transform duration-200 shadow-sm",
                  billingCycle === 'annual' ? 'left-8' : 'left-1'
                )}
              />
            </button>
            <span className={cn("text-sm font-medium transition-colors", billingCycle === 'annual' ? 'text-foreground' : 'text-muted-foreground')}>
              Yearly <span className="text-primary text-xs font-bold ml-1">(Save 20%)</span>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 mb-24 max-w-6xl">
          {pricingPlans.map((plan, index) => (
            <Card
              key={index}
              className={cn(
                "relative flex flex-col h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
                plan.popular ? "border-primary shadow-md shadow-primary/5" : "border-border"
              )}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge variant="default" className="bg-primary hover:bg-primary text-primary-foreground px-4 py-1 shadow-sm">
                    MOST POPULAR
                  </Badge>
                </div>
              )}

              <CardHeader>
                <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-muted-foreground ml-2">/{billingCycle === 'monthly' ? 'mo' : 'mo, billed yearly'}</span>
                </div>
                <p className="text-muted-foreground text-sm mt-4 pb-4 border-b border-border">
                  {plan.description}
                </p>
              </CardHeader>

              <CardContent className="flex-1">
                <ul className="space-y-4">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      {feature.included ? (
                        <div className="mt-0.5 rounded-full bg-primary/10 p-0.5">
                          <Check className="h-3.5 w-3.5 text-primary" />
                        </div>
                      ) : (
                        <div className="mt-0.5 rounded-full bg-muted p-0.5">
                          <X className="h-3.5 w-3.5 text-muted-foreground" />
                        </div>
                      )}
                      <span className={feature.included ? "text-foreground" : "text-muted-foreground"}>
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button
                  asChild
                  className="w-full"
                  variant={plan.popular ? "default" : "outline"}
                  size="lg"
                >
                  <Link href={plan.ctaLink}>
                    {plan.cta}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-display mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">Everything you need to know about our pricing and plans.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card
                key={index}
                className={cn(
                  "overflow-hidden transition-all duration-200",
                  activeFaq === index ? "border-primary/50 shadow-sm" : "border-border hover:border-primary/30"
                )}
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                >
                  <span className="font-semibold text-lg pr-8">{faq.question}</span>
                  {activeFaq === index ? (
                    <ChevronUp className="h-5 w-5 text-primary shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground shrink-0" />
                  )}
                </button>
                <div
                  className={cn(
                    "px-6 text-muted-foreground overflow-hidden transition-all duration-300 ease-in-out",
                    activeFaq === index ? "max-h-40 pb-6 opacity-100" : "max-h-0 opacity-0"
                  )}
                >
                  <p className="leading-relaxed">{faq.answer}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
